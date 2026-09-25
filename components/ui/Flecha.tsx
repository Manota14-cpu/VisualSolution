/* ============================================================
   LA FLECHA
   Dice adónde lleva una acción antes de tocarla: en diagonal sale
   del sitio (se abre en otra pestaña), derecha sigue adentro. Al
   pasar el cursor avanza en su dirección; el CSS está en
   app/experiencia.css (.flecha).
   ============================================================ */

export function Flecha({ externa = false, className = "" }: { externa?: boolean; className?: string }) {
  return (
    <svg
      className={`flecha ${externa ? "es-externa" : ""} ${className}`}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      {externa ? (
        <path d="M4 10 10 4M5 4h5v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
