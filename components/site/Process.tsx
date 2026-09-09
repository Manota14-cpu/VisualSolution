"use client";

import { useEffect, useRef } from "react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { clamp01, onScroll, useMotionEnv } from "@/lib/motion";
import { steps } from "@/lib/content";

export function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLElement>(null);
  const { reduce } = useMotionEnv();

  /* La línea se dibuja según el avance del scroll dentro de la sección,
     leyendo el valor compartido en vez de abrir su propio listener. */
  useEffect(() => {
    const el = wrap.current;
    const bar = rail.current;
    if (!el || !bar) return;
    if (reduce) {
      bar.style.setProperty("--p", "1");
      return;
    }
    return onScroll(() => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01((vh * 0.75 - r.top) / (r.height + vh * 0.3));
      bar.style.setProperty("--p", p.toFixed(3));
    });
  }, [reduce]);

  /* El paso activo se enciende cuando cruza el centro de la pantalla. */
  useEffect(() => {
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const token = entry.target.querySelector(".step-token");
          token?.classList.toggle("on", entry.isIntersecting);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    el.querySelectorAll("[data-step]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <section className="border-y border-carbon bg-concrete py-20 md:py-28" id="proceso">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal className="self-start lg:sticky lg:top-28">
          <SplitHeading
            text="Cómo trabajamos"
            className="display display-md"
          />
          <p className="mt-4 max-w-[34ch] text-base leading-relaxed text-ash">
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
              data-step=""
              className={`flex gap-4 ${
                i === 0 ? "pb-6" : i === steps.length - 1 ? "border-t border-carbon pt-6" : "border-t border-carbon py-6"
              }`}
            >
              <span className="token step-token">{step.n}</span>
              <div>
                <h3 className="text-lg font-bold leading-snug text-carbon">{step.title}</h3>
                <p className="mt-2 max-w-[52ch] text-base leading-relaxed text-ash">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
