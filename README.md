# Visual Solution

Sitio del estudio. Next.js 15 (App Router) + React 19 + Tailwind v4.

El sistema visual es **Tinta Azul**, definido en `DESIGN.md`: una sola tinta
azul en tres fuerzas sobre papel claro, tipografía comprimida ultrabold hasta
189px y cero sombras. En el hero, el papel con la trama de puntos azules y el
monograma VS impreso en azul a escala arquitectónica y fuera de registro: dos
tintas corridas que el puntero abre y cierra.

```
app/
  layout.tsx        metadata, tipografías, elementos fijos
  page.tsx          compone las secciones
  globals.css       tokens de Tailwind, componentes y capa de movimiento
components/
  brand/            el símbolo VS, plano y como plancha de impresión
DESIGN.md           el sistema de diseño, tal como lo mandó el cliente
design/             sus tokens: variables.css, theme.css y tokens.json
  motion/           capa global de movimiento, revelados, elementos fijos
  site/             las secciones de la página
lib/
  content.ts        TODO el texto y los datos del sitio
  motion.ts         base compartida: preferencias, scroll, bucle de rAF
public/             logo.svg, íconos de la pestaña, video del hero
legacy/             la versión anterior en HTML plano, por si hace falta
```

## Trabajar en el sitio

```bash
npm install
npm run dev
```

Abre en http://localhost:3000. Para probar el resultado real de producción:

```bash
npm run build && npm start
```

## Publicarlo

**Vercel** es la opción directa: importás el repo y no hay nada que
configurar. Detecta Next solo y mantiene la optimización de imágenes.

**GitHub Pages** necesita export estático, porque no corre Node. Agregá a
`next.config.mjs`:

```js
output: 'export',
images: { unoptimized: true },
```

y publicá la carpeta `out/`. Perdés la optimización automática de imágenes,
así que conviene subir las fotos ya comprimidas.

> Si tenías GitHub Pages apuntando a la raíz del repo sirviendo el
> `index.html` viejo, eso dejó de funcionar: ahora ese archivo está en
> `legacy/`. Usá Vercel, o hacé el export estático de arriba.

---

## Antes de publicar: lo que falta reemplazar

Está todo junto en `lib/content.ts`, marcado con `TODO`.

1. **Los cinco proyectos del catálogo.** Casa Ferrán, Talleres Bravo,
   Lumen Café, Nordelta Padel y Estudio Mirasol son de relleno, con fotos de
   picsum.photos. Cambiá nombres, rubros, años y las dos URLs de cada uno
   (`thumb` para la grilla, `full` para el visor).

2. **Las fotos de servicios.** Dos tarjetas usan picsum. Poné archivos tuyos
   en `public/` y referencialos como `/mi-foto.jpg`.

3. **Los datos de contacto.** `hola@visualsolution.com` y `@visualsolution`
   son placeholders, en el objeto `site`.

4. **Las respuestas de Preguntas.** Los plazos y la forma de pago los escribí
   como borrador razonable. Ajustalos a como trabajás de verdad.

Cuando las fotos sean todas propias, se puede borrar el bloque
`remotePatterns` de `next.config.mjs`.

## El formulario

Sin backend arma un correo con los datos y abre el cliente de mail.
Para que envíe de verdad, poné la URL de Formspree, Getform o tu API en
`site.formEndpoint` dentro de `lib/content.ts`. Con eso pasa a mandar un POST
con JSON, y quedan activos la barra de carga y el mensaje de error.

## El logo

El símbolo VS vive en dos lugares que hay que mantener juntos si alguna vez
lo rediseñás:

- **Marca plana:** `MARK_PATH` en `components/brand/Mark.tsx`. Es el mismo
  `path` que `public/logo.svg`, en un viewBox de 143.5 x 76. Lo usan la barra,
  el pie, el botón de volver arriba y el preloader.
- **Íconos de la pestaña:** `public/favicon-32.png`, `favicon-48.png`, `favicon.ico` y
  `apple-touch-icon.png` (180px), generados desde la pieza del VS azul sobre
  papel cuadriculado. Los chicos van recortados más cerca de la marca.

## Sistema de diseño

El sistema es **Tinta Azul**. Reemplazó en septiembre de 2026 a **Caldera**
(lienzo negro, magenta y violeta), que fue el sistema con el que el cliente
arrancó. Cambió sólo el color: tipografía, radios, espaciado y la regla de cero
sombras siguen iguales.

- `DESIGN.md` — la referencia larga y la fuente de verdad: roles de cada color,
  los pares que se midieron, los do's y don'ts, cada componente y los motivos
  firma.
