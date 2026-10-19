"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { CaseLayer } from "@/components/site/CaseLayer";
import { scrollToId } from "@/components/motion/MotionProvider";
import { useMotionEnv, withTransition } from "@/lib/motion";
import { etiquetaEnlace, numeroDeSeccion, works, type Work } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Flecha } from "@/components/ui/Flecha";

/* ============================================================
   EL CATÁLOGO
   Un acordeón: los trabajos en fila, como los lomos de una carpeta.
   El abierto se lleva la mitad del ancho, en color, con su nombre y
   sus acciones; los cerrados quedan angostos e impresos en la tinta
   de la marca (gris, velo azul y la trama), con el nombre de costado.
   Con mouse se abre el que tiene el cursor encima; con el dedo o el
   teclado, el que se toca o se elige. En el teléfono la fila pasa a
   columna.

   Los cerrados se inclinan apenas hacia el abierto y su imagen se
   corre hacia él: la fila tiene profundidad y el ojo va solo al que
   importa. Todo es CSS: el componente sólo dice cuál está abierto.

   La acción principal abre el sitio en vivo; la ficha sigue como
   segunda puerta.
   ============================================================ */

/* Qué parte del ancho se lleva el abierto (sin contar los huecos). */
const ABIERTO = 0.52;

const morphNameFor = (id: string) => `caso-${id}`;

const dosCifras = (n: number) => String(n).padStart(2, "0");

