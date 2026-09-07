import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
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

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
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
  themeColor: "#040506",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${geistMono.variable}`}>
      <body>
        <MarkGradient />
        <Preloader />
        <ScrollProgress />
        <Grain />
        <MotionProvider />

        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-btn focus:border focus:border-hairline focus:bg-recessed focus:px-4 focus:py-2 focus:text-[13px] focus:text-white"
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
