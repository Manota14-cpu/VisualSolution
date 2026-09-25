"use client";

/* ============================================================
   Elementos fijos: preloader, barra de progreso de lectura, grano
   y botón de volver arriba.
   ============================================================ */

import { useEffect, useState } from "react";
import { MARK_PATH, MARK_VIEWBOX, Mark } from "@/components/brand/Mark";
import { onScroll, terminarIntro, useMotionEnv } from "@/lib/motion";
import { lockScroll, scrollToTop } from "@/components/motion/MotionProvider";

/* La intro imprime la marca: las dos tintas entran fuera de registro y
   recién cuando cierran cae la plancha de tiza encima. Es la misma idea
   que sostiene el hero, contada en un segundo. Se saltea con movimiento
   reducido y en visitas posteriores de la misma sesión. */
export function Preloader() {
  const { reduce, ready } = useMotionEnv();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!ready) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("vs-boot") === "1";
    } catch {
      seen = false;
    }
    if (reduce || seen) {
      terminarIntro();
      return;
    }
    try {
      sessionStorage.setItem("vs-boot", "1");
    } catch {
      /* modo privado: se muestra igual */
    }
    setShow(true);
    lockScroll(true);
    /* El hero empieza a imprimirse mientras la intro se desvanece: las
       dos entradas quedan encadenadas, sin un cuadro vacío en el medio. */
    const i = window.setTimeout(terminarIntro, 780);
    const a = window.setTimeout(() => {
      setDone(true);
      lockScroll(false);
    }, 900);
    const b = window.setTimeout(() => setShow(false), 1500);
    return () => {
      window.clearTimeout(i);
      window.clearTimeout(a);
      window.clearTimeout(b);
      lockScroll(false);
      terminarIntro();
    };
  }, [ready, reduce]);

  if (!show) return null;

  return (
    <div id="boot" className={done ? "done" : undefined} aria-hidden="true">
      <svg viewBox={MARK_VIEWBOX}>
        <path className="b-a" d={MARK_PATH} fillRule="nonzero" />
        <path className="b-b" d={MARK_PATH} fillRule="nonzero" />
        <path className="b-k" d={MARK_PATH} fillRule="nonzero" />
      </svg>
    </div>
  );
}

export function ScrollProgress() {
  return (
    <div className="progress-wrap fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <div
        className="progress h-full w-full"
        style={{ background: "var(--color-azul-medio)" }}
      />
    </div>
  );
}

/* El grano no va: Caldera es plano y la textura del sistema es la
   trama de puntos del hero, no un ruido encima de todo. */
export function Grain() {
  return null;
}

export function BackToTop() {
  const [on, setOn] = useState(false);
  const [spin, setSpin] = useState(false);

  useEffect(() => onScroll((v) => setOn(v > window.innerHeight * 0.9)), []);

  return (
    <button
      id="btt"
      type="button"
      aria-label="Volver arriba"
      className={`${on ? "on" : ""} ${spin ? "spin" : ""}`}
      onClick={() => {
        setSpin(true);
        scrollToTop();
        window.setTimeout(() => setSpin(false), 800);
      }}
    >
      <Mark />
    </button>
  );
}
