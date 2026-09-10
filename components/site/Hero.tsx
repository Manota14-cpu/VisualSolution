"use client";

import { useCallback, useState } from "react";
import { Plate } from "@/components/brand/Plate";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { hero, capabilities, heroServices, type HeroService } from "@/lib/content";

/* ============================================================
   EL HERO
   Un afiche, no una tarjeta. La plancha va a sangre, de borde a
   borde de la pantalla, con el monograma calado a escala
   arquitectónica; el reclamo la muerde desde abajo y se apoya
   contra el margen izquierdo con las líneas escalonadas.
   Imagen y tipografía se traban en vez de apilarse: es lo único
   que separa una composición de una plantilla.

   Debajo del reclamo, las etiquetas: son lo que arma la consulta,
   así que viven donde alguien las busca. Si nadie toca nada, el
   afiche se lee igual.
   ============================================================ */

function Chip({
  service,
  taken,
  onToggle,
}: {
  service: HeroService;
  taken: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`chip ${taken ? "is-taken" : ""}`}
      aria-pressed={taken}
      onClick={onToggle}
    >
      <span className="chip-code">{service.code}</span>
      <span className="chip-label">{service.label}</span>
    </button>
  );
}

export function Hero() {
  const [taken, setTaken] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setTaken((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }, []);

  const elegidos = heroServices.filter((s) => taken.includes(s.id));
  const resumen = elegidos.map((s) => s.label).join(" + ");
  /* La etiqueta del botón no puede crecer sin límite: con los cinco
     puestos se desbordaría. Hasta dos van los nombres; de ahí, el
     conteo. */
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
      {/* La plancha, a sangre. */}
      <div className="banda">
        <Plate className="halftone h-full w-full" services={taken} />
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

        {/* Las etiquetas, apenas debajo del titular: son lo que arma la
            consulta y lo que cambia el botón. */}
        <div className="animate-rise mt-8" style={{ animationDelay: ".75s" }}>
          <p className="hint">{hero.pick}</p>
          <div className="etiquetas mt-3">
            {heroServices.map((s) => (
              <Chip
                key={s.id}
                service={s}
                taken={taken.includes(s.id)}
                onToggle={() => toggle(s.id)}
              />
            ))}
          </div>
        </div>

        <div className="cierre">
          <p className="tagline animate-rise" style={{ animationDelay: ".85s" }}>
            {hero.sub}
          </p>

          <div className="animate-rise flex flex-wrap items-center gap-3" style={{ animationDelay: ".95s" }}>
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
