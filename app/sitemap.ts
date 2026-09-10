import type { MetadataRoute } from "next";
import { works, siteUrl } from "@/lib/content";

/* Las cinco páginas de caso son rutas reales y estáticas: sin sitemap,
   un buscador sólo encuentra la portada y depende de rastrear los
   enlaces para llegar al resto. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...works.map((w) => ({
      url: `${siteUrl}/trabajos/${w.id}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
