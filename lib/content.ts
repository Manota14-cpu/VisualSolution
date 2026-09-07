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

export const nav = [
  { href: "#servicios", label: "Servicios" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#proceso", label: "Proceso" },
  { href: "#preguntas", label: "Preguntas" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const hero = {
  headline: "Programamos tu sitio. Producimos tu contenido.",
  sub: "Estudio de desarrollo web y producción audiovisual. Un solo equipo para toda tu presencia digital.",
  primaryCta: "Empezar proyecto",
  secondaryCta: "Ver trabajos",
  meta: ["Sitios y tiendas", "Video y fotografía", "Identidad y automatización"],
} as const;

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

export const workFilters = [
  { id: "todos", label: "Todos" },
  { id: "sitios", label: "Sitios" },
  { id: "tiendas", label: "Tiendas" },
  { id: "contenido", label: "Contenido" },
  { id: "identidad", label: "Identidad" },
] as const;

export type Work = {
  id: string;
  title: string;
  kind: string;
  year: string;
  category: string;
  span: string;
  ratio: string;
  thumb: string;
  full: string;
  alt: string;
};

/* TODO: reemplazar por proyectos reales. Los nombres, rubros y fotos
   son de relleno para mostrar la estructura. */
export const works: Work[] = [
  {
    id: "casa-ferran",
    title: "Casa Ferrán",
    kind: "Sitio web y reservas",
    year: "2025",
    category: "sitios",
    span: "xl:col-span-6",
    ratio: "aspect-[16/10]",
    thumb: "https://picsum.photos/seed/visualsolution-work-restaurant/1100/690",
    full: "https://picsum.photos/seed/visualsolution-work-restaurant/1600/1000",
    alt: "Sitio web del restaurante Casa Ferrán",
  },
  {
    id: "talleres-bravo",
    title: "Talleres Bravo",
    kind: "Tienda online",
    year: "2025",
    category: "tiendas",
    span: "xl:col-span-6",
    ratio: "aspect-[16/10]",
    thumb: "https://picsum.photos/seed/visualsolution-work-store/1100/690",
    full: "https://picsum.photos/seed/visualsolution-work-store/1600/1000",
    alt: "Tienda online de indumentaria",
  },
  {
    id: "lumen-cafe",
    title: "Lumen Café",
    kind: "Contenido mensual",
    year: "2024",
    category: "contenido",
    span: "xl:col-span-4",
    ratio: "aspect-[4/3]",
    thumb: "https://picsum.photos/seed/visualsolution-work-coffee/800/600",
    full: "https://picsum.photos/seed/visualsolution-work-coffee/1400/1050",
    alt: "Contenido vertical para una cafetería",
  },
  {
    id: "nordelta-padel",
    title: "Nordelta Padel",
    kind: "App de reservas",
    year: "2024",
    category: "sitios",
    span: "xl:col-span-4",
    ratio: "aspect-[4/3]",
    thumb: "https://picsum.photos/seed/visualsolution-work-padel/800/600",
    full: "https://picsum.photos/seed/visualsolution-work-padel/1400/1050",
    alt: "Aplicación de reservas de canchas",
  },
  {
    id: "estudio-mirasol",
    title: "Estudio Mirasol",
    kind: "Identidad visual",
    year: "2024",
    category: "identidad",
    span: "xl:col-span-4",
    ratio: "aspect-[4/3]",
    thumb: "https://picsum.photos/seed/visualsolution-work-studio-brand/800/600",
    full: "https://picsum.photos/seed/visualsolution-work-studio-brand/1400/1050",
    alt: "Sistema de identidad visual aplicado a papelería",
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
