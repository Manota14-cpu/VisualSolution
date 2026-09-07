# Visual Solution

Sitio del estudio: una sola página, estática, sin build obligatorio.
Tailwind v4, tema oscuro bloqueado, acento violeta → rosa, y el símbolo VS
renderizado en 3D con Three.js en el hero.

```
index.html          el sitio. Todo vive acá: estilos, marcado y scripts.
assets/logo.svg     el logo original en vectores.
assets/favicon.svg  ícono de pestaña con la marca.
artifact.html       copia para la vista previa publicada (sin <html>/<head>).
server.js           servidor estático mínimo para mirarlo en local.
.claude/launch.json config del preview de Claude Code.
```

## Verlo en local

```bash
node server.js
```

Abre en http://localhost:4321. También sirve cualquier servidor estático
(`npx serve`, Live Server de VS Code, etc.). Abrir el archivo con doble clic
también funciona, pero el `mailto` del formulario se comporta raro.

## Publicarlo

Subí `index.html` y la carpeta `assets/` a cualquier hosting estático:
Netlify, Vercel, Cloudflare Pages o GitHub Pages. No hace falta nada más.
`artifact.html` y `server.js` no se suben.

---

## Antes de publicar: lo que falta reemplazar

Está todo marcado con `TODO` en el HTML.

1. **Los cinco proyectos del catálogo.** Casa Ferrán, Talleres Bravo,
   Lumen Café, Nordelta Padel y Estudio Mirasol son de relleno, con fotos de
   picsum.photos. Cambiá nombres, rubros, años y el `src` de cada imagen.

2. **Las fotos de servicios.** Dos tarjetas usan picsum. Poné archivos tuyos
   en `assets/`.

3. **Los datos de contacto.** `hola@visualsolution.com` y `@visualsolution`
   son placeholders. Aparecen en la sección de contacto, en el pie y en la
   constante `MAILTO` del script.

4. **Las respuestas de Preguntas.** Los plazos y la forma de pago los escribí
   como borrador razonable. Ajustalos a como trabajás de verdad.

## El formulario

Sin backend arma un correo con los datos y abre el cliente de mail.
Para que envíe de verdad, poné la URL de Formspree, Getform o tu API en:

```js
var ENDPOINT = "";
```

Con eso pasa a mandar un POST con JSON, y quedan activos la barra de carga,
el mensaje de error y la confirmación.

## Tailwind

El archivo usa el build de navegador (`@tailwindcss/browser@4` por CDN), que
compila las clases al cargar la página. Anda, pero para producción conviene
compilar el CSS una vez:

```bash
npx @tailwindcss/cli -i src/input.css -o dist/app.css --minify
```

Y cambiar el `<script>` de Tailwind por `<link rel="stylesheet" href="dist/app.css">`.
El bloque `@theme` del `<style type="text/tailwindcss">` es el que hay que
mover a `src/input.css`.

**Cuidado al tocar ese bloque.** Las reglas de componentes (`.btn`, `.card`,
`.token`, `.field-input`) viven ahí adentro. Si se borra alguna, los botones
quedan como texto plano sin fondo ni padding. Si editás esa zona, revisá
después que `.btn`, `.btn-sm` y `.btn-solid` sigan estando.

## El logo

El símbolo VS es el logo real, en tres lugares que hay que mantener juntos si
alguna vez lo rediseñás:

- **Marca plana:** el `<symbol id="vs-mark">` arriba del marcado. Es el mismo
  `path` que `assets/logo.svg`, en un viewBox de 143.5 x 76. Lo usan la barra,
  el pie, el botón de volver arriba y el respaldo del hero.
- **Marca 3D:** `markShapes()` en el script devuelve las tres piezas del trazado
  como contornos cerrados de Three.js, en la misma caja de 143.5 x 76 pero con el
  eje Y hacia arriba, por eso las coordenadas están espejadas respecto del SVG.
  Se extruyen con bisel y se centran con `translate(-71.75, -38, ...)`.
- **Preloader:** el mismo `path`, con `pathLength="1"` para dibujar el contorno
  sin medir la ruta a mano.

