/* ============================================================
   El símbolo VS. Es el mismo path que public/logo.svg, en un
   viewBox de 143.5 x 76.
   Si alguna vez rediseñás el logo hay que actualizar tres lugares:
   este archivo, public/logo.svg y public/favicon.svg.
   ============================================================ */

export const MARK_PATH =
  "M 0.0,0.0 L 34.48,58.27 L 47.35,40.55 L 23.31,0.0 Z " +
  "M 143.5,5.34 L 76.24,7.16 L 35.57,61.19 L 45.16,76.0 L 85.71,22.1 L 128.45,21.73 Z " +
  "M 133.18,43.34 L 123.47,32.29 L 86.81,32.05 L 76.0,46.13 L 114.24,47.35 L 104.29,58.4 " +
  "L 67.14,58.76 L 53.78,75.15 L 112.3,73.94 L 131.24,52.45 Z";

export const MARK_VIEWBOX = "0 0 143.5 76";

export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true">
      <path fill="currentColor" fillRule="nonzero" d={MARK_PATH} />
    </svg>
  );
}
