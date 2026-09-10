import { ImageResponse } from "next/og";
import { OG, fuentes, tarjeta } from "@/lib/og";
import { hero, site } from "@/lib/content";

export const alt = `${site.name} — ${site.shortDescription}`;
export const size = OG;
export const contentType = "image/png";

export default async function Image() {
  const caras = await fuentes();
  return new ImageResponse(
    tarjeta({ titulo: [...hero.claim], pie: site.shortDescription, caras }) as never,
    { ...OG, fonts: caras.length ? caras : undefined }
  );
}
