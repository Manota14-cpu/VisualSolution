"use client";

import { useState } from "react";
import { siWhatsapp } from "simple-icons";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { MetalFaz } from "@/components/brand/MetalRig";
import { Flecha } from "@/components/ui/Flecha";
import { faqs, whatsappUrl } from "@/lib/content";

export function Faq() {
  // una sola respuesta abierta a la vez
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="seccion" id="preguntas" aria-labelledby="preguntas-titulo">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-12 px-4 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal className="self-start lg:sticky lg:top-32">
          <Eyebrow n="04">Preguntas</Eyebrow>
          <SplitHeading
            id="preguntas-titulo"
            text="Lo que siempre nos preguntan"
            accent="nos preguntan"
            className="display display-md"
          />
          {/* Quien no encuentra su pregunta tiene la respuesta a un toque,
              en el mismo canal que el resto del sitio. */}
          <div className="faq-otra">
            <p>¿Tenés otra pregunta?</p>
            <a
              className="btn btn-metal es-suave btn-sm"
              href={whatsappUrl("Hola Visual Solution, tengo una pregunta.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MetalFaz />
              <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d={siWhatsapp.path} />
              </svg>
              Preguntanos por WhatsApp
              <Flecha externa />
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          </div>
        </Reveal>

        <Reveal>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`faq-row border-t border-dotted border-azul/25 ${
                  i === faqs.length - 1 ? "border-b" : ""
                } ${isOpen ? "is-open" : ""}`}
              >
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-5 px-3 py-6 text-left text-[clamp(18px,1.9vw,24px)] font-medium leading-snug text-azul"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="flex items-baseline gap-4 md:gap-6">
                      <span className="faq-num" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="q">{item.q}</span>
                    </span>
                    <span
                      className="chev grid size-9 shrink-0 place-items-center rounded-pills border border-azul/20 text-azul/85"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div className="answer" id={`faq-${i}`} inert={!isOpen}>
                  <div>
                    <p className="faq-a max-w-[58ch] pb-7 pr-3 text-[17px] leading-relaxed text-azul/85">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
