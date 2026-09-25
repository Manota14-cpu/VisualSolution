import type { Metadata } from "next";
import Link from "next/link";
import { Canales, LegalPage, datosDelTitular, type SeccionLegal } from "@/components/site/Legal";
import { site, siteHost } from "@/lib/content";

/* ============================================================
   POLÍTICA DE PRIVACIDAD
   Ley 25.326 de Protección de Datos Personales. Cubre lo que pide
   su artículo 6 (quién es responsable, para qué se usan los datos,
   quién los recibe, qué es obligatorio, qué pasa si no se dan y
   cómo ejercer los derechos) y la Resolución AAIP 14/2018, que
   pide mostrarlo antes de recolectar: el aviso corto va pegado al
   formulario y remite acá.

   Sólo describe lo que el sitio hace de verdad. Si se agrega
   analítica, cookies, un backend para el formulario o cualquier
   servicio nuevo, esta página se actualiza en el mismo cambio.
   ============================================================ */

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: `Qué datos recibe ${site.name}, para qué los usa, con quién intervienen y cómo ejercer tus derechos según la Ley 25.326.`,
  alternates: { canonical: "/privacidad" },
};

const titular = datosDelTitular();

const secciones: SeccionLegal[] = [
  {
    id: "responsable",
    titulo: "Quién es responsable de tus datos",
    cuerpo: (
      <>
        <p>
          El responsable de los datos que nos das a través de este sitio ({siteHost}) es {site.name}
          {titular.length ? `, ${titular.join(", ")}` : ""}, estudio de desarrollo web y producción
          audiovisual.
        </p>
        <p>Podés contactarnos por cualquiera de estos canales:</p>
        <Canales />
      </>
    ),
  },
  {
    id: "datos",
    titulo: "Qué datos recibimos",
    cuerpo: (
      <>
        <ul>
          <li>
            <strong>Los que escribís en el formulario de contacto:</strong> tu nombre, tu correo
            electrónico, el servicio que te interesa y el mensaje sobre tu proyecto.
          </li>
          <li>
            <strong>Los que nos mandás al escribirnos directo</strong> por WhatsApp, correo o Instagram,
            incluido el número de teléfono o el usuario que esos servicios nos muestran.
          </li>
          <li>
            <strong>Datos técnicos de la visita</strong> que registra automáticamente el servicio que
            aloja el sitio para funcionar y protegerse de abusos: dirección IP, tipo de navegador, página
            visitada, fecha y hora. No los usamos para identificarte.
          </li>
        </ul>
        <p>
          No te pedimos datos sensibles (salud, origen étnico, religión, opiniones políticas, vida sexual,
          etc.) y te pedimos que no los incluyas en tus mensajes.
        </p>
      </>
    ),
  },
  {
    id: "formulario",
    titulo: "Cómo funciona el formulario",
    cuerpo: (
      <>
        <p>
          El formulario <strong>no envía tus datos a ningún servidor ni los guarda en ninguna base de
          datos</strong>. Cuando tocás «Enviar por WhatsApp», tu propio navegador arma un mensaje con lo
          que escribiste y abre WhatsApp. El mensaje nos llega recién cuando lo enviás vos desde WhatsApp:
          hasta ese momento podés editarlo o descartarlo.
        </p>
        <p>
          Todos los campos son necesarios: sin un nombre, un correo, el servicio y una descripción mínima
          no podemos preparar una respuesta. Si preferís no completarlos, podés escribirnos directo por
          cualquiera de los canales de contacto y contarnos sólo lo que quieras.
        </p>
        <p>
          Para enviar el formulario te pedimos que marques que leíste esta política y aceptás que usemos
          esos datos para responderte. Ese es tu consentimiento, y lo podés retirar cuando quieras.
        </p>
      </>
    ),
  },
  {
    id: "finalidad",
    titulo: "Para qué usamos tus datos",
    cuerpo: (
      <>
        <ul>
          <li>Para responder tu consulta y prepararte una propuesta con alcance, plazo y precio.</li>
          <li>
            Si nos contratás, para comunicarnos durante el proyecto, coordinar las entregas, facturar y
            darte soporte.
          </li>
          <li>Para cumplir obligaciones legales, por ejemplo las fiscales.</li>
        </ul>
        <p>
          <strong>No los usamos para publicidad.</strong> No armamos listas de envío ni te sumamos a
          comunicaciones comerciales sin pedírtelo antes.
        </p>
      </>
    ),
  },
  {
    id: "terceros",
    titulo: "Quién más interviene",
    cuerpo: (
      <>
        <p>
          No vendemos, alquilamos ni cedemos tus datos. Sólo los compartiríamos si una autoridad competente
          nos lo exigiera por ley. Para funcionar, el sitio y el estudio usan servicios de terceros, cada uno
          con su propia política de privacidad:
        </p>
        <ul>
          <li>
            <strong>WhatsApp</strong> (Meta Platforms): el canal por el que nos llega el mensaje del
            formulario y las consultas que nos escribas ahí.
          </li>
          <li>
            <strong>Gmail</strong> (Google): la cuenta de correo del estudio, si nos escribís por mail.
          </li>
          <li>
            <strong>Vercel</strong>: el servicio que aloja el sitio y registra los datos técnicos de las
            visitas.
          </li>
          <li>
            <strong>Instagram, TikTok y YouTube</strong>: sólo si seguís un enlace a nuestros perfiles. Ahí
            rige la política de cada red.
          </li>
        </ul>
        <p>
          Algunos de estos servicios guardan datos en servidores fuera de la Argentina, por ejemplo en
          Estados Unidos. Al usarlos para escribirnos, tus datos pueden quedar almacenados en esos países.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    titulo: "Cuánto tiempo los guardamos",
    cuerpo: (
      <>
        <p>
          Conservamos las consultas mientras dure la conversación. Si no avanzamos con un proyecto, borramos
          los mensajes y tus datos dentro de los 12 meses desde el último contacto.
        </p>
        <p>
          Si trabajamos juntos, los conservamos mientras dure la relación y, después, el tiempo que exijan
          las normas fiscales y contables.
        </p>
      </>
    ),
  },
  {
    id: "seguridad",
    titulo: "Cómo los cuidamos",
    cuerpo: (
      <p>
        Sólo accede a tus datos quien atiende tu consulta, y los tratamos con la confidencialidad que exige
        el artículo 10 de la Ley 25.326. Tomamos medidas razonables para protegerlos, aunque ningún sistema
        es infalible: si ocurriera un incidente que afecte tus datos, te vamos a avisar.
      </p>
    ),
  },
  {
    id: "cookies",
    titulo: "Cookies y almacenamiento local",
    cuerpo: (
      <>
        <p>
          <strong>Este sitio no usa cookies</strong>, ni herramientas de analítica, ni píxeles de
          seguimiento o de publicidad.
        </p>
        <p>
          Lo único que guarda en tu navegador es un dato técnico de la sesión (en el almacenamiento de
          sesión, no en una cookie) para no repetirte la animación de entrada cada vez que volvés a la
          portada. No te identifica y se borra solo al cerrar la pestaña. Las tipografías, las imágenes y
          el video se sirven desde el propio sitio, sin pedidos a servicios de terceros.
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    titulo: "Tus derechos y cómo ejercerlos",
    cuerpo: (
      <>
        <p>La Ley 25.326 te da, entre otros, estos derechos sobre tus datos:</p>
        <ul>
          <li>
            <strong>Acceso:</strong> saber qué datos tuyos tenemos. Te respondemos dentro de los 10 días
            corridos (artículo 14).
          </li>
          <li>
            <strong>Rectificación y actualización:</strong> corregir datos inexactos o incompletos.
          </li>
          <li>
            <strong>Supresión:</strong> pedir que los borremos. La rectificación, la actualización o la
            supresión se hacen dentro de los 5 días hábiles (artículo 16).
          </li>
          <li>
            <strong>Retirar tu consentimiento</strong> en cualquier momento, sin que eso afecte lo hecho
            antes.
          </li>
        </ul>
        <p>
          Para ejercerlos, escribinos a <a href={`mailto:${site.email}`}>{site.email}</a> o por WhatsApp
          diciéndonos qué necesitás. Es gratis. Podemos pedirte que acredites tu identidad, para no darle tus
          datos a otra persona.
        </p>
        <blockquote className="legal-leyenda">
          <p>
            El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos
            en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés
            legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326.
          </p>
          <p>
            La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley
            N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes
            resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de
            protección de datos personales.
          </p>
        </blockquote>
      </>
    ),
  },
  {
    id: "menores",
    titulo: "Menores de edad",
    cuerpo: (
      <p>
        El sitio está pensado para personas mayores de 18 años que consultan por su negocio o su proyecto.
        Si sos menor, pedile a una persona adulta responsable que nos escriba.
      </p>
    ),
  },
  {
    id: "cambios",
    titulo: "Cambios en esta política",
    cuerpo: (
      <p>
        Si la cambiamos, publicamos la versión nueva en esta misma página con su fecha de actualización. Si
        el cambio afecta cómo usamos datos que ya nos diste, te lo vamos a avisar por el mismo canal por el
        que nos escribiste.
      </p>
    ),
  },
  {
    id: "contacto",
    titulo: "Contacto",
    cuerpo: (
      <>
        <p>Por cualquier duda sobre tus datos o sobre esta política, escribinos:</p>
        <Canales />
        <p>
          El uso del sitio se rige además por nuestros <Link href="/terminos">términos y condiciones</Link>.
        </p>
      </>
    ),
  },
];

export default function Privacidad() {
  return (
    <LegalPage
      actual="/privacidad"
      titulo="Política de privacidad"
      bajada="Qué datos nos das cuando nos escribís, para qué los usamos y cómo podés controlarlos. En lenguaje claro: si algo no se entiende, preguntanos."
      resumen={[
        "El sitio no guarda nada de lo que escribís en el formulario: arma un mensaje de WhatsApp que nos llega recién cuando lo enviás vos.",
        "Usamos tus datos sólo para responderte y, si trabajamos juntos, para llevar adelante el proyecto.",
        "No vendemos ni cedemos tus datos, y no te vamos a mandar publicidad.",
        "No usamos cookies, analítica ni herramientas de seguimiento.",
        `Podés pedir ver, corregir o borrar tus datos cuando quieras, gratis, escribiendo a ${site.email}.`,
      ]}
      secciones={secciones}
    />
  );
}
