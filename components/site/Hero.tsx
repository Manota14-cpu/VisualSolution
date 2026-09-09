"use client";

import { useCallback, useRef, useState } from "react";
import { Mark3D } from "@/components/brand/Mark3D";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { hero, capabilities, heroServices, type HeroService } from "@/lib/content";

/* ============================================================
   EL HERO
   Un afiche: papel lavanda a sangre, el titular gigante con el
   interlineado aplastado para que las líneas se apilen como
   bloques físicos, y la cinta 3D pasando por detrás.
   Las calcomanías de servicio se arrastran adentro de la cinta y
   arman la consulta. Si nadie toca nada, el afiche se lee igual.
   ============================================================ */

/* Posiciones de collage: nunca alineadas a la grilla. */
const ARC: React.CSSProperties[] = [
  { top: "2%", left: "-1%" },
  { top: "36%", left: "-7%" },
  { top: "74%", left: "3%" },
  { top: "9%", right: "-1%" },
  { top: "55%", right: "-6%" },
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
      style={
        {
          "--sticker": service.sticker,
          "--rot": `${service.rot}deg`,
        } as React.CSSProperties
      }
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
    <section className="relative overflow-hidden bg-canvas pb-16 pt-28 md:pb-24 md:pt-32" id="top">
      <div className="relative mx-auto w-full max-w-[1440px] px-4 md:px-10">
        {/* El bloque escultórico. La cinta pasa por detrás del titular:
            el texto se comporta como objeto, no como párrafo. */}
        <div className="relative mx-auto w-full max-w-[1000px]">
          <div ref={stage} className={`stage relative mx-auto ${over ? "is-over" : ""}`}>
            <Mark3D
              className="animate-rise relative mx-auto grid aspect-video w-[min(340px,72vw)] place-items-center md:w-[min(520px,58vw)]"
              services={taken}
            />
          </div>

          {/* En pantalla ancha las calcomanías flotan en collage. */}
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
          <span className="hidden md:inline">Arrastrá un servicio a la cinta</span>
          <span className="md:hidden">Tocá lo que necesitás</span>
        </p>

        <h1 className="display display-xl animate-rise mt-6 text-center" style={{ animationDelay: ".1s" }}>
          Programamos
          <br />
          tu sitio.
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
            <p className="label text-smoke">Tu proyecto</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2">
              {elegidos.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className="taken"
                    style={{ "--sticker": s.sticker } as React.CSSProperties}
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
          <span aria-hidden="true"> ✦ </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee-band border-y border-carbon">
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max">
          {line(false)}
          {line(true)}
        </div>
      </div>
    </div>
  );
}
