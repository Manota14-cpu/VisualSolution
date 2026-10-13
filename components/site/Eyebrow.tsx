/* ============================================================
   EL RÓTULO DE SECCIÓN
   Número, un trazo que se dibuja al entrar y el nombre de la
   sección. Es lo que convierte seis bloques sueltos en un índice:
   quien baja sabe en qué parte está y cuántas hay, como en una
   publicación. Los nombres son los mismos de la nav, así la barra
   y la página dicen lo mismo.
   Va adentro de un Reveal: el trazo arranca cuando el bloque entra.
   ============================================================ */

export function Eyebrow({ n, children, className = "" }: { n: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="eyebrow-n">{n}</span>
      <span className="eyebrow-l" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
