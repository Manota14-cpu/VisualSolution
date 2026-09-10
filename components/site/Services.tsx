"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal, SplitHeading, useReveal } from "@/components/motion/Reveal";
import { services, type Service } from "@/lib/content";

/* ============================================================
   LOS SERVICIOS
   Cinco pliegos a todo el ancho, no cinco tarjetas del mismo
   tamaño en una grilla. Una grilla de tarjetas iguales es la
   estructura que sale sola, y era lo último que quedaba en pie.

   Cerrado, un pliego es una línea de titular en display sobre el
   negro. Abierto, se inunda con la plancha —el mismo degradado y
   la misma trama del hero— y el texto se da vuelta a obsidiana,
   que es el único uso válido de ese negro: encima de un relleno
   brillante.

   Uno solo abierto por vez. La sección entra con el destacado ya
   abierto: una lista de titulares cerrados no dice qué hace el
   estudio, y eso es justamente lo que la sección tiene que decir.
   ============================================================ */

function Pliego({
  service,
  abierto,
  indice,
  onToggle,
}: {
  service: Service;
  abierto: boolean;
  indice: number;
  onToggle: () => void;
}) {
  const ref = useReveal<HTMLDivElement>();
  const id = `servicio-${service.id}`;

  /* .rv y .is-open NO pueden vivir en el mismo elemento. El observador
     agrega "in" a mano; React, al re-renderizar por el cambio de estado,
     reescribe className desde el JSX y se lo lleva puesto. Como el
     observador ya dejó de mirar el elemento, nunca vuelve: el pliego
     queda invisible para siempre después del primer clic. Van separados:
     el de afuera sólo revela y su className nunca cambia. */
  return (
    <div ref={ref} className="rv" style={{ ["--i" as string]: indice } as React.CSSProperties}>
      <div className={`pliego ${abierto ? "is-open" : ""}`}>
        <h3>
          <button
            type="button"
            className="pliego-btn"
            aria-expanded={abierto}
            aria-controls={id}
            onClick={onToggle}
          >
            <span className="pliego-titulo">{service.title}</span>
            <span className="pliego-mas" aria-hidden="true">
              +
            </span>
          </button>
        </h3>

        <div className="pliego-cuerpo" id={id} role="region">
          <div>
            <div className="pliego-dentro">
              <p className="pliego-texto">{service.body}</p>

              <div className="pliego-lado">
                {service.tags && (
                  <ul className="flex flex-wrap gap-2">
                    {service.tags.map((t) => (
                      <li key={t} className="badge">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {service.token && <span className="token">{service.token}</span>}
              </div>

              {service.image && (
                <div className="pliego-foto">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  /* Arranca abierto el destacado; si ninguno lo es, el primero. */
  const inicial = services.find((s) => s.featured)?.id ?? services[0].id;
  const [abierto, setAbierto] = useState<string>(inicial);

  return (
    <section className="bg-onyx py-20 md:py-28" id="servicios">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <Reveal className="mb-10 max-w-[44ch] md:mb-14">
          <SplitHeading
            text="Todo lo que tu marca necesita para verse y funcionar bien."
            className="display display-md"
          />
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-chalk/70">
            Trabajamos las dos mitades del mismo problema: la pieza técnica que sostiene el negocio y el
            contenido que lo hace visible.
          </p>
        </Reveal>

        <div className="pliegos">
          {services.map((s, i) => (
            <Pliego
              key={s.id}
              service={s}
              indice={i}
              abierto={abierto === s.id}
              /* Cerrar el abierto dejaría la sección muda: siempre queda uno. */
              onToggle={() => setAbierto(s.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
