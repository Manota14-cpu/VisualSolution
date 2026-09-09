"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { Reveal, SplitHeading, useReveal } from "@/components/motion/Reveal";
import { CaseLayer } from "@/components/site/CaseLayer";
import { scrollToId } from "@/components/motion/MotionProvider";
import { askAbout } from "@/lib/consult";
import { useMotionEnv, withTransition } from "@/lib/motion";
import { workFilters, works, type Work } from "@/lib/content";

/* El nombre de transición tiene que ser único en todo el documento, así
   que sólo lo lleva la ficha que se está abriendo. */
const morphNameFor = (id: string) => `caso-${id}`;

/* Inclinación con el origen en el punto del cursor, con el trabajo por
   cuadro limitado a un rAF. */
function useTilt<T extends HTMLElement>(strength = 7) {
  const host = useRef<T>(null);
  const { fine, reduce } = useMotionEnv();

  useEffect(() => {
    const el = host.current;
    if (!el || !fine || reduce) return;
    const plate = el.querySelector<HTMLElement>(".tilt");
    if (!plate) return;
    let queued = false;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        plate.style.transformOrigin = `${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%`;
        plate.style.setProperty("--ry", `${((px - 0.5) * strength).toFixed(2)}deg`);
        plate.style.setProperty("--rx", `${((py - 0.5) * -strength * 0.86).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      plate.style.transformOrigin = "";
      plate.style.setProperty("--ry", "0deg");
      plate.style.setProperty("--rx", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [fine, reduce, strength]);

  return host;
}

function WorkCard({
  work,
  hidden,
  morphing,
  onOpen,
}: {
  work: Work;
  hidden: boolean;
  morphing: boolean;
  onOpen: (w: Work) => void;
}) {
  const host = useTilt<HTMLElement>();
  // el <article> lleva .rv: hay que registrarlo aunque el ref sea del tilt
  useReveal<HTMLElement>(host);
  const wipe = useReveal<HTMLDivElement>();
  const detail = work.chapters?.length ? "Ver el caso" : "Ver ficha";

  return (
    <article ref={host} className={`work group rv ${work.span} ${hidden ? "is-out" : ""}`} hidden={hidden}>
      <a
        className="work-open block w-full text-left"
        href={`/trabajos/${work.id}`}
        aria-label={`Abrir el caso ${work.title}`}
        onClick={(e) => {
          // Es un enlace real para que se pueda abrir en otra pestaña y
          // los buscadores lo sigan. El clic normal lo intercepta la capa.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onOpen(work);
        }}
      >
        <div
          ref={wipe}
          className={`tilt shot wipe relative rounded-cards ${work.ratio}`}
          style={morphing ? ({ viewTransitionName: morphNameFor(work.id) } as React.CSSProperties) : undefined}
        >
          <Image
            src={work.thumb}
            alt={work.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </a>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium leading-snug text-chalk">{work.title}</h3>
          <p className="mt-1 text-xs text-chalk/55">{work.kind}</p>
        </div>
        <span className="badge">{work.year}</span>
      </div>
      <p className="work-detail mt-2 label text-chalk/55">{detail}</p>
    </article>
  );
}

export function Works() {
  const [filter, setFilter] = useState("todos");
  const [open, setOpen] = useState<Work | null>(null);
  /* Se separa del abierto: el nombre de transición debe estar puesto en
     la tarjeta ANTES de que empiece la captura, y seguir puesto hasta
     que la vuelta termine. */
  const [morphId, setMorphId] = useState<string | null>(null);
  const { reduce } = useMotionEnv();
  const pushedUrl = useRef(false);

  const visible = works.filter((w) => filter === "todos" || w.category === filter);

  const pick = useCallback(
    (id: string) => withTransition(() => flushSync(() => setFilter(id)), reduce),
    [reduce]
  );

  /* Cerrar de verdad. Lo llama sólo el popstate, para que haya un
     único camino: si cerráramos acá Y además volviéramos atrás, el
     popstate cerraría por segunda vez y las dos transiciones se
     pisarían, dejando la capa en un estado inconsistente. */
  const closeNow = useCallback(() => {
    withTransition(() => flushSync(() => setOpen(null)), reduce);
    // el nombre se suelta recién cuando la transición terminó
    window.setTimeout(() => setMorphId(null), 700);
  }, [reduce]);

  /* La URL manda: cerrar es volver atrás, y el popstate hace el resto. */
  const close = useCallback(() => {
    if (pushedUrl.current) {
      pushedUrl.current = false;
      history.back();
    } else {
      closeNow();
    }
  }, [closeNow]);

  const show = useCallback(
    (work: Work) => {
      // 1. la tarjeta recibe el nombre y se pinta antes de la captura
      flushSync(() => setMorphId(work.id));
      // 2. la transición captura el estado viejo y aplica el nuevo
      withTransition(() => flushSync(() => setOpen(work)), reduce);
      // 3. la URL queda compartible y el botón atrás cierra el caso
      history.pushState({ caso: work.id }, "", `/trabajos/${work.id}`);
      pushedUrl.current = true;
    },
    [reduce]
  );

  /* El botón atrás del navegador cierra el caso en vez de sacarte del
     sitio. Como la URL ya volvió sola, no hay que tocarla de nuevo. */
  useEffect(() => {
    const onPop = () => {
      pushedUrl.current = false;
      closeNow();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [closeNow]);

  const consultar = useCallback(() => {
    close();
    window.setTimeout(() => scrollToId("contacto"), 220);
  }, [close]);

  return (
    <section className="bg-onyx py-20 md:py-28" id="trabajos">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SplitHeading
              text="Catálogo"
              className="display display-md"
            />
          </Reveal>
          <Reveal as="a" delay={1} className="link" href="#contacto">
            Pedir el catálogo completo
          </Reveal>
        </div>

        <Reveal className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar trabajos por tipo">
          {workFilters.map((f) => (
            <button
              key={f.id}
              className="pill"
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => pick(f.id)}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
          {works.map((w) => (
            <WorkCard
              key={w.id}
              work={w}
              hidden={filter !== "todos" && w.category !== filter}
              morphing={morphId === w.id}
              onOpen={show}
            />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-8 label text-chalk/55">No hay trabajos de ese tipo todavía.</p>
        )}
      </div>

      {open && (
        <CaseLayer
          work={open}
          morphName={morphId === open.id ? morphNameFor(open.id) : undefined}
          onClose={close}
          onConsult={consultar}
        />
      )}
    </section>
  );
}
