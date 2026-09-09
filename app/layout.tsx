import type { Metadata, Viewport } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";
import { MarkGradient } from "@/components/brand/Mark";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { BackToTop, Grain, Preloader, ScrollProgress } from "@/components/motion/Chrome";
import { site } from "@/lib/content";

/* next/font descarga y sirve las tipografías desde el propio dominio:
   sin pedido a Google en runtime y sin salto de layout al cargar. */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/* Anton hace de Lateral: un solo peso, ultracondensado y pesado, que
   es lo que permite el interlineado aplastado sin que las líneas se
   toquen. Es el sustituto libre más cercano al display del original. */
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
  themeColor: "#EAE3FB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${anton.variable}`}>
      <body>
        <MarkGradient />
        <Preloader />
        <ScrollProgress />
        <Grain />
        <MotionProvider />

        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:border focus:border-carbon focus:bg-recessed focus:px-4 focus:py-2 focus:text-[13px] focus:text-carbon"
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
