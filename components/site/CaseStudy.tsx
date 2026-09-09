"use client";

/* ============================================================
   EL CASO
   Un mismo componente para las dos formas de llegar:
   - la capa que morfea desde la grilla (navegación interna)
   - la página /trabajos/[slug] (enlace compartido, buscadores)
   Así no hay dos versiones del mismo contenido que se desincronicen.
   ============================================================ */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { askAbout } from "@/lib/consult";
import { clamp01 } from "@/lib/motion";
import type { Work } from "@/lib/content";

/* La imagen de portada es la que viaja desde la grilla. El nombre de
   transición tiene que ser único en el documento, por eso lo recibe
   desde afuera y sólo lo lleva la ficha que se está abriendo. */
export function CaseCover({ work, morphName }: { work: Work; morphName?: string }) {
  return (
    <div
      className="shot relative aspect-[16/9] w-full overflow-hidden rounded-card md:aspect-[21/9]"
      style={morphName ? ({ viewTransitionName: morphName } as React.CSSProperties) : undefined}
    >
      <Image
        src={work.full}
        alt={work.alt}
        fill
        priority
        sizes="(max-width: 1200px) 100vw, 1200px"
        className="object-cover"
      />
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
    <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-y border-hairline py-8 md:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="font-mono text-[11px] uppercase tracking-[.8px] text-smoke">{f.label}</dt>
          <dd className="mt-2 text-base text-white">{f.value}</dd>
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
        <h2 className="text-[clamp(22px,2.6vw,30px)] font-normal leading-tight tracking-[.2px] text-white">
          {chapter.title}
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-ash">{chapter.body}</p>
      </div>

      {chapter.image ? (
        <div className="shot relative aspect-[4/3] overflow-hidden rounded-card shadow-keysoft">
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
          <span className="font-mono text-[11px] uppercase tracking-[.8px] text-smoke">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}
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
            className="shot relative aspect-[3/4] w-[72vw] shrink-0 snap-center overflow-hidden rounded-card shadow-keysoft md:w-[340px]"
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
    <div className="absolute inset-x-0 bottom-0 h-px bg-hairline" aria-hidden="true">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${p})`,
          background: "linear-gradient(90deg,#8B5CF6,#EC4899)",
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
          <h1 className="text-[clamp(30px,4.4vw,48px)] font-normal leading-[1.1] tracking-[.22px] text-white">
            {work.title}
          </h1>
          {work.summary && (
            <p className="mt-4 max-w-[58ch] text-lg leading-relaxed text-ash">{work.summary}</p>
          )}
        </div>
      </header>

      <div className="mt-10">
        <Facts work={work} />
      </div>

      {hasStory ? (
        <div className="divide-y divide-hairline">
          {work.chapters!.map((c, i) => (
            <Chapter key={c.title} chapter={c} index={i} />
          ))}
        </div>
      ) : (
        /* Ficha compacta: no pide disculpas por no tener historia,
           muestra lo que hay y ofrece la conversación. */
        <p className="max-w-[58ch] py-14 text-base leading-relaxed text-ash md:py-20">
          Si querés ver el detalle de este trabajo o algo parecido para tu negocio, escribinos y te lo
          mostramos.
        </p>
      )}

      {work.gallery?.length ? <Gallery images={work.gallery} title={work.title} /> : null}

      <footer className="border-t border-hairline pt-12 text-center">
        <p className="mx-auto max-w-[34ch] text-[clamp(22px,2.6vw,30px)] font-normal leading-tight tracking-[.2px] text-white">
          ¿Querés algo así para tu negocio?
        </p>
        <button
          className="btn btn-solid mag mt-7"
          type="button"
          onClick={() => {
            askAbout(work.title);
            onConsult?.();
          }}
        >
          <i className="diamond" aria-hidden="true" />
          Consultar por este proyecto
        </button>
      </footer>

    </article>
  );
}
