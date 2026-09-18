"use client";

/* ============================================================
   EL APAREJO DEL METAL
   Un solo par de listeners para todos los botones de metal de la
   página, delegados en el documento. Once botones con su propio
   listener cada uno serían veintidós suscripciones haciendo lo
   mismo; así son dos, y da igual cuántos botones se agreguen
   después o si aparecen y desaparecen con un filtro.

   No monta nada ni dibuja nada: sólo escribe cuatro custom
   properties en el botón que corresponde. Todo lo que se ve está
   en CSS, que es lo que permite que esto no cueste nada.
   ============================================================ */

import { useEffect } from "react";

export function MetalRig() {
  useEffect(() => {
    /* Sin puntero fino —un teléfono— no hay reflejo que seguir: el
       dedo tapa justo lo que iluminaría. La onda del golpe sí queda,
       que es la que da la respuesta al toque. */
    const fino = window.matchMedia("(pointer: fine)").matches;

    const mover = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.(".btn-metal") as HTMLElement | null;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      btn.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    };

    const golpear = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest?.(".btn-metal") as HTMLElement | null;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--px", `${(e.clientX - r.left).toFixed(0)}px`);
      btn.style.setProperty("--py", `${(e.clientY - r.top).toFixed(0)}px`);
      /* Se saca y se vuelve a poner en el cuadro siguiente: sin eso,
         dos clics seguidos no reinician la animación porque la clase
         nunca llegó a ausentarse. */
      btn.classList.remove("is-golpe");
      requestAnimationFrame(() => btn.classList.add("is-golpe"));
    };

    if (fino) document.addEventListener("pointermove", mover, { passive: true });
    document.addEventListener("pointerdown", golpear, { passive: true });
    return () => {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerdown", golpear);
    };
  }, []);

  return null;
}

/* El interior de un botón de metal: las dos piezas que el CSS
   necesita y que no se pueden hacer con pseudo-elementos porque
   ::before y ::after ya están tomados por el canto y el reflejo. */
export function MetalFaz() {
  return (
    <>
      <span className="canto" aria-hidden="true" />
      <span className="onda" aria-hidden="true" />
    </>
  );
}