Si cambiás el logo, hay que actualizar los tres, más `assets/favicon.svg`.

## Sistema de diseño

- **Superficies:** canvas `#040506`, tarjeta `#07080a`, hueco `#111214`,
  insignia `#1b1c1e`, hairline `#363739`.
- **Texto:** blanco, `#9c9c9d` secundario, `#6a6b6c` apagado.
- **Marca:** violeta `#8B5CF6` → rosa `#EC4899`. Está racionado a propósito:
  logo, atmósfera del hero, la tarjeta de tiendas y los estados de foco.
  No se usa en texto de lectura ni en botones.
- **Acción:** botón neutro `#e6e6e6` con texto `#454647`. Si querés el CTA en
  degradado, cambiá `.btn-solid` a `background:linear-gradient(102deg,#8B5CF6,#EC4899); color:#0A0410;`.
- **Tipografía:** Inter (titulares en peso 400 con tracking positivo, es
  deliberado) y Geist Mono para metadatos y monogramas.
- **Elevación:** sombra de tecla, nunca drop shadow.
- **Radios:** 6px insignias, 8px botones e inputs, 16px tarjetas,
  20px tarjetas grandes, círculo completo para los monogramas.

## Animación

**Capa global**

- Scroll con inercia (Lenis por CDN). Mueve el scroll real del documento, así
  que `position:sticky`, los anclas y la barra de progreso siguen funcionando.
- Barra de progreso de lectura arriba de todo (`animation-timeline: scroll()`,
  se oculta sola donde el navegador no la soporta).
- Fondo vivo: campo de puntos en canvas con parallax de profundidad.
- Cursor propio: punto sólido más anillo que lo persigue y crece sobre lo
  interactivo. En campos de texto vuelve el cursor del sistema.
- Botones magnéticos: se estiran hacia el cursor dentro de un radio corto.
- Preloader: el símbolo VS se dibuja trazo por trazo. Solo la primera visita
  de cada sesión (`sessionStorage`).
- Header que se condensa al scrollear, con micro rebote del logo la primera vez.

**Hero**

- Logo VS en 3D con mapa de entorno procedural (reflejos reales, no solo luces),
  halo aditivo, campo de puntos detrás y giro que sigue al puntero.
- Al soltar el puntero conserva el impulso y frena de a poco, en vez de volver
  de golpe al centro.
- Al scrollear fuera del hero gira más rápido, se achica y se aleja.
- Titular que sube palabra por palabra, cada una entrando desde desenfoque.

**Por sección**

- Marquesina: cada capacidad crece y toma el degradado de marca al pasar por encima.
- Servicios: foco de luz que sigue al cursor, inclinación 3D con el origen en el
  punto del cursor, brillo diagonal en la tarjeta de tiendas y pulso único de los
  monogramas al entrar en pantalla.
- Trabajos: barrido de revelado (`clip-path`) la primera vez que cada imagen entra
  en pantalla, filtros por tipo con `View Transitions` cuando el navegador lo
  soporta, y visor de caso a pantalla completa con foco atrapado y cierre con `Esc`.
- Proceso: línea vertical que se dibuja con el scroll y el paso activo encendido
  con el degradado de marca.
- Preguntas: acordeón con rebote en el ícono y fondo tenue en la fila abierta.
- Contacto: etiquetas flotantes y botón que muta a un tilde dibujado antes de
  mostrar la confirmación.
- Volver arriba: el símbolo VS gira 360° mientras la página sube.

**Reglas que respeta todo lo anterior**

- Con `prefers-reduced-motion: reduce` se apaga entero, no se hace más lento.
- Los efectos de puntero solo corren con puntero fino, así que en móvil no
  gastan batería ni dejan transformaciones pegadas.
- Un solo bucle de `requestAnimationFrame` para todo lo continuo, que se detiene
  con la pestaña oculta. El 3D además se pausa al salir de pantalla.
- En equipos de 4 núcleos o menos, o pantallas de menos de 768px, se apagan las
  capas caras (fondo vivo, halo y puntos del hero) y baja el `pixelRatio`.
- Sin WebGL el hero cae a la marca plana en SVG y no se rompe nada.
