import Image from "next/image";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Flecha } from "@/components/ui/Flecha";
import { numeroDeSeccion, perfilesCargados, type Perfil } from "@/lib/content";

/* ============================================================
   EL EQUIPO
   Una tarjeta por persona: quién es, a qué se dedica y qué sabe
   hacer, con las habilidades agrupadas. Los datos viven en
   lib/content.ts (perfiles). Sin ningún perfil cargado la sección
   no se dibuja, y tampoco su enlace en la barra.

   Es un componente de servidor: sólo Reveal, que anima la entrada,
   se hidrata en el cliente.
   ============================================================ */

/* Las dos primeras iniciales del nombre, para la ficha sin foto. */
const iniciales = (nombre: string) =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();

function Ficha({ perfil, indice }: { perfil: Perfil; indice: number }) {
  const tituloId = `${perfil.id}-nombre`;

  /* .rv y la tarjeta van en elementos separados: .rv.in fija su propia
     transición y pisaría la de la luz y la sombra de la tarjeta. */
  return (
    <Reveal delay={indice} className="h-full">
      <article className="perfil" data-luz aria-labelledby={tituloId}>
        <header className="perfil-cab">
          <div className="perfil-foto">
            {perfil.foto ? (
              <Image
                src={perfil.foto}
                alt={`Foto de ${perfil.nombre}`}
                width={192}
                height={192}
                sizes="96px"
                className="perfil-foto-img"
              />
            ) : (
              <span aria-hidden="true">{iniciales(perfil.nombre)}</span>
            )}
          </div>
          <div>
            <h3 id={tituloId} className="display display-sm perfil-nombre">
              {perfil.nombre}
            </h3>
            {perfil.rol && <p className="perfil-rol">{perfil.rol}</p>}
          </div>
        </header>

        {perfil.bio && <p className="perfil-bio">{perfil.bio}</p>}

        {perfil.habilidades.length > 0 && (
          <div className="perfil-grupos">
            {perfil.habilidades.map((g) => (
              <div key={g.grupo}>
                <h4 className="label perfil-grupo">{g.grupo}</h4>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((item) => (
                    <li key={item} className="badge">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {perfil.enlaces && perfil.enlaces.length > 0 && (
          <ul className="perfil-enlaces">
            {perfil.enlaces.map((e) => (
              <li key={e.url}>
                <a className="link link-flecha" href={e.url} target="_blank" rel="noopener noreferrer">
                  {e.label}
                  <Flecha externa />
                  <span className="sr-only"> (se abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </article>
    </Reveal>
  );
}

export function Team() {
  if (perfilesCargados.length === 0) return null;

  return (
    <section className="seccion" id="equipo" aria-labelledby="equipo-titulo">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <Reveal className="cabecera">
          <div>
            <Eyebrow n={numeroDeSeccion("#equipo")}>Equipo</Eyebrow>
            <SplitHeading
              id="equipo-titulo"
              text="Las personas detrás del estudio."
              accent="detrás del estudio."
              className="display display-md max-w-[16ch]"
            />
          </div>
          <p className="cabecera-texto">Un solo equipo. Esto es lo que sabe hacer cada integrante.</p>
        </Reveal>

        <div className="perfiles">
          {perfilesCargados.map((p, i) => (
            <Ficha key={p.id} perfil={p} indice={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