- `design/variables.css`, `design/theme.css` y `design/tokens.json` son los
  archivos originales de Caldera que mandó el cliente. Quedan como historia:
  nada del sitio los importa.

`app/globals.css` define los tokens en su bloque `@theme`. **Si hay que cambiar
un color, se cambia ahí y en `DESIGN.md`**, y en `lib/og.ts`, que dibuja la
tarjeta para compartir en el servidor y no puede leer variables de CSS.

Tinta azul sobre papel. El lienzo es claro y todo lo que pesa —texto, logo,
acción— va en el azul corporativo.

- **Superficies:** fondo `#EAF0F6` de punta a punta, papel `#FFFFFF` para
  tarjetas, campos y la píldora de la nav. El azul `#0036A5` pleno aparece como
  **bandas**: la marquesina, el cierre, el servicio abierto y el pie. Así el
  color de la marca tiene peso y el sitio no queda pálido.
- **Texto:** azul `#0036A5` para todo lo que se apoya sobre el lienzo o el
  papel (8.8:1 y 10.1:1). Lo secundario baja a 80–85% de opacidad, nunca menos:
  al 70% mide 4.3:1, apenas debajo de AA. Sobre las bandas azules, papel.
- **Acentos:** azul medio `#155BCD` para las barras de las cabeceras, los hovers,
  la línea del proceso y los anillos de foco (5.4:1 sobre el lienzo).
- **Etiquetas:** bruma `#AECDED` con texto azul. Es el único elemento teñido.
- **Imágenes y maquetas:** el degradado `#0036A5 → #155BCD → #AECDED`, con la
  bruma en la punta para que el texto blanco se apoye sobre el tramo azul.
- **Error:** `#C62828`, sólo en la validación del formulario. Es el único color
  que no es tinta: un borde azul no avisa que algo está mal.
- **Tipografía:** Anton para el display, que es el sustituto libre de
  PP Neue Corp Compact (la original es de pago; `DESIGN.md` la nombra junto a
  Bebas Neue y Druk Wide Bold). Va de 26px a 189px con tracking **positivo**
  de +0.02em: a esa escala los trazos gruesos se chocan sin él. DM Sans para
  todo lo demás, **siempre en 500** — en 400 se ve anémica al lado del display
  y en 700 le compite. Las sirve `next/font` desde el propio dominio.
- **Radios, el sistema de tres:** 100px los campos, 40px las tarjetas y los
  botones rectangulares, píldora completa el resto.
- **Elevación:** ninguna. Ni una sombra en todo el sitio. La jerarquía se arma
  con contraste de valor: lienzo → papel → azul.
- **Divisores:** punteados de 1.5px, nunca rayados ni llenos.
- **Layout:** 1280px de ancho máximo, 80px entre secciones, 40px de relleno
  de tarjeta.

### Las tres reglas que no se negocian

1. Ni una sombra.
2. Una sola tinta en tres fuerzas: azul, azul medio y bruma. El rojo existe
   sólo para decir "esto está mal".
3. Nunca texto blanco sobre bruma (1.65:1) ni azul sobre azul medio (1.65:1).
   Todo lo demás pasa AA: se midió antes de elegir.

Las reglas de componentes (`.btn`, `.chip`, `.nav-link`, `.field-input`) van
**dentro** de `@layer components`. Es importante: lo que queda fuera de una capa
le gana a las utilidades de Tailwind, y entonces `md:hidden` deja de funcionar
sobre cualquier componente que fije `display`. Ya pasó dos veces.

### Los motivos firma

1. **La trama de puntos** (`.halftone`): tinta azul sobre papel claro, bruma
   abajo a la izquierda que se abre hacia el lienzo arriba a la derecha. Va
   siempre a escala de hero. Es lo más reconocible del sistema.
2. **El titular a 189px**, con interlineado 0.94.
3. **El sistema de tres radios**, que da redondez sin monotonía.

## Compartir y ser encontrado

Lo que se ve cuando alguien pega el enlace en WhatsApp, en un DM de Instagram
o en LinkedIn. Es lo primero que ve la mayoría de la gente que llega al sitio,
y para un estudio que vende que las cosas se vean bien, una tarjeta vacía
resta.

- **La tarjeta se genera de la misma plancha que el hero** (`app/opengraph-image.tsx`
  y `lib/og.ts`): el degradado, el monograma fuera de registro y el reclamo en
  Anton, armados con `ImageResponse` en build. Compartir el sitio es compartir
  un afiche.
