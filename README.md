# Visual Solution

Sitio del estudio. Next.js 15 (App Router) + React 19 + Tailwind v4. El
sistema visual es un afiche impreso: papel lavanda, contorno negro de 1px,
tipografía display gigante y colores de marca puestos como calcomanías. En
el hero, dos manos a punto de tocarse —la de la máquina y la de la
persona— dibujadas en SVG con esa misma lógica, y las calcomanías de
servicio que se arrastran al hueco entre las dos.

```
app/
  layout.tsx        metadata, tipografías, elementos fijos
  page.tsx          compone las secciones
  globals.css       tokens de Tailwind, componentes y capa de movimiento
components/
  brand/            el símbolo VS y la escena de las manos
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

Los tokens están en el bloque `@theme` de `app/globals.css` y Tailwind genera
las utilidades a partir de ahí: `bg-card`, `text-ash`, `border-carbon`,
`rounded-cardlg`, `bg-sun`.

El sitio es un afiche impreso, no una interfaz iluminada: papel plano, contorno
negro y colores puestos como calcomanías. No hay degradados, ni sombras, ni
vidrio esmerilado. Si aparece uno, es un resto del sistema anterior.

- **Superficies:** papel `#EAE3FB`, tarjeta `#FFFFFF`, hueco `#F4F0FC`,
  hormigón `#CFCBD6`, tinta `#000000`. Las secciones alternan entre esos
  fondos a sangre y el pie cierra en negro.
- **Texto:** negro `#000000` para todo lo estructural, `#17141F` para lectura
  larga, `#5B5468` para lo secundario. Sobre el pie negro, blanco al 60–70%.
- **Calcomanías:** violeta `#8B5CF6`, rosa `#EC4899`, peri `#7C9CFF`,
  coral `#FF7A4D`, sol `#FFD24A`, tinte `#D9C7FF`. Son rellenos, nunca texto.
- **Alerta:** `#C62247`, el único rojo del sistema. Es el error del formulario
  y está calculado para leerse sobre papel y sobre blanco.
- **Tipografía:** Anton para el display (`.display` más `.display-xl/lg/md/sm`),
  con interlineado aplastado y en versalitas: el titular es escultura, no
  oración. Inter para todo lo demás, en 400 para lectura y 700 para estructura;
  no hay pesos intermedios. `.label` es la etiqueta chica en versalitas.
  Las sirve `next/font` desde el propio dominio: sin pedido a Google.
- **Elevación:** un contorno negro de 1.5px (`shadow-key`). No hay sombras.
- **Radios:** botones y pastillas en círculo completo, 20px tarjetas,
  40px tarjetas grandes.

Las reglas de componentes (`.btn`, `.chip`, `.nav-link`, `.field-input`) van
**dentro** de `@layer components`. Es importante: lo que queda fuera de una capa
le gana a las utilidades de Tailwind, y entonces `md:hidden` deja de funcionar
sobre cualquier componente que fije `display`. Ya pasó dos veces.

## Animación

El movimiento acompaña al collage, no lo protagoniza. El cursor propio, el campo
de partículas, el magnetismo de los botones, la inclinación 3D de las tarjetas y
el grano se fueron con el mundo oscuro.

**Capa global** (`components/motion/MotionProvider.tsx`)

- Scroll con inercia (Lenis). Mueve el scroll real del documento, así que
  `position:sticky`, los anclas y la barra de progreso siguen funcionando.
- Barra de progreso de lectura (`animation-timeline: scroll()`, se oculta sola
  donde el navegador no la soporta).
- Preloader: el símbolo se dibuja trazo por trazo. Solo la primera visita de
  cada sesión.
- Header con micro rebote del logo la primera vez que se despega del borde.

**Hero**

- El encuentro (`components/brand/Hands.tsx`): la mano de la máquina entra
  por la izquierda, la de la persona por la derecha, y entre las yemas de los
  índices queda el hueco donde salta la chispa. Están dibujadas en SVG con
  relleno plano y contorno negro, como el resto del sitio.
- Las manos se acercan al puntero. Todo el acercamiento cuelga de una sola
  custom property, `--reach` (0 lejos, 1 a punto de tocarse), que el puntero
  escribe sobre el contenedor: ni un solo render de React por movimiento.
  Sin puntero fino, o con movimiento reducido, se quedan quietas y ya cerca.
- Nunca llegan a tocarse del todo. El hueco es el tema del afiche.
- Cinco calcomanías de servicio que se arrastran a ese hueco y arman la
  consulta: cada una que entra se queda orbitando el punto de contacto y
  cambia la etiqueta del botón. El clic seco hace lo mismo que el arrastre.
- Si nadie toca nada, el afiche se lee igual.

Las falanges no están escritas a mano: `seg()` arma una cápsula y `finger()`
las encadena. Para mover un dedo se tocan tres números —ángulos, largos y
anchos— y no quince paths.

**Por sección**

- Marquesina negra a sangre entre el hero y el resto.
- Servicios: la pieza destacada está apoyada torcida y se endereza al hover.
- Trabajos: barrido de revelado, filtros por tipo con `View Transitions` y
  visor de caso con foco atrapado y cierre con `Esc`.
- Proceso: línea vertical que se dibuja con el scroll y paso activo encendido.
- Preguntas: acordeón, con la fila abierta teñida.
- Contacto: etiquetas flotantes y botón que muta a un tilde dibujado.
- Volver arriba: el símbolo gira 360° mientras la página sube.

**Reglas que respeta todo lo anterior**

- Con `prefers-reduced-motion: reduce` se apaga entero, no se hace más lento.
- Un solo bucle de `requestAnimationFrame` en `lib/motion.ts` para todo lo
  continuo, que se detiene con la pestaña oculta.
- El hero es SVG y CSS: no hay WebGL, no hay canvas y no hay nada que pueda
  fallar en un equipo viejo. Three.js se fue del proyecto con el logo 3D.

### Una trampa que ya está resuelta

Dentro de `document.startViewTransition`, un `setState` normal de React no se
aplica a tiempo y la transición captura el DOM viejo: el filtro y el visor
quedan una acción atrasados. Por eso `Works.tsx` usa `flushSync`. Si agregás
otra transición con estado, hacé lo mismo.
