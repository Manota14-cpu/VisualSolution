"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { MetalFaz } from "@/components/brand/MetalRig";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand/Mark";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { useMotionEnv } from "@/lib/motion";
import { hero, capabilities, heroServices, type HeroService } from "@/lib/content";

/* ============================================================
   EL HERO
   Un video a pantalla completa —alguien trabajando en una terraza
   por encima de las nubes— con el nombre del estudio a escala de
   cartel abajo a la izquierda y todo lo que arma la consulta a la
   derecha. La estructura viene de un hero de 21st.dev; el
   contenido, los colores y la navegación son los de Visual.

   El monograma va en el cielo, grande y translúcido: una marca de
   agua que se mezcla con la luz del video en vez de pegarse encima
   como un sello.

   Las etiquetas de servicio siguen acá: son lo que arma la consulta
   y lo que cambia el texto del botón.
   ============================================================ */

const EASE = [0.16, 1, 0.3, 1] as const;

/* La entrada de cada bloque de la derecha, escalonada después del
   título. */
const sube = (delay: number) => ({
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.8, delay, ease: EASE },
});

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
  const video = useRef<HTMLVideoElement>(null);
  const { reduce, ready } = useMotionEnv();

  /* Con movimiento reducido el video no corre: queda el primer cuadro,
     que es el póster. El atributo autoPlay sigue en el marcado para que
     arranque antes de hidratar en el caso común; acá sólo se frena. */
  useEffect(() => {
    const v = video.current;
    if (!v || !ready) return;
    if (reduce) {
      v.pause();
      v.currentTime = 0;
    } else {
      v.play().catch(() => {});
    }
  }, [reduce, ready]);

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
    <section id="top" className="sobre-video relative w-full p-2 md:p-3">
      {/* Con movimiento reducido framer-motion deja las opacidades y
          saca los desplazamientos. */}
      <MotionConfig reducedMotion="user">
        {/* Ocupa la pantalla, pero crece si el contenido no entra: con el
            bloque anclado abajo en absoluto, en un teléfono chico lo que
            sobraba se cortaba por arriba, justo donde está el nombre. */}
        <div className="relative flex min-h-[max(560px,calc(100svh-1rem))] w-full flex-col justify-end overflow-hidden rounded-2xl bg-azul md:min-h-[max(600px,calc(100svh-1.5rem))] md:rounded-[2rem]">
          {/* El video de fondo. Es decorado: no lleva foco ni se anuncia. */}
          <video
            ref={video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 h-full w-full object-cover"
            src="/video/manotacielo.mp4"
            poster="/video/manotacielo-poster.jpg"
          />

          {/* El grano */}
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

          {/* El monograma en el cielo */}
          <motion.svg
            className="hero-marca"
            viewBox={MARK_VIEWBOX}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease: EASE }}
          >
            <path d={MARK_PATH} fillRule="nonzero" />
          </motion.svg>

          {/* Azul arriba para que la nav se apoye, azul fuerte abajo para
              que el texto blanco se lea aunque pase una nube. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-azul/30 via-transparent to-azul/85" />

          {/* El relleno de arriba le guarda el lugar a la nav fija. */}
          <div className="relative px-4 pb-2 pt-28 sm:px-6 md:px-10">
            <div className="grid grid-cols-12 items-end gap-4 lg:gap-8">
              <div className="col-span-12 lg:col-span-7">
                <h1 className="font-medium leading-[0.85] tracking-[-0.07em] text-papel text-[21vw] sm:text-[19vw] md:text-[16vw] lg:text-[min(12.5vw,27vh)]">
                  <WordsPullUp text="Visual Solution" />
                </h1>
              </div>

              {/* El panel: el texto chico no se puede apoyar directo sobre una
                  nube blanca. Oscurece sólo donde hay texto y deja el resto del
                  video limpio. */}
              <div className="hero-panel col-span-12 mb-4 flex flex-col gap-5 lg:col-span-5 lg:mb-10">
                <motion.p {...sube(0.5)} className="max-w-[46ch] text-sm leading-snug text-papel/85 md:text-base">
                  <span className="text-papel">{hero.headline}</span> {hero.sub}
                </motion.p>

                <motion.div {...sube(0.6)}>
                  <p className="hint">{hero.pick}</p>
                  <div className="etiquetas mt-3">
                    {heroServices.map((s) => (
                      <Chip key={s.id} service={s} taken={taken.includes(s.id)} onToggle={() => toggle(s.id)} />
                    ))}
                  </div>
                </motion.div>

                <motion.div {...sube(0.7)} className="flex flex-wrap items-center gap-3">
                  <button className="btn btn-metal" type="button" onClick={empezar}>
                    <MetalFaz />
                    <i className="diamond" aria-hidden="true" />
                    <span key={ctaLabel} className="cta-label">
                      {ctaLabel}
                    </span>
                  </button>
                  <a className="btn btn-metal es-suave" href="#trabajos">
                    <MetalFaz />
                    {hero.secondaryCta}
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
    </section>
  );
}

/* La marquesina azul a sangre, pegada al borde de la página: es la
   bisagra entre el hero y el resto. */
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
    <div className="marquee-band border-y border-papel/20">
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max">
          {line(false)}
          {line(true)}
        </div>
      </div>
    </div>
  );
}
