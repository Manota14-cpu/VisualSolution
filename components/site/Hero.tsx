"use client";

import { useCallback, useState } from "react";
import { Mark3D, LIGHTS, type LightColor } from "@/components/brand/Mark3D";
import { hero, capabilities } from "@/lib/content";

/* El hero es un set de rodaje. La escenografía CSS toma el color de la
   luz que la persona elige, así el cambio no queda encerrado en el
   canvas: se contagia a toda la sección. */
export function Hero() {
  const [color, setColor] = useState<LightColor>("violeta");
  const [touched, setTouched] = useState(false);
  const onFirstTouch = useCallback(() => setTouched(true), []);
  const rgb = LIGHTS[color].css;

  return (
    <section
      className="relative overflow-hidden pb-16 pt-28 text-center md:pb-24 md:pt-32"
      id="top"
      style={{ ["--luz" as string]: rgb, ["--lx" as string]: "50%", ["--ly" as string]: "34%" }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(52% 44% at var(--lx) var(--ly), rgba(var(--luz), .4), rgba(26,11,51,.18) 56%, transparent 76%)",
          }}
        />
        <span
          className="animate-drift-a absolute left-[-8vw] top-[16%] h-28 w-[74vw] rounded-full opacity-55 blur-[46px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(var(--luz),.8),transparent)" }}
        />
        <span
          className="animate-drift-b absolute right-[-10vw] top-[34%] h-24 w-[62vw] rounded-full opacity-45 blur-[46px]"
          style={{ background: "linear-gradient(90deg,transparent,rgba(139,92,246,.55),transparent)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,transparent 52%,#040506 100%)" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <Mark3D
          className="studio animate-rise relative mx-auto grid aspect-video w-[min(360px,72vw)] place-items-center md:w-[min(520px,78vw)]"
          color={color}
          onFirstTouch={onFirstTouch}
        />

        {/* La mesa de luces. Son controles reales, no decoración: se
            alcanzan con el tabulador y dicen qué hacen. */}
        <div className="animate-rise mb-4 mt-3 flex items-center justify-center gap-3 md:mb-6">
          <div className="flex items-center gap-1.5" role="group" aria-label="Color de la luz">
            {(Object.keys(LIGHTS) as LightColor[]).map((k) => (
              <button
                key={k}
                type="button"
                className={`swatch ${color === k ? "is-on" : ""}`}
                style={{ ["--sw" as string]: LIGHTS[k].css }}
                aria-pressed={color === k}
                onClick={() => setColor(k)}
              >
                <span className="sr-only">Luz {LIGHTS[k].label.toLowerCase()}</span>
              </button>
            ))}
          </div>
          <p className={`hint font-mono text-[11px] tracking-[.6px] ${touched ? "is-done" : ""}`}>
            Mové la luz
          </p>
        </div>

        <h1
          className="animate-rise mx-auto max-w-[22ch] text-balance text-[clamp(34px,5.2vw,56px)] font-normal leading-[1.17] tracking-[.22px] text-white"
          style={{ animationDelay: ".12s" }}
        >
          {hero.headline}
        </h1>

        <p
          className="animate-rise mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-ash"
          style={{ animationDelay: ".22s" }}
        >
          {hero.sub}
        </p>

        <div className="animate-rise mt-8 flex flex-wrap justify-center gap-2" style={{ animationDelay: ".32s" }}>
          <a className="btn btn-solid mag" href="#contacto">
            <i className="diamond" aria-hidden="true" />
            {hero.primaryCta}
          </a>
          <a className="btn btn-ghost mag" href="#trabajos">
            {hero.secondaryCta}
          </a>
        </div>

        <p
          className="animate-rise mt-4 font-mono text-xs tracking-[.17px] text-smoke"
          style={{ animationDelay: ".42s" }}
        >
          {hero.meta.map((item, i) => (
            <span key={item}>
              <span className="px-2">{item}</span>
              {i < hero.meta.length - 1 && <span className="text-slate">|</span>}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* Marquesina de capacidades. El contenido se duplica para el bucle
   infinito; la copia va oculta a lectores de pantalla. */
export function Marquee() {
  const strip = (hidden: boolean) => (
    <div
      className="flex shrink-0 items-center gap-8 pr-8 font-mono text-[13px] text-ash"
      aria-hidden={hidden || undefined}
    >
      {capabilities.map((cap, i) => (
        <span key={cap} className="contents">
          <span className="mq-word">{cap}</span>
          <span className={i % 2 === 0 ? "text-violet" : "text-pink"} aria-hidden="true">
            /
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="border-y border-hairline bg-card py-5">
      <div className="fade-x overflow-hidden">
        <div className="animate-marquee flex w-max">
          {strip(false)}
          {strip(true)}
        </div>
      </div>
    </div>
  );
}
