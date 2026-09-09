"use client";

/* ============================================================
   Capa global de movimiento: scroll con inercia, fondo vivo,
   cursor propio y botones magnéticos. Es un componente sin marcado
   propio salvo los tres elementos fijos que necesita.
   ============================================================ */

import { useEffect } from "react";
import {
  addTask,
  lerp,
  pointer,
  publishScroll,
  onScroll,
  useMotionEnv,
  wakeLoop,
} from "@/lib/motion";

let lenisRef: { scrollTo: (t: unknown, o?: unknown) => void; stop: () => void; start: () => void } | null = null;

/** Lo usan el menú móvil y el visor para congelar el fondo. */
export function lockScroll(lock: boolean) {
  document.body.style.overflow = lock ? "hidden" : "";
  if (lock) lenisRef?.stop();
  else lenisRef?.start();
}

export function scrollToTop() {
  if (lenisRef) lenisRef.scrollTo(0, { duration: 1.1 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Viaje suave hacia una sección, respetando el alto del header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -90 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function MotionProvider() {
  const { reduce, fine, lite, ready } = useMotionEnv();

  /* ---- marcas en <html> para los selectores de CSS ---- */
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.classList.toggle("fine", fine);
    root.classList.toggle("lite", lite);
  }, [ready, fine, lite]);

  /* ---- 2.1 scroll con inercia ----
     Lenis mueve el scroll real del documento, así que position:sticky,
     los anclas y la barra de progreso siguen funcionando igual. */
  useEffect(() => {
    if (!ready) return;
    let dispose = () => {};

    if (reduce) {
      const onWin = () => publishScroll(window.scrollY);
      window.addEventListener("scroll", onWin, { passive: true });
      onWin();
      return () => window.removeEventListener("scroll", onWin);
    }

    let cancelled = false;
    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        const lenis = new Lenis({
          duration: 0.9,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          touchMultiplier: 1.6,
        });
        lenisRef = lenis as unknown as typeof lenisRef;
        lenis.on("scroll", (e: { scroll: number }) => publishScroll(e.scroll));

        let raf = 0;
        const tick = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        // los anclas internos pasan por Lenis para que el viaje sea suave
        const onClick = (e: MouseEvent) => {
          const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
          if (!a) return;
          const id = a.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target as HTMLElement, { offset: -90 });
          history.replaceState(null, "", id);
        };
        document.addEventListener("click", onClick);

        dispose = () => {
          cancelAnimationFrame(raf);
          document.removeEventListener("click", onClick);
          lenis.destroy();
          lenisRef = null;
        };
      })
      .catch(() => {
        const onWin = () => publishScroll(window.scrollY);
        window.addEventListener("scroll", onWin, { passive: true });
        dispose = () => window.removeEventListener("scroll", onWin);
      });

    return () => {
      cancelled = true;
      dispose();
    };
  }, [ready, reduce]);

  /* ---- puntero compartido ---- */
  useEffect(() => {
    if (!ready || !fine) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.seen = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready, fine]);

  /* ---- red de seguridad del revelado ----
     .rv arranca en opacity:0 y depende de que alguien lo registre en el
     observador. Si un elemento lleva la clase pero se olvidó el registro,
     queda invisible para siempre. Esta barrida se asegura de que eso no
     pueda pasar: pasados 2,5s, todo lo que siga sin .in se muestra. */
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      document.querySelectorAll(".rv:not(.in)").forEach((el) => el.classList.add("in"));
    }, 2500);
    return () => window.clearTimeout(t);
  }, [ready]);

  /* ---- el bucle maestro vuelve al mostrar la pestaña ---- */
  useEffect(() => {
    const onVis = () => {
      if (!document.hidden) wakeLoop();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  /* Ya no monta nada: el fondo de partículas, el cursor propio y el
     magnetismo pertenecían al mundo oscuro. Acá el movimiento se
     reduce a la marquesina, las entradas y los estados de hover. */
  return null;
}
