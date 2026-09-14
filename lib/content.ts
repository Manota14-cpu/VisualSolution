/* ============================================================
   Todo el texto y los datos del sitio viven acá. Para cambiar
   copys, proyectos o preguntas no hace falta tocar ningún
   componente: se edita este archivo.
   ============================================================ */

export const site = {
  name: "Visual Solution",
  title: "Visual Solution",
  description:
    "Visual Solution es un estudio de desarrollo web y producción de contenido. Sitios, tiendas online, video e identidad visual para marcas que quieren vender mejor.",
  shortDescription: "Estudio de desarrollo web y producción de contenido.",
  // TODO: reemplazar por los datos reales de contacto
  email: "hola@visualsolution.com",
  instagram: { handle: "@visualsolution", url: "https://instagram.com/" },
  linkedin: "https://www.linkedin.com/",
  youtube: "https://www.youtube.com/",
  /* Para que el formulario envíe de verdad, poner acá la URL de
     Formspree, Getform o tu propia API. Vacío usa el cliente de correo. */
  formEndpoint: "",
} as const;

/* La URL pública. Hace falta para que las tarjetas de compartir, el
   sitemap y los datos estructurados apunten a algún lado. En Vercel la
   toma sola del dominio de producción; el día que haya dominio propio,
   se pone NEXT_PUBLIC_SITE_URL en las variables de entorno y no hay que
   tocar nada más. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://visual-solution.vercel.app")
).replace(/[/]$/, "");

/* El dominio sin protocolo, para mostrarlo escrito. */
export const siteHost = siteUrl.replace(/^https?:[/][/]/, "");

/* ============================================================
   LOS DERECHOS
   El año sale del momento de la compilación, no del reloj de quien
   mira: la página es estática, así que si se calculara en el cliente
   habría una diferencia entre lo que sirve el servidor y lo que pinta
   el navegador. Un aviso de copyright marca el año de publicación,
   así que quedar fijo al último deploy es lo correcto.
   ============================================================ */
export const legal = {
  year: new Date().getFullYear(),
  holder: "Visual Solution",
  rights: "Todos los derechos reservados",
  credit: "Diseño y desarrollo propio",
} as const;

export const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const hero = {
  headline: "Donde la idea toca la máquina.",
  /* El reclamo del hero, partido en las dos lineas del afiche. */
  claim: ["Donde la idea", "toca la", "máquina."],
  sub: "Estudio de desarrollo web y producción audiovisual. Un solo equipo para toda tu presencia digital.",
  pick: "Elegí lo que necesitás",
  primaryCta: "Empezar proyecto",
  secondaryCta: "Ver trabajos",
  meta: ["Sitios y tiendas", "Video y fotografía", "Identidad y automatización"],
} as const;


/* ============================================================
   EL CONFIGURADOR DEL HERO
   Las fichas que se arrastran dentro del logo. formValue es el
   valor que recibe el <select> del formulario cuando se elige una
   sola; con dos o mas pasa a 'Varias cosas a la vez'.
   ============================================================ */
export type HeroService = { id: string; code: string; label: string; formValue: string };

export const heroServices: HeroService[] = [
  { id: 'web', code: 'WEB', label: 'Sitio web', formValue: 'Sitio web' },
  { id: 'shop', code: 'SHP', label: 'Tienda online', formValue: 'Tienda online' },
  { id: 'video', code: 'VID', label: 'Video y foto', formValue: 'Contenido audiovisual' },
  { id: 'brand', code: 'IDV', label: 'Identidad', formValue: 'Identidad visual' },
  { id: 'auto', code: 'AUT', label: 'Automatización', formValue: 'Varias cosas a la vez' },
];

export const capabilities = [
  "Sitios a medida",
  "Tiendas online",
  "Landing pages",
  "Video vertical",
  "Fotografía de producto",
  "Motion graphics",
  "Identidad visual",
  "SEO técnico",
  "Automatizaciones",
] as const;

