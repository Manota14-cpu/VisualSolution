import Link from "next/link";
import { Mark } from "@/components/brand/Mark";
import { Eyebrow } from "@/components/site/Eyebrow";
import { legal, paginasLegales, site, whatsappUrl } from "@/lib/content";

/* ============================================================
   LAS PÁGINAS LEGALES
   Privacidad y Términos comparten esta forma. Se escriben en
   lenguaje claro, en la voz del sitio, y abren con un resumen de
   cinco líneas: la mayoría de la gente lee eso y nada más, así que
   lo importante tiene que estar ahí, no enterrado en la sección 9.

   El índice queda fijo al costado en escritorio: son páginas
   largas y la gente entra buscando una cosa puntual. Los números
   de sección son los mismos en el índice y en el texto.
   ============================================================ */

export type SeccionLegal = { id: string; titulo: string; cuerpo: React.ReactNode };

/* Los datos del titular: sólo los que estén cargados en lib/content. */
export function datosDelTitular() {
  return [
    legal.titular && `titular: ${legal.titular}`,
    legal.cuit && `CUIT ${legal.cuit}`,
    legal.domicilio && `domicilio en ${legal.domicilio}`,
  ].filter(Boolean) as string[];
}

/* Los canales de contacto, iguales en las dos páginas. */
export function Canales() {
  return (
    <ul>
      <li>
        Correo: <a href={`mailto:${site.email}`}>{site.email}</a>
      </li>
      <li>
        WhatsApp:{" "}
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          {site.whatsappVisible}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </li>
      <li>
        Instagram:{" "}
        <a href={site.instagram.url} target="_blank" rel="noopener">
          {site.instagram.handle}
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </li>
    </ul>
  );
}

/* El enlace a la Ventanilla Federal Única, con la leyenda exacta que
   pide la Disposición 890/2025. */
export function EnlaceConsumidor({ className = "" }: { className?: string }) {
  return (
    <a className={className} href={legal.consumidor.url} target="_blank" rel="noopener noreferrer">
      {legal.consumidor.leyenda}
      <span className="sr-only"> (sitio del Gobierno nacional, se abre en una pestaña nueva)</span>
    </a>
  );
}

export function LegalPage({
  actual,
  titulo,
  bajada,
  resumen,
  secciones,
}: {
  actual: (typeof paginasLegales)[number]["href"];
  titulo: string;
  bajada: string;
  resumen: string[];
  secciones: SeccionLegal[];
}) {
  const otra = paginasLegales.find((p) => p.href !== actual)!;
  return (
    <main id="main" className="legal">
      <div className="case-bar">
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-4 px-4 md:px-10">
          <Link className="case-back" href="/">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Inicio
          </Link>
          <Link className="inline-flex items-center gap-2" href="/" aria-label={`${site.name}, inicio`}>
            <Mark className="block h-auto w-[22px] text-azul" />
            <span className="text-sm font-medium text-azul">
              Visual <span className="text-azul/80">Solution</span>
            </span>
          </Link>
        </div>
      </div>

      <article className="mx-auto w-full max-w-[1100px] px-4 pb-20 md:px-10">
        <header className="legal-cabecera">
          <Eyebrow n="§" className="in">
            Legal
          </Eyebrow>
          <h1 className="display display-lg">{titulo}</h1>
          <p className="legal-bajada">{bajada}</p>
          <p className="legal-fecha">Última actualización: {legal.actualizado}</p>
        </header>

        <aside className="legal-resumen superficie" aria-labelledby="resumen-titulo">
          <h2 id="resumen-titulo">En pocas palabras</h2>
          <ul>
            {resumen.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </aside>

        <div className="legal-cuerpo">
          <nav className="legal-indice" aria-label="Índice">
            <p className="label">Índice</p>
            <ol>
              {secciones.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-texto">
            {secciones.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`}>
                <h2 id={`${s.id}-t`}>
                  <span className="legal-n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.titulo}
                </h2>
                {s.cuerpo}
              </section>
            ))}
          </div>
        </div>

        <footer className="legal-pie">
          <p>
            También podés leer nuestra <Link href={otra.href}>{otra.label.toLowerCase()}</Link>.
          </p>
          <p>
            <EnlaceConsumidor />
          </p>
          <p className="label text-azul/75">
            © {legal.year} {legal.holder}. {legal.rights}.
          </p>
        </footer>
      </article>
    </main>
  );
}
