"use client";

import { useState } from "react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { faqs } from "@/lib/content";

export function Faq() {
  // una sola respuesta abierta a la vez
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-onyx py-20 md:py-28" id="preguntas">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal className="self-start">
          <SplitHeading
            text="Lo que siempre nos preguntan"
            className="display display-md"
          />
        </Reveal>

        <Reveal>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`faq-row border-t border-dotted border-chalk/25 ${
                  i === faqs.length - 1 ? "border-b" : ""
                } ${isOpen ? "is-open" : ""}`}
              >
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-5 px-3 py-6 text-left text-[clamp(18px,1.9vw,24px)] font-medium leading-snug text-chalk"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="q">{item.q}</span>
                    <span
                      className="chev grid size-9 shrink-0 place-items-center rounded-pills border border-chalk/20 text-chalk/70"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div className="answer" id={`faq-${i}`} inert={!isOpen}>
                  <div>
                    <p className="max-w-[58ch] px-3 pb-7 text-[17px] leading-relaxed text-chalk/70">{item.a}</p>
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
