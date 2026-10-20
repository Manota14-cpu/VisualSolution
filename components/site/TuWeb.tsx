"use client";

import { useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Building2,
  Calculator,
  Coffee,
  Croissant,
  Flower2,
  HeartPulse,
  Menu,
  Monitor,
  Salad,
  Shirt,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  Tag,
  Truck,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { Reveal, SplitHeading } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/site/Eyebrow";
import { MetalFaz } from "@/components/brand/MetalRig";
import { Flecha } from "@/components/ui/Flecha";
import { scrollToId } from "@/components/motion/MotionProvider";
import { askAbout } from "@/lib/consult";
import { tuWeb, whatsappUrl, type EstiloDemo, type RubroDemo } from "@/lib/content";

/* ============================================================
   TU WEB, EN VIVO
   La prueba de que sabemos diseñar no es contarlo: es diseñarle la
   web a quien está mirando, mientras mira. Escribe el nombre de su
   negocio, elige rubro y estilo, y la ventana arma una web con su
   nombre, su dirección y un dibujo de portada que sale de su nombre:
   cada nombre da una composición distinta.

   Y se puede mirar por dentro. Debajo del diseño hay una segunda capa
   idéntica en modo plano —la grilla, los contornos y el nombre de
   cada pieza, en la tinta de la marca—, y una lupa que sigue al
   cursor la deja ver. Con el dedo o el teclado, un botón muestra el
   plano entero. El botón de celular achica la ventana y la web se
   reacomoda sola: el diseño adaptable, a la vista.

   La web de muestra es decorado para la tecnología de asistencia: se
   anuncia con una sola descripción y no suma títulos ni botones
   falsos a la página.
   ============================================================ */

type Forma = "cuarto" | "medio" | "circulo" | "anillo" | "cuadro" | "hoja" | "nada";
type Tesela = { forma: Forma; giro: number; fondo: number; tinta: number };

const iconos: Record<RubroDemo["id"], { chip: LucideIcon; tarjetas: [LucideIcon, LucideIcon, LucideIcon] }> = {
  gastronomia: { chip: Coffee, tarjetas: [Croissant, UtensilsCrossed, ShoppingBag] },
  indumentaria: { chip: Shirt, tarjetas: [Shirt, Tag, Truck] },
  salud: { chip: HeartPulse, tarjetas: [Stethoscope, Salad, Flower2] },
  estudio: { chip: Briefcase, tarjetas: [Calculator, Users, Building2] },
};

/* La letra de cada estilo, para el rótulo del título en el plano. */
const letra: Record<EstiloDemo["id"], string> = {
  editorial: "Instrument Serif",
  audaz: "Space Grotesk Bold",
  calido: "DM Sans",
};

/* El repertorio de formas de cada estilo. La sucesión de números al
   azar es la misma para un nombre en los tres estilos: cambia el
   repertorio, no el ritmo de la composición. */
const formas: Record<EstiloDemo["id"], Forma[]> = {
  editorial: ["circulo", "medio", "nada", "anillo", "medio", "nada", "cuarto"],
  audaz: ["cuarto", "cuadro", "medio", "circulo", "cuarto", "anillo"],
  calido: ["hoja", "circulo", "medio", "hoja", "nada", "circulo"],
};

/* FNV-1a: el mismo texto da siempre el mismo número. */
const semilla = (texto: string) => {
  let h = 2166136261;
  for (const c of texto) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/* mulberry32: una sucesión de números al azar que se repite igual
   para la misma semilla. */
const azar = (s: number) => () => {
  s = (s + 0x6d2b79f5) | 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* Doce teselas en cuatro por tres. Fondo y tinta son índices de la
   paleta del estilo (--t1 a --t4): al cambiar de estilo, la misma
   composición se vuelve a pintar. */
function componer(nombre: string, rubro: RubroDemo["id"], estilo: EstiloDemo["id"]): Tesela[] {
  const r = azar(semilla(`${nombre.trim().toLowerCase()}|${rubro}`));
  const repertorio = formas[estilo];
  return Array.from({ length: 12 }, () => {
    const forma = repertorio[Math.floor(r() * repertorio.length)];
    const giro = Math.floor(r() * 4);
    const fondo = Math.floor(r() * 4) + 1;
    let tinta = Math.floor(r() * 4) + 1;
    if (tinta === fondo) tinta = (tinta % 4) + 1;
    return { forma, giro, fondo, tinta };
  });
}

function Figura({ forma }: { forma: Forma }) {
  switch (forma) {
    case "cuarto":
      return <path d="M0 0H100A100 100 0 0 1 0 100Z" />;
    case "medio":
      return <path d="M0 100A50 50 0 0 1 100 100Z" />;
    case "circulo":
      return <circle cx="50" cy="50" r="36" />;
    case "anillo":
      return <circle className="tw-trazo" cx="50" cy="50" r="28" />;
    case "cuadro":
      return <rect x="25" y="25" width="50" height="50" />;
    case "hoja":
      return <path d="M0 100C0 45 45 0 100 0C100 55 55 100 0 100Z" />;
    default:
      return null;
  }
}

/* Cada tesela lleva de clave su forma y sus colores: al escribir, sólo
   se vuelven a montar —y entran con un golpe— las que cambiaron. */
function Arte({ teselas }: { teselas: Tesela[] }) {
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {teselas.map((t, i) => (
        <g key={i} transform={`translate(${(i % 4) * 100} ${Math.floor(i / 4) * 100})`}>
          <g
            key={`${t.forma}-${t.giro}-${t.fondo}-${t.tinta}`}
            className="tw-tesela"
            style={{ ["--i" as string]: i } as React.CSSProperties}
          >
            <rect width="100" height="100" className={`tw-f${t.fondo}`} />
            <g transform={`rotate(${t.giro * 90} 50 50)`} className={`tw-f${t.tinta}`}>
              <Figura forma={t.forma} />
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

/* El dominio que tendría: sin tildes, sin espacios, en .com.ar. */
const dominio = (nombre: string) => {
  const s = nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "");
  return `${s || "tunegocio"}.com.ar`;
};

/* La web de muestra. Se dibuja dos veces, una encima de la otra: el
   diseño y el plano. Tienen que ser idénticas para que la lupa caiga
   justo sobre lo que tapa, por eso el plano cambia colores y suma
   contornos y rótulos, pero nunca medidas. */
function Sitio({
  nombre,
  rubro,
  estilo,
  teselas,
}: {
  nombre: string;
  rubro: RubroDemo;
  estilo: EstiloDemo["id"];
  teselas: Tesela[];
}) {
  const ic = iconos[rubro.id];
  const inicial = Array.from(nombre.trim())[0]?.toUpperCase() ?? "T";

  return (
    <div className={`tw-sitio tw-${estilo}`}>
      <div className="tw-nav" data-spec="Barra · 64 de alto">
        <span className="tw-logo" data-spec="Logo">
          <span className="tw-logo-marca">{inicial}</span>
          <span className="tw-logo-nombre">{nombre}</span>
        </span>
        <span className="tw-menu" data-spec="Menú">
          {rubro.nav.map((n) => (
            <span key={n}>{n}</span>
          ))}
        </span>
        <span className="tw-nav-btn" data-spec="Botón">
          {rubro.accion}
        </span>
        <span className="tw-hamburguesa" data-spec="Menú móvil">
          <Menu />
        </span>
      </div>

      <div className="tw-hero" data-spec="Portada · 2 columnas" data-spec-movil="Portada · 1 columna">
        <div className="tw-hero-texto">
          <p className="tw-kicker" data-spec="Etiqueta · 12px">
            {rubro.kicker}
          </p>
          <p className="tw-h1" data-spec={`Título · ${letra[estilo]}`}>
            {nombre}
          </p>
          <p className="tw-bajada" data-spec="Bajada · 17 / 1.55">
            {rubro.bajada}
          </p>
          <div className="tw-acciones">
            <span className="tw-btn" data-spec="Acción · 46 de alto">
              {rubro.accion}
            </span>
            <span className="tw-btn-2" data-spec="Secundaria">
              {rubro.secundaria}
            </span>
          </div>
        </div>
        <div className="tw-arte" data-spec="Arte hecho con tu nombre">
          <Arte teselas={teselas} />
        </div>
      </div>

      <div className="tw-tarjetas" data-spec="Grilla · 3 columnas" data-spec-movil="Grilla · 1 columna">
        {rubro.tarjetas.map((t, i) => {
          const Icono = ic.tarjetas[i];
          return (
            <div key={t.titulo} className="tw-tarjeta" data-spec="Tarjeta · 20 de aire">
              <Icono aria-hidden="true" />
              <p className="tw-tarjeta-t">{t.titulo}</p>
              <p className="tw-tarjeta-d">{t.detalle}</p>
            </div>
          );
        })}
      </div>

      <p className="tw-pie-sitio" data-spec="Pie">
        © {nombre} · {dominio(nombre)}
      </p>
    </div>
  );
}

export function TuWeb() {
  const [nombre, setNombre] = useState("");
  const [rubroId, setRubroId] = useState<RubroDemo["id"]>("gastronomia");
  const [estiloId, setEstiloId] = useState<EstiloDemo["id"]>("editorial");
  const [dispositivo, setDispositivo] = useState<"compu" | "celu">("compu");
  const [plano, setPlano] = useState(false);
  const lienzo = useRef<HTMLDivElement>(null);

  const rubro = tuWeb.rubros.find((r) => r.id === rubroId)!;
  const estilo = tuWeb.estilos.find((e) => e.id === estiloId)!;
  const visible = nombre.trim() || rubro.ejemplo;
  const teselas = useMemo(() => componer(visible, rubro.id, estilo.id), [visible, rubro.id, estilo.id]);

  /* La lupa: la posición va como custom properties y el encendido como
     atributo, escritos a mano. Ni una cosa ni la otra están en el JSX,
     así React no se las lleva puestas cuando se vuelve a dibujar
     mientras alguien escribe con el cursor encima. */
  const mover = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = lienzo.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
    el.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
    el.dataset.lente = "";
  };
  const salir = () => {
    if (lienzo.current) delete lienzo.current.dataset.lente;
  };

  const pedir = () => {
    askAbout(`una web para ${visible} (${rubro.label.toLowerCase()}, estilo ${estilo.label.toLowerCase()})`);
    scrollToId("contacto");
  };

  const sitio = <Sitio nombre={visible} rubro={rubro} estilo={estilo.id} teselas={teselas} />;

  return (
    <section className="seccion tuweb" id="en-vivo" aria-labelledby="en-vivo-titulo">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-10">
        <Reveal className="cabecera">
          <div>
            <Eyebrow n="●">En vivo</Eyebrow>
            <SplitHeading
              id="en-vivo-titulo"
              text="Tu web, diseñada mientras escribís."
              accent="mientras escribís."
              className="display display-md max-w-[15ch]"
            />
          </div>
          <p className="cabecera-texto">
            Poné el nombre de tu negocio y elegí rubro y estilo: la armamos en el momento. Pasá el cursor por la pantalla
            y mirá el plano por dentro.
          </p>
        </Reveal>

        <div className="tw">
          <Reveal className="tw-lado">
            <form className="tw-controles" onSubmit={(e) => e.preventDefault()}>
              <label className="tw-campo">
                <span className="label">Tu negocio</span>
                <input
                  className="field-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder={rubro.ejemplo}
                  maxLength={28}
                  autoComplete="organization"
                  spellCheck={false}
                />
              </label>

              <fieldset className="tw-campo">
                <legend className="label">Rubro</legend>
                <div className="tw-opciones">
                  {tuWeb.rubros.map((r) => {
                    const Icono = iconos[r.id].chip;
                    return (
                      <label key={r.id} className="tw-opcion">
                        <input
                          type="radio"
                          name="tw-rubro"
                          value={r.id}
                          checked={r.id === rubroId}
                          onChange={() => setRubroId(r.id)}
                        />
                        <span>
                          <Icono aria-hidden="true" />
                          {r.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="tw-campo">
                <legend className="label">Estilo</legend>
                <div className="tw-opciones">
                  {tuWeb.estilos.map((s) => (
                    <label key={s.id} className="tw-opcion">
                      <input
                        type="radio"
                        name="tw-estilo"
                        value={s.id}
                        checked={s.id === estiloId}
                        onChange={() => setEstiloId(s.id)}
                      />
                      <span>
                        <i className="tw-muestra" aria-hidden="true">
                          {s.muestra.map((c) => (
                            <b key={c} style={{ background: c }} />
                          ))}
                        </i>
                        {s.label}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="tw-detalle">{estilo.detalle}.</p>
              </fieldset>
            </form>

            <div className="tw-pie">
              <button className="btn btn-metal" type="button" onClick={pedir}>
                <MetalFaz />
                <i className="diamond" aria-hidden="true" />
                Quiero una web así
              </button>
              <a
                className="link link-flecha"
                href={whatsappUrl(
                  `Hola Visual Solution, quiero una web para ${visible} (${rubro.label}, estilo ${estilo.label}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                o escribinos por WhatsApp
                <Flecha externa />
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <p className="tw-nota">
                Es una muestra hecha en el momento. Tu web real se diseña a medida, con tus fotos, tus textos y tu marca.
              </p>
            </div>
          </Reveal>

          <div className="tw-escena">
            <div
              className={`tw-marco ${dispositivo === "celu" ? "es-celu" : ""}`}
              role="img"
              aria-label={`Vista previa: así podría verse la web de ${visible}, rubro ${rubro.label}, estilo ${estilo.label}.`}
            >
              <div className="tw-barra" aria-hidden="true">
                <span />
                <span />
                <span />
                <p>{dominio(visible)}</p>
              </div>
              <div className="tw-pantalla" data-lenis-prevent onPointerMove={mover} onPointerLeave={salir}>
                <div ref={lienzo} className={`tw-lienzo ${plano ? "plano-entero" : ""}`}>
                  <div className="tw-capa" aria-hidden="true">
                    {sitio}
                  </div>
                  <div className="tw-capa tw-plano" aria-hidden="true">
                    {sitio}
                  </div>
                  <span className="tw-lupa" aria-hidden="true">
                    <span>Plano</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="tw-vista">
              <fieldset className="tw-opciones tw-dispositivo">
                <legend className="sr-only">Ver en</legend>
                {(
                  [
                    ["compu", "Compu", Monitor],
                    ["celu", "Celular", Smartphone],
                  ] as const
                ).map(([id, label, Icono]) => (
                  <label key={id} className="tw-opcion">
                    <input
                      type="radio"
                      name="tw-dispositivo"
                      value={id}
                      checked={dispositivo === id}
                      onChange={() => setDispositivo(id)}
                    />
                    <span>
                      <Icono aria-hidden="true" />
                      {label}
                    </span>
                  </label>
                ))}
              </fieldset>
              <button type="button" className="tw-plano-btn" aria-pressed={plano} onClick={() => setPlano((p) => !p)}>
                {plano ? "Ver el diseño" : "Ver el plano"}
              </button>
              <p className="tw-pista">Pasá el cursor por la pantalla para ver el plano.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
