"use client";

/* ============================================================
   EL CASO
   Un mismo componente para las dos formas de llegar:
   - la capa que morfea desde la grilla (navegación interna)
   - la página /trabajos/[slug] (enlace compartido, buscadores)
   Así no hay dos versiones del mismo contenido que se desincronicen.
   ============================================================ */

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { askAbout } from "@/lib/consult";
import { clamp01, useMotionEnv } from "@/lib/motion";
import { etiquetaEnlace, whatsappUrl, works, type Work } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";
import { Mark } from "@/components/brand/Mark";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Flecha } from "@/components/ui/Flecha";
import { scrollToId } from "@/components/motion/MotionProvider";

const dosCifras = (n: number) => String(n).padStart(2, "0");

/* La portada: una plancha en azul pleno con la trama, como las
   portadas del catálogo, y el trabajo apoyado encima. Un sitio va
   adentro de una ventana de navegador con su dirección —dice, sin
   explicarlo, que es un sitio que funciona—; una pieza gráfica va
   entera, como un afiche sobre la plancha.

   Es la que viaja desde el acordeón: el nombre de transición tiene que
   ser único en el documento, por eso lo recibe desde afuera y sólo lo
   lleva la ficha que se está abriendo. Por lo mismo no lleva revelado
   de entrada: la captura de la transición la vería transparente. */
