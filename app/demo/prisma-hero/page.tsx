import type { Metadata } from "next";
import { PrismaHero } from "@/components/ui/prisma-hero";

/* Vista de prueba del componente, tal como viene. No es parte del sitio:
   trae contenido de muestra en inglés, así que no se indexa ni figura en
   el mapa del sitio. */
export const metadata: Metadata = {
  title: "Demo · Prisma hero",
  robots: { index: false, follow: false },
};

export default function DemoOne() {
  return <PrismaHero />;
}
