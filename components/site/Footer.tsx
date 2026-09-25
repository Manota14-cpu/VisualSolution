import { Mark } from "@/components/brand/Mark";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { hero, legal, nav, site, siteHost, siteUrl, whatsappUrl } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";

export function Closer() {
  return (
    /* La página abre con una plancha y cierra con otra: el último
       bloque antes del pie es el mismo material que el hero, para que
       el remate no sea un párrafo más sobre negro. */
    <section className="inundado mx-2 mt-2 overflow-hidden rounded-2xl py-24 text-center md:mx-3 md:rounded-[2rem] md:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <SplitHeading
          text="Tu marca merece verse tan bien como funciona."
          className="mx-auto max-w-[18ch] display display-lg"
        />
        <Reveal as="p" delay={1} className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-relaxed text-papel/85">
          Contanos la idea. La primera propuesta no se cobra.
        </Reveal>
        <Reveal as="a" delay={2} className="btn btn-metal mt-8" href="#contacto">
          <MetalFaz />
          <i className="diamond" aria-hidden="true" />
          {hero.primaryCta}
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
];

export function Footer() {
  return (
    <footer className="mx-2 mb-2 mt-2 rounded-2xl bg-azul pb-10 pt-14 text-papel md:mx-3 md:mb-3 md:rounded-[2rem]">
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

        {/* El aviso legal. Va en un <small> porque eso es exactamente lo
            que el elemento significa: letra chica de derechos y
            atribución, no un párrafo más. */}
        {/* En el teléfono cada dato va en su renglón: los separadores
            quedaban colgando al principio de la línea siguiente. */}
        <small className="mt-10 flex flex-col items-center justify-center gap-2 border-t border-dotted border-papel/30 pt-6 text-center label leading-relaxed text-papel/75 sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-1">
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
    </footer>
  );
}
