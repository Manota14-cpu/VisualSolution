"use client";

/* ============================================================
   LA PLANCHA
   El giro del hero es una plancha de impresión: el degradado
   violeta→magenta con la trama de puntos encima, y el monograma
   VS calado en negro a escala arquitectónica.

   Debajo del negro hay dos copias del mismo monograma, una
   magenta y una violeta, corridas en direcciones opuestas. Eso
   es un fuera de registro: el error clásico de la impresión en
   varias tintas, cuando las planchas no se alinean y los colores
   asoman por los bordes. Acá es deliberado, y el puntero lo
   maneja — cuanto más lejos del centro, más se abren las tintas.
   Cada servicio elegido suma una tinta más al registro.

   Es el único lugar del sitio donde la marca aparece a este
   tamaño, y no hay nada que pueda fallar: es un path y dos
   custom properties.
   ============================================================ */

import { useCallback, useEffect, useRef } from "react";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand/Mark";
import { useMotionEnv } from "@/lib/motion";

export function Plate({ className, services = [] }: { className?: string; services?: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  const { reduce, fine } = useMotionEnv();

  /* Todo lo que se mueve son custom properties del contenedor. A treinta
     eventos por segundo, un render de React por cada uno sería absurdo. */
  const escribir = useCallback((k: string, v: string) => {
    box.current?.style.setProperty(k, v);
  }, []);

  /* Cuantas más tintas, más se abre el registro. */
  useEffect(() => {
    escribir("--tintas", String(1 + services.length * 0.18));
  }, [escribir, services.length]);

  /* La deriva de la trama sólo corre en pantalla, y la plancha espera a
     que la luz termine de subir para encender los puntos. */
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const t = window.setTimeout(() => el.classList.add("is-lit"), 900);
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-live");
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-live", e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    /* Sin puntero fino o con movimiento reducido el registro queda
       apenas abierto y quieto: la plancha tiene que leerse sin que
       nadie mueva nada. */
    if (!fine || reduce) {
      escribir("--rx", "2.4px");
      escribir("--ry", "-1.9px");
      return;
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const tope = (v: number) => Math.max(-1, Math.min(1, v));
      escribir("--rx", `${(tope(dx) * 5.5).toFixed(2)}px`);
      escribir("--ry", `${(tope(dy) * 4.4).toFixed(2)}px`);

      const dentro =
        e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      el.classList.toggle("is-near", dentro);
      if (dentro) {
        escribir("--lx", `${(e.clientX - r.left).toFixed(1)}px`);
        escribir("--ly", `${(e.clientY - r.top).toFixed(1)}px`);
      }
    };
    const salir = () => {
      escribir("--rx", "2.4px");
      escribir("--ry", "-1.9px");
      el.classList.remove("is-near");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", salir);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", salir);
    };
  }, [escribir, fine, reduce]);

  return (
    <div ref={box} className={`plancha ${className ?? ""}`}>
      <span className="luz" aria-hidden="true">
        <i />
      </span>

      <svg className="marca" viewBox={MARK_VIEWBOX} aria-hidden="true">
        {/* las dos tintas corridas, y encima el negro que las tapa */}
        <path className="tinta tinta-a" d={MARK_PATH} fillRule="nonzero" />
        <path className="tinta tinta-b" d={MARK_PATH} fillRule="nonzero" />
        <path className="tinta-negra" d={MARK_PATH} fillRule="nonzero" />
      </svg>
    </div>
  );
}
