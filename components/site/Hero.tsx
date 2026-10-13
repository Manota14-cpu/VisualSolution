"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { MotionConfig, motion } from "framer-motion";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { MetalFaz } from "@/components/brand/MetalRig";
import { Flecha } from "@/components/ui/Flecha";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand/Mark";
import { askForServices } from "@/lib/consult";
import { scrollToId } from "@/components/motion/MotionProvider";
import { addTask, getScroll, onScroll, useIntroLista, useMotionEnv } from "@/lib/motion";
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

/* El video. Es un loop de 7 s sin corte: el final se funde con el
   principio en los últimos 3 s, así que el salto de vuelta mide menos
   que el movimiento entre dos cuadros seguidos. El póster es el primer
   cuadro del loop: cuando el video arranca no cambia nada en pantalla. */
const POSTER = "/video/manotacielo-poster.jpg";
/* Lo que no es un teléfono en vertical recibe el cuadro completo. */
const HORIZONTAL = "(min-width: 768px), (orientation: landscape)";

/* La entrada de cada bloque de la derecha, escalonada después del
   título. Espera a que la intro se vaya. */
const sube = (delay: number, activo: boolean) => ({
  initial: { y: 24, opacity: 0 },
  animate: activo ? { y: 0, opacity: 1 } : {},
  transition: { duration: 1, delay, ease: EASE },
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
  const seccion = useRef<HTMLElement>(null);
  const { reduce, ready, fine, lite } = useMotionEnv();
  const lista = useIntroLista();

  /* PROFUNDIDAD
     El cursor inclina la escena: el video, lejos, se corre al revés; la
     marca, el título y el panel, cerca, lo acompañan a distintas
     distancias. Son dos custom properties (--hx, --hy, de -1 a 1) que el
     CSS reparte entre las capas; acá sólo se suavizan hacia el puntero.
     Sólo con puntero fino, sin movimiento reducido y en equipos que
     aguantan, y sólo mientras el hero está en pantalla. */
  useEffect(() => {
    const sec = seccion.current;
    if (!sec || !ready || reduce || lite || !fine) return;
    let meta = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    const mover = (e: PointerEvent) => {
      meta = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
    };
    const paso = () => {
      const dx = meta.x - pos.x;
      const dy = meta.y - pos.y;
      if (Math.abs(dx) < 0.0008 && Math.abs(dy) < 0.0008) return;
      pos.x += dx * 0.06;
      pos.y += dy * 0.06;
      sec.style.setProperty("--hx", pos.x.toFixed(4));
      sec.style.setProperty("--hy", pos.y.toFixed(4));
    };
    let quitar: (() => void) | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !quitar) quitar = addTask(paso);
      if (!e.isIntersecting && quitar) {
        quitar();
        quitar = null;
      }
    });
    io.observe(sec);
    window.addEventListener("pointermove", mover, { passive: true });
    return () => {
      io.disconnect();
      quitar?.();
      window.removeEventListener("pointermove", mover);
    };
  }, [ready, reduce, lite, fine]);

  /* El póster es lo primero que se ve: se pide con prioridad alta, antes
     de que el navegador descubra el video. */
  preload(POSTER, { as: "image", fetchPriority: "high" });

  /* Con movimiento reducido el video no corre: queda el primer cuadro,
     que es el póster. El atributo autoPlay sigue en el marcado para que
     arranque antes de hidratar en el caso común; acá sólo se frena.
     Fuera de pantalla se pausa: nadie lo ve y decodificar 1440p en loop
     sólo gasta batería mientras se lee el resto de la página. */
  useEffect(() => {
    const v = video.current;
    if (!v || !ready) return;
    if (reduce) {
      v.pause();
      v.currentTime = 0;
      return;
    }
    const play = () => {
      v.play().catch(() => {});
    };
    if (!("IntersectionObserver" in window)) {
      play();
      return;
    }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : v.pause()), {
      threshold: 0,
    });
    io.observe(v);
    return () => io.disconnect();
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
    <section id="top" ref={seccion} className="hero sobre-video relative w-full p-2 md:p-3">
      {/* Con movimiento reducido framer-motion deja las opacidades y
          saca los desplazamientos. */}
      <MotionConfig reducedMotion="user">
        {/* Ocupa la pantalla, pero crece si el contenido no entra: con el
            bloque anclado abajo en absoluto, en un teléfono chico lo que
            sobraba se cortaba por arriba, justo donde está el nombre. */}
        <div className="hero-marco relative flex min-h-[max(560px,calc(100svh-1rem))] w-full flex-col justify-end overflow-hidden rounded-2xl bg-azul md:min-h-[max(600px,calc(100svh-1.5rem))] md:rounded-[2rem]">
          {/* El video de fondo. Es decorado: no lleva foco ni se anuncia.
              Va dentro de su propia capa: la capa se mueve con el scroll y
              el video con el cursor, cada uno con su propiedad. */}
          <div className="hero-fondo absolute inset-0">
          <video
            ref={video}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            className="hero-video absolute inset-0 h-full w-full object-cover"
            poster={POSTER}
          >
            {/* Cuatro fuentes, en el orden en que conviene tomarlas:
                - AV1 primero: la misma nitidez en mucho menos peso. El codecs
                  del type hace que un navegador sin AV1 la saltee sin
                  descargar nada.
                - H.264 después, para todo lo demás.
                - En un teléfono vertical el video cubre la altura y sólo se ve
                  la franja del centro: esa franja, recortada a 9:16, es lo
                  único que se descarga ahí.
                El completo va primero y con media: un navegador que no entiende
                media en source toma el primero que puede reproducir y ve el
                video entero. */}
            <source src="/video/manotacielo-av1.mp4" type={'video/mp4; codecs="av01.0.12M.10"'} media={HORIZONTAL} />
            <source src="/video/manotacielo.mp4" type={'video/mp4; codecs="avc1.640028"'} media={HORIZONTAL} />
            <source src="/video/manotacielo-vertical-av1.mp4" type={'video/mp4; codecs="av01.0.08M.10"'} />
            <source src="/video/manotacielo-vertical.mp4" type={'video/mp4; codecs="avc1.640028"'} />
          </video>
          </div>

          {/* El grano */}
          <div className="noise-overlay pointer-events-none absolute inset-0 opacity-[0.7] mix-blend-overlay" />

          {/* El monograma en el cielo */}
          <motion.svg
            className="hero-marca"
            viewBox={MARK_VIEWBOX}
            aria-hidden="true"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={lista ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 2, delay: 0.2, ease: EASE }}
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
                <h1 className="hero-titulo font-medium leading-[0.85] tracking-[-0.07em] text-papel text-[21vw] sm:text-[19vw] md:text-[16vw] lg:text-[min(12.5vw,27vh)]">
                  <WordsPullUp text="Visual Solution" wordClassName="hero-palabra" activo={lista} />
                </h1>
              </div>

              {/* El panel: el texto chico no se puede apoyar directo sobre una
                  nube blanca. Oscurece sólo donde hay texto y deja el resto del
                  video limpio. */}
              {/* Dos capas: la de afuera se mueve con el scroll y el cursor, la
                  de adentro hace la entrada. Cada una con su transform. */}
              <div className="hero-capa-panel col-span-12 mb-4 lg:col-span-5 lg:mb-10">
              <motion.div
                className="hero-panel flex flex-col gap-5"
                data-luz
                initial={{ opacity: 0, y: 32, scale: 0.98 }}
                animate={lista ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              >
                <motion.p {...sube(0.55, lista)} className="max-w-[46ch] text-sm leading-snug text-papel/85 md:text-base">
                  <span className="text-papel">{hero.headline}</span> {hero.sub}
                </motion.p>

                <motion.div {...sube(0.68, lista)}>
                  <p className="hint">{hero.pick}</p>
                  <div className="etiquetas mt-3">
                    {heroServices.map((s) => (
                      <Chip key={s.id} service={s} taken={taken.includes(s.id)} onToggle={() => toggle(s.id)} />
                    ))}
                  </div>
                </motion.div>

                {/* En el teléfono los dos botones no entran en una fila: cada uno
                    toma el ancho completo, en vez de quedar dos píldoras de
                    distinto largo apiladas contra la izquierda. */}
                <motion.div {...sube(0.8, lista)} className="flex flex-wrap items-center gap-3">
                  <button className="btn btn-metal max-sm:flex-auto" type="button" onClick={empezar}>
                    <MetalFaz />
                    <i className="diamond" aria-hidden="true" />
                    <span key={ctaLabel} className="cta-label">
                      {ctaLabel}
                    </span>
                  </button>
                  <a className="btn btn-metal es-suave max-sm:flex-auto" href="#trabajos">
                    <MetalFaz />
                    {hero.secondaryCta}
                    <Flecha />
                  </a>
                </motion.div>
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
   bisagra entre el hero y el resto.
   Responde al scroll: cuanto más rápido se baja, más corre la cinta, y
   vuelve sola a su paso. Se toca la velocidad de la animación CSS que ya
   existe (playbackRate conserva la posición: no hay saltos), no se
   reescribe en JavaScript. */
export function Marquee() {
  const cinta = useRef<HTMLDivElement>(null);
  const { reduce, ready } = useMotionEnv();

  useEffect(() => {
    const el = cinta.current;
    if (!el || !ready || reduce) return;
    const anim = el.getAnimations()[0];
    if (!anim) return;
    let ultimo = getScroll();
    let impulso = 0;
    let quitar: (() => void) | null = null;
    const paso = () => {
      impulso *= 0.9;
      if (impulso < 0.02) {
        impulso = 0;
        anim.playbackRate = 1;
        quitar?.();
        quitar = null;
        return;
      }
      anim.playbackRate = 1 + impulso;
    };
    const soltar = onScroll((v) => {
      const d = Math.abs(v - ultimo);
      ultimo = v;
      impulso = Math.min(4, Math.max(impulso, d / 10));
      if (impulso > 0.02 && !quitar) quitar = addTask(paso);
    });
    return () => {
      soltar();
      quitar?.();
    };
  }, [ready, reduce]);

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
    <div className="marquee-band">
      <div className="overflow-hidden">
        <div ref={cinta} className="animate-marquee flex w-max">
          {line(false)}
          {line(true)}
        </div>
      </div>
    </div>
  );
}