- **Una tarjeta por proyecto** (`app/trabajos/[slug]/opengraph-image.tsx`). Antes
  se compartía `work.full`, que hoy es una foto de relleno de picsum: el enlace
  mostraba una imagen que no era del proyecto.
- **La trama de puntos NO va en la tarjeta.** Se ve casi siempre a unos 300px de
  ancho en un chat, y a esa escala una retícula de 16px se vuelve papilla gris.
  El motivo firma no sobrevive al medio; el degradado, el monograma y el titular
  sí.
- **La tarjeta sigue la lógica del hero**: papel claro con el monograma en azul,
  y el reclamo en azul mordiendo la plancha. El sello va en azul pleno con
  letra de papel, que es el único peso en la esquina donde la plancha se aclara.
- Las dos caras del sistema se bajan de Google en build. Si el pedido falla, la
  tarjeta se arma igual con la tipografía que trae el generador: vale más una
  tarjeta con otra tipografía que ninguna.
- `metadataBase` —sin él, cualquier ruta relativa de las tarjetas queda sin
  resolver—, canónicas, `summary_large_image` para X, plantilla de título,
  `sitemap.xml` y `robots.txt` generados desde el contenido, y datos
  estructurados (`ProfessionalService` con el catálogo de servicios) para que un
  buscador entienda que esto es un estudio y no un blog. Sólo se afirma lo que
  es verdad: nada de dirección, teléfono ni reseñas inventadas.
- **La URL pública** es `https://visual-solution.vercel.app`. Sale de
  `NEXT_PUBLIC_SITE_URL`; en Vercel se toma sola del dominio de producción, así
  que el día que haya dominio propio no hay que tocar código.
- **Los derechos** viven en `legal` dentro de `lib/content.ts`: el aviso del pie,
  `copyrightHolder` y `copyrightYear` en los datos estructurados, y `author`,
  `creator` y `publisher` en los metadatos salen todos de ahí. El año se calcula
  en la compilación y no en el reloj de quien mira: la página es estática, y un
  aviso de copyright marca el año de publicación, así que quedar fijo al último
  deploy es lo correcto. El `LICENSE` de la raíz reserva todos los derechos
  sobre el código, los textos y la identidad.

## Animación

El movimiento acompaña, no protagoniza: el sistema es plano y editorial.

**Capa global** (`components/motion/MotionProvider.tsx`)

- Scroll con inercia (Lenis). Mueve el scroll real del documento, así que
  `position:sticky`, los anclas y la barra de progreso siguen funcionando.
- Barra de progreso de lectura (`animation-timeline: scroll()`, se oculta sola
  donde el navegador no la soporta).
- Preloader: el símbolo se dibuja trazo por trazo. Solo la primera visita de
  cada sesión.
- Header con micro rebote del logo la primera vez que se despega del borde.

**Hero**

- **Desde septiembre de 2026 el hero es un video** (`components/site/Hero.tsx`):
  alguien trabajando en una terraza sobre las nubes
  (`public/video/manotacielo.mp4`, con póster del primer cuadro), el nombre
  "Visual Solution" a escala de cartel abajo a la izquierda con las palabras
  que suben (`components/ui/words-pull-up.tsx`, de framer-motion) y, a la
  derecha, un panel de vidrio azul con el reclamo, las etiquetas y los
  botones de metal. La estructura viene de un hero de 21st.dev; contenido,
  colores y navegación son los de Visual.
- El monograma va en el cielo como marca de agua (`.hero-marca`, blanco
  translúcido en `overlay`), alineado con el título para armar el logotipo
  completo. Se mide para no tocar nunca el nombre: en teléfonos de menos de
  720px de alto se oculta, porque no queda lugar entre la nav y el título.
- El panel existe por contraste: sobre una nube blanca, el texto chico en
  blanco necesita al menos 72% de azul detrás para pasar AA (4.9:1).
- Con movimiento reducido el video no corre y queda el póster.
- El video va en dos versiones: la completa (539 KB) y, para teléfonos en
  vertical, la franja central recortada a 9:16 (186 KB), que es lo único que
  se ve ahí. El original pesaba 3.8 MB; se recodificó sin diferencia visible
  (SSIM 0.986).
- La plancha de impresión que se describe abajo fue el hero anterior. Sus
  componentes (`Plate.tsx`, `Press.tsx`) y su CSS se eliminaron; quedan en el
  historial de git.

- El giro es una **plancha de impresión** (`components/brand/Plate.tsx`): el
  papel con la trama encima y el monograma VS impreso en azul a escala
  arquitectónica. Es el único lugar del sitio donde la marca aparece a este
  tamaño.
