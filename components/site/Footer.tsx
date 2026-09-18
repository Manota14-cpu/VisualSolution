import { Mark } from "@/components/brand/Mark";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { hero, legal, nav, site, siteHost, siteUrl } from "@/lib/content";
import { MetalFaz } from "@/components/brand/MetalRig";

export function Closer() {
  return (
    /* La página abre con una plancha y cierra con otra: el último
       bloque antes del pie es el mismo material que el hero, para que
       el remate no sea un párrafo más sobre negro. */
    <section className="inundado py-24 text-center md:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <SplitHeading
          text="Tu marca merece verse tan bien como funciona."
          className="mx-auto max-w-[18ch] display display-lg"
        />
        <Reveal as="p" delay={1} className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-relaxed text-obsidian/75">
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
      { href: `mailto:${site.email}`, label: site.email },
    ],
  },
  {
    title: "Redes",
    links: [
      { href: site.instagram.url, label: "Instagram" },
      { href: site.linkedin, label: "LinkedIn" },
      { href: site.youtube, label: "YouTube" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-carbon pb-10 pt-14 text-chalk">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="grid max-w-[34ch] content-start gap-4">
            <a className="inline-flex items-center gap-2" href="#top" aria-label="Visual Solution, inicio">
              <Mark className="block h-auto w-[26px]" />
              <span className="text-sm font-medium text-chalk">
                Visual <span className="text-chalk/60">Solution</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed text-chalk/70">
              Desarrollo web y producción de contenido para marcas que quieren vender mejor.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            {columns.map((col) => (
              <div key={col.title} className="grid content-start gap-2">
                <h4 className="label mb-2 block text-chalk/60">{col.title}</h4>
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <a
                      key={l.href}
                      className="foot-link text-sm text-chalk/70 transition-colors duration-200 hover:text-chalk"
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
        <small className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-t border-dotted border-chalk/30 pt-6 text-center label text-chalk/60">
          <span>
            © {legal.year} {legal.holder}. {legal.rights}.
          </span>
          <span className="text-chalk/30" aria-hidden="true">
            |
          </span>
          <span>{legal.credit}</span>
          <span className="text-chalk/30" aria-hidden="true">
            |
          </span>
          <a className="foot-link transition-colors duration-200 hover:text-chalk" href={siteUrl}>
            {siteHost}
          </a>
        </small>
      </div>
    </footer>
  );
}
