/* ============================================================
   EL RÓTULO DE SECCIÓN
   Número, un trazo que se dibuja al entrar y el nombre de la
   sección. Es lo que convierte seis bloques sueltos en un índice:
   quien baja sabe en qué parte está y cuántas hay, como en una
   publicación. Los nombres son los mismos de la nav, así la barra
   y la página dicen lo mismo.
   Va adentro de un Reveal: el trazo arranca cuando el bloque entra, y
   un número gira como un cuentakilómetros desde 0 hasta el suyo. El
   número real va en texto para los lectores de pantalla; las columnas
   de cifras son decorado.
   ============================================================ */

const CIFRAS = "0123456789".split("");

export function Eyebrow({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  const cifras = /^\d+$/.test(n) ? n.split("") : null;
  return (
    <p className={`eyebrow ${className}`}>
      {cifras ? (
        <span className="eyebrow-n">
          <span className="sr-only">{n}</span>
          {cifras.map((c, i) => (
            <span
              key={i}
              className="cifra"
              aria-hidden="true"
              style={{ ["--d" as string]: c, ["--k" as string]: i } as React.CSSProperties}
            >
              <span>
                {CIFRAS.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ))}
        </span>
      ) : (
        <span className="eyebrow-n">{n}</span>
      )}
      <span className="eyebrow-l" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
