# Visual Solution

Sitio del estudio. Next.js 15 (App Router) + React 19 + Tailwind v4, tema
oscuro bloqueado, acento violeta → rosa, y el símbolo VS renderizado en 3D
con Three.js en el hero.

```
app/
  layout.tsx        metadata, tipografías, elementos fijos
  page.tsx          compone las secciones
  globals.css       tokens de Tailwind, componentes y capa de movimiento
components/
  brand/            el símbolo VS, plano y en 3D
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

El símbolo VS vive en tres lugares que hay que mantener juntos si alguna vez
lo rediseñás:

- **Marca plana:** `MARK_PATH` en `components/brand/Mark.tsx`. Es el mismo
  `path` que `public/logo.svg`, en un viewBox de 143.5 x 76. Lo usan la barra,
  el pie, el botón de volver arriba, el preloader y el respaldo del hero.
- **Marca 3D:** `markShapes()` en `components/brand/Mark3D.tsx` devuelve las
  tres piezas del trazado como contornos cerrados, en la misma caja pero con
  el eje Y hacia arriba, por eso las coordenadas están espejadas respecto del
  SVG. Se extruyen con bisel y se centran con `translate(-71.75, -38, ...)`.
- **Favicon:** `public/favicon.svg`.

## Sistema de diseño

Los tokens están en el bloque `@theme` de `app/globals.css` y Tailwind genera
las utilidades a partir de ahí: `bg-card`, `text-ash`, `border-hairline`,
`rounded-cardlg`, `shadow-key`.

- **Superficies:** canvas `#040506`, tarjeta `#07080a`, hueco `#111214`,
  insignia `#1b1c1e`, hairline `#363739`.
- **Texto:** blanco, `#9c9c9d` secundario, `#6a6b6c` apagado.
- **Marca:** violeta `#8B5CF6` → rosa `#EC4899`. Está racionado a propósito:
  logo, atmósfera del hero, la tarjeta de tiendas y los estados de foco.
  No se usa en texto de lectura ni en botones.
- **Acción:** botón neutro `#e6e6e6` con texto `#454647`. Si querés el CTA en
  degradado, cambiá `.btn-solid` en `globals.css`.
- **Tipografía:** Inter (titulares en peso 400 con tracking positivo, es
  deliberado) y Geist Mono para metadatos y monogramas. Las sirve `next/font`
  desde el propio dominio: sin pedido a Google y sin salto de layout.
- **Elevación:** sombra de tecla, nunca drop shadow.
- **Radios:** 6px insignias, 8px botones e inputs, 16px tarjetas,
  20px tarjetas grandes, círculo completo para los monogramas.

Las reglas de componentes (`.btn`, `.card`, `.token`, `.field-input`) van sin
`@layer` a propósito: lo que queda fuera de una capa le gana en la cascada, así
una utilidad de Tailwind mal puesta no le pisa el fondo a un botón.

## Animación

**Capa global** (`components/motion/MotionProvider.tsx`)

- Scroll con inercia (Lenis). Mueve el scroll real del documento, así que
  `position:sticky`, los anclas y la barra de progreso siguen funcionando.
- Barra de progreso de lectura (`animation-timeline: scroll()`, se oculta sola
  donde el navegador no la soporta).
- Fondo vivo: campo de puntos en canvas con parallax de profundidad.
- Cursor propio: punto sólido más anillo que lo persigue y crece sobre lo
  interactivo. En campos de texto vuelve el cursor del sistema.
- Botones magnéticos: se estiran hacia el cursor dentro de un radio corto.
- Preloader: el símbolo se dibuja trazo por trazo. Solo la primera visita de
  cada sesión.
- Header que se condensa al scrollear, con micro rebote del logo la primera vez.

**Hero**

- Logo VS en 3D con mapa de entorno procedural, halo aditivo, campo de puntos
  detrás y giro que sigue al puntero. Al soltarlo conserva el impulso y frena
  de a poco. Al scrollear fuera del hero gira más rápido y se aleja.
- Titular que sube palabra por palabra, cada una entrando desde desenfoque.

**Por sección**

- Marquesina: cada capacidad crece y toma el degradado al pasar por encima.
- Servicios: foco de luz que sigue al cursor, inclinación 3D con el origen en
  el punto del cursor, brillo diagonal en la tarjeta de tiendas y pulso único
  de los monogramas.
- Trabajos: barrido de revelado, filtros por tipo con `View Transitions` y
  visor de caso con foco atrapado y cierre con `Esc`.
- Proceso: línea vertical que se dibuja con el scroll y paso activo encendido.
- Preguntas: acordeón con rebote en el ícono.
- Contacto: etiquetas flotantes y botón que muta a un tilde dibujado.
- Volver arriba: el símbolo gira 360° mientras la página sube.

**Reglas que respeta todo lo anterior**

- Con `prefers-reduced-motion: reduce` se apaga entero, no se hace más lento.
- Los efectos de puntero solo corren con puntero fino, así que en móvil no
  gastan batería ni dejan transformaciones pegadas.
- Un solo bucle de `requestAnimationFrame` en `lib/motion.ts` para todo lo
  continuo, que se detiene con la pestaña oculta. El 3D además se pausa al
  salir de pantalla.
- En equipos de 4 núcleos o menos, o pantallas de menos de 768px, se apagan
  las capas caras (fondo vivo, halo y puntos del hero).
- Sin WebGL el hero cae a la marca plana en SVG y no se rompe nada.
- Three.js entra por `import()` dinámico: no pesa en el bundle inicial.

### Una trampa que ya está resuelta

Dentro de `document.startViewTransition`, un `setState` normal de React no se
aplica a tiempo y la transición captura el DOM viejo: el filtro y el visor
quedan una acción atrasados. Por eso `Works.tsx` usa `flushSync`. Si agregás
otra transición con estado, hacé lo mismo.
