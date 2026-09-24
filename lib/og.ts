import { readFile } from "node:fs/promises";
import path from "node:path";
import { MARK_PATH, MARK_VIEWBOX } from "@/components/brand/Mark";

/* ============================================================
   LA TARJETA QUE SE COMPARTE
   Lo que se ve cuando alguien pega el enlace en WhatsApp, en un
   DM de Instagram o en LinkedIn. Es lo primero que va a ver la
   mayoría de la gente que llegue al sitio.

   Habla el mismo idioma que el hero: una imagen a sangre bajo un
   velo azul, el monograma y el nombre arriba, y el título en DM
   Sans a tamaño de cartel abajo a la izquierda. En la home, la
   imagen es un cuadro del video; en cada proyecto, la captura del
   propio sitio, así compartir un caso muestra ese caso.

   La trama de puntos no va: la tarjeta se ve casi siempre a unos
   300px de ancho en un chat, y a esa escala una retícula se vuelve
   papilla gris.
   ============================================================ */

export const OG = { width: 1200, height: 630 };

/* La misma paleta que globals.css. Acá no llegan las variables de CSS:
   la tarjeta la dibuja el servidor, así que los valores van escritos. */
const PAPEL = "#FFFFFF";
const AZUL = "#0036A5";
const MEDIO = "#155BCD";

/* La cara del sistema. Se baja una sola vez en build; si por lo que sea
   no está, la tarjeta se arma igual con la que trae el generador. Vale
   más una tarjeta con otra tipografía que ninguna. */
type Cara = { name: string; data: ArrayBuffer; style: "normal"; weight: 500 };
let cache: Cara[] | undefined;

async function bajar(familia: string, name: string): Promise<Cara | null> {
  try {
    /* Con un agente viejo, Google devuelve TTF en vez de woff2, que es
       el único formato que el generador sabe leer. */
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${familia}&display=swap`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1)" },
    }).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:\/\/[^)]+\.ttf)\)/)?.[1];
    if (!url) return null;
    return { name, data: await fetch(url).then((r) => r.arrayBuffer()), style: "normal", weight: 500 };
  } catch {
    return null;
  }
}

export async function fuentes(): Promise<Cara[]> {
  if (cache) return cache;
  const cuerpo = await bajar("DM+Sans:wght@500", "DM Sans");
  cache = cuerpo ? [cuerpo] : [];
  return cache;
}

/* La imagen de fondo, como data URI JPEG recortada a la tarjeta. El
   generador no lee WebP —el formato de las capturas—, así que pasa por
   sharp, que viene con Next. Si no está o el archivo falta, la tarjeta
   sale con el azul pleno: nunca se rompe el build por una imagen. */
export async function fondo(publico: string, { desenfoque = 0 } = {}): Promise<string | null> {
  try {
    const { default: sharp } = await import("sharp");
    const crudo = await readFile(path.join(process.cwd(), "public", publico));
    let img = sharp(crudo).resize(OG.width, OG.height, { fit: "cover", position: "top" });
    /* Una captura de sitio trae sus propios títulos y logos, y a tamaño de
       chat le compiten al nuestro. Desenfocada se siguen reconociendo sus
       colores y su forma, pero su texto deja de leerse. */
    if (desenfoque > 0) img = img.blur(desenfoque);
    const jpg = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    return `data:image/jpeg;base64,${jpg.toString("base64")}`;
  } catch {
    return null;
  }
}

/* El generador sólo sabe devolver PNG, y un PNG con una foto a sangre
   pesa 750 KB. WhatsApp deja de mostrar la vista previa pasados unos
   300 KB, y es justamente donde más se comparte el sitio. Se reencodea a
   JPEG; si sharp no está, sale el PNG igual. */
export async function comoJpeg(png: Response): Promise<Response> {
  const crudo = Buffer.from(await png.arrayBuffer());
  try {
    const { default: sharp } = await import("sharp");
    const jpg = await sharp(crudo).jpeg({ quality: 84, mozjpeg: true }).toBuffer();
    return new Response(new Uint8Array(jpg), {
      headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response(new Uint8Array(crudo), { headers: { "Content-Type": "image/png" } });
  }
}

/** La tarjeta. `titulo` va en líneas; `pie` es la línea chica. */
export function tarjeta({
  titulo,
  pie,
  imagen,
  caras,
  veloFuerte = false,
}: {
  titulo: string[];
  pie: string;
  imagen: string | null;
  caras: Cara[];
  /* Para las capturas de sitios, que son más cargadas que la foto del hero. */
  veloFuerte?: boolean;
}) {
  const largo = Math.max(...titulo.map((l) => l.length));
  /* El título se achica sólo si la línea más larga no entra: el nombre
     de un proyecto puede ser mucho más largo que el del estudio. */
  const cuerpoTitulo = Math.min(128, Math.round(1900 / Math.max(largo, 8)));
  const familia = caras.some((c) => c.name === "DM Sans") ? "DM Sans" : "sans-serif";

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: AZUL,
        backgroundImage: `linear-gradient(42deg, ${AZUL} 10%, ${MEDIO} 100%)`,
        fontFamily: familia,
        color: PAPEL,
      },
      children: [
        /* la imagen, a sangre */
        imagen
          ? {
              type: "img",
              props: {
                src: imagen,
                width: OG.width,
                height: OG.height,
                style: { position: "absolute", top: 0, left: 0, width: OG.width, height: OG.height, objectFit: "cover" },
              },
            }
          : null,
        /* el velo: azul arriba para la marca, azul fuerte abajo para que el
           título se lea sobre cualquier imagen */
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              width: OG.width,
              height: OG.height,
              backgroundImage: veloFuerte
                ? "linear-gradient(180deg, rgba(0,54,165,0.78) 0%, rgba(0,54,165,0.5) 34%, rgba(0,54,165,0.72) 60%, rgba(0,54,165,0.96) 100%)"
                : "linear-gradient(180deg, rgba(0,54,165,0.55) 0%, rgba(0,54,165,0.18) 32%, rgba(0,54,165,0.55) 58%, rgba(0,54,165,0.94) 100%)",
            },
          },
        },
        /* la marca y el nombre, arriba a la izquierda */
        {
          type: "div",
          props: {
            style: { position: "absolute", top: 44, left: 56, display: "flex", alignItems: "center", gap: 16 },
            children: [
              {
                type: "svg",
                props: {
                  width: 76,
                  height: 40,
                  viewBox: MARK_VIEWBOX,
                  children: { type: "path", props: { d: MARK_PATH, fill: PAPEL, fillRule: "nonzero" } },
                },
              },
              { type: "div", props: { style: { fontSize: 30, letterSpacing: "-0.02em" }, children: "Visual Solution" } },
            ],
          },
        },
        /* el sello */
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 42,
              right: 52,
              display: "flex",
              backgroundColor: PAPEL,
              color: AZUL,
              borderRadius: 999,
              padding: "12px 26px",
              fontSize: 24,
            },
            children: "Web + video",
          },
        },
        /* el título y el pie, abajo a la izquierda */
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 56,
              right: 56,
              bottom: 48,
              display: "flex",
              flexDirection: "column",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    fontSize: cuerpoTitulo,
                    lineHeight: 0.9,
                    letterSpacing: "-0.055em",
                  },
                  children: titulo.map((l) => ({ type: "div", props: { children: l } })),
                },
              },
              {
                type: "div",
                props: {
                  style: { display: "flex", marginTop: 22, fontSize: 28, color: "rgba(255,255,255,0.88)" },
                  children: pie,
                },
              },
            ],
          },
        },
      ].filter(Boolean),
    },
  };
}
