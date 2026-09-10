import type { Metadata, Viewport } from "next";
import { DM_Sans, Anton } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { BackToTop, Grain, Preloader, ScrollProgress } from "@/components/motion/Chrome";
import { services, site, siteUrl } from "@/lib/content";

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
  /* Sin metadataBase, cualquier ruta relativa de las tarjetas de
     compartir queda sin resolver y el enlace se ve vacío. */
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s — ${site.name}`,
  },
  description: site.description,
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
  icons: { icon: "/favicon.svg" },
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
  sameAs: [site.instagram.url, site.linkedin, site.youtube],
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
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${anton.variable}`}>
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
