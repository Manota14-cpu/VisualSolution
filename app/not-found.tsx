import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import { MetalFaz } from "@/components/brand/MetalRig";

/* ============================================================
   LA 404
   Un enlace roto no puede terminar en la página genérica del
   framework: el mismo marco azul del hero y del cierre, el número
   a escala de cartel y dos salidas —al inicio y al catálogo, que
   es lo que más se comparte—.
   ============================================================ */

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-[100svh] flex-col p-2 md:p-3">
      <section className="inundado flex flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl px-6 py-20 text-center md:rounded-[2rem]">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 text-papel" aria-label="Visual Solution, inicio">
          <Mark className="block h-auto w-[30px]" />
          <span className="text-sm font-medium">Visual Solution</span>
        </Link>

        <p className="nf-numero" aria-hidden="true">
          404
        </p>
        <h1 className="display nf-titulo mt-2">Esta página no existe.</h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-[17px] leading-relaxed text-papel/85">
          Puede que el enlace esté roto o que la página se haya movido. Desde acá podés seguir.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link className="btn btn-metal" href="/">
            <MetalFaz />
            <i className="diamond" aria-hidden="true" />
            Volver al inicio
          </Link>
          <Link className="btn btn-metal es-suave" href="/#trabajos">
            <MetalFaz />
            Ver trabajos
          </Link>
        </div>
      </section>
    </main>
  );
}