function Hoja({
  work,
  indice,
  activa,
  lado,
  deriva,
  morphing,
  onActivar,
  onTecla,
  onOpen,
}: {
  work: Work;
  indice: number;
  activa: boolean;
  /* De qué lado del abierto queda: hacia ahí se inclina. */
  lado: "antes" | "despues" | null;
  /* Cuántos lugares lo separan del abierto, con signo y tope en 1.5:
     cuánto se corre la imagen. */
  deriva: number;
  morphing: boolean;
  onActivar: () => void;
  onTecla: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onOpen: (w: Work) => void;
}) {
  const id = `trabajo-${work.id}`;
  const externo = !!work.url;
  /* Sin sitio en vivo la acción lleva a la ficha, y la etiqueta dice lo
     que es cada cosa: una app se conoce, un sitio se mira. */
  const etiquetaFicha = work.category === "software" ? "Conocer la app" : "Ver ficha del proyecto";
  const n = dosCifras(indice + 1);

  return (
    <li
      className={`hoja ${activa ? "is-activa" : ""} ${lado ? `es-${lado}` : ""}`}
      style={{ ["--i" as string]: indice, ["--deriva" as string]: deriva } as React.CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivar()}
    >
      {/* El marco es el que viaja a la ficha cuando se abre: tiene la
          medida exacta del panel, sin lo que la imagen asoma de más. */}
      <div
        className="hoja-marco"
        aria-hidden="true"
        style={morphing ? ({ viewTransitionName: morphNameFor(work.id) } as React.CSSProperties) : undefined}
      >
        <div className="hoja-imagen">
          {work.preview ? (
            <Image
              src={work.preview}
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 720px"
              className="object-cover"
              style={work.previewPosition ? { objectPosition: work.previewPosition } : undefined}
            />
          ) : (
            /* Sin captura, el panel no queda vacío ni roto: se llena con
               la plancha y el nombre, que es material del sistema. */
            <div className="ventana-plancha">
              <span>{work.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* El lomo: número y nombre de costado, sólo con el panel cerrado. */}
      <span className="hoja-lomo" aria-hidden="true">
        <span className="hoja-n">{n}</span>
        <span className="hoja-lomo-titulo">{work.title}</span>
      </span>

      {/* Todo el panel es el botón que lo abre. Abierto sigue ahí, por
          debajo de las acciones, para que el teclado no pierda el lugar. */}
      <button
        type="button"
        className="hoja-gatillo"
        aria-expanded={activa}
        aria-controls={id}
        aria-label={`${work.title}, ${work.kind}`}
        onClick={onActivar}
        onKeyDown={onTecla}
      />

      {/* inert saca del tabulador y del árbol de accesibilidad lo que no
          se ve: las acciones de un panel cerrado no se pueden tocar. */}
      <div className="hoja-detalle" id={id} inert={!activa}>
        <p className="hoja-meta">
          <span className="hoja-n">{n}</span>
          <i aria-hidden="true" />
          {work.kind}
          {work.pending && <span className="badge">En preparación</span>}
        </p>
        <h3 className="hoja-titulo">{work.title}</h3>
        {work.short && <p className="hoja-texto">{work.short}</p>}

        <div className="hoja-acciones">
          {externo ? (
            <>
              <a className="btn btn-metal btn-sm" href={work.url} target="_blank" rel="noopener noreferrer">
                <MetalFaz />
                <i className="diamond" aria-hidden="true" />
                {etiquetaEnlace(work.url!)}
                <Flecha externa />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <button className="hoja-ficha" type="button" onClick={() => onOpen(work)}>
                Ver ficha
                <Flecha />
              </button>
            </>
          ) : (
            <button className="btn btn-metal btn-sm" type="button" onClick={() => onOpen(work)}>
              <MetalFaz />
              <i className="diamond" aria-hidden="true" />
              {etiquetaFicha}
              <Flecha />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export function Works() {
  const [open, setOpen] = useState<Work | null>(null);
  /* Se separa del abierto: el nombre de transición debe estar puesto en
     la pieza ANTES de que empiece la captura, y seguir puesto hasta que
     la vuelta termine. */
  const [morphId, setMorphId] = useState<string | null>(null);
  const { reduce } = useMotionEnv();
  const pushedUrl = useRef(false);

  /* ---- el acordeón ---- */
  const [activa, setActiva] = useState(0);
  const lista = useRef<HTMLUListElement>(null);
  const total = works.length;
  /* Cuánto crece el abierto para quedarse con ABIERTO del ancho: los
     cerrados crecen 1 cada uno. */
  const crece = (ABIERTO * (total - 1)) / (1 - ABIERTO);

  /* Las flechas recorren los paneles como pestañas: mueven el foco al
     vecino y lo abren. */
  const tecla = useCallback(
    (i: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const paso = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!paso) return;
      e.preventDefault();
      const n = (i + paso + total) % total;
      setActiva(n);
      lista.current?.querySelectorAll<HTMLButtonElement>(".hoja-gatillo")[n]?.focus();
    },
    [total]
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

  /* Pasar a otro trabajo sin cerrar la capa. La URL se reemplaza y no
     se apila: atrás sigue cerrando la ficha. El panel de ese trabajo
     queda abierto en el acordeón y lleva el nombre de transición, así
     al cerrar la imagen vuelve a su lugar. */
  const irA = useCallback(
    (work: Work) => {
      setActiva(works.findIndex((w) => w.id === work.id));
      withTransition(
        () =>
          flushSync(() => {
            setMorphId(work.id);
            setOpen(work);
          }),
        reduce
      );
      history.replaceState({ caso: work.id }, "", `/trabajos/${work.id}`);
    },
    [reduce]
  );

  const consultar = useCallback(() => {
    close();
    window.setTimeout(() => scrollToId("contacto"), 220);
  }, [close]);

  return (
    <section className="seccion" id="trabajos" aria-labelledby="trabajos-titulo">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        {/* Una sola palabra a escala de cartel: es la sección que vende, y
            el titular más grande de la página después del hero. */}
        <div className="cabecera">
          <Reveal>
            <Eyebrow n={numeroDeSeccion("#trabajos")}>Proyectos</Eyebrow>
            <div className="titulo-con-cuenta">
              <SplitHeading id="trabajos-titulo" text="Trabajos" className="display display-xl" />
              {/* La cuenta, en superíndice como en un índice editorial. Es
                  decorado: los números de los paneles ya la dicen. */}
              <span className="titulo-cuenta" aria-hidden="true">
                {dosCifras(total)}
              </span>
            </div>
          </Reveal>
          <Reveal delay={1} className="cabecera-texto">
            <p>Proyectos reales, funcionando. Elegí uno y entrá a verlo.</p>
            <a className="link link-flecha mt-5" href="#contacto">
              Contanos tu proyecto
              <Flecha />
            </a>
          </Reveal>
        </div>

        <Reveal>
          <ul
            ref={lista}
            className="acordeon"
            aria-label="Trabajos"
            style={
              {
                ["--n" as string]: total,
                ["--abierto" as string]: ABIERTO,
                ["--crece" as string]: crece.toFixed(3),
              } as React.CSSProperties
            }
          >
            {works.map((w, i) => (
              <Hoja
                key={w.id}
                work={w}
                indice={i}
                activa={i === activa}
                lado={i < activa ? "antes" : i > activa ? "despues" : null}
                deriva={Math.max(-1.5, Math.min(1.5, activa - i))}
                /* El nombre de transición no puede estar dos veces en la
                   página: el panel lo lleva sólo con la ficha cerrada, y
                   la portada de la ficha sólo con la ficha abierta. Si
                   coinciden, el navegador cancela la transición. */
                morphing={morphId === w.id && !open}
                onActivar={() => setActiva(i)}
                onTecla={tecla(i)}
                onOpen={show}
              />
            ))}
          </ul>
        </Reveal>
      </div>

      {open && (
        <CaseLayer
          work={open}
          morphName={morphId === open.id ? morphNameFor(open.id) : undefined}
          onClose={close}
          onConsult={consultar}
          onGo={irA}
          anterior={works[(works.indexOf(open) - 1 + total) % total]}
          siguiente={works[(works.indexOf(open) + 1) % total]}
        />
      )}
    </section>
  );
}
