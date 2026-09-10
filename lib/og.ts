import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand/Mark";

/* ============================================================
   LA TARJETA QUE SE COMPARTE
   Lo que se ve cuando alguien pega el enlace en WhatsApp, en un
   DM de Instagram o en LinkedIn. Es lo primero que va a ver la
   mayoría de la gente que llegue al sitio, y hasta ahora era una
   tarjeta vacía: para un estudio que vende que las cosas se vean
   bien, eso resta.

   Se arma con la misma plancha que el hero, así que compartir el
   sitio es compartir un afiche.

   Una decisión que vale explicar: acá NO va la trama de puntos.
   La tarjeta se ve casi siempre a unos 300px de ancho en un chat,
   y a esa escala una retícula de 16px se convierte en papilla
   gris. El motivo firma no sobrevive al medio, así que la tarjeta
   se queda con lo que sí sobrevive: el degradado, el monograma
   fuera de registro y el reclamo a tamaño de cartel.
   ============================================================ */

export const OG = { width: 1200, height: 630 };

const ONIX = "#000000";
const OBSIDIANA = "#070607";
const TIZA = "#FFFFFF";
const MAGENTA = "#EC4899";
const VIOLETA = "#8B5CF6";
const TINTE = "#C4B5FD";

/* Las dos caras del sistema. Se bajan una sola vez en build; si por lo
   que sea no están, la tarjeta se arma igual con la que trae el
   generador. Vale más una tarjeta con otra tipografía que ninguna. */
type Cara = { name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 500 };
let cache: Cara[] | undefined;

async function bajar(familia: string, name: string, weight: 400 | 500): Promise<Cara | null> {
  try {
    /* Con un agente viejo, Google devuelve TTF en vez de woff2, que es
       el único formato que el generador sabe leer. */
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${familia}&display=swap`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    return { name, data: await fetch(url).then((r) => r.arrayBuffer()), style: "normal", weight };
  } catch {
    return null;
  }
}

export async function fuentes(): Promise<Cara[]> {
  if (cache) return cache;
  const [display, cuerpo] = await Promise.all([
    bajar("Anton", "Anton", 400),
    bajar("DM+Sans:wght@500", "DM Sans", 500),
  ]);
  cache = [display, cuerpo].filter((f): f is Cara => !!f);
  return cache;
}

const hay = (fs: Cara[], n: string) => (fs.some((f) => f.name === n) ? n : "sans-serif");

/** El monograma, fuera de registro: las dos tintas y el negro encima. */
function Marca({ alto, corre = 10 }: { alto: number; corre?: number }) {
  const ancho = (alto * 143.5) / 76;
  const capa = (color: string, dx: number, dy: number) => ({
    type: "svg",
    props: {
      width: ancho,
      height: alto,
      viewBox: MARK_VIEWBOX,
      style: { position: "absolute", left: dx, top: dy },
      children: { type: "path", props: { d: MARK_PATH, fill: color, fillRule: "nonzero" } },
    },
  });
  return {
    type: "div",
    props: {
      style: { display: "flex", position: "relative", width: ancho + corre * 2, height: alto + corre },
      children: [capa(MAGENTA, corre * 2, 0), capa(TINTE, 0, corre), capa(OBSIDIANA, corre, corre / 2)],
    },
  };
}

/** La tarjeta. `pie` es la línea chica; `titulo` el reclamo grande. */
export function tarjeta({ titulo, pie, caras }: { titulo: string[]; pie: string; caras: Cara[] }) {
  const largo = Math.max(...titulo.map((l) => l.length));
  /* El reclamo se achica sólo si la línea más larga no entra: un título
     de proyecto puede ser mucho más largo que el reclamo del hero. */
  const cuerpoTitulo = Math.min(112, Math.round(1180 / (largo * 0.52)));

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: ONIX,
        fontFamily: hay(caras, "DM Sans"),
      },
      children: [
        /* la plancha, con el monograma calado */
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 350,
              position: "relative",
              backgroundColor: VIOLETA,
              backgroundImage: `linear-gradient(42deg, ${VIOLETA} 4%, ${MAGENTA} 96%)`,
            },
            children: [
              Marca({ alto: 200 }),
              {
                /* El sello va en obsidiana, no en magenta: arriba a la
                   derecha la plancha ya ES magenta y un sello magenta
                   sobre magenta no se ve. */
                type: "div",
                props: {
                  style: {
                    position: "absolute",
                    top: 30,
                    right: 44,
                    display: "flex",
                    backgroundColor: OBSIDIANA,
                    color: TINTE,
                    borderRadius: 999,
                    padding: "13px 28px",
                    fontSize: 25,
                  },
                  children: "Web + video",
                },
              },
            ],
          },
        },

        /* el reclamo, mordiendo la plancha desde abajo */
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "0 52px 44px",
              justifyContent: "flex-end",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    marginTop: -34,
                    fontFamily: hay(caras, "Anton"),
                    fontSize: cuerpoTitulo,
                    lineHeight: 0.92,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    color: TIZA,
                  },
                  children: titulo.map((l) => ({ type: "div", props: { children: l } })),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    marginTop: 24,
                    fontSize: 27,
                    color: "rgba(255,255,255,0.62)",
                  },
                  children: pie,
                },
              },
            ],
          },
        },
      ],
    },
  };
}
