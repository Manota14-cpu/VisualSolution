"use client";

import { useEffect, useRef } from "react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { onScroll, useMotionEnv } from "@/lib/motion";
import { steps } from "@/lib/content";

export function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const { reduce } = useMotionEnv();

  /* El avance es discreto, no continuo. Antes la línea se dibujaba con
     una fracción del scroll y frenaba en cualquier lado —a media altura
     entre dos pasos, o partiendo un número al medio—, y encima se
     encendían dos pasos a la vez. Ahora la línea sólo puede terminar
     sobre un número: se calcula cuál fue el último que cruzó la línea
     de lectura y se pinta hasta ahí. */
  useEffect(() => {
    const el = wrap.current;
    const bar = rail.current;
    if (!el || !bar) return;

    const fichas = Array.from(el.querySelectorAll<HTMLElement>(".step-token"));
    if (fichas.length < 2) return;

    /* El riel se mide contra los números, no contra la caja: va del
       centro del primero al centro del último. Si se toca el relleno
       de un paso, el riel sigue cayendo donde tiene que caer, y la
       fracción p aterriza clavada sobre un número. */
    const riel = bar.parentElement as HTMLElement;
    const medir = () => {
      const base = el.getBoundingClientRect();
      const a = fichas[0].getBoundingClientRect();
      const z = fichas[fichas.length - 1].getBoundingClientRect();
      const centro = (r: DOMRect) => r.top + r.height / 2 - base.top;
      /* el riel va en su propia calle, a la izquierda: dentro de los
         numerales se colaría por los huecos de los dígitos */
      riel.style.left = "7px";
      riel.style.top = `${centro(a)}px`;
      riel.style.bottom = "auto";
      riel.style.height = `${centro(z) - centro(a)}px`;
    };
    medir();
    window.addEventListener("resize", medir);

    const pintar = (alcanzado: number) => {
      const p = alcanzado < 0 ? 0 : alcanzado / (fichas.length - 1);
      bar.style.setProperty("--p", p.toFixed(3));
      fichas.forEach((f, i) => f.classList.toggle("on", i <= alcanzado));
    };

    if (reduce) {
      pintar(fichas.length - 1);
      return () => window.removeEventListener("resize", medir);
    }

    const soltar = onScroll(() => {
      const linea = window.innerHeight * 0.62;
      let alcanzado = -1;
      for (let i = 0; i < fichas.length; i++) {
        const r = fichas[i].getBoundingClientRect();
        if (r.top + r.height / 2 <= linea) alcanzado = i;
      }
      pintar(alcanzado);
    });
    return () => {
      soltar();
      window.removeEventListener("resize", medir);
    };
  }, [reduce]);

  return (
    <section className="bg-onyx py-20 md:py-28" id="proceso">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal className="self-start lg:sticky lg:top-28">
          <SplitHeading text="Cómo trabajamos" className="display display-md" />
          <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-chalk/70">
            Cuatro instancias, fechas cerradas y una sola persona a cargo de la comunicación durante todo el
            proyecto.
          </p>
        </Reveal>

        <div className="steps" ref={wrap}>
          <span className="steps-rail" aria-hidden="true">
            <i ref={rail as React.RefObject<HTMLElement>} />
          </span>

          {steps.map((step, i) => (
            <Reveal
              key={step.n}
              as="article"
              delay={i}
              className={`flex items-start gap-5 pl-7 md:gap-8 ${
                i === 0
                  ? "pb-8"
                  : i === steps.length - 1
                    ? "border-t border-dotted border-chalk/30 pt-8"
                    : "border-t border-dotted border-chalk/30 py-8"
              }`}
            >
              <span className="step-token">{step.n}</span>
              <div className="pt-1">
                <h3 className="text-[clamp(19px,2vw,26px)] font-medium leading-snug text-chalk">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-chalk/70">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
