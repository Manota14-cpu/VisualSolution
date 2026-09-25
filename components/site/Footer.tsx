import { siWhatsapp } from "simple-icons";
import { Mark } from "@/components/brand/Mark";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { hero, legal, nav, paginasLegales, site, siteHost, siteUrl, whatsappUrl } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";
import { Flecha } from "@/components/ui/Flecha";
import { EnlaceConsumidor } from "@/components/site/Legal";

export function Closer() {
  return (
    /* La página abre con una plancha y cierra con otra: el último
       bloque antes del pie es el mismo material que el hero, para que
       el remate no sea un párrafo más sobre negro. */
    /* El monograma vuelve, enorme y en filete, detrás de la frase: la
       página abre con la marca en el cielo y cierra con la marca en la
       tinta. La luz del cursor recorre la trama (data-luz). */
    <section className="cierre inundado mx-2 mt-2 overflow-hidden rounded-2xl py-28 text-center md:mx-3 md:rounded-[2rem] md:py-40" data-luz>
      <Mark className="cierre-marca" />
      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <SplitHeading
          text="Tu marca merece verse tan bien como funciona."
          accent="tan bien como funciona."
          className="mx-auto max-w-[16ch] display display-lg"
        />
        <Reveal as="p" delay={1} className="mx-auto mt-7 max-w-[52ch] text-[17px] leading-relaxed text-papel/85 md:text-lg">
          Contanos la idea. La primera propuesta no se cobra.
        </Reveal>
        <Reveal delay={2} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a className="btn btn-metal" href="#contacto">
            <MetalFaz />
            <i className="diamond" aria-hidden="true" />
            {hero.primaryCta}
          </a>
          <a
            className="btn btn-metal es-suave"
            href={whatsappUrl("Hola Visual Solution, quiero hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MetalFaz />
            <svg className="size-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d={siWhatsapp.path} />
            </svg>
            Escribinos por WhatsApp
            <Flecha externa />
            <span className="sr-only"> (se abre en una pestaña nueva)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

const columns = [
  { title: "Estudio", links: nav.slice(0, 4) },
  {
    title: "Contacto",
    links: [
      { href: "#contacto", label: hero.primaryCta },
      { href: whatsappUrl(), label: `WhatsApp ${site.whatsappVisible}` },
      { href: `mailto:${site.email}`, label: site.email },
    ],
  },
  {
    title: "Redes",
    links: [
      { href: site.instagram.url, label: "Instagram" },
      { href: site.tiktok, label: "TikTok" },
      { href: site.youtube, label: "YouTube" },
    ],
  },
  { title: "Legal", links: [...paginasLegales] },
];

export function Footer() {
  return (
    <footer className="pie relative mx-2 mb-2 mt-2 overflow-hidden rounded-2xl bg-azul pt-14 text-papel md:mx-3 md:mb-3 md:rounded-[2rem]">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="grid max-w-[34ch] content-start gap-4">
            <a className="inline-flex items-center gap-2" href="#top" aria-label="Visual Solution, inicio">
              <Mark className="block h-auto w-[26px]" />
              <span className="text-sm font-medium text-papel">
                Visual <span className="text-papel/75">Solution</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed text-papel/85">
              Desarrollo web y producción de contenido para marcas que quieren vender mejor.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            {columns.map((col) => (
              <div key={col.title} className="grid content-start gap-2">
                <h4 className="label mb-2 block text-papel/75">{col.title}</h4>
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <a
                      key={l.href}
                      className="foot-link text-sm text-papel/85 transition-colors duration-200 hover:text-papel"
                      href={l.href}
                      {...(external ? { target: "_blank", rel: "noopener" } : {})}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Disposición 890/2025: el enlace a la Ventanilla Federal Única de
            Reclamos, con la leyenda textual que pide la norma. Va a la vista,
            no escondido entre los enlaces. */}
        <p className="mt-10 border-t border-dotted border-papel/30 pt-6 text-center text-sm">
          <EnlaceConsumidor className="foot-link text-papel/85 transition-colors duration-200 hover:text-papel" />
        </p>

        {/* El aviso legal. Va en un <small> porque eso es exactamente lo
            que el elemento significa: letra chica de derechos y
            atribución, no un párrafo más. */}
        {/* En el teléfono cada dato va en su renglón: los separadores
            quedaban colgando al principio de la línea siguiente. */}
        <small className="mt-5 flex flex-col items-center justify-center gap-2 text-center label leading-relaxed text-papel/75 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1">
          <span>
            © {legal.year} {legal.holder}. {legal.rights}.
          </span>
          <span className="hidden text-papel/40 sm:inline" aria-hidden="true">
            |
          </span>
          <span>{legal.credit}</span>
          <span className="hidden text-papel/40 sm:inline" aria-hidden="true">
            |
          </span>
          <a className="foot-link transition-colors duration-200 hover:text-papel" href={siteUrl}>
            {siteHost}
          </a>
        </small>
      </div>

      {/* La firma: el nombre a todo el ancho, impreso con la trama y
          recortado por el borde inferior, como un sello que no entra
          entero en la hoja. Es decorado: el nombre ya está arriba. */}
      <p className="pie-firma" aria-hidden="true">
        Visual Solution
      </p>
    </footer>
  );
}
