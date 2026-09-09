import { Mark } from "@/components/brand/Mark";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { hero, nav, site } from "@/lib/content";

export function Closer() {
  return (
    <section className="bg-concrete border-b border-carbon py-24 text-center md:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <SplitHeading
          text="Tu marca merece verse tan bien como funciona."
          className="mx-auto max-w-[18ch] display display-lg"
        />
        <Reveal as="p" delay={1} className="mx-auto mt-4 max-w-[52ch] text-base leading-relaxed text-ash">
          Contanos la idea. La primera propuesta no se cobra.
        </Reveal>
        <Reveal as="a" delay={2} className="btn btn-solid mt-8" href="#contacto">
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
    <footer className="bg-carbon pb-10 pt-14 text-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="grid max-w-[34ch] content-start gap-4">
            <a className="inline-flex items-center gap-2" href="#top" aria-label="Visual Solution, inicio">
              <Mark className="block h-auto w-[26px]" />
              <span className="text-[13px] font-bold text-white">
                Visual <span className="text-white/60">Solution</span>
              </span>
            </a>
            <p className="text-sm leading-relaxed text-white/70">
              Desarrollo web y producción de contenido para marcas que quieren vender mejor.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            {columns.map((col) => (
              <div key={col.title} className="grid content-start gap-2">
                <h4 className="label mb-2 block text-white/60">{col.title}</h4>
                {col.links.map((l) => {
                  const external = l.href.startsWith("http");
                  return (
                    <a
                      key={l.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
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

        <p className="mt-10 flex flex-wrap justify-center gap-2 border-t border-white/20 pt-6 label text-white/60">
          <span>{site.name}</span>
          <span className="text-white/30">|</span>
          <span>Estudio de web y contenido</span>
          <span className="text-white/30">|</span>
          <span>{new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}
