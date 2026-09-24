import { ImageResponse } from "next/og";
import { OG, fondo, fuentes, tarjeta } from "@/lib/og";
import { works, site } from "@/lib/content";

export const alt = `Un trabajo de ${site.name}`;
export const size = OG;
export const contentType = "image/png";

/* Una tarjeta por proyecto, con la captura del propio sitio de fondo:
   compartir un caso muestra ese caso. Se generan las mismas rutas que la
   página. */
export function generateStaticParams() {
  return works.map((w) => ({ slug: w.id }));
}

/* El título se parte en líneas cortas: a tamaño de cartel, una línea
   larga no entra y achicarla desperdicia la tarjeta. */
function enLineas(texto: string) {
  const palabras = texto.split(" ");
  if (palabras.length < 3) return palabras.length === 2 && texto.length < 16 ? [texto] : palabras;
  const mitad = Math.ceil(palabras.length / 2);
  return [palabras.slice(0, mitad).join(" "), palabras.slice(mitad).join(" ")];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = works.find((w) => w.id === slug);
  const [caras, imagen] = await Promise.all([
    fuentes(),
    work?.preview ? fondo(work.preview.replace(/^\//, ""), { desenfoque: 7 }) : Promise.resolve(null),
  ]);

  return new ImageResponse(
    tarjeta({
      titulo: work ? enLineas(work.title) : [site.name],
      pie: work ? `${work.kind} · ${work.year}` : site.shortDescription,
      imagen,
      caras,
      veloFuerte: true,
    }) as never,
    { ...OG, fonts: caras.length ? caras : undefined }
  );
}
