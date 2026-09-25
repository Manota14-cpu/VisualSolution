"use client";

/* ============================================================
   EL APAREJO DEL PUNTERO
   Un solo par de listeners para todo lo que reacciona al cursor,
   delegados en el documento: once botones con su propio listener
   serían veintidós suscripciones haciendo lo mismo; así son dos, y
   da igual cuántas piezas se agreguen después o si aparecen y
   desaparecen con un filtro.

   Tres cosas, y ninguna dibuja nada: sólo escriben custom
   properties. Todo lo que se ve está en CSS.
   - El reflejo del metal (--mx, --my en .btn-metal).
   - El imán: el botón se corre unos píxeles hacia el cursor
     (--tx, --ty). Dice "esto se toca" antes del clic.
   - La luz: cualquier pieza con data-luz recibe la posición del
     cursor (--lx, --ly) para iluminarse desde ahí.

   Las lecturas del puntero se juntan en un cuadro de animación:
   por más eventos que lleguen, se mide y se escribe una vez por
   cuadro.
   ============================================================ */

import { useEffect } from "react";

const IMAN_X = 6;
const IMAN_Y = 4;

export function MetalRig() {
  useEffect(() => {
    /* Sin puntero fino —un teléfono— no hay reflejo, imán ni luz que
       seguir: el dedo tapa justo lo que iluminaría. La onda del golpe
       sí queda, que es la que da la respuesta al toque. */
    const fino = window.matchMedia("(pointer: fine)").matches;
    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ultimo: PointerEvent | null = null;
    let cuadro = 0;
    let iman: HTMLElement | null = null;

    const soltar = (b: HTMLElement) => {
      b.style.setProperty("--tx", "0px");
      b.style.setProperty("--ty", "0px");
    };

    const aplicar = () => {
      cuadro = 0;
      const e = ultimo;
      if (!e) return;
      const t = e.target as Element | null;

      const btn = t?.closest?.(".btn-metal") as HTMLElement | null;
      if (btn) {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        btn.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
        if (!quieto) {
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const x = Math.max(-IMAN_X, Math.min(IMAN_X, dx * 0.12));
          const y = Math.max(-IMAN_Y, Math.min(IMAN_Y, dy * 0.25));
          btn.style.setProperty("--tx", `${x.toFixed(1)}px`);
          btn.style.setProperty("--ty", `${y.toFixed(1)}px`);
        }
      }
      if (iman && iman !== btn) soltar(iman);
      iman = btn;

      const luz = t?.closest?.("[data-luz]") as HTMLElement | null;
      if (luz) {
        const r = luz.getBoundingClientRect();
        luz.style.setProperty("--lx", `${(e.clientX - r.left).toFixed(0)}px`);
        luz.style.setProperty("--ly", `${(e.clientY - r.top).toFixed(0)}px`);
      }
    };

    const mover = (e: PointerEvent) => {
      ultimo = e;
      if (!cuadro) cuadro = requestAnimationFrame(aplicar);
    };

    /* Al salir del botón vuelve a su lugar, con la misma curva lenta con
       la que se fue: el imán se suelta, no se corta. */
    const salir = (e: PointerEvent) => {
      if (iman && !iman.contains(e.relatedTarget as Node | null)) {
        soltar(iman);
        iman = null;
      }
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

    if (fino) {
      document.addEventListener("pointermove", mover, { passive: true });
      document.addEventListener("pointerout", salir, { passive: true });
    }
    document.addEventListener("pointerdown", golpear, { passive: true });
    return () => {
      cancelAnimationFrame(cuadro);
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerout", salir);
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
