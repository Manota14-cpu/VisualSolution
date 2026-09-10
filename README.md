# Visual Solution

Sitio del estudio. Next.js 15 (App Router) + React 19 + Tailwind v4.

El sistema visual es **Caldera**, definido en `DESIGN.md` y en `design/`:
negro total, magenta y violeta como únicas luces, tipografía comprimida
ultrabold hasta 189px y cero sombras. En el hero, el bloque de trama de
puntos con el monograma VS calado en negro a escala arquitectónica y fuera
de registro: dos tintas corridas que el puntero abre y cierra.

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
public/             logo.svg y favicon.svg
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
- **Favicon:** `public/favicon.svg`.

## Sistema de diseño

El sistema es **Caldera** y está definido, entero, en cuatro archivos que
mandó el cliente y que son la fuente de verdad:

- `DESIGN.md` — la referencia larga: roles de cada color, los do's y don'ts,
  la descripción de cada componente y los motivos firma.
- `design/variables.css` — los tokens como custom properties.
- `design/theme.css` — los mismos tokens en el bloque `@theme` de Tailwind v4.
- `design/tokens.json` — los mismos, en JSON.

`app/globals.css` copia esos valores tal cual. **Si hay que cambiar un color o
un radio, se cambia primero en esos archivos.**

Neón prensado contra obsidiana: el lienzo es negro total y cada elemento
magenta o violeta se lee como luz que sube desde abajo de la superficie.

- **Superficies:** ónix `#000000` de punta a punta, carbón `#18151E` para
  tarjetas y bloques de contenido, magenta `#EC4899` para lo destacado y
  violeta `#8B5CF6` para una sola tarjeta y el bloque del hero.
- **Texto:** tiza `#FFFFFF` para absolutamente todo lo que se apoya sobre el
  lienzo. Lo secundario baja opacidad (70% y 55%), que no es un color nuevo.
  Obsidiana `#070607` existe solo para escribir **encima** de un relleno
  brillante: magenta, violeta o tinte. Nunca sobre el negro.
- **Etiquetas:** tinte violeta `#C4B5FD` con texto obsidiana. Es el único
  elemento teñido de todo el sistema.
- **Tipografía:** Anton para el display, que es el sustituto libre de
  PP Neue Corp Compact (la original es de pago; `DESIGN.md` la nombra junto a
  Bebas Neue y Druk Wide Bold). Va de 26px a 189px con tracking **positivo**
  de +0.02em: a esa escala los trazos gruesos se chocan sin él. DM Sans para
  todo lo demás, **siempre en 500** — en 400 se ve anémica al lado del display
  y en 700 le compite. Las sirve `next/font` desde el propio dominio.
- **Radios, el sistema de tres:** 100px los campos, 40px las tarjetas y los
  botones rectangulares, píldora completa el resto.
- **Elevación:** ninguna. Ni una sombra en todo el sitio. La jerarquía se arma
  con contraste de color: negro → carbón → magenta.
- **Divisores:** punteados de 1.5px, nunca rayados ni llenos.
- **Layout:** 1280px de ancho máximo, 80px entre secciones, 40px de relleno
  de tarjeta.

### Las tres reglas que no se negocian

1. Ni una sombra.
2. Solo magenta y violeta como acentos, más el tinte violeta para etiquetas.
   Ningún color más — el rojo de error también es magenta.
3. El violeta no se usa para controles. Es superficie del hero, efecto y una
   sola tarjeta destacada. Los botones son magenta.

Las reglas de componentes (`.btn`, `.chip`, `.nav-link`, `.field-input`) van
**dentro** de `@layer components`. Es importante: lo que queda fuera de una capa
le gana a las utilidades de Tailwind, y entonces `md:hidden` deja de funcionar
sobre cualquier componente que fije `display`. Ya pasó dos veces.

### Los motivos firma

1. **La trama de puntos** (`.halftone`): puntos magenta sobre un degradado
   violeta→magenta que termina en magenta pleno arriba a la derecha. Va
   siempre a escala de hero y con 40px de radio. Es lo más reconocible del
   sistema.
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
- **El sello va en obsidiana y no en magenta**: arriba a la derecha la plancha ya
  *es* magenta, y un sello magenta sobre magenta no se ve.
- Las dos caras del sistema se bajan de Google en build. Si el pedido falla, la
  tarjeta se arma igual con la tipografía que trae el generador: vale más una
  tarjeta con otra tipografía que ninguna.
- `metadataBase` —sin él, cualquier ruta relativa de las tarjetas queda sin
  resolver—, canónicas, `summary_large_image` para X, plantilla de título,
  `sitemap.xml` y `robots.txt` generados desde el contenido, y datos
  estructurados (`ProfessionalService` con el catálogo de servicios) para que un
  buscador entienda que esto es un estudio y no un blog. Sólo se afirma lo que
  es verdad: nada de dirección, teléfono ni reseñas inventadas.
- **La URL pública** sale de `NEXT_PUBLIC_SITE_URL`; en Vercel se toma sola del
  dominio de producción. El respaldo está marcado con TODO en `lib/content.ts`.

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

- El giro es una **plancha de impresión** (`components/brand/Plate.tsx`): el
  degradado con la trama encima y el monograma VS calado en negro a escala
  arquitectónica. Es el único lugar del sitio donde la marca aparece a este
  tamaño.
