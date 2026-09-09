"use client";

import { useCallback, useRef, useState } from "react";
import { Hands } from "@/components/brand/Hands";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { hero, capabilities, heroServices, type HeroService } from "@/lib/content";

/* ============================================================
   EL HERO
   El bloque de trama a escala de hero —puntos magenta sobre el
   degradado violeta→magenta, que es la firma del sistema— con las
   dos manos apoyadas encima a punto de tocarse. Debajo, el titular
   a 189px, que es la otra firma.
   Las fichas de servicio se arrastran al hueco entre las manos y
   arman la consulta. Si nadie toca nada, el afiche se lee igual.
   ============================================================ */

/* Las fichas se apoyan en los bordes del bloque, nunca encima del
   punto de contacto, que es lo único que no se puede tapar. */
const ARC: React.CSSProperties[] = [
  { top: "-5%", left: "1%" },
  { top: "31%", left: "-6%" },
  { top: "74%", left: "3%" },
  { top: "-3%", right: "2%" },
  { top: "35%", right: "-6%" },
];

function Chip({
  service,
  taken,
  dragging,
  onToggle,
  onDragStart,
}: {
  service: HeroService;
  taken: boolean;
  dragging: boolean;
  onToggle: () => void;
  onDragStart: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`chip ${taken ? "is-taken" : ""} ${dragging ? "is-dragging" : ""}`}
      aria-pressed={taken}
      onClick={onToggle}
      onPointerDown={(e) => {
        // el arrastre es el camino lindo; el clic es el que siempre funciona
        if (e.button === 0) onDragStart(service.id);
      }}
    >
      <span className="chip-code">{service.code}</span>
      <span className="chip-label">{service.label}</span>
    </button>
  );
}

export function Hero() {
  const [taken, setTaken] = useState<string[]>([]);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const toggle = useCallback((id: string) => {
    setTaken((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }, []);

  /* Se escucha en la ventana y no en la ficha, para no perder el rastro
     del puntero apenas sale de ella. */
  const startDrag = useCallback((id: string) => {
    let movido = false;
    const dentro = (e: PointerEvent) => {
      const r = stage.current?.getBoundingClientRect();
      return !!r && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    };
    const move = (e: PointerEvent) => {
      if (!movido) {
        movido = true;
        setDragging(id);
      }
      setOver(dentro(e));
    };
    const up = (e: PointerEvent) => {
      // sólo cuenta como arrastre si hubo movimiento: un clic seco lo
      // resuelve el onClick, sin pisarse con esto
      if (movido && dentro(e)) setTaken((t) => (t.includes(id) ? t : [...t, id]));
      setDragging(null);
      setOver(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }, []);

  const elegidos = heroServices.filter((s) => taken.includes(s.id));
  const resumen = elegidos.map((s) => s.label).join(" + ");
  /* La etiqueta no puede crecer sin límite: con los cinco puestos el
     botón se desbordaría. Hasta dos van los nombres; de ahí, el conteo. */
  const ctaLabel =
    elegidos.length === 0
      ? hero.primaryCta
      : elegidos.length <= 2
        ? `Empezar: ${resumen}`
        : `Empezar: ${elegidos.length} servicios`;

  const empezar = useCallback(() => {
    if (elegidos.length) {
      askForServices(elegidos.map((s) => ({ label: s.label, formValue: s.formValue })));
    }
    scrollToId("contacto");
  }, [elegidos]);

  return (
    <section className="relative overflow-hidden bg-onyx pb-16 pt-28 md:pb-24 md:pt-32" id="top">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 md:px-10">
        {/* El bloque de trama con las manos encima. Las fichas se apoyan
            en sus bordes. */}
        <div className="relative mx-auto w-full max-w-[1040px]">
          <div ref={stage} className={`stage relative ${over ? "is-over" : ""}`}>
            <Hands
              className="halftone animate-rise aspect-[6/5] w-full md:aspect-[15/7]"
              services={taken}
            />
          </div>

          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {heroServices.map((s, i) => (
              <div key={s.id} className="pointer-events-auto absolute" style={ARC[i]}>
                <Chip
                  service={s}
                  taken={taken.includes(s.id)}
                  dragging={dragging === s.id}
                  onToggle={() => toggle(s.id)}
                  onDragStart={startDrag}
                />
              </div>
            ))}
          </div>
        </div>

        {/* En angosto van en una tira que se desliza, para no empujar el
            titular fuera de la primera pantalla. */}
        <div className="chip-strip fade-x mt-4 md:hidden">
          {heroServices.map((s) => (
            <Chip
              key={s.id}
              service={s}
              taken={taken.includes(s.id)}
              dragging={dragging === s.id}
              onToggle={() => toggle(s.id)}
              onDragStart={startDrag}
            />
          ))}
        </div>

        <p className={`hint mt-5 text-center ${taken.length ? "is-done" : ""}`}>
          <span className="hidden md:inline">Arrastrá un servicio al punto de contacto</span>
          <span className="md:hidden">Tocá lo que necesitás</span>
        </p>

        <h1 className="display display-xl animate-rise mt-6 text-center" style={{ animationDelay: ".1s" }}>
          {hero.claim.map((linea, i) => (
            <span key={linea} className="block">
              {linea}
            </span>
          ))}
        </h1>

        <p
          className="tagline animate-rise mx-auto mt-7 max-w-[46ch] text-center"
          style={{ animationDelay: ".2s" }}
        >
          {hero.sub}
        </p>

        {/* Lo armado. Cada pieza se saca desde acá. */}
        {elegidos.length > 0 && (
          <div className="mt-8 text-center">
            <p className="label text-chalk/55">Tu proyecto</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {elegidos.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="taken"
                    onClick={() => toggle(s.id)}
                  >
                    {s.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Sacar {s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div
          className="animate-rise mt-9 flex flex-wrap justify-center gap-3"
          style={{ animationDelay: ".3s" }}
        >
          <button className="btn btn-solid" type="button" onClick={empezar}>
            <i className="diamond" aria-hidden="true" />
            <span key={ctaLabel} className="cta-label">
              {ctaLabel}
            </span>
          </button>
          <a className="btn btn-ghost" href="#trabajos">
            {hero.secondaryCta}
          </a>
        </div>
      </div>
    </section>
  );
}

/* La marquesina negra a sangre, pegada al borde de la página: es la
   bisagra entre el afiche del hero y el resto. */
export function Marquee() {
  const line = (hidden: boolean) => (
    <div className="row" aria-hidden={hidden || undefined}>
      {capabilities.map((cap) => (
        <span key={cap}>
          {cap}
          <span className="sep" aria-hidden="true"> ✦ </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-band border-y border-chalk/20">
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max">
          {line(false)}
          {line(true)}
        </div>
      </div>
    </div>
  );
}