export type Service = {
  id: string;
  title: string;
  body: string;
  token?: string;
  /* TODO: reemplazar por fotos propias en /public */
  image?: { src: string; alt: string };
  tags?: string[];
  span: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "web",
    title: "Desarrollo web a medida",
    body: "Sitios institucionales, landings y aplicaciones. Código propio, rápido, indexable y fácil de editar sin depender de nosotros.",
    image: { src: "https://picsum.photos/seed/visualsolution-code-editor/1000/560", alt: "" },
    tags: ["Next.js", "React", "WordPress", "Integraciones"],
    span: "xl:col-span-6",
  },
  {
    id: "tiendas",
    title: "Tiendas online",
    body: "Catálogo, medios de pago, envíos y stock. Montamos la tienda y dejamos el flujo de venta funcionando de punta a punta.",
    token: "SHP",
    tags: ["Shopify", "WooCommerce", "Mercado Pago"],
    span: "xl:col-span-6",
    featured: true,
  },
  {
    id: "audiovisual",
    title: "Producción audiovisual",
    body: "Guion, rodaje y edición. Piezas cortas para redes, videos de producto y material institucional.",
    image: { src: "https://picsum.photos/seed/visualsolution-camera-rig/800/450", alt: "" },
    span: "xl:col-span-5",
  },
  {
    id: "identidad",
    title: "Identidad visual",
    body: "Logo, paleta, tipografía y las plantillas para que todo el equipo publique parejo.",
    token: "IDV",
    span: "xl:col-span-4",
  },
  {
    id: "automatizacion",
    title: "Automatización",
    body: "Formularios, chatbots y reportes conectados a las herramientas que ya usás.",
    token: "AUT",
    span: "xl:col-span-3",
  },
];

/* Las tres disciplinas del estudio. Con pocos proyectos un filtro no
   sirve para filtrar, pero sí para decir de una qué se hace acá:
   páginas web, tiendas online y software a medida. */
export const workFilters = [
  { id: "todos", label: "Todo" },
  { id: "web", label: "Desarrollo web" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "software", label: "Software" },
] as const;

export type Fact = { label: string; value: string };
export type Chapter = { title: string; body: string; image?: string };

export type Work = {
  id: string;
  title: string;
  /* Qué clase de trabajo es. Se lee debajo del nombre en la tarjeta. */
  kind: string;
  year: string;
  category: string;
  alt: string;
  /* El sitio en vivo. Con url la tarjeta abre el proyecto en una pestaña
     nueva; sin ella —una app descargable, un trabajo que todavía no está
     publicado— la acción lleva a la ficha. */
  url?: string;
  /* La captura del proyecto, en /public/trabajos. Es opcional a
     propósito: sin archivo la tarjeta dibuja una plancha con el nombre
     en vez de una imagen rota. */
  preview?: string;
  /* Sólo lo que está confirmado. Un stack que no se verificó no va. */
  tech?: string[];
  /* Dos líneas para la tarjeta del catálogo. */
  short?: string;
  /* Mientras falte la información real, la ficha se muestra como lo que
     es: en preparación. Nunca se rellena con datos inventados. */
  pending?: boolean;
  /* Frase corta. Se lee bajo el título en la portada del caso. */
  summary?: string;
  /* Datos duros del proyecto. Sin esto se arman solos con kind y year. */
  facts?: Fact[];
  /* La historia. Un proyecto con capítulos abre el caso completo; sin
     ellos abre una ficha compacta, que también se ve terminada. */
  chapters?: Chapter[];
  /* Imágenes sueltas al pie del caso, en una tira que se desliza. */
  gallery?: string[];
};