- Debajo del negro hay dos copias del mismo monograma, una magenta y una
  violeta, corridas en direcciones opuestas. Eso es un **fuera de registro**:
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

**La tesis: la luz sube desde abajo del negro**

`DESIGN.md` dice que cada elemento magenta o violeta se lee como luz que sube
desde abajo de la superficie. Eso es todo el movimiento del sitio: **nada se
desliza, las cosas se encienden**. Una sola idea material, con un momento
protagonista y el resto en voz baja.

- **La composición del hero es un afiche, no una tarjeta.** La plancha va a
  sangre, de borde a borde de la pantalla, y el reclamo la muerde desde
  abajo, contra el margen izquierdo y con las líneas escalonadas. Imagen y
  tipografía se traban en vez de apilarse: es lo único que separa una
  composición de una plantilla.
- **El giro es una plancha de impresión** (`components/brand/Plate.tsx'):
  el degradado con la trama encima y el monograma VS calado en negro a
  escala arquitectónica. Debajo del negro hay dos copias del mismo
  monograma, una magenta y una violeta, corridas en direcciones opuestas:
  eso es un **fuera de registro**, el error clásico de la impresión en
  varias tintas cuando las planchas no se alinean. Acá es deliberado, lo
  maneja el puntero —cuanto más lejos del centro, más se abren— y cada
  servicio elegido lo abre un poco más. Es el único lugar del sitio donde
  la marca aparece a este tamaño.
- **Las etiquetas van justo debajo del titular**, que es donde alguien las
  busca: son lo que arma la consulta y lo que cambia el botón. Apagada es
  una píldora de carbón; elegida se rellena de magenta, igual que el filtro
  activo del catálogo y el paso alcanzado del proceso.
- **El momento** es la llegada del hero. El bloque arranca negro y la luz sube
  por debajo (`@keyframes subir`, un `clip-path` que se abre desde el borde de
  abajo); cuando termina se encienden los puntos de la trama. Después cada
  línea del reclamo entra desde abajo de su propia ventana, arrastrada por un
  filo de magenta que sube con ella y se apaga arriba.
- **La trama es una serigrafía de verdad** (`components/brand/Press.tsx`).
  Un cuadrilátero y un shader, en WebGL crudo: sin una sola dependencia
  nueva y 0,3 kB de bundle. Cada tinta tiene su propio **ángulo de
  pantalla** —15° el magenta, 75° el violeta— que es exactamente lo que
  hace un taller de serigrafía para que las dos retículas no formen muaré
  al superponerse. Los puntos crecen y se achican con la densidad de
  tinta, se abren donde pasa el puntero, y **la velocidad del scroll corre
  una plancha contra la otra**: el fuera de registro del monograma, pero
  en la tinta misma.
- Se imprime un cuadro **antes** de enganchar cualquier bucle: con
  `alpha: false` el lienzo arranca negro opaco y tapa la trama en CSS que
  hay debajo, así que si la primera pintada esperara al primer tick, la
  plancha parpadearía en negro.
- Degrada solo: sin WebGL no se monta nada, y en equipos de cuatro núcleos
  o menos y en pantallas de menos de 768px tampoco. Queda la trama en CSS,
  que deriva un mosaico completo cada veintiséis segundos y se frena sola
  al salir de pantalla. En un celular el costo de GPU es cero.
- **La luz sigue al puntero.** Sobre la plancha, un disco arrastra más puntos
  y más brillo. La máscara viaja con el disco, así que moverlo es una
  transformación y no repinta. Son dos custom properties, no estado.

**Por sección**

- Nav: los seis enlaces comparten una sola píldora de luz que se desliza hasta
  el que tiene el cursor o el foco. Hace legible que son un grupo.
- Cabeceras: una barra corta de magenta que se dibuja sola al entrar. El mismo
  material que el filo del hero, en voz baja.
- Marquesina: se frena si alguien quiere leerla, y cada capacidad se enciende.
- Servicios: la tarjeta violeta respira su propia trama; las de carbón sangran
  luz violeta desde el borde de abajo al pasar el cursor. Es luz, no sombra:
  vive adentro de la tarjeta. El monograma suelta un anillo al entrar.
- Trabajos: **un índice editorial, no una grilla de fichas**. Una grilla de
  tarjetas iguales —foto, título, año, "ver más"— es la estructura que sale
  sola y se nota. Acá cada trabajo es una fila a todo el ancho, con el año a
  la izquierda y el título en display, separadas por el punteado del sistema.
  La foto no vive adentro de un marco: hay **un solo recorte** para toda la
  lista que sigue al puntero y cambia de imagen al pasar de fila, con dos
  esquinas abiertas y dos al ras. Donde no hay puntero que seguir, cada fila
  muestra su propia tira recortada. La trama del sistema florece sobre la
  foto en `mix-blend-mode: screen`. Filtros con `View Transitions` y visor de
  caso con foco atrapado y `Esc`.
- Proceso: la línea se dibuja en magenta y termina siempre sobre un número; el
  que alcanza suelta el mismo anillo que el monograma.
- Preguntas: la pregunta se corre, el chevrón se enciende y la respuesta sube
  apenas después de abrirse la fila.
- Contacto: etiquetas flotantes, el campo enfocado se enciende desde abajo y el
  botón muta a un tilde dibujado.
- Botones: una luz cruza el relleno magenta; en el secundario el contorno se
  enciende antes de que llegue el relleno.
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
