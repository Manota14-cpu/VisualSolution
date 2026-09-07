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

  /* ---- 2.2 fondo vivo ----
     Campo de puntos con parallax de profundidad: cada punto se
     desplaza según su capa, no 1:1 con el scroll. */
  useEffect(() => {
    if (!ready || reduce || lite) return;
    const cv = document.getElementById("bg-field") as HTMLCanvasElement | null;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type Pt = { x: number; y: number; z: number; r: number; vx: number; vy: number; pink: boolean };
    let pts: Pt[] = [];
    let W = 0;
    let H = 0;
    let scrollY = 0;

    const size = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      const n = Math.min(70, Math.round((W * H) / 26000));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * 1.4,
        z: 0.25 + Math.random() * 0.75,
        r: 0.6 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.04 - Math.random() * 0.09,
        pink: Math.random() > 0.5,
      }));
    };

    size();
    seed();
    const onResize = () => {
      size();
      seed();
    };
    window.addEventListener("resize", onResize);
    const show = window.setTimeout(() => cv.classList.add("on"), 400);

    const offScroll = onScroll((v) => {
      scrollY = v;
    });

    const offTask = addTask(() => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -20) {
          p.y = H + 20;
          p.x = Math.random() * W;
        }
        if (p.x < -20) p.x = W + 20;
        else if (p.x > W + 20) p.x = -20;

        const oy = (scrollY * p.z * 0.06) % (H + 40);
        let yy = p.y - oy;
        if (yy < -20) yy += H + 40;

        ctx.beginPath();
        ctx.arc(p.x, yy, p.r * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.pink
          ? `rgba(236,72,153,${(0.05 + p.z * 0.09).toFixed(3)})`
          : `rgba(139,92,246,${(0.05 + p.z * 0.1).toFixed(3)})`;
        ctx.fill();
      }
    });

    return () => {
      window.clearTimeout(show);
      window.removeEventListener("resize", onResize);
      offScroll();
      offTask();
      cv.classList.remove("on");
    };
  }, [ready, reduce, lite]);

  /* ---- 2.3 cursor propio ----
     Punto sólido más anillo que lo persigue con retraso. Sobre campos
     de texto vuelve el cursor del sistema. */
  useEffect(() => {
    if (!ready || !fine || reduce) return;
    const dot = document.getElementById("cur-dot");
    const ring = document.getElementById("cur-ring");
    if (!dot || !ring) return;
    const root = document.documentElement;
    root.classList.add("cursor-on");

    let rx = pointer.x;
    let ry = pointer.y;
    const offTask = addTask(() => {
      rx = lerp(rx, pointer.x, 0.16);
      ry = lerp(ry, pointer.y, 0.16);
      dot.style.transform = `translate3d(${pointer.x}px,${pointer.y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    });

    const HIT = "a, button, .card, [role='button'], summary, .pill, .mq-word";
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!t?.closest) return;
      root.classList.toggle("on-hit", !!t.closest(HIT));
      root.classList.toggle("on-field", !!t.closest("input, textarea"));
    };
    const onLeave = () => root.classList.remove("on-hit", "on-field");
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      offTask();
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      root.classList.remove("cursor-on", "on-hit", "on-field");
    };
  }, [ready, fine, reduce]);

  /* ---- 2.4 botones magnéticos ----
     Se estiran hacia el cursor dentro de un radio corto y vuelven con
     amortiguación al salir. */
  useEffect(() => {
    if (!ready || !fine || reduce) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".mag"));
    if (!items.length) return;
    const RADIUS = 90;
    const PULL = 0.32;
    const state = items.map(() => ({ x: 0, y: 0, tx: 0, ty: 0 }));

    const offTask = addTask(() => {
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const s = state[i];
        const r = el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > window.innerHeight + 100) {
          s.tx = 0;
          s.ty = 0;
        } else {
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const d = Math.hypot(dx, dy);
          const reach = RADIUS + Math.max(r.width, r.height) / 2;
          if (pointer.seen && d < reach) {
            const f = (1 - d / reach) * PULL;
            s.tx = dx * f;
            s.ty = dy * f;
          } else {
            s.tx = 0;
            s.ty = 0;
          }
        }
        s.x = lerp(s.x, s.tx, 0.14);
        s.y = lerp(s.y, s.ty, 0.14);
        if (Math.abs(s.x) < 0.01 && Math.abs(s.y) < 0.01) {
          s.x = 0;
          s.y = 0;
        }
        el.style.setProperty("--mgx", `${s.x.toFixed(2)}px`);
        el.style.setProperty("--mgy", `${s.y.toFixed(2)}px`);
      }
    });

    return () => {
      offTask();
      items.forEach((el) => {
        el.style.removeProperty("--mgx");
        el.style.removeProperty("--mgy");
      });
    };
  }, [ready, fine, reduce]);

  return (
    <>
      <canvas id="bg-field" aria-hidden="true" />
      <div id="cur-ring" aria-hidden="true" />
      <div id="cur-dot" aria-hidden="true" />
    </>
  );
}
