import { Nav } from "@/components/site/Nav";
import { Hero, Marquee } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Works } from "@/components/site/Works";
import { Process } from "@/components/site/Process";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Closer, Footer } from "@/components/site/Footer";

/* Server Component: el marcado llega armado desde el servidor y sólo
   las piezas que necesitan interacción se hidratan en el cliente. */
export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Works />
        <Process />
        <Faq />
        <Contact />
        <Closer />
      </main>
      <Footer />
    </>
  );
}
