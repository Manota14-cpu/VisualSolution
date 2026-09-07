"use client";

/* ============================================================
   BASE COMPARTIDA DE MOVIMIENTO
   Un solo detector de preferencias, un solo valor de scroll y un
   solo bucle de rAF para todo lo continuo (cursor, magnetismo,
   partículas). Todo efecto nuevo se cuelga de acá en vez de abrir
   su propio listener.
   ============================================================ */

import { useEffect, useState } from "react";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export type MotionEnv = { reduce: boolean; fine: boolean; lite: boolean; ready: boolean };

/* En el servidor no hay matchMedia: el primer render asume el caso
   conservador (sin efectos) y el efecto corrige tras montar, así no
   hay desajuste de hidratación. */
export function useMotionEnv(): MotionEnv {
  const [env, setEnv] = useState<MotionEnv>({
    reduce: true,
    fine: false,
    lite: true,
    ready: false,
  });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    const lite = reduce || cores <= 4 || window.innerWidth < 768;
    setEnv({ reduce, fine, lite, ready: true });
  }, []);

  return env;
}

/* ---- valor de scroll compartido ----
   Lo publica MotionProvider (desde Lenis o desde un listener pasivo)
   y lo consumen el hero 3D, la línea del proceso y el botón de volver
   arriba. Un solo origen de verdad. */

type ScrollFn = (v: number) => void;
const scrollSubs = new Set<ScrollFn>();
let scrollValue = 0;

export function publishScroll(v: number) {
  scrollValue = v;
  scrollSubs.forEach((fn) => fn(v));
}

export function getScroll() {
  return scrollValue;
}

/** Suscribe una función al scroll. Devuelve la baja. */
export function onScroll(fn: ScrollFn) {
  scrollSubs.add(fn);
  fn(scrollValue);
  return () => {
    scrollSubs.delete(fn);
  };
}

/* ---- bucle maestro de rAF ----
   Se detiene solo cuando no queda ninguna tarea o la pestaña está
   oculta, y arranca de nuevo al volver. */

type Task = () => void;
const tasks = new Set<Task>();
let running = false;

function loop() {
  if (document.hidden || tasks.size === 0) {
    running = false;
    return;
  }
  tasks.forEach((t) => t());
  requestAnimationFrame(loop);
}

function start() {
  if (running || document.hidden) return;
  running = true;
  requestAnimationFrame(loop);
}

/** Agrega una tarea por cuadro. Devuelve la baja. */
export function addTask(fn: Task) {
  tasks.add(fn);
  start();
  return () => {
    tasks.delete(fn);
  };
}

export function wakeLoop() {
  start();
}

/* ---- puntero compartido ---- */
export const pointer = { x: 0, y: 0, seen: false };

/* ---- View Transitions ----
   Si ya hay una corriendo, la nueva se aborta y sus promesas rechazan.
   Se silencian acá, y donde la API no existe el cambio se aplica igual. */
export function withTransition(fn: () => void, reduce = false) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => {
      finished?: Promise<unknown>;
      ready?: Promise<unknown>;
      updateCallbackDone?: Promise<unknown>;
    };
  };
  if (reduce || typeof doc.startViewTransition !== "function") {
    fn();
    return;
  }
  try {
    const t = doc.startViewTransition(fn);
    t?.finished?.catch(() => {});
    t?.ready?.catch(() => {});
    t?.updateCallbackDone?.catch(() => {});
  } catch {
    fn();
  }
}
