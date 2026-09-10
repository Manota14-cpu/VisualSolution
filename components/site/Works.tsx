"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { CaseLayer } from "@/components/site/CaseLayer";
import { scrollToId } from "@/components/motion/MotionProvider";
import { useMotionEnv, withTransition } from "@/lib/motion";
import { workFilters, works, type Work } from "@/lib/content";

/* ============================================================
   EL CATÁLOGO
   Un índice editorial, no una grilla de fichas. Cada trabajo es
   una fila a todo el ancho: el año a la izquierda, el título en
   display y el tipo a la derecha, separadas por el punteado del
   sistema.

   La foto no vive adentro de un marco. Hay un solo recorte para
   toda la lista, que sigue al puntero y cambia de imagen al
   pasar de fila: la imagen flota sobre el texto en vez de estar
   encajada al lado. Donde no hay puntero que seguir, cada fila
   muestra su propia tira recortada.
   ============================================================ */

/* El nombre de transición tiene que ser único en todo el documento, así
   que sólo lo lleva la pieza que se está abriendo. Y sólo una: si el
   recorte y la tira lo llevaran a la vez, la transición falla. */
const morphNameFor = (id: string) => `caso-${id}`;

function Fila({
  work,
  hidden,
  morphing,
  onOpen,
  onEnter,
}: {
  work: Work;
  hidden: boolean;
  morphing: boolean;
  onOpen: (w: Work) => void;
  onEnter: (w: Work) => void;
}) {
  return (
    <button
      type="button"
      className="fila"
      hidden={hidden}
      onPointerEnter={() => onEnter(work)}
      onFocus={() => onEnter(work)}
      onClick={() => onOpen(work)}
      aria-label={`Abrir el caso ${work.title}`}
    >
      <span className="anio">{work.year}</span>

      <span>
        <span className="titulo">{work.title}</span>
      </span>

      <span className="tipo">{work.kind}</span>

      <svg className="flecha" width="26" height="14" viewBox="0 0 26 14" fill="none" aria-hidden="true">
        <path
          d="M1 7h23M18 1l6 6-6 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* La tira: es lo que se ve donde el puntero no existe. */}
      <span className="fila-tira" aria-hidden="true">
        <Image
          src={work.thumb}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={morphing ? ({ viewTransitionName: morphNameFor(work.id) } as React.CSSProperties) : undefined}
        />
      </span>
    </button>
  );
}

export function Works() {
  const [filter, setFilter] = useState("todos");
  const [open, setOpen] = useState<Work | null>(null);
  /* Se separa del abierto: el nombre de transición debe estar puesto en
     la pieza ANTES de que empiece la captura, y seguir puesto hasta que
     la vuelta termine. */
  const [morphId, setMorphId] = useState<string | null>(null);
  const [activo, setActivo] = useState<Work>(works[0]);
  const { reduce, fine } = useMotionEnv();
  const pushedUrl = useRef(false);
  const lista = useRef<HTMLDivElement>(null);

  const visible = works.filter((w) => filter === "todos" || w.category === filter);

  /* El recorte sigue al puntero. Posición y escala son custom
     properties del contenedor: mover una imagen no puede costar un
     render de React por cada movimiento del mouse. */
  useEffect(() => {
    const el = lista.current;
    if (!el || !fine || reduce) return;
    const move = (e: PointerEvent) => {
      el.style.setProperty("--cx", `${e.clientX.toFixed(1)}px`);
      el.style.setProperty("--cy", `${e.clientY.toFixed(1)}px`);
    };
    const entra = () => el.classList.add("is-hover");
    const sale = () => el.classList.remove("is-hover");
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerenter", entra);
    el.addEventListener("pointerleave", sale);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerenter", entra);
      el.removeEventListener("pointerleave", sale);
    };
  }, [fine, reduce]);

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
      // 1. la pieza recibe el nombre y se pinta antes de la captura
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
            <SplitHeading text="Catálogo" className="display display-md" />
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

        <Reveal>
          <div className="indice" ref={lista}>
            {works.map((w) => (
              <Fila
                key={w.id}
                work={w}
                hidden={filter !== "todos" && w.category !== filter}
                morphing={morphId === w.id && !fine}
                onOpen={show}
                onEnter={setActivo}
              />
            ))}

            {/* Un solo recorte para toda la lista: cambia de foto al pasar
                de fila en vez de existir cinco veces. */}
            {fine && !reduce && (
              <span className="recorte" aria-hidden="true">
                <Image
                  key={activo.id}
                  src={activo.thumb}
                  alt=""
                  width={360}
                  height={270}
                  className="h-full w-full object-cover"
                  style={
                    morphId === activo.id
                      ? ({ viewTransitionName: morphNameFor(activo.id) } as React.CSSProperties)
                      : undefined
                  }
                />
              </span>
            )}
          </div>
        </Reveal>

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
