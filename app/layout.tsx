import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { MetalRig } from "@/components/brand/MetalRig";
import { BackToTop, Grain, Preloader, ScrollProgress } from "@/components/motion/Chrome";
import { legal, services, site, siteUrl } from "@/lib/content";

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


export const metadata: Metadata = {
  /* Sin metadataBase, cualquier ruta relativa de las tarjetas de
     compartir queda sin resolver y el enlace se ve vacío. */
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: siteUrl }],
  creator: site.name,
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.shortDescription,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "es_AR",
  },
  /* La imagen la genera app/opengraph-image.tsx: no hace falta
     nombrarla acá, Next la engancha sola. */
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  /* El ícono sale de la pieza del estudio: el VS azul sobre papel
     cuadriculado. Los tamaños chicos van recortados más cerca de la marca
     para que a 32px no sea casi todo fondo; el de 180 es la pieza entera. */
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

/* Datos estructurados. Es lo que le permite a un buscador entender que
   esto es un estudio y no un blog: nombre, qué hace, dónde encontrarlo
   y qué servicios ofrece. Sólo se afirma lo que es verdad — nada de
   dirección, teléfono ni reseñas inventadas. */
const datosDelEstudio = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  description: site.description,
  url: siteUrl,
  email: site.email,
  image: `${siteUrl}/opengraph-image`,
  sameAs: [site.instagram.url, site.tiktok, site.youtube],
  copyrightHolder: { "@type": "Organization", name: legal.holder, url: siteUrl },
  copyrightYear: legal.year,
  areaServed: "AR",
  knowsLanguage: "es",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.body },
    })),
  },
};

export const viewport: Viewport = {
  themeColor: "#EAF0F6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={dmSans.variable}>
      <body>
        <script
          type="application/ld+json"
          /* El JSON se arma en el servidor a partir de lib/content: no hay
             nada de lo que escribe un visitante acá adentro. */
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datosDelEstudio) }}
        />
        <Preloader />
        <ScrollProgress />
        <Grain />
        <MotionProvider />
        <MetalRig />

        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-pills focus:bg-azul focus:px-5 focus:py-3 focus:text-papel"
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
