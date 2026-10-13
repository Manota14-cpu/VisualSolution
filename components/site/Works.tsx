"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { CaseLayer } from "@/components/site/CaseLayer";
import { scrollToId } from "@/components/motion/MotionProvider";
import { useMotionEnv, withTransition } from "@/lib/motion";
import { etiquetaEnlace, works, type Work } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";

/* ============================================================
   EL CATÁLOGO
   Un carrusel: un proyecto grande por vez, con los vecinos asomando a
   los costados para invitar a deslizar. Avanza solo cada pocos
   segundos —la barra de cada proyecto muestra cuánto falta— y se
   frena apenas alguien lo toca, pasa el cursor o lo deja de ver.

   La pista es un scroll horizontal nativo con imanes: en el teléfono
   se desliza con el dedo sin ninguna librería, y el autoplay sólo le
   pide al navegador que vaya a la diapositiva que toca.

   Cada tarjeta muestra el proyecto adentro de una ventana de
   navegador: dice, sin explicarlo, que es un sitio que funciona. La
   acción principal abre el sitio en vivo; la ficha sigue como segunda
   puerta.
   ============================================================ */

/* Cuánto dura cada proyecto en pantalla. Tiene que ir a la par de la
   animación de la barra en globals.css (--carrusel-paso). */
const PASO_MS = 6000;

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
            style={work.previewPosition ? { objectPosition: work.previewPosition } : undefined}
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

const dosCifras = (n: number) => String(n).padStart(2, "0");

