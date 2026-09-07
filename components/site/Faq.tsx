"use client";

import { useState } from "react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { faqs } from "@/lib/content";

export function Faq() {
  // una sola respuesta abierta a la vez
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28" id="preguntas">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 md:px-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal className="self-start">
          <p className="eyebrow mb-6 block">Preguntas</p>
          <SplitHeading
            text="Lo que siempre nos preguntan"
            className="text-[clamp(26px,3.4vw,32px)] font-normal leading-tight tracking-[.2px] text-white"
          />
        </Reveal>

        <Reveal>
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`faq-row border-t border-hairline ${
                  i === faqs.length - 1 ? "border-b" : ""
                } ${isOpen ? "is-open" : ""}`}
              >
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-4 px-3 py-5 text-left text-base font-medium text-white"
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span
                      className="chev grid size-6 shrink-0 place-items-center rounded-full border border-hairline text-ash"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div className="answer" id={`faq-${i}`}>
                  <div>
                    <p className="max-w-[58ch] px-3 pb-5 text-base leading-relaxed text-ash">{item.a}</p>
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
