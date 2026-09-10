"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mark } from "@/components/brand/Mark";
import { lockScroll } from "@/components/motion/MotionProvider";
import { useMotionEnv } from "@/lib/motion";
import { hero, nav } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [pop, setPop] = useState(false);
  const popped = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const links = useRef<HTMLElement>(null);
  const { reduce } = useMotionEnv();

  /* Los enlaces comparten una sola luz. Se desliza hasta el que tiene
     el cursor, y cuando nadie apunta a nada vuelve sola a la sección en
     la que estás: la barra deja de ser un menú y pasa a decirte dónde
     estás parado. Posición y ancho van como custom properties del
     contenedor — un render por movimiento no tiene sentido. */
  const iluminar = useCallback((el: HTMLElement | null) => {
    const nav = links.current;
    if (!nav) return;
    if (!el) {
      nav.classList.add("is-idle");
      return;
    }
    const base = nav.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    nav.style.setProperty("--nx", `${r.left - base.left}px`);
    nav.style.setProperty("--nw", `${r.width}px`);
    nav.classList.add("on");
    nav.classList.remove("is-idle");
  }, []);

  /* La sección activa. Se mira una franja angosta en el medio de la
     pantalla: así sólo hay una activa por vez, sin importar cuánto mida
     cada sección. */
  const [activa, setActiva] = useState<string | null>(null);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setActiva(`#${e.target.id}`);
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 }
    );
    const vistas = nav
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => !!el);
    vistas.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* Volver a la sección activa es lo mismo que iluminar su enlace: el
     hover simplemente la pisa mientras dura. */
  const alaActiva = useCallback(() => {
    const cont = links.current;
    if (!cont) return;
    if (!activa) {
      iluminar(null);
      return;
    }
    iluminar(cont.querySelector<HTMLElement>(`a[href="${activa}"]`));
  }, [activa, iluminar]);

  useEffect(() => {
    if (!links.current?.matches(":hover")) alaActiva();
  }, [alaActiva]);

  /* Centinela más IntersectionObserver, sin listener de scroll. */
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const isStuck = !entry.isIntersecting;
        setStuck(isStuck);
        if (isStuck && !popped.current && !reduce) {
          popped.current = true;
          setPop(true);
          window.setTimeout(() => setPop(false), 600);
        }
      },
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div
        ref={sentinel}
        style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, pointerEvents: "none" }}
        aria-hidden="true"
      />

      <header
        className={`nav-shell fixed inset-x-0 top-4 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-[1200px] items-center justify-between gap-6 rounded-pills border border-chalk/20 bg-carbon py-2 pl-4 pr-2 ${
          stuck ? "is-stuck" : ""
        }`}
      >
        <a className="inline-flex items-center gap-2" href="#top" aria-label="Visual Solution, inicio">
          <Mark className={`block h-auto w-[26px] text-magenta ${pop ? "nav-pop" : ""}`} />
          <span className="whitespace-nowrap text-sm font-medium text-chalk">
            Visual <span className="text-chalk/55">Solution</span>
          </span>
        </a>

        <nav
          ref={links as React.RefObject<HTMLElement>}
          className="nav-links is-idle hidden items-center gap-1 lg:flex"
          aria-label="Principal"
          onPointerLeave={alaActiva}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) alaActiva();
          }}
        >
          <i className="nav-glow" aria-hidden="true" />
          {nav.map((item) => (
            <a
              key={item.href}
              className="nav-link"
              href={item.href}
              aria-current={activa === item.href ? "true" : undefined}
              onPointerEnter={(e) => iluminar(e.currentTarget)}
              onFocus={(e) => iluminar(e.currentTarget)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a className="btn btn-solid btn-sm hidden lg:inline-flex" href="#contacto">
            <i className="diamond" aria-hidden="true" />
            {hero.primaryCta}
          </a>
          <button
            className="grid size-9 place-items-center rounded-pills border border-chalk/20 lg:hidden"
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true">
              <path
                d="M1 1.5h13"
                stroke="#000000"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  transformOrigin: "center",
                  transform: open ? "translateY(4.5px) rotate(45deg)" : undefined,
                  transition: "transform .3s cubic-bezier(.16,1,.3,1)",
                }}
              />
              <path
                d="M1 6h13"
                stroke="#000000"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{ opacity: open ? 0 : 1, transition: "opacity .2s" }}
              />
              <path
                d="M1 10.5h13"
                stroke="#000000"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  transformOrigin: "center",
                  transform: open ? "translateY(-4.5px) rotate(-45deg)" : undefined,
                  transition: "transform .3s cubic-bezier(.16,1,.3,1)",
                }}
              />
            </svg>
          </button>
        </div>
      </header>

      <div
        id="menu"
        className={`fixed inset-0 z-40 flex-col bg-onyx px-4 pb-10 pt-24  ${
          open ? "flex" : "hidden"
        }`}
      >
        {nav.map((item) => (
          <a
            key={item.href}
            className="display border-b border-chalk/20 py-4 text-[clamp(34px,12vw,60px)] text-chalk"
            href={item.href}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a className="btn btn-solid mt-6 self-start" href="#contacto" onClick={() => setOpen(false)}>
          <i className="diamond" aria-hidden="true" />
          {hero.primaryCta}
        </a>
      </div>
    </>
  );
}
