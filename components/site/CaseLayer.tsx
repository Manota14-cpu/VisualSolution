"use client";

/* ============================================================
   LA CAPA
   El caso se abre encima de la grilla, no navegando, para que la
   portada pueda viajar desde la tarjeta con View Transitions.
   Pero sincroniza la URL con history.pushState, así el enlace se
   puede copiar y compartir, y el botón atrás del navegador cierra
   el caso en vez de sacarte del sitio.
   Quien entre directo a /trabajos/[slug] recibe la página real, que
   usa el mismo componente de contenido.
   ============================================================ */

import { useEffect, useRef } from "react";
import { CaseProgress, CaseStudy } from "@/components/site/CaseStudy";
import { lockScroll } from "@/components/motion/MotionProvider";
import type { Work } from "@/lib/content";

export function CaseLayer({
  work,
  morphName,
  onClose,
  onConsult,
}: {
  work: Work;
  morphName?: string;
  onClose: () => void;
  onConsult: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll(true);
    scroller.current?.scrollTo(0, 0);
    closeBtn.current?.focus();
    return () => lockScroll(false);
  }, []);

  /* Foco atrapado y salida por Escape. El caso es una capa modal: si
     el tabulador se escapa a la grilla de atrás, se pierde el hilo. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const box = scroller.current;
      if (!box) return;
      const f = Array.from(
        box.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      ref={scroller}
      className="case-layer"
      role="dialog"
      aria-modal="true"
      aria-label={`Caso: ${work.title}`}
      data-lenis-prevent
    >
      <div className="case-bar">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 px-4 md:px-10">
          <button className="case-back" type="button" onClick={onClose} ref={closeBtn}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Catálogo
          </button>
          <p className="truncate label text-chalk/55">{work.title}</p>
        </div>
        <CaseProgress scroller={scroller} />
      </div>

      <CaseStudy work={work} morphName={morphName} onConsult={onConsult} />
    </div>
  );
}
