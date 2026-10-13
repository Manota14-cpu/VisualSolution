import type { Metadata } from "next";
import Link from "next/link";
import { Canales, EnlaceConsumidor, LegalPage, datosDelTitular, type SeccionLegal } from "@/components/site/Legal";
import { services, site, siteHost } from "@/lib/content";

/* ============================================================
   TÉRMINOS Y CONDICIONES
   Qué es el sitio, cómo se usa y cómo se contrata. Escritos para
   un público de consumidores: nada acá puede recortar lo que la
   Ley 24.240 y el Código Civil y Comercial garantizan (art. 37 de
   la Ley 24.240), y cada sección que toca un derecho lo dice.

   Lo que el sitio promete en otras partes —"la primera propuesta no
   se cobra", los plazos y pagos de las preguntas frecuentes— está
   recogido acá tal cual, para que no haya dos versiones.
   ============================================================ */

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: `Qué es el sitio de ${site.name}, cómo se usa, cómo se contrata un servicio y qué derechos tenés como consumidor.`,
  alternates: { canonical: "/terminos" },
};

const titular = datosDelTitular();

const secciones: SeccionLegal[] = [
  {
    id: "quienes-somos",
    titulo: "Quiénes somos",
    cuerpo: (
      <>
        <p>
          {site.name} es un estudio de desarrollo web y producción audiovisual
          {titular.length ? ` (${titular.join(", ")})` : ""}. Este sitio, {siteHost}, es nuestro.
        </p>
        <p>Nos podés contactar por:</p>
        <Canales />
      </>
    ),
  },
  {
    id: "para-que",
    titulo: "Para qué es este sitio",
    cuerpo: (
      <>
        <p>Es la presentación del estudio. Sirve para:</p>
        <ul>
          <li>
            Mostrar los servicios que ofrecemos: {services.map((s) => s.title.toLowerCase()).join(", ")}.
          </li>
          <li>Mostrar trabajos que realizamos, con enlaces a los sitios publicados.</li>
          <li>Darte una forma directa de consultarnos por tu proyecto.</li>
        </ul>
        <p>
          <strong>No es una tienda:</strong> en el sitio no se compra, no se paga ni se contrata nada. Usarlo
          es gratuito, no requiere registrarse y una consulta no genera obligaciones para ninguna de las
          partes.
        </p>
      </>
    ),
  },
  {
    id: "uso",
    titulo: "Uso del sitio",
    cuerpo: (
      <>
        <p>Podés navegar el sitio, compartir sus enlaces y usarlo para consultarnos. No está permitido:</p>
        <ul>
          <li>Usarlo con fines ilícitos o que perjudiquen a terceros.</li>
          <li>Intentar acceder a partes no públicas, vulnerar su seguridad o cargar código malicioso.</li>
          <li>Sobrecargarlo con pedidos automatizados o extraer su contenido de forma masiva.</li>
          <li>Enviar mensajes masivos, publicidad no solicitada o contenido ofensivo por los canales de contacto.</li>
        </ul>
      </>
    ),
  },
  {
    id: "informacion",
    titulo: "La información que publicamos",
    cuerpo: (
      <>
        <p>
          Lo que el sitio dice sobre plazos, formas de pago y alcances (por ejemplo, en «Lo que siempre nos
          preguntan») es <strong>orientativo</strong>. Cada proyecto tiene su alcance, precio, moneda,
          impuestos, plazos y forma de pago definidos en su propuesta escrita, y eso es lo que vale.
        </p>
        <p>
          Hacemos lo posible por mantener la información correcta y actualizada; si encontrás un error,
          avisanos y lo corregimos.
        </p>
      </>
    ),
  },
  {
    id: "contratacion",
    titulo: "Consultas, propuestas y contratación",
    cuerpo: (
      <ul>
        <li>
          Consultarnos por el formulario, WhatsApp, correo o Instagram es gratis y no te obliga a contratar.
        </li>
        <li>
          <strong>La primera propuesta no se cobra</strong> y tampoco te compromete a nada.
        </li>
        <li>
          El contrato se forma cuando aceptás por escrito —por correo, WhatsApp u otro medio que deje
          constancia— una propuesta que indique el servicio, su alcance, el precio y las condiciones de pago
          y de entrega.
        </li>
        <li>
          Las condiciones de esa propuesta completan estos términos y, si difieren, prevalecen, siempre que
          no reduzcan los derechos que la ley te reconoce como consumidor.
        </li>
      </ul>
    ),
  },
  {
    id: "revocacion",
    titulo: "Derecho de revocación",
    cuerpo: (
      <>
        <p>
          Si sos consumidor y contratás a distancia (por ejemplo, por WhatsApp o por correo), podés revocar
          la aceptación dentro de los <strong>10 días corridos</strong> desde que se celebró el contrato, sin
          costo ni responsabilidad, según el artículo 34 de la Ley 24.240 y los artículos 1110 y siguientes
          del Código Civil y Comercial. Para hacerlo, avisanos por correo a{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> o por WhatsApp y te confirmamos la recepción.
        </p>
        <p>
          Este derecho no aplica en los casos que excluye el artículo 1116 del Código Civil y Comercial, como
          los trabajos confeccionados conforme a tus especificaciones o claramente personalizados.
        </p>
      </>
    ),
  },
  {
    id: "propiedad",
    titulo: "Propiedad intelectual",
    cuerpo: (
      <p>
        El diseño, los textos, el código, el video, las imágenes propias y la marca {site.name} (su nombre y
        el monograma VS) pertenecen al estudio y están protegidos por la Ley 11.723 de Propiedad
        Intelectual. Todos los derechos reservados. No se pueden copiar, reproducir ni reutilizar sin
        autorización escrita, salvo compartir enlaces o citas breves que mencionen la fuente.
      </p>
    ),
  },
  {
    id: "portfolio",
    titulo: "Trabajos de clientes y marcas de terceros",
    cuerpo: (
      <>
        <p>
          Los proyectos del catálogo son trabajos realizados por el estudio y se muestran como antecedentes.
          Los nombres, logos, marcas, capturas y contenidos de esos proyectos pertenecen a sus respectivos
          titulares.
        </p>
        <p>
          Los logos de «Con qué trabajamos» (Next.js, React, Three.js, Shopify, WooCommerce, Mercado Pago y
          Vercel) pertenecen a sus dueños y sólo identifican las herramientas que usamos: no implican
          asociación ni patrocinio.
        </p>
        <p>Si sos titular de alguno de estos contenidos y querés que lo retiremos, escribinos y lo resolvemos.</p>
      </>
    ),
  },
  {
    id: "enlaces",
    titulo: "Enlaces a otros sitios",
    cuerpo: (
      <p>
        El sitio enlaza a WhatsApp, Instagram, TikTok, YouTube, a sitios de clientes y a organismos públicos.
        No controlamos esos sitios ni respondemos por su contenido o sus políticas: al entrar, rigen sus
        propios términos.
      </p>
    ),
  },
  {
    id: "responsabilidad",
    titulo: "Responsabilidad",
    cuerpo: (
      <p>
        Trabajamos para que el sitio funcione sin interrupciones ni errores, pero no podemos garantizarlo:
        puede haber mantenimientos o fallas del alojamiento o de la conexión. Nada en estos términos limita la
        responsabilidad que nos corresponda por ley ni los derechos que te reconoce la Ley 24.240 de Defensa
        del Consumidor.
      </p>
    ),
  },
  {
    id: "datos",
    titulo: "Tus datos",
    cuerpo: (
      <p>
        Cómo tratamos los datos que nos das está explicado en la{" "}
        <Link href="/privacidad">política de privacidad</Link>, que forma parte de estos términos.
      </p>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en estos términos",
    cuerpo: (
      <p>
        Podemos actualizar estos términos. La versión vigente es la publicada en esta página, con su fecha de
        actualización. Los cambios rigen desde su publicación y no modifican las propuestas que ya hayas
        aceptado.
      </p>
    ),
  },
  {
    id: "ley",
    titulo: "Ley aplicable y reclamos",
    cuerpo: (
      <>
        <p>
          Estos términos se rigen por las leyes de la República Argentina. Si sos consumidor, es competente la
          jurisdicción del lugar donde recibiste o debiste recibir el servicio (artículo 1109 del Código Civil
          y Comercial), y cualquier cláusula en contrario se tiene por no escrita.
        </p>
        <p>
          Antes que nada, escribinos: la mayoría de los problemas se resuelven hablando. Si no quedás
          conforme, podés reclamar ante la Ventanilla Federal Única de Reclamos de Defensa del Consumidor:
        </p>
        <p>
          <EnlaceConsumidor />
        </p>
      </>
    ),
  },
];

export default function Terminos() {
  return (
    <LegalPage
      actual="/terminos"
      titulo="Términos y condiciones"
      bajada="Qué es este sitio, cómo se usa y cómo trabajamos cuando nos contratás. Usar el sitio implica aceptarlos."
      resumen={[
        "Este sitio presenta al estudio: no vende nada en línea y consultarnos no te compromete a nada.",
        "Lo que publicamos sobre plazos y pagos es orientativo; lo que vale es la propuesta escrita de cada proyecto.",
        "La primera propuesta no se cobra y no te obliga a contratar.",
        "El diseño, los textos, el código y la marca son del estudio; los trabajos del catálogo pertenecen también a sus clientes.",
        "Si sos consumidor, tus derechos bajo la Ley 24.240 se aplican siempre.",
      ]}
      secciones={secciones}
    />
  );
}
