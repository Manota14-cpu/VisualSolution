"use client";

/* ============================================================
   EL CASO
   Un mismo componente para las dos formas de llegar:
   - la capa que morfea desde la grilla (navegación interna)
   - la página /trabajos/[slug] (enlace compartido, buscadores)
   Así no hay dos versiones del mismo contenido que se desincronicen.
   ============================================================ */

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { askAbout } from "@/lib/consult";
import { clamp01, useMotionEnv } from "@/lib/motion";
import { etiquetaEnlace, type Work } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";

/* La imagen de portada es la que viaja desde la grilla. El nombre de
   transición tiene que ser único en el documento, por eso lo recibe
   desde afuera y sólo lo lleva la ficha que se está abriendo. */
export function CaseCover({ work, morphName }: { work: Work; morphName?: string }) {
  return (
    <div
      className="shot relative aspect-[16/9] w-full overflow-hidden rounded-cards md:aspect-[21/9]"
      style={
        {
          ...(morphName ? { viewTransitionName: morphName } : {}),
          ...(work.previewEntera ? { background: work.previewEntera.fondo } : {}),
        } as React.CSSProperties
      }
    >
      {work.preview ? (
        <Image
          src={work.preview}
          alt={work.alt}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className={work.previewEntera ? "object-contain" : "object-cover object-top"}
          style={!work.previewEntera && work.previewPosition ? { objectPosition: work.previewPosition } : undefined}
        />
      ) : (
        /* Sin captura, la portada se llena con la plancha del sistema y
           el nombre: nunca una imagen rota. */
        <div className="ventana-plancha">
          <span>{work.title}</span>
        </div>
      )}
    </div>
  );
}

