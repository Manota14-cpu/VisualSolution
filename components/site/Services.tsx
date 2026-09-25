"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal, SplitHeading, useReveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { services, type Service } from "@/lib/content";

/* ============================================================
   LOS SERVICIOS
   Cinco pliegos a todo el ancho, no cinco tarjetas del mismo
   tamaño en una grilla. Una grilla de tarjetas iguales es la
   estructura que sale sola, y era lo último que quedaba en pie.

   Cerrado, un pliego es una línea de titular en display sobre el
   lienzo. Abierto, se inunda de azul pleno con su trama y el texto
   se da vuelta a papel.

   Uno solo abierto por vez, y el abierto se cierra con el mismo
   toque que lo abrió. La sección entra con el destacado ya abierto
   —una lista de titulares cerrados no dice qué hace el estudio—,
   pero después manda quien la usa: si quiere cerrarlo, se cierra.
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
      <div className={`pliego ${abierto ? "is-open" : ""}`} data-luz>
        <h3>
          <button
            type="button"
            className="pliego-btn"
            aria-expanded={abierto}
            aria-controls={id}
            onClick={onToggle}
          >
            {/* El número ordena la lista como un índice; el título sigue
                siendo lo único que se lee. */}
            <span className="pliego-cab">
              <span className="pliego-n" aria-hidden="true">
                {String(indice + 1).padStart(2, "0")}
              </span>
              <span className="pliego-titulo">{service.title}</span>
            </span>
            <span className="pliego-mas" aria-hidden="true">
              +
            </span>
          </button>
        </h3>

        {/* inert saca el cuerpo cerrado del arbol de accesibilidad y del
            tabulador, sin sacarlo del layout: la apertura se sigue
            pudiendo animar. */}
        <div className="pliego-cuerpo" id={id} role="region" inert={!abierto}>
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
  /* null es "ninguno abierto". */
  const [abierto, setAbierto] = useState<string | null>(inicial);

  return (
    <section className="seccion" id="servicios" aria-labelledby="servicios-titulo">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        {/* Cabecera en dos columnas: la frase a la izquierda, el párrafo
            abajo a la derecha. En una sola columna quedaba medio ancho
            vacío al lado de cada titular. */}
        <Reveal className="cabecera">
          <div>
            <Eyebrow n="01">Servicios</Eyebrow>
            <SplitHeading
              id="servicios-titulo"
              text="Todo lo que tu marca necesita para verse y funcionar bien."
              accent="verse y funcionar bien."
              className="display display-md max-w-[16ch]"
            />
          </div>
          <p className="cabecera-texto">
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
              onToggle={() => setAbierto((a) => (a === s.id ? null : s.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