function Tarjeta({
  work,
  numero,
  morphing,
  inclinar,
  onOpen,
}: {
  work: Work;
  numero: string;
  morphing: boolean;
  inclinar: boolean;
  onOpen: (w: Work) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const externo = !!work.url;
  /* Sin sitio en vivo la acción lleva a la ficha, y la etiqueta dice lo
     que es cada cosa: una app se conoce, un sitio se mira. */
  const etiquetaFicha = work.category === "software" ? "Conocer la app" : "Ver ficha del proyecto";

  /* La tarjeta activa se inclina apenas hacia el cursor y un brillo la
     sigue: se siente como un objeto que se puede agarrar. Sólo con
     mouse y con movimiento permitido. */
  const mover = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const el = ref.current;
      if (!el || !inclinar || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${((x - 0.5) * 5).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - y) * 4).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    },
    [inclinar]
  );
  const soltar = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  }, []);

  return (
    <article
      ref={ref}
      className={`obra ${work.pending ? "es-pendiente" : ""}`}
      onPointerMove={mover}
      onPointerLeave={soltar}
    >
      <Ventana work={work} morphing={morphing} />

      <div className="obra-cuerpo">
        <span className="obra-numero" aria-hidden="true">
          {numero}
        </span>
        <div className="obra-meta">
          <span className="badge">{work.kind}</span>
          {work.pending && <span className="badge obra-espera">En preparación</span>}
          <span className="obra-anio">{work.year}</span>
        </div>

        <h3 className="obra-titulo">{work.title}</h3>
        {work.short && <p className="obra-texto">{work.short}</p>}

        <div className="obra-acciones">
          {externo ? (
            <>
              <a className="btn btn-metal btn-sm" href={work.url} target="_blank" rel="noopener noreferrer">
                <MetalFaz />
                <i className="diamond" aria-hidden="true" />
                {etiquetaEnlace(work.url!)}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <button className="obra-ficha" type="button" onClick={() => onOpen(work)}>
                Ver ficha
              </button>
            </>
          ) : (
            <button className="btn btn-metal btn-sm" type="button" onClick={() => onOpen(work)}>
              <MetalFaz />
              <i className="diamond" aria-hidden="true" />
              {etiquetaFicha}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function Works() {
  const [open, setOpen] = useState<Work | null>(null);
  /* Se separa del abierto: el nombre de transición debe estar puesto en
     la pieza ANTES de que empiece la captura, y seguir puesto hasta que
     la vuelta termine. */
  const [morphId, setMorphId] = useState<string | null>(null);
  const { reduce, fine, ready } = useMotionEnv();
  const pushedUrl = useRef(false);

  /* ---- el carrusel ---- */
  const [activa, setActiva] = useState(0);
  /* Cada vuelta del mismo índice tiene que reiniciar la barra: la key de
     la barra lleva este contador. */
  const [vuelta, setVuelta] = useState(0);
  const [encima, setEncima] = useState(false);
  const [foco, setFoco] = useState(false);
  const [tocando, setTocando] = useState(false);
  const [aLaVista, setALaVista] = useState(false);
  const carrusel = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLUListElement>(null);
  const total = works.length;

  /* Se frena cuando alguien lo está mirando de cerca, cuando no está en
     pantalla, con la ficha abierta o con movimiento reducido. */
  const pausado = !ready || reduce || encima || foco || tocando || !aLaVista || !!open;

  const centrar = useCallback(
    (i: number, suave = true) => {
      const t = pista.current;
      const d = t?.children[i] as HTMLElement | undefined;
      if (!t || !d) return;
      t.scrollTo({
        left: d.offsetLeft - (t.clientWidth - d.offsetWidth) / 2,
        behavior: suave && !reduce ? "smooth" : "auto",
      });
    },
    [reduce]
  );

  const ir = useCallback(
    (i: number) => {
      const n = (i + total) % total;
      setActiva(n);
      setVuelta((v) => v + 1);
      centrar(n);
    },
    [centrar, total]
  );

  /* Cuando el que desliza es el dedo, la diapositiva activa sale de
     dónde quedó la pista: la más cercana al centro. Se calcula al
     terminar el desplazamiento, no durante, para que el autoplay y el
     dedo no se pisen. */
  useEffect(() => {
    const t = pista.current;
    if (!t) return;
    let espera = 0;
    const leer = () => {
      const centro = t.scrollLeft + t.clientWidth / 2;
      let mejor = 0;
      let dist = Infinity;
      Array.from(t.children).forEach((c, i) => {
        const el = c as HTMLElement;
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centro);
        if (d < dist) {
          dist = d;
          mejor = i;
        }
      });
      setActiva((a) => {
        if (a !== mejor) setVuelta((v) => v + 1);
        return mejor;
      });
    };
    const onScroll = () => {
      window.clearTimeout(espera);
      espera = window.setTimeout(leer, 120);
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      t.removeEventListener("scroll", onScroll);
      window.clearTimeout(espera);
    };
  }, []);

  /* Al cambiar el ancho, la activa vuelve al centro sin animación. */
  useEffect(() => {
    const t = pista.current;
    if (!t) return;
    const ro = new ResizeObserver(() => centrar(activa, false));
    ro.observe(t);
    return () => ro.disconnect();
  }, [activa, centrar]);

  useEffect(() => {
    const el = carrusel.current;
    if (!el || !("IntersectionObserver" in window)) {
      setALaVista(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setALaVista(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <section className="bg-fondo py-20 md:py-28" id="trabajos">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <SplitHeading text="Trabajos" className="display display-md" />
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-azul/85">
              Proyectos reales, funcionando. Deslizá y entrá a verlos.
            </p>
          </Reveal>
          <Reveal as="a" delay={1} className="link shrink-0" href="#contacto">
            Contanos tu proyecto
          </Reveal>
        </div>
      </div>

      {/* El revelado va afuera: su clase "in" la pone el observador a mano
          y React se la llevaría puesta al re-renderizar is-pausado. */}
      <Reveal>
        <div
          className={`carrusel ${pausado ? "is-pausado" : ""}`}
          ref={carrusel}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Trabajos"
          onPointerEnter={(e) => e.pointerType === "mouse" && setEncima(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setEncima(false)}
          onFocus={() => setFoco(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFoco(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") ir(activa + 1);
            if (e.key === "ArrowLeft") ir(activa - 1);
          }}
        >
          <ul
            className="carrusel-pista"
            ref={pista}
            onTouchStart={() => setTocando(true)}
            onTouchEnd={() => setTocando(false)}
            onTouchCancel={() => setTocando(false)}
          >
            {works.map((w, i) => (
              <li
                key={w.id}
                className={`diapo ${i === activa ? "is-activa" : ""}`}
                aria-roledescription="diapositiva"
                aria-label={`${i + 1} de ${total}: ${w.title}`}
                /* Tocar un vecino lo trae al centro en vez de abrirlo. */
                onClickCapture={(e) => {
                  if (i === activa) return;
                  e.preventDefault();
                  e.stopPropagation();
                  ir(i);
                }}
                onFocus={() => i !== activa && ir(i)}
              >
                <Tarjeta work={w} numero={dosCifras(i + 1)} morphing={morphId === w.id} inclinar={fine && !reduce && i === activa} onOpen={show} />
              </li>
            ))}
          </ul>

          <div className="carrusel-controles mx-auto w-full max-w-[1200px] px-4 md:px-10">
            <p className="carrusel-cuenta" aria-hidden="true">
              <span key={activa}>{dosCifras(activa + 1)}</span> / {dosCifras(total)}
            </p>

            <div className="carrusel-indices">
              {works.map((w, i) => (
                <button
                  key={w.id}
                  type="button"
                  className={`indice ${i === activa ? "is-activo" : ""} ${i < activa ? "is-visto" : ""}`}
                  aria-current={i === activa ? "true" : undefined}
                  onClick={() => ir(i)}
                >
                  <span className="indice-nombre">{w.title}</span>
                  <span className="indice-barra" aria-hidden="true">
                    {i === activa && (
                      <i
                        key={vuelta}
                        style={{ ["--carrusel-paso" as string]: `${PASO_MS}ms` } as React.CSSProperties}
                        onAnimationEnd={() => ir(activa + 1)}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="carrusel-flechas">
              <button type="button" className="flecha" aria-label="Proyecto anterior" onClick={() => ir(activa - 1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button type="button" className="flecha" aria-label="Proyecto siguiente" onClick={() => ir(activa + 1)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Reveal>

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