- **El titular muerde el papel pero no toca la marca.** Los dos son del mismo
  azul: si se pisan, las letras se funden con el trazo de la S. Por eso el
  monograma va arriba y con alto explícito derivado de la banda (un
  `max-height` en porcentaje ahí es circular y no limita nada). Medido en el
  peor momento de la deriva por scroll, de 300 a 540px de banda, quedan entre
  50 y 200px de aire.
- Debajo del azul hay dos copias del mismo monograma, una en azul medio y una
  en bruma, corridas en direcciones opuestas. Eso es un **fuera de registro**:
  el error clásico de la impresión en varias tintas, cuando las planchas no
  se alinean y los colores asoman por los bordes.
- El corrimiento lo maneja el puntero —cuanto más lejos del centro, más se
  abren las tintas— y cada servicio elegido lo abre un poco más. Todo cuelga
  de tres custom properties del contenedor: ni un render de React por
  movimiento. Sin puntero fino, o con movimiento reducido, el registro queda
  apenas abierto y quieto, porque la plancha tiene que leerse sin que nadie
  mueva nada.
- **El corrimiento va en unidades del `viewBox`**, que se escalan con la
  marca: cinco unidades sobre 143.5 son más de veinte píxeles en pantalla.
  Si algún día se cambia el tamaño del monograma, los números de `Plate.tsx`
  se mueven con él y no hay que retocarlos.
- Las etiquetas de servicio viven **debajo del titular**, que es donde alguien
  las busca. Si nadie toca nada, el afiche se lee igual.

**La tesis: las cosas se imprimen**

Todo el movimiento del sitio sale de la misma idea material que el color: tinta
sobre papel. **Nada se desliza, las cosas se imprimen**. Una sola idea material, con un momento
protagonista y el resto en voz baja.

- **La composición del hero es un afiche, no una tarjeta.** La plancha va a
  sangre, de borde a borde de la pantalla, y el reclamo la muerde desde
  abajo, contra el margen izquierdo y con las líneas escalonadas. Imagen y
  tipografía se traban en vez de apilarse: es lo único que separa una
  composición de una plantilla.
- **El giro es una plancha de impresión** (`components/brand/Plate.tsx`):
  el papel con la trama encima y el monograma VS impreso en azul a escala
  arquitectónica. Debajo del azul hay dos copias del mismo monograma, una
  en azul medio y una en bruma, corridas en direcciones opuestas:
  eso es un **fuera de registro**, el error clásico de la impresión en
  varias tintas cuando las planchas no se alinean. Acá es deliberado, lo
  maneja el puntero —cuanto más lejos del centro, más se abren— y cada
  servicio elegido lo abre un poco más. Es el único lugar del sitio donde
  la marca aparece a este tamaño.
- **Las etiquetas van justo debajo del titular**, que es donde alguien las
  busca: son lo que arma la consulta y lo que cambia el botón. Apagada es
  una píldora de papel; elegida se rellena de azul, igual que el filtro
  activo del catálogo y el paso alcanzado del proceso.
- **El momento** es la llegada del hero. El papel se imprime desde el borde de
  abajo (`@keyframes subir`, un `clip-path` que se abre hacia arriba); cuando
  termina aparecen los puntos de la trama. Después cada línea del reclamo entra
  desde abajo de su propia ventana, arrastrada por un filo de azul medio que
  sube con ella y se apaga arriba.
- **La trama es una serigrafía de verdad** (`components/brand/Press.tsx`).
  Un cuadrilátero y un shader, en WebGL crudo: sin una sola dependencia
  nueva y 0,3 kB de bundle. Cada tinta tiene su propio **ángulo de
  pantalla** —15° el azul medio, 75° el azul— que es exactamente lo que
  hace un taller de serigrafía para que las dos retículas no formen muaré
  al superponerse. Los puntos crecen y se achican con la densidad de
  tinta, se abren donde pasa el puntero, y **la velocidad del scroll corre
  una plancha contra la otra**: el fuera de registro del monograma, pero
  en la tinta misma.
- Se imprime un cuadro **antes** de enganchar cualquier bucle: con
  `alpha: false` el lienzo arranca negro opaco y tapa la trama en CSS que
  hay debajo, así que si la primera pintada esperara al primer tick, la
  plancha parpadearía en negro.
- Degrada solo: sin WebGL, o con movimiento reducido pedido por la persona,
  no se monta y queda la trama en CSS, que también deriva y se frena sola al
  salir de pantalla. No hay otro portón: un cuadrilátero con ocho senos por
  píxel no es caro, y exigir más de cuatro núcleos y 768px de ancho dejaba
  afuera a casi todos los teléfonos. En pantallas chicas dibuja a densidad 1.
