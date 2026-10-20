import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { manifiesto } from "@/lib/content";

/* ============================================================
   EL MANIFIESTO
   Una frase grande que se queda quieta mientras se baja y se va
   entintando palabra por palabra: el scroll la escribe. Cada palabra
   tiene su tramo del recorrido (--a a --b, en % de la sección fija) y
   pasa de apenas impresa a tinta plena. Es CSS atado al scroll: no
   suma JavaScript y corre fuera del hilo principal.

   Donde el navegador no sabe atar animaciones al scroll, o con
   movimiento reducido, la frase se lee entera y la sección mide lo
   que mide el texto. El texto completo está en el HTML desde el
   servidor: se lee, se indexa y se copia igual.
   ============================================================ */

export function Manifiesto() {
  const palabras = manifiesto.flatMap((tramo) =>
    tramo.texto.split(/\s+/).map((palabra) => ({ palabra, acento: !!tramo.acento }))
  );
  const total = palabras.length;

  return (
    <section className="manifiesto" aria-label="Lo que hacemos">
      <div className="manifiesto-fijo">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
          <Reveal>
            <Eyebrow n="✦">Lo que hacemos</Eyebrow>
          </Reveal>
          <p className="manifiesto-texto">
            {palabras.map(({ palabra, acento }, i) => {
              /* Las palabras se reparten entre el 4% y el 82% del
                 recorrido; el último tramo queda para leerla entera. */
              const desde = 4 + (i / total) * 78;
              return (
                <span key={i}>
                  <span
                    className={acento ? "palabra acento" : "palabra"}
                    style={{ ["--a" as string]: desde.toFixed(1), ["--b" as string]: (desde + 9).toFixed(1) } as React.CSSProperties}
                  >
                    {palabra}
                  </span>
                  {i < total - 1 ? " " : null}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
