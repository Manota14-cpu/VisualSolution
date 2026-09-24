import { ImageResponse } from "next/og";
import { OG, fondo, fuentes, tarjeta } from "@/lib/og";
import { hero, site } from "@/lib/content";

export const alt = `${site.name} — ${site.shortDescription}`;
export const size = OG;
export const contentType = "image/png";

/* La tarjeta de la home: el mismo cuadro del video que el hero. */
export default async function Image() {
  const [caras, imagen] = await Promise.all([fuentes(), fondo("video/manotacielo-poster.jpg")]);
  return new ImageResponse(
    tarjeta({ titulo: ["Visual", "Solution"], pie: hero.headline, imagen, caras }) as never,
    { ...OG, fonts: caras.length ? caras : undefined }
  );
}
