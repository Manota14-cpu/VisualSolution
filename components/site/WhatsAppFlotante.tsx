"use client";

import { useEffect, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { onScroll } from "@/lib/motion";
import { whatsappUrl } from "@/lib/content";

/* ============================================================
   WHATSAPP, A MANO
   Un chat con el estudio desde cualquier punto de la página, con
   el saludo ya escrito. Aparece recién al dejar atrás el hero —ahí
   ya están los botones de la consulta y taparlos sería competirles—
   y queda debajo del de volver arriba.

   Va en la tinta del sitio y no en el verde de WhatsApp: el glifo
   alcanza para reconocerlo, y un verde saturado sería el único
   color ajeno de toda la página.
   ============================================================ */

export function WhatsAppFlotante() {
  const [on, setOn] = useState(false);

  useEffect(() => onScroll((v) => setOn(v > window.innerHeight * 0.9)), []);

  return (
    <a
      className={`wsp-flotante ${on ? "on" : ""}`}
      href={whatsappUrl("Hola Visual Solution, quiero hacer una consulta.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribinos por WhatsApp (se abre en una pestaña nueva)"
      tabIndex={on ? 0 : -1}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d={siWhatsapp.path} />
      </svg>
      <span className="wsp-texto">Escribinos</span>
    </a>
  );
}