function Facts({ work }: { work: Work }) {
  // Sin datos propios se arman con lo que ya tiene la ficha.
  const facts =
    work.facts ?? [
      { label: "Trabajo", value: work.kind },
      { label: "Año", value: work.year },
      { label: "Rubro", value: work.category },
    ];

  return (
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-dotted border-azul/30 py-8 md:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="label text-azul/80">{f.label}</dt>
          <dd className="mt-2 text-base text-azul">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Capítulo: el texto se lee mientras la imagen queda fija al costado.
   En pantallas chicas se apilan, que es como se lee de verdad. */
function Chapter({ chapter, index }: { chapter: NonNullable<Work["chapters"]>[number]; index: number }) {
  return (
    <section className="grid grid-cols-1 gap-8 py-14 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-20">
      <div className="md:sticky md:top-24 md:self-start">
        <h2 className="display display-sm">
          {chapter.title}
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-azul/85">{chapter.body}</p>
      </div>

      {chapter.image ? (
        <div className="shot relative aspect-[4/3] overflow-hidden rounded-cards">
          <Image
            src={chapter.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ) : (
        /* Sin imagen el capítulo respira solo: una regla y el número,
           en vez de un hueco o una tarjeta vacía. */
        <div className="hidden items-start justify-end md:flex">
          <span className="label text-azul/80">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}
    </section>
  );
}

/* El producto en uso: los pasos a un lado y el video al otro, como un
   capítulo. El video es vertical; se recorta el aire de arriba y de
   abajo (sólo fondo) para que no quede una columna eterna.
   Corre solo, mudo y en loop mientras está a la vista, y se frena al
   salir. Con movimiento reducido no arranca: queda el primer cuadro y
   el botón para verlo. El botón está siempre, porque un video en loop
   tiene que poder pausarse (WCAG 2.2.2). */
function Demo({ demo }: { demo: NonNullable<Work["demo"]> }) {
  const video = useRef<HTMLVideoElement>(null);
  const pausadoAMano = useRef(false);
  const [enPausa, setEnPausa] = useState(true);
  const { reduce, ready } = useMotionEnv();
  const titulo = useId();

  useEffect(() => {
    const v = video.current;
    if (!v || !ready || reduce || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) v.pause();
        else if (!pausadoAMano.current) v.play().catch(() => {});
      },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [ready, reduce]);

  const alternar = () => {
    const v = video.current;
    if (!v) return;
    pausadoAMano.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section
      className="grid grid-cols-1 gap-10 border-b border-dotted border-azul/30 py-14 md:grid-cols-[1fr_1.1fr] md:gap-16 md:py-20"
      aria-labelledby={titulo}
    >
      <div className="md:sticky md:top-24 md:self-start">
        <h2 id={titulo} className="display display-sm">
          {demo.title}
        </h2>
        {demo.intro && <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-azul/85">{demo.intro}</p>}

        <ol className="demo-pasos">
          {demo.steps.map((p, i) => (
            <li key={p.title}>
              <span className="demo-n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {demo.result && (
          <div className="demo-listo">
            <p className="demo-listo-t">
              <span className="demo-n" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="m3.5 8.4 3 3 6-6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {demo.result.title}
            </p>
            <ul className="obra-tech">
              {demo.result.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <figure className="demo-video">
        <div className="demo-marco">
          <video
            ref={video}
            muted
            loop
            playsInline
            preload="metadata"
            poster={demo.poster}
            disablePictureInPicture
            disableRemotePlayback
            aria-label={demo.label}
            onPlay={() => setEnPausa(false)}
            onPause={() => setEnPausa(true)}
          >
            {demo.videos.map((f) => (
              <source key={f.src} src={f.src} type={f.type} />
            ))}
          </video>
        </div>
        {/* El control va debajo y no encima: el video tiene texto en
            los cuatro bordes y cualquier botón le tapaba algo. */}
        <figcaption className="demo-pie">
          <button className="demo-control" type="button" onClick={alternar}>
            {enPausa ? (
              <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
                <rect x="3.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
                <rect x="9.5" y="2.5" width="3" height="11" rx="1" fill="currentColor" />
              </svg>
            )}
            {enPausa ? "Reproducir" : "Pausar"}
            <span className="sr-only"> el video</span>
          </button>
        </figcaption>
      </figure>
    </section>
  );
}

function Gallery({ images, title }: { images: string[]; title: string }) {
  return (
    <section className="py-14 md:py-20">
      <div
        className="fade-x -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:-mx-10 md:px-10"
        data-lenis-prevent
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="shot relative aspect-[3/4] w-[72vw] shrink-0 snap-center overflow-hidden rounded-cards md:w-[340px]"
          >
            <Image
              src={src}
              alt={`${title}, imagen ${i + 1}`}
              fill
              sizes="(max-width: 768px) 72vw, 340px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Barra fina que marca cuánto queda del caso. La usa la capa en su
    barra superior; la página con URL propia usa la del sitio. */
export function CaseProgress({ scroller }: { scroller?: React.RefObject<HTMLElement | null> }) {
  const [p, setP] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = scroller?.current;
    const read = () => {
      const top = el ? el.scrollTop : window.scrollY;
      const max = el ? el.scrollHeight - el.clientHeight : document.body.scrollHeight - window.innerHeight;
      setP(max > 0 ? clamp01(top / max) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(read);
    };
    const target: HTMLElement | Window = el ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    read();
    return () => {
      cancelAnimationFrame(raf.current);
      target.removeEventListener("scroll", onScroll);
    };
  }, [scroller]);

  return (
    <div className="absolute inset-x-0 bottom-0 h-px bg-azul/20" aria-hidden="true">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${p})`,
          background: "var(--color-azul-medio)",
        }}
      />
    </div>
  );
}

export function CaseStudy({
  work,
  morphName,
  onConsult,
}: {
  work: Work;
  morphName?: string;
  onConsult?: () => void;
}) {
  const hasStory = !!work.chapters?.length;

  return (
    <article className="mx-auto w-full max-w-[1100px] px-4 pb-24 md:px-10">
      <header className="pt-6 md:pt-10">
        <CaseCover work={work} morphName={morphName} />

        {/* El año no se repite acá: ya está en la fila de datos, y como
            insignia suelta quedaba colgando sin alinearse con nada. */}
        <div className="mt-8">
          <h1 className="display display-lg">
            {work.title}
          </h1>
          {work.summary && (
            <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-azul/85">{work.summary}</p>
          )}

          {/* Quien llega acá desde un buscador o un enlace compartido no
              tiene otra forma de llegar al proyecto: el sitio en vivo es
              la mejor prueba de que existe y funciona. */}
          {work.url && (
            <a
              className="btn btn-metal mt-7"
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MetalFaz />
              <i className="diamond" aria-hidden="true" />
              {etiquetaEnlace(work.url)}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          )}
        </div>
      </header>

      <div className="mt-10">
        <Facts work={work} />
      </div>

      {work.demo && <Demo demo={work.demo} />}

      {hasStory ? (
        <div className="divide-y divide-dotted divide-azul/30">
          {work.chapters!.map((c, i) => (
            <Chapter key={c.title} chapter={c} index={i} />
          ))}
        </div>
      ) : (
        /* Ficha compacta: no pide disculpas por no tener historia,
           muestra lo que hay y ofrece la conversación. */
        <p className="max-w-[58ch] py-14 text-base leading-relaxed text-azul/85 md:py-20">
          Si querés ver el detalle de este trabajo o algo parecido para tu negocio, escribinos y te lo
          mostramos.
        </p>
      )}

      {work.gallery?.length ? <Gallery images={work.gallery} title={work.title} /> : null}

      <footer className="border-t border-dotted border-azul/30 pt-12 text-center">
        <p className="mx-auto max-w-[34ch] display display-sm">
          ¿Querés algo así para tu negocio?
        </p>
        <button
          className="btn btn-metal mt-7"
          type="button"
          onClick={() => {
            askAbout(work.title);
            onConsult?.();
          }}
        >
          <MetalFaz />
          <i className="diamond" aria-hidden="true" />
          Consultar por este proyecto
        </button>
      </footer>

    </article>
  );
}
