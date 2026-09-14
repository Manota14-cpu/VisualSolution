"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { Reveal, SplitHeading, useReveal } from "@/components/motion/Reveal";
import { CaseLayer } from "@/components/site/CaseLayer";
import { scrollToId } from "@/components/motion/MotionProvider";
import { useMotionEnv, withTransition } from "@/lib/motion";
import { workFilters, works, type Work } from "@/lib/content";

/* ============================================================
   EL CATÁLOGO
   Tres trabajos, tres tarjetas. Con esta cantidad no tiene sentido
   una grilla de piezas iguales: el primero ocupa el ancho completo
   y los otros dos van a la par, así la sección tiene una entrada
   clara en vez de tres cosas del mismo peso compitiendo.

   Cada tarjeta muestra el proyecto adentro de una ventana de
   navegador: es lo que dice, sin explicarlo, que esto es un sitio
   que funciona y no una maqueta. Si todavía no hay captura, la
   ventana se llena con la plancha del sistema y el nombre del
   proyecto — nunca una imagen rota.

   La acción principal abre el sitio en vivo en una pestaña nueva.
   La ficha —la que existía antes, con capítulos y transición de
   vista— sigue estando, como segunda puerta.
   ============================================================ */

const morphNameFor = (id: string) => `caso-${id}`;

/* La ventana: el marco de navegador con la captura adentro. */
function Ventana({ work, morphing }: { work: Work; morphing: boolean }) {
  const morph = morphing
    ? ({ viewTransitionName: morphNameFor(work.id) } as React.CSSProperties)
    : undefined;

  return (
    <div className="ventana" aria-hidden="true">
      <div className="ventana-barra">
        <span />
        <span />
        <span />
        {work.url && <p className="ventana-url">{work.url.replace(/^https?:[/][/]/, "")}</p>}
      </div>

      <div className="ventana-vista" style={morph}>
        {work.preview ? (
          <Image
            src={work.preview}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 60vw"
            className="object-cover object-top"
          />
        ) : (
          /* Sin captura, la ventana no queda vacía ni rota: se llena
             con la plancha y el nombre, que es material del sistema. */
          <div className="ventana-plancha">
            <span>{work.title}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Tarjeta({
  work,
  ancha,
  hidden,
  morphing,
  onOpen,
}: {
  work: Work;
  ancha: boolean;
  hidden: boolean;
  morphing: boolean;
  onOpen: (w: Work) => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const externo = !!work.url;

  return (
    <div ref={ref} className={`rv ${ancha ? "md:col-span-2" : ""}`} hidden={hidden}>
      <article className={`obra ${ancha ? "es-ancha" : ""} ${work.pending ? "es-pendiente" : ""}`}>
        <Ventana work={work} morphing={morphing} />

        <div className="obra-cuerpo">
          <div className="obra-meta">
            <span className="badge">{work.kind}</span>
            {work.pending && <span className="badge obra-espera">En preparación</span>}
            <span className="obra-anio">{work.year}</span>
          </div>

          <h3 className="obra-titulo">{work.title}</h3>
          {work.short && <p className="obra-texto">{work.short}</p>}

          {work.tech && (
            <ul className="obra-tech">
              {work.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}

          <div className="obra-acciones">
            {externo ? (
              <>
                <a className="btn btn-solid btn-sm" href={work.url} target="_blank" rel="noopener noreferrer">
                  <i className="diamond" aria-hidden="true" />
                  Explorar proyecto
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
                <button className="obra-ficha" type="button" onClick={() => onOpen(work)}>
                  Ver ficha
                </button>
              </>
            ) : (
              <button className="btn btn-solid btn-sm" type="button" onClick={() => onOpen(work)}>
                <i className="diamond" aria-hidden="true" />
                Conocer la app
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export function Works() {
  const [filter, setFilter] = useState("todos");
  const [open, setOpen] = useState<Work | null>(null);
  /* Se separa del abierto: el nombre de transición debe estar puesto en
     la pieza ANTES de que empiece la captura, y seguir puesto hasta que
     la vuelta termine. */
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
      flushSync(() => setMorphId(work.id));
      withTransition(() => flushSync(() => setOpen(work)), reduce);
      history.pushState({ caso: work.id }, "", `/trabajos/${work.id}`);
      pushedUrl.current = true;
    },
    [reduce]
  );

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
            <SplitHeading text="Trabajos" className="display display-md" />
            <p className="mt-6 max-w-[54ch] text-base leading-relaxed text-chalk/70">
              Sitios web, tiendas online y software a medida. Cada proyecto está en línea y se puede
              recorrer: preferimos mostrarlos funcionando antes que contarlos.
            </p>
          </Reveal>
          <Reveal as="a" delay={1} className="link shrink-0" href="#contacto">
            Contanos tu proyecto
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

        {/* El primero ocupa el ancho completo; los otros dos van a la
            par. Con el filtro puesto, el que quede primero manda. */}
        <div className="obras">
          {works.map((w) => {
            const oculto = filter !== "todos" && w.category !== filter;
            return (
              <Tarjeta
                key={w.id}
                work={w}
                ancha={visible[0]?.id === w.id}
                hidden={oculto}
                morphing={morphId === w.id}
                onOpen={show}
              />
            );
          })}
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