- **La luz sigue al puntero.** Sobre la plancha, un disco arrastra más puntos
  y más brillo. La máscara viaja con el disco, así que moverlo es una
  transformación y no repinta. Son dos custom properties, no estado.

**Por sección**

- Nav: los seis enlaces comparten una sola píldora de luz que se desliza hasta
  el que tiene el cursor o el foco. Hace legible que son un grupo.
- Cabeceras: una barra corta de azul medio que se dibuja sola al entrar. El mismo
  material que el filo del hero, en voz baja.
- Marquesina: se frena si alguien quiere leerla, y cada capacidad se enciende.
- Servicios: cada pliego abierto se inunda de azul pleno con su trama de
  bruma, y el texto se da vuelta a papel. El monograma suelta un anillo al
  entrar.
- Trabajos: **tres tarjetas, no una grilla de piezas iguales**. Con esta
  cantidad el primero ocupa el ancho completo y los otros dos van a la par,
  así la sección tiene una entrada clara. Cada trabajo se muestra adentro de
  una **ventana de navegador** con su URL real: es lo que dice, sin
  explicarlo, que esto es un sitio que funciona y no una maqueta. La acción
  principal abre el proyecto en vivo en una pestaña nueva; la ficha —con
  capítulos y transición de vista— sigue siendo la segunda puerta, y la
  propia ficha también lleva al sitio, porque quien llega desde un buscador
  no tiene otra forma de alcanzarlo.
- **Las capturas son opcionales a propósito.** Sin archivo en
  `public/trabajos/`, la ventana dibuja la plancha del sistema con el nombre
  del proyecto: material de marca, nunca una imagen rota. Poner la captura es
  dejar el archivo y descomentar una línea en `lib/content.ts`.
- **Nada sin confirmar.** El stack de cada trabajo —Next.js en los dos, más
  Turbopack en Pack— salió de mirar el sitio en vivo, no de suponer. La ficha
  de App Visual se muestra como "en preparación" hasta que haya información
  real: es preferible a inventarla.
- Proceso: la línea se dibuja en azul medio y termina siempre sobre un número; el
  que alcanza suelta el mismo anillo que el monograma.
- Preguntas: la pregunta se corre, el chevrón se enciende y la respuesta sube
  apenas después de abrirse la fila.
- Contacto: etiquetas flotantes, el campo enfocado se enciende desde abajo y el
  botón muta a un tilde dibujado.
- Botones: de metal líquido. Chapa azul, etiqueta en papel, y el metal en el
  canto: dos anillos cónicos girando en sentidos opuestos. El reflejo sigue al
  puntero y el golpe sale de donde se apretó.
- Pie: los enlaces se subrayan desde el lado por el que entra el cursor.
- Volver arriba: el símbolo gira 360° mientras la página sube.

El sangrado de luz de una superficie se anima con `--luz`, declarada con
`@property`: una custom property sin registrar no interpola.

**Reglas que respeta todo lo anterior**

- Con `prefers-reduced-motion: reduce` hay **menos movimiento y más suave**, no
  la ausencia de movimiento: apagar todo también apaga la señal de que algo
  pasó. Se van los bucles y los desplazamientos en el espacio; se quedan el
  color, la opacidad y los cambios de estado, que son los que confirman una
  acción.
- Un solo bucle de `requestAnimationFrame` en `lib/motion.ts` para todo lo
  continuo, que se detiene con la pestaña oculta.
- El hero es SVG y CSS: no hay WebGL, no hay canvas y no hay nada que pueda
  fallar en un equipo viejo. Three.js se fue del proyecto con el logo 3D.

### Dos trampas que ya están resueltas

El nombre de una transición de vista tiene que ser **único en el documento**.
En el catálogo hay dos piezas con la misma foto —el recorte que sigue al
puntero y la tira de cada fila— y sólo una puede llevar el nombre: se lo
asigna la que está visible según haya o no puntero fino. Si lo llevan las
dos, la transición falla entera.

La máscara de `SplitHeading` sólo tenía aire abajo, así que a las mayúsculas
acentuadas les comía la tilde: se leía CATALOGO y COMO. Ahora tiene aire
arriba también, compensado con un margen negativo para no mover el texto.



Dentro de `document.startViewTransition`, un `setState` normal de React no se
aplica a tiempo y la transición captura el DOM viejo: el filtro y el visor
quedan una acción atrasados. Por eso `Works.tsx` usa `flushSync`. Si agregás
otra transición con estado, hacé lo mismo.
