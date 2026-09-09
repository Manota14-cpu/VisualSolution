import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/site/CaseStudy";
import { Mark } from "@/components/brand/Mark";
import { works, site } from "@/lib/content";

/* Página real por proyecto: la que recibe quien abre el enlace directo
   o llega desde un buscador. Dentro del sitio, la grilla abre el mismo
   contenido en una capa que morfea desde la tarjeta. */

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = works.find((w) => w.id === slug);
  if (!work) return { title: "Trabajo no encontrado" };

  const description = work.summary ?? `${work.kind}, ${work.year}. Un trabajo de ${site.name}.`;
  return {
    title: `${work.title} — ${site.name}`,
    description,
    openGraph: {
      title: `${work.title} — ${site.name}`,
      description,
      type: "article",
      images: [{ url: work.full, alt: work.alt }],
    },
  };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = works.find((w) => w.id === slug);
  if (!work) notFound();

  return (
    <main id="main">
      <div className="case-bar">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 px-4 md:px-10">
          <Link className="case-back" href="/#trabajos">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10 2 4 8l6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Catálogo
          </Link>
          <Link className="inline-flex items-center gap-2" href="/" aria-label={`${site.name}, inicio`}>
            <Mark className="block h-auto w-[22px]" />
            <span className="text-sm font-medium text-chalk">
              Visual <span className="text-chalk/55">Solution</span>
            </span>
          </Link>
        </div>
      </div>

      <CaseStudy work={work} />
    </main>
  );
}
