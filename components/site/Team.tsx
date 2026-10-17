import Image from "next/image";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { Flecha } from "@/components/ui/Flecha";
import { numeroDeSeccion, perfilesCargados, type Perfil } from "@/lib/content";

/* ============================================================
   EL EQUIPO
   Una credencial por persona. Arriba, una plancha en azul pleno
   con el retrato impreso en la tinta de la marca —las sombras en
   azul, las luces en papel—, así dos fotos sacadas en lugares
   distintos se leen como una serie. Sin foto, las iniciales van
   enormes en la trama. Abajo, en papel, la bio y lo que sabe hacer
   como una ficha técnica: el grupo a la izquierda, las etiquetas a
   la derecha.

   Los datos viven en lib/content.ts (perfiles). Sin ningún perfil
   cargado la sección no se dibuja, y tampoco su enlace en la barra.
   Es un componente de servidor: sólo Reveal se hidrata.
   ============================================================ */

/* Las dos primeras iniciales del nombre, para la plancha sin foto. */
const iniciales = (nombre: string) =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra[0])
    .join("")
    .toUpperCase();

const dosCifras = (n: number) => String(n).padStart(2, "0");

function Ficha({ perfil, indice, total }: { perfil: Perfil; indice: number; total: number }) {
  const tituloId = `${perfil.id}-nombre`;
  /* Las etiquetas entran en orden de lectura, de un grupo al
     siguiente: la cuenta sigue corriendo entre grupos. */
  let k = 0;

  /* .rv y la tarjeta van en elementos separados: .rv.in fija su propia
     transición y pisaría la de la luz y la sombra de la tarjeta. */
  return (
    <Reveal delay={indice} className="h-full">
      <article className="perfil" data-luz aria-labelledby={tituloId}>
        <div className="perfil-plancha inundado">
          {perfil.foto ? (
            <div className="perfil-retrato">
              <Image
                src={perfil.foto}
                alt={`Retrato de ${perfil.nombre}`}
                fill
                sizes="(min-width: 768px) 560px, 100vw"
              />
            </div>
          ) : (
            <span className="perfil-monograma" aria-hidden="true">
              {iniciales(perfil.nombre)}
            </span>
          )}

          <span className="perfil-n" aria-hidden="true">
            {dosCifras(indice + 1)} <span>/ {dosCifras(total)}</span>
          </span>

          <div className="perfil-titular">
            <h3 id={tituloId} className="perfil-nombre">
              {perfil.nombre}
            </h3>
            {perfil.rol && <p className="perfil-rol">{perfil.rol}</p>}
          </div>
        </div>

        <div className="perfil-cuerpo">
          {perfil.bio && <p className="perfil-bio">{perfil.bio}</p>}

          {perfil.habilidades.length > 0 && (
            <dl className="perfil-ficha">
              {perfil.habilidades.map((g) => (
                <div key={g.grupo} className="perfil-fila">
                  <dt className="label">{g.grupo}</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-2">
                      {g.items.map((item) => (
                        <li key={item} className="badge" style={{ ["--k" as string]: k++ } as React.CSSProperties}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {perfil.enlaces && perfil.enlaces.length > 0 && (
            <ul className="perfil-enlaces">
              {perfil.enlaces.map((e) => (
                <li key={e.url}>
                  <a className="perfil-enlace" href={e.url} target="_blank" rel="noopener noreferrer">
                    {e.label}
                    <Flecha externa />
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
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
            <Ficha key={p.id} perfil={p} indice={i} total={perfilesCargados.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