export const works: Work[] = [
  {
    id: "neweb",
    title: "NEWEB",
    kind: "Web interactiva",
    year: "2026",
    category: "web",
    url: "https://neweb-two.vercel.app",
    /* Cuando tengas la captura: guardala en public/trabajos/neweb.webp
       (1600×1000 sirve) y descomentá la línea de abajo. Mientras tanto
       la tarjeta dibuja la plancha del sistema con el nombre, que es
       material de marca y no una imagen rota. */
    // preview: "/trabajos/neweb.webp",
    alt: "Portada del sitio NEWEB, una experiencia web sobre el sistema solar",
    /* Lo único que se afirma acá está verificado contra el sitio en
       vivo: las secciones, las piezas y el stack salen de la página,
       no de una suposición. */
    tech: ["Next.js", "React", "Animación", "Diseño responsive"],
    short:
      "Una experiencia web inmersiva para recorrer el sistema solar: planetas, comparador, línea de tiempo y datos del universo.",
    summary:
      "Un sitio de exploración espacial construido como experiencia: se recorre, se compara y se descubre. Todo el peso está puesto en el diseño, la interacción y el ritmo de lectura.",
    facts: [
      { label: "Tipo", value: "Experiencia web interactiva" },
      { label: "Stack", value: "Next.js · React" },
      { label: "Idioma", value: "Español" },
      { label: "Estado", value: "En línea" },
    ],
    chapters: [
      {
        title: "Qué es",
        body: "Una web de divulgación sobre el sistema solar y la exploración espacial, pensada como recorrido y no como enciclopedia. La navegación se divide en Planetas, Descubrimientos, Universo y Datos, y cada sección tiene su propia forma de mostrarse.",
      },
      {
        title: "Qué se puede hacer",
        body: "Explorar cada planeta con su ficha de información, compararlos entre sí, recorrer una línea de tiempo de los grandes descubrimientos espaciales y entrar en las secciones de agujeros negros, nebulosas, exoplanetas y galaxias. Hay además datos del universo y una galería de imágenes.",
      },
      {
        title: "Cómo está hecho",
        body: "Next.js y React. El trabajo fuerte está en la experiencia: tipografía a escala de cartel, animaciones que acompañan el scroll y una puesta oscura y cinematográfica que sostiene el tema sin tapar la información.",
      },
    ],
  },
  {
    id: "pack-distribuidora",
    title: "Pack Distribuidora",
    kind: "E-commerce / Catálogo web",
    year: "2026",
    category: "ecommerce",
    url: "https://packdistribuidoraar.vercel.app",
    /* Captura: public/trabajos/pack-distribuidora.webp */
    // preview: "/trabajos/pack-distribuidora.webp",
    alt: "Portada del sitio de Pack Distribuidora, catálogo de productos descartables",
    tech: ["Next.js", "Turbopack", "Catálogo", "Carrito"],
    short:
      "Catálogo comercial para una distribuidora de descartables: diez categorías, buscador, combos y precios, con la venta minorista y mayorista en el mismo lugar.",
    summary:
      "Un catálogo pensado para vender: encontrar el producto rápido, ver el precio y armar el pedido sin fricción, tanto para un cliente de mostrador como para un mayorista.",
    facts: [
      { label: "Rubro", value: "Distribución de descartables" },
      { label: "Tipo", value: "Catálogo / e-commerce" },
      { label: "Stack", value: "Next.js · Turbopack" },
      { label: "Estado", value: "En línea" },
    ],
    chapters: [
      {
        title: "El encargo",
        body: "Una distribuidora de productos descartables que necesitaba mostrar su catálogo completo y atender dos públicos a la vez: el comprador minorista y el mayorista, que buscan cosas distintas y compran de forma distinta.",
      },
      {
        title: "Qué resuelve",
        body: "Diez categorías —bandejas y envases, bolsas, cubiertos, film, platos, limpieza, eventos, gastronomía, servilletas y vasos—, buscador de productos, destacados, ofertas y combos armados con el ahorro a la vista. Suma carrito, información de envíos, preguntas frecuentes y contacto.",
      },
      {
        title: "Cómo está hecho",
        body: "Next.js con Turbopack. Todo el diseño está orientado a la venta: la ruta desde que alguien entra hasta que encuentra lo que busca es lo más corta posible, y el sitio funciona igual de bien en el mostrador que en un teléfono.",
      },
    ],
  },
  {
    id: "app-visual",
    title: "App Visual",
    kind: "Software / Aplicación",
    year: "2026",
    category: "software",
    /* Sin url: no hay enlace público todavía, así que la tarjeta lleva
       a la ficha en vez de a un sitio externo. */
    /* Captura o mockup: public/trabajos/app-visual.webp */
    // preview: "/trabajos/app-visual.webp",
    alt: "App Visual, aplicación de escritorio desarrollada por Visual Solution",
    /* TODO — PENDIENTE DE INFORMACIÓN.
       Acá NO hay nada inventado a propósito: todavía no se sabe qué
       hace la aplicación. En cuanto llegue la información hay que
       completar short, summary, tech, facts y chapters, y agregar
       `url` o `download` si hay enlace. Mientras tanto la tarjeta se
       muestra como "en preparación", que es la verdad. */
    pending: true,
    short: "Aplicación descargable desarrollada por el estudio. Ficha en preparación.",
    summary: "Ficha en preparación.",
    facts: [
      { label: "Tipo", value: "Aplicación descargable" },
      { label: "Desarrollo", value: "Visual Solution" },
      { label: "Estado", value: "Ficha en preparación" },
    ],
  },
];

