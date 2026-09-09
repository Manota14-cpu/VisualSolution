import type { Metadata, Viewport } from "next";
import { DM_Sans, Anton } from "next/font/google";
import "./globals.css";
import { MarkGradient } from "@/components/brand/Mark";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { BackToTop, Grain, Preloader, ScrollProgress } from "@/components/motion/Chrome";
import { site } from "@/lib/content";

/* next/font descarga y sirve las tipografías desde el propio dominio:
   sin pedido a Google en runtime y sin salto de layout al cargar. */
/* DM Sans va solo en 500. El sistema no admite ni 400 ni 700: en 400
   se ve anémica al lado del display ultrabold y en 700 le compite. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-dm-sans",
  display: "swap",
});

/* Anton reemplaza a PP Neue Corp Compact, que es una tipografía de
   pago. DESIGN.md la nombra como sustituto válido junto a Bebas Neue y
   Druk Wide Bold: un solo peso, ultracondensado y pesado, que es lo que
   sostiene el display a 189px. */
const anton = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.shortDescription,
    type: "website",
    locale: "es_AR",
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${anton.variable}`}>
      <body>
        <MarkGradient />
        <Preloader />
        <ScrollProgress />
        <Grain />
        <MotionProvider />

        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pills focus:bg-magenta focus:px-5 focus:py-3 focus:text-obsidian"
          href="#main"
        >
          Ir al contenido
        </a>

        {children}

        <BackToTop />
      </body>
    </html>
  );
}
