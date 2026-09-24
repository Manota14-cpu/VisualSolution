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
  email: "visualsolutionn@gmail.com",
  instagram: {
    handle: "@visualsolution.com.ar",
    url: "https://www.instagram.com/visualsolution.com.ar/",
  },
  tiktok: "https://www.tiktok.com/@visualsolution_",
  youtube: "https://www.youtube.com/@visualsolution_arg",
  /* El formulario se manda por WhatsApp: abre un chat con este número y la
     consulta ya escrita. Formato internacional sin "+": 54 (Argentina),
     9 (celular: WhatsApp registra así los celulares argentinos; sin el 9
     el enlace suele decir que el número no está en WhatsApp) y 3492 301333.
     Vacío, el formulario vuelve a usar formEndpoint o el correo. */
  whatsapp: "5493492301333",
  /* El mismo número, como se lee. */
  whatsappVisible: "+54 9 3492 30-1333",
  /* Sólo se usa si whatsapp está vacío: la URL de Formspree, Getform o una
     API propia. Si también está vacío, se arma un correo. */
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
  /* Dónde se centra el recorte, como object-position. Las capturas de
     sitios se recortan desde arriba, que es donde está el hero; una pieza
     gráfica necesita su propio punto. */
  previewPosition?: string;
  /* La captura es una pieza gráfica —un afiche cuadrado— y no una
     pantalla. En la portada del caso, que es muy ancha, se muestra entera
     sobre el color de su papel en vez de recortarla hasta perder el
     texto. */
  previewEntera?: { fondo: string };
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

/* Un chat de WhatsApp con el estudio, con el mensaje ya escrito si se
   pasa uno. Lo usan el formulario, el botón flotante, Contacto y el pie. */
export const whatsappUrl = (texto?: string) =>
  `https://wa.me/${site.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

/* La acción del enlace dice adónde lleva: un post de Instagram no es
   "explorar un proyecto". */
export const etiquetaEnlace = (url: string) =>
  /(^|[/.])instagram\.com\//.test(url) ? "Ver en Instagram" : "Explorar proyecto";

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
    preview: "/trabajos/neweb.webp",
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
    preview: "/trabajos/pack-distribuidora.webp",
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
    /* OJO CON EL NOMBRE. El deploy se llama noir-studio-seven, pero el
       sitio que hay ahí se titula "Recuperar el planeta". Se usa el
       nombre real: una tarjeta que dice una cosa y abre otra confunde a
       quien hace clic. Si el proyecto tiene que figurar como Noir
       Studio, es cambiar title. */
    id: "recuperar-el-planeta",
    title: "Recuperar el planeta",
    kind: "Sitio editorial / Infografía",
    year: "2026",
    category: "web",
    url: "https://noir-studio-seven.vercel.app",
    /* Captura: public/trabajos/recuperar-el-planeta.webp */
    preview: "/trabajos/recuperar-el-planeta.webp",
    alt: "Recuperar el planeta, infografía web sobre informática y medio ambiente",
    tech: ["Three.js", "Vanta.js", "Lenis", "Sitio estático"],
    short:
      "Infografía web sobre cómo la informática interviene en la recuperación ambiental: medir, predecir, optimizar y restaurar, con cada cifra citando su fuente y su año.",
    summary:
      "Una pieza editorial de una sola página, construida alrededor de un argumento y no de un listado: cuatro capacidades concretas, tres mediciones con fuente y un circuito que se cierra sobre sí mismo.",
    facts: [
      { label: "Tipo", value: "Infografía editorial" },
      { label: "Stack", value: "Three.js · Vanta · Lenis" },
      { label: "Rigor", value: "Datos con fuente y año" },
      { label: "Estado", value: "En línea" },
    ],
    chapters: [
      {
        title: "El argumento",
        body: "El sitio abre descartando lo obvio —“no se trata de apps ecológicas”— y propone cuatro capacidades concretas: medir, predecir, optimizar y restaurar. Todo lo que sigue sostiene esa tesis en vez de enumerar temas sueltos.",
      },
      {
        title: "Cómo está armado",
        body: "Cuatro frentes desplegados, con tecnologías en uso y mediciones publicadas; tres mediciones que son mediciones y no proyecciones, cada una con el organismo que la publicó y el año; las cuatro fases del circuito; el costo de la propia herramienta, que el sitio no esquiva; y seis preguntas frecuentes que responden las objeciones reales.",
      },
      {
        title: "Cómo está hecho",
        body: "Sitio estático con un fondo animado en Three.js a través de Vanta y scroll con inercia por Lenis. Sin framework: el peso está puesto en que la pieza cargue rápido y se lea de un tirón.",
      },
    ],
  },
  {
    id: "app-visual",
    title: "App Visual",
    kind: "Software / Aplicación",
    year: "2026",
    category: "software",
    /* El post de Instagram que presenta la app. Va sin los parámetros de
       rastreo del enlace copiado (utm_source y stkn, un token de quien lo
       compartió): Instagram abre el mismo post sin ellos. */
    url: "https://www.instagram.com/p/DdkOwO0Dol4/",
    /* La pieza del post. Es cuadrada: en la tarjeta se recorta centrada
       al 52%, que entra justo de "Todo tu" a "En una sola app"; en la
       ficha se ve entera sobre el gris de su papel. */
    preview: "/trabajos/app-visual.webp",
    previewPosition: "50% 52%",
    previewEntera: { fondo: "#E5E6E8" },
    alt: "Pieza de App Visual: «Todo tu negocio en una sola app», con el ícono VA entre dos estrellas",
    /* Todo lo de acá sale del post de Instagram y de la pieza, en las
       palabras del estudio. No se afirma nada más: el stack no está
       publicado, así que no va. */
    short:
      "Stock, caja y ventas en una sola app. Funciona sin internet, los datos quedan en tu computadora y no se paga cuota.",
    summary: "Todo tu negocio en una sola app.",
    facts: [
      { label: "Hace", value: "Stock, caja y ventas" },
      { label: "Para", value: "Kiosco, despensa, panadería o distribuidora" },
      { label: "Funciona", value: "Sin internet, con los datos en tu computadora" },
      { label: "Costo", value: "Sin cuota" },
      { label: "Estado", value: "Disponible" },
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