export function CaseCover({ work, morphName }: { work: Work; morphName?: string }) {
  const { reduce, fine } = useMotionEnv();

  /* El trabajo se inclina apenas hacia el cursor: se siente como un
     objeto apoyado en la plancha. Sólo con mouse y con movimiento. */
  const inclinar = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || !fine || e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      e.currentTarget.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
      e.currentTarget.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    },
    [reduce, fine]
  );
  const soltar = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.removeProperty("--rx");
    e.currentTarget.style.removeProperty("--ry");
  }, []);

  let contenido: React.ReactNode;
  if (!work.preview) {
    /* Sin captura, la plancha y el nombre: nunca una imagen rota. */
    contenido = (
      <div className="ventana-plancha">
        <span>{work.title}</span>
      </div>
    );
  } else if (work.previewEntera) {
    contenido = (
      <div className="caso-pieza" style={{ background: work.previewEntera.fondo }}>
        <Image src={work.preview} alt={work.alt} fill priority sizes="(max-width: 768px) 80vw, 460px" className="object-contain" />
      </div>
    );
  } else {
    contenido = (
      <div className="caso-ventana">
        <div className="caso-ventana-barra" aria-hidden="true">
          <span />
          <span />
          <span />
          {work.url && <p>{work.url.replace(/^https?:[/][/]/, "").replace(/[/]$/, "")}</p>}
        </div>
        <div className="caso-ventana-vista">
          <Image
            src={work.preview}
            alt={work.alt}
            fill
            priority
            sizes="(max-width: 768px) 92vw, 920px"
            className="object-cover object-top"
            style={work.previewPosition ? { objectPosition: work.previewPosition } : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="caso-portada inundado"
      data-luz
      style={morphName ? ({ viewTransitionName: morphName } as React.CSSProperties) : undefined}
      onPointerMove={inclinar}
      onPointerLeave={soltar}
    >
      {contenido}
    </div>
  );
}

/* Los datos duros, en una ficha de papel. Las columnas se reparten
   solas: con cuatro o con cinco datos entran en un renglón, sin uno
   colgando abajo. */
function Facts({ work }: { work: Work }) {
  // Sin datos propios se arman con lo que ya tiene la ficha.
  const facts =
    work.facts ?? [
      { label: "Trabajo", value: work.kind },
      { label: "Año", value: work.year },
      { label: "Rubro", value: work.category },
    ];

  return (
    <Reveal className="caso-datos">
      <dl>
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="label">{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/* Los capítulos. A la izquierda, un índice quieto que marca en cuál
   estás y lleva a cualquiera; a la derecha, cada capítulo con su
   número impreso en la trama. En pantallas chicas el índice no está:
   los capítulos se apilan y se leen de corrido.

   El índice usa botones y no enlaces con #: adentro de la capa, un
   cambio de fragmento dispara popstate y cerraría la ficha. */
function Capitulos({ work }: { work: Work }) {
  const chapters = work.chapters!;
  const [actual, setActual] = useState(0);
  const lista = useRef<HTMLDivElement>(null);
  const { reduce } = useMotionEnv();
  const idDe = (i: number) => `capitulo-${work.id}-${i + 1}`;

  /* El capítulo actual es el que cruza una franja angosta un poco por
     encima del medio de la pantalla. */
  useEffect(() => {
    const el = lista.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const secciones = Array.from(el.querySelectorAll<HTMLElement>(".capitulo"));
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActual(secciones.indexOf(e.target as HTMLElement));
      },
      { rootMargin: "-38% 0px -58% 0px", threshold: 0 }
    );
    secciones.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [work.id]);

  const ir = (i: number) => {
    const destino = document.getElementById(idDe(i));
    if (!destino) return;
    /* En la capa se desplaza la capa; en la página, el documento, que
       lleva el scroll con inercia. */
    if (destino.closest(".case-layer")) destino.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    else scrollToId(destino.id);
  };

  return (
    <div className="capitulos" style={{ ["--actual" as string]: actual } as React.CSSProperties}>
      <nav className="capitulos-indice" aria-label="Capítulos">
        <p className="label">El proyecto</p>
        <ol style={{ ["--total" as string]: chapters.length } as React.CSSProperties}>
          {chapters.map((c, i) => (
            <li key={c.title}>
              <button
                type="button"
                className={i === actual ? "is-actual" : i < actual ? "is-leido" : ""}
                aria-current={i === actual ? "true" : undefined}
                onClick={() => ir(i)}
              >
                <span className="capitulos-indice-n">{dosCifras(i + 1)}</span>
                {c.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div ref={lista}>
        {chapters.map((c, i) => (
          <Reveal as="section" key={c.title} id={idDe(i)} className="capitulo" aria-labelledby={`${idDe(i)}-t`}>
            <span className="capitulo-n" aria-hidden="true">
              {dosCifras(i + 1)}
            </span>
            <h2 id={`${idDe(i)}-t`} className="display display-sm">
              {c.title}
            </h2>
            <p className="capitulo-texto">{c.body}</p>
            {c.image && (
              <div className="capitulo-imagen shot">
                <Image src={c.image} alt="" fill sizes="(max-width: 900px) 100vw, 640px" className="object-cover" />
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
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

/* El remate: la misma plancha que cierra la página principal. Adentro
   del sitio, la acción lleva al formulario con el proyecto ya escrito;
   en la página suelta (un enlace compartido, un buscador) no hay
   formulario, así que va directo a WhatsApp con el mensaje armado. */
function Cierre({ work, conHistoria, onConsult }: { work: Work; conHistoria: boolean; onConsult?: () => void }) {
  const mensaje = `Hola Visual Solution, vi ${work.title} en su sitio y quiero algo así para mi negocio.`;
  const whatsapp = (
    <>
      <MetalFaz />
      <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d={siWhatsapp.path} />
      </svg>
      {onConsult ? "Escribinos por WhatsApp" : "Consultar por WhatsApp"}
      <Flecha externa />
      <span className="sr-only"> (se abre en una pestaña nueva)</span>
    </>
  );

  return (
    <section className="caso-cierre cierre inundado" data-luz aria-labelledby="caso-cierre-titulo">
      <Mark className="cierre-marca" />
      <div className="relative">
        <SplitHeading
          id="caso-cierre-titulo"
          text="¿Querés algo así para tu negocio?"
          accent="para tu negocio?"
          className="mx-auto max-w-[15ch] display display-md"
        />
        <Reveal as="p" delay={1} className="mx-auto mt-6 max-w-[48ch] text-[17px] leading-relaxed text-papel/85">
          {conHistoria
            ? "Contanos la idea. La primera propuesta no se cobra."
            : "Si querés ver el detalle de este trabajo o algo parecido para tu negocio, escribinos y te lo mostramos."}
        </Reveal>
        <Reveal delay={2} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onConsult ? (
            <>
              <button
                className="btn btn-metal"
                type="button"
                onClick={() => {
                  askAbout(work.title);
                  onConsult();
                }}
              >
                <MetalFaz />
                <i className="diamond" aria-hidden="true" />
                Consultar por este proyecto
              </button>
              <a className="btn btn-metal es-suave" href={whatsappUrl(mensaje)} target="_blank" rel="noopener noreferrer">
                {whatsapp}
              </a>
            </>
          ) : (
            <>
              <a className="btn btn-metal" href={whatsappUrl(mensaje)} target="_blank" rel="noopener noreferrer">
                {whatsapp}
              </a>
              <Link className="btn btn-metal es-suave" href="/#contacto">
                <MetalFaz />
                <i className="diamond" aria-hidden="true" />
                Usar el formulario
              </Link>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* La salida hacia adelante: el próximo trabajo del catálogo, con su
   captura impresa en la tinta como los paneles cerrados del acordeón.
   Adentro del sitio cambia la ficha sin cerrar la capa; en la página
   suelta es un enlace a la otra página. */
/* El anterior y el siguiente del catálogo, dando la vuelta en los
   extremos. */
const vecinos = (work: Work) => {
  const i = works.findIndex((w) => w.id === work.id);
  const n = works.length;
  return { i, anterior: works[(i - 1 + n) % n], siguiente: works[(i + 1) % n] };
};

function Siguiente({ work, onGo }: { work: Work; onGo?: (w: Work) => void }) {
  const sig = vecinos(work).siguiente;
  if (!sig || sig.id === work.id) return null;

  const dentro = (
    <>
      <span className="siguiente-texto">
        <span className="label">
          Siguiente proyecto · {dosCifras(works.indexOf(sig) + 1)} / {dosCifras(works.length)}
        </span>
        <span className="siguiente-titulo">{sig.title}</span>
        <span className="siguiente-tipo">{sig.kind}</span>
      </span>
      <span className="siguiente-imagen" aria-hidden="true">
        {sig.preview && (
          <Image
            src={sig.preview}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            className="object-cover"
            style={sig.previewPosition ? { objectPosition: sig.previewPosition } : undefined}
          />
        )}
      </span>
      <span className="siguiente-flecha" aria-hidden="true">
        <Flecha />
      </span>
    </>
  );

  return (
    <Reveal as="nav" className="caso-siguiente" aria-label="Siguiente proyecto">
      {onGo ? (
        <button type="button" className="siguiente" onClick={() => onGo(sig)}>
          {dentro}
        </button>
      ) : (
        <Link className="siguiente" href={`/trabajos/${sig.id}`}>
          {dentro}
        </Link>
      )}
    </Reveal>
  );
}

/* Anterior, cuenta y siguiente, para la barra de arriba. Adentro del
   sitio cambian la ficha sin cerrarla; en la página suelta son
   enlaces a las otras páginas. */
export function CaseNav({ work, onGo }: { work: Work; onGo?: (w: Work) => void }) {
  const { i, anterior, siguiente } = vecinos(work);
  if (works.length < 2) return null;

  const flecha = (destino: Work, atras: boolean) => {
    const etiqueta = `${atras ? "Proyecto anterior" : "Proyecto siguiente"}: ${destino.title}`;
    const clase = `caso-flecha ${atras ? "es-atras" : ""}`;
    return onGo ? (
      <button type="button" className={clase} aria-label={etiqueta} title={destino.title} onClick={() => onGo(destino)}>
        <Flecha />
      </button>
    ) : (
      <Link className={clase} href={`/trabajos/${destino.id}`} aria-label={etiqueta} title={destino.title}>
        <Flecha />
      </Link>
    );
  };

  return (
    <nav className="caso-nav" aria-label="Otros proyectos">
      <span className="caso-nav-cuenta" aria-hidden="true">
        {dosCifras(i + 1)} <span>/ {dosCifras(works.length)}</span>
      </span>
      {flecha(anterior, true)}
      {flecha(siguiente, false)}
    </nav>
  );
}

export function CaseStudy({
  work,
  morphName,
  onConsult,
  onGo,
}: {
  work: Work;
  morphName?: string;
  onConsult?: () => void;
  onGo?: (w: Work) => void;
}) {
  const hasStory = !!work.chapters?.length;
  const numero = dosCifras(works.findIndex((w) => w.id === work.id) + 1);

  return (
    <article className="mx-auto w-full max-w-[1100px] px-4 pb-16 md:px-10 md:pb-24">
      {/* La misma cabecera que las secciones de la página: rótulo y
          titular a la izquierda, el párrafo y las acciones a la derecha. */}
      <header className="caso-cabecera">
        <Reveal>
          <Eyebrow n={numero}>
            {work.kind} · {work.year}
          </Eyebrow>
          <SplitHeading as="h1" text={work.title} className="display display-lg" />
        </Reveal>

        <Reveal delay={1} className="caso-cabecera-lado">
          {work.summary && <p className="caso-resumen">{work.summary}</p>}
          {work.tech?.length ? (
            <ul className="obra-tech" aria-label="Herramientas">
              {work.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          ) : null}

          {/* Quien llega acá desde un buscador o un enlace compartido no
              tiene otra forma de llegar al proyecto: el sitio en vivo es
              la mejor prueba de que existe y funciona. */}
          {work.url && (
            <a className="btn btn-metal" href={work.url} target="_blank" rel="noopener noreferrer">
              <MetalFaz />
              <i className="diamond" aria-hidden="true" />
              {etiquetaEnlace(work.url)}
              <Flecha externa />
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          )}
        </Reveal>
      </header>

      <CaseCover work={work} morphName={morphName} />

      <Facts work={work} />

      {work.demo && <Demo demo={work.demo} />}

      {/* Sin capítulos la ficha no pide disculpas: muestra lo que hay y
          el cierre ofrece la conversación. */}
      {hasStory && <Capitulos key={work.id} work={work} />}

      {work.gallery?.length ? <Gallery images={work.gallery} title={work.title} /> : null}

      <Cierre work={work} conHistoria={hasStory} onConsult={onConsult} />

      <Siguiente work={work} onGo={onGo} />
    </article>
  );
}
