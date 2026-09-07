"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { Reveal, SplitHeading, useReveal } from "@/components/motion/Reveal";
import { lockScroll, scrollToId } from "@/components/motion/MotionProvider";
import { askAbout } from "@/lib/consult";
import { useMotionEnv, withTransition } from "@/lib/motion";
import { workFilters, works, type Work } from "@/lib/content";

/* Inclinación con el origen en el punto del cursor, con el trabajo por
   cuadro limitado a un rAF. */
function useTilt<T extends HTMLElement>(strength = 7) {
  const host = useRef<T>(null);
  const { fine, reduce } = useMotionEnv();

  useEffect(() => {
    const el = host.current;
    if (!el || !fine || reduce) return;
    const plate = el.querySelector<HTMLElement>(".tilt");
    if (!plate) return;
    let queued = false;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width;
      py = (e.clientY - r.top) / r.height;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        plate.style.transformOrigin = `${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%`;
        plate.style.setProperty("--ry", `${((px - 0.5) * strength).toFixed(2)}deg`);
        plate.style.setProperty("--rx", `${((py - 0.5) * -strength * 0.86).toFixed(2)}deg`);
      });
    };
    const onLeave = () => {
      plate.style.transformOrigin = "";
      plate.style.setProperty("--ry", "0deg");
      plate.style.setProperty("--rx", "0deg");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [fine, reduce, strength]);

  return host;
}

function WorkCard({ work, hidden, onOpen }: { work: Work; hidden: boolean; onOpen: (w: Work) => void }) {
  const host = useTilt<HTMLElement>();
  // el <article> lleva .rv: hay que registrarlo aunque el ref sea del tilt
  useReveal<HTMLElement>(host);
  const wipe = useReveal<HTMLDivElement>();

  return (
    <article
      ref={host}
      className={`work group rv ${work.span} ${hidden ? "is-out" : ""}`}
      hidden={hidden}
    >
      <button
        type="button"
        className="work-open block w-full text-left"
        aria-label={`Ampliar ${work.title}`}
        onClick={() => onOpen(work)}
      >
        <div ref={wipe} className={`tilt shot wipe relative rounded-card shadow-keysoft ${work.ratio}`}>
          <Image
            src={work.thumb}
            alt={work.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </button>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-white">{work.title}</h3>
          <p className="mt-1 text-xs text-smoke">{work.kind}</p>
        </div>
        <span className="badge">{work.year}</span>
      </div>
      {work.description && (
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[.8px] text-smoke">Ver detalle</p>
      )}
    </article>
  );
}

function Lightbox({ work, onClose }: { work: Work; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll(true);
    closeBtn.current?.focus();
    return () => lockScroll(false);
  }, []);

  // foco atrapado mientras el visor está abierto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const f = Array.from(box.current?.querySelectorAll<HTMLElement>("button, [href]") ?? []);
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
      ref={box}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button ref={closeBtn} className="lb-close" type="button" aria-label="Cerrar" onClick={onClose}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      <figure>
        <Image
          src={work.full}
          alt={`${work.title}, vista ampliada`}
          width={1600}
          height={1000}
          className="h-auto w-full rounded-[20px]"
        />
        <figcaption className="mt-5">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium text-white" id="lb-title">
                {work.title}
              </h3>
              <p className="mt-1 text-sm text-smoke">{work.kind}</p>
            </div>
            <span className="badge">{work.year}</span>
          </div>

          {/* Solo los proyectos con descripción muestran el detalle y la
              puerta de salida hacia el contacto. */}
          {work.description && (
            <>
              <p className="mt-4 max-w-[62ch] text-base leading-relaxed text-ash">{work.description}</p>
              <button
                className="btn btn-solid mt-5"
                type="button"
                onClick={() => {
                  askAbout(work.title);
                  onClose();
                  window.setTimeout(() => scrollToId("contacto"), 60);
                }}
              >
                <i className="diamond" aria-hidden="true" />
                Consultar por este proyecto
              </button>
            </>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

export function Works() {
  const [filter, setFilter] = useState<string>("todos");
  const [open, setOpen] = useState<Work | null>(null);
  const { reduce } = useMotionEnv();

  const visible = works.filter((w) => filter === "todos" || w.category === filter);

  /* flushSync es necesario: dentro de startViewTransition, un setState
     normal no se aplica a tiempo y la transición captura el DOM viejo,
     con lo que el filtro y el visor quedan una acción atrasados. */
  const pick = useCallback(
    (id: string) => withTransition(() => flushSync(() => setFilter(id)), reduce),
    [reduce]
  );
  const show = useCallback(
    (w: Work) => withTransition(() => flushSync(() => setOpen(w)), reduce),
    [reduce]
  );
  const hide = useCallback(
    () => withTransition(() => flushSync(() => setOpen(null)), reduce),
    [reduce]
  );

  return (
    <section className="border-t border-hairline py-20 md:py-28" id="trabajos">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <p className="eyebrow mb-6 block">Trabajos</p>
            <SplitHeading
              text="Catálogo"
              className="text-[clamp(26px,3.4vw,32px)] font-normal leading-tight tracking-[.2px] text-white"
            />
          </Reveal>
          <Reveal as="a" delay={1} className="link" href="#contacto">
            Pedir el catálogo completo
          </Reveal>
        </div>

        <Reveal className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filtrar trabajos por tipo">
          {workFilters.map((f) => (
            <button
              key={f.id}
              className="pill"
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => pick(f.id)}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-12">
          {works.map((w) => (
            <WorkCard
              key={w.id}
              work={w}
              hidden={filter !== "todos" && w.category !== filter}
              onOpen={show}
            />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-8 font-mono text-xs text-smoke">No hay trabajos de ese tipo todavía.</p>
        )}
      </div>

      {open && <Lightbox work={open} onClose={hide} />}
    </section>
  );
}
