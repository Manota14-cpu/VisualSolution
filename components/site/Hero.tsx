"use client";

import { useCallback, useRef, useState } from "react";
import { Hands } from "@/components/brand/Hands";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { hero, capabilities, heroServices, type HeroService } from "@/lib/content";

/* ============================================================
   EL HERO
   Un afiche, no una tarjeta. La banda de trama va a sangre, de
   borde a borde de la pantalla, con las dos manos cortadas por
   los márgenes; el reclamo la muerde desde abajo y se apoya
   contra el margen izquierdo con las líneas escalonadas.
   Imagen y tipografía se traban en vez de apilarse: es lo único
   que separa una composición de una plantilla.

   Las fichas de servicio viven en una barra negra que cruza el
   pie de la banda, y se arrastran al hueco entre las manos.
   Si nadie toca nada, el afiche se lee igual.
   ============================================================ */

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
    <section className="relative overflow-hidden bg-onyx pb-16 pt-24 md:pb-24 md:pt-28" id="top">
      {/* La banda, a sangre. El puntero que entra acá acerca las manos,
          y es también la zona donde se sueltan las fichas. */}
      <div ref={stage} className={`banda stage ${over ? "is-over" : ""}`}>
        <Hands className="halftone h-full w-full" services={taken} />

        <span className="sello" aria-hidden="true">
          <i className="diamond" />
          Web + video
        </span>

        <div className="tira fade-x">
          <p className={`hint ${taken.length ? "is-done" : ""}`}>
            <span className="hidden md:inline">Arrastrá al punto de contacto</span>
            <span className="md:hidden">Tocá lo que necesitás</span>
          </p>
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
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 md:px-10">
        {/* Cada línea la descubre un filo de luz que sube con ella. El
            texto está entero en el DOM desde el servidor, así que se
            lee igual si el CSS no llega. */}
        <h1 className="display display-xl claim">
          {hero.claim.map((linea, i) => (
            <span
              key={linea}
              className="claim-line"
              style={{ ["--d" as string]: `${420 + i * 120}ms` } as React.CSSProperties}
            >
              <i>{linea}</i>
            </span>
          ))}
        </h1>

        <div className="cierre">
          <p className="tagline animate-rise" style={{ animationDelay: ".8s" }}>
            {hero.sub}
          </p>

          <div className="animate-rise flex flex-wrap items-center gap-3" style={{ animationDelay: ".9s" }}>
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

        {/* Lo armado. Cada pieza se saca desde acá. */}
        {elegidos.length > 0 && (
          <div className="mt-8">
            <p className="label text-chalk/55">Tu proyecto</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {elegidos.map((s) => (
                <li key={s.id}>
                  <button type="button" className="taken" onClick={() => toggle(s.id)}>
                    {s.label}
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Sacar {s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
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
          <span className="mq-word">{cap}</span>
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