export const steps = [
  {
    n: "01",
    title: "Entendemos el negocio",
    body: "Una reunión para saber qué vendés, a quién y contra quién competís. De ahí sale el alcance, el presupuesto cerrado y la fecha de entrega.",
  },
  {
    n: "02",
    title: "Diseñamos la pieza",
    body: "Mostramos el diseño completo antes de escribir código. Lo revisamos juntos hasta que esté aprobado, sin sorpresas después.",
  },
  {
    n: "03",
    title: "Programamos y producimos",
    body: "Desarrollo, rodaje y edición en paralelo. Vas viendo avances reales en un enlace privado, no capturas sueltas.",
  },
  {
    n: "04",
    title: "Lanzamos y medimos",
    body: "Publicación, analítica configurada y una capacitación grabada para que tu equipo cargue contenido solo. Después seguimos con soporte.",
  },
] as const;

/* TODO: ajustar plazos y forma de pago a como trabajás realmente. */
export const faqs = [
  {
    q: "¿Cuánto tarda un proyecto?",
    a: "Una landing sale en dos semanas. Un sitio institucional, entre cuatro y seis. Una tienda depende del tamaño del catálogo. La fecha queda cerrada antes de empezar, no sobre la marcha.",
  },
  {
    q: "¿Cómo cobran?",
    a: "Presupuesto cerrado por proyecto, en dos pagos: uno al aprobar el diseño y otro al publicar. Sin horas sueltas ni adicionales que aparecen al final.",
  },
  {
    q: "¿El código y las cuentas quedan a mi nombre?",
    a: "Sí. El dominio, el hosting y el repositorio se abren a tu nombre desde el primer día. Si algún día seguís sin nosotros, no perdés nada.",
  },
  {
    q: "¿Puedo editar el contenido después?",
    a: "Sí. Dejamos un panel de carga y una capacitación grabada para que tu equipo publique novedades, productos o fotos sin tocar código.",
  },
  {
    q: "¿Trabajan a distancia?",
    a: "Sí. Todo el proceso va por videollamada y un enlace privado donde seguís los avances. Para rodajes y fotos coordinamos la locación.",
  },
] as const;

export const serviceOptions = [
  "Sitio web",
  "Tienda online",
  "Contenido audiovisual",
  "Identidad visual",
  "Varias cosas a la vez",
] as const;
