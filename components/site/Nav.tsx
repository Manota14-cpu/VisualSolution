"use client";

import { useEffect, useRef, useState } from "react";
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
  const { reduce } = useMotionEnv();

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
        className={`nav-shell fixed inset-x-0 top-4 z-40 mx-auto flex w-[calc(100%-2rem)] max-w-[1200px] items-center justify-between gap-6 rounded-btn border border-carbon bg-card py-2 pl-4 pr-2 ${
          stuck ? "is-stuck" : ""
        }`}
      >
        <a className="inline-flex items-center gap-2" href="#top" aria-label="Visual Solution, inicio">
          <Mark className={`block h-auto w-[26px] ${pop ? "nav-pop" : ""}`} />
          <span className="whitespace-nowrap text-[13px] font-bold text-carbon">
            Visual <span className="text-smoke">Solution</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {nav.map((item) => (
            <a
              key={item.href}
              className="nav-link"
              href={item.href}
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
            className="grid size-9 place-items-center rounded-btn border border-carbon lg:hidden"
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
        className={`fixed inset-0 z-40 flex-col bg-canvas px-4 pb-10 pt-24  ${
          open ? "flex" : "hidden"
        }`}
      >
        {nav.map((item) => (
          <a
            key={item.href}
            className="display border-b border-carbon py-4 text-[clamp(34px,12vw,60px)] text-carbon"
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
