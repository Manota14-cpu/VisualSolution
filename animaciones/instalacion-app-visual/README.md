# Cómo se instala App Visual

Animación de 8 segundos, vertical 9:16 (1080 x 1920, 30 cuadros por
segundo), para historias, reels y estados. Le muestra a un local cómo se
instala la app:

1. **Conectamos el pendrive** (0 a 2 s)
2. **Instalamos**: doble clic en «Instalar App Visual», la barra llega al
   100% y tilda Stock, Caja y Ventas (2 a 6,1 s)
3. **Listo para usar**: queda el ícono en la compu, con «Sin internet»,
   «Los datos quedan en tu compu» y «Sin cuota» (6,1 a 8 s)

Cada texto queda quieto al menos un segundo y medio, para que se lea de
una. Lo importante va entre los 250 y los 1620 px de alto: arriba y
abajo queda aire para lo que tapan Instagram y WhatsApp.

```
index.html                   la animación: se abre en el navegador y corre en bucle
render.cjs                   la pasa a video cuadro a cuadro
instalacion-app-visual.mp4   el video terminado
fonts/                       DM Sans, la misma letra del sitio
```

## Verla

Abrí `index.html` en el navegador. Espacio pausa y la barra de abajo
adelanta y atrasa.

## Cambiarla y volver a sacar el video

Todo está en `index.html`: los textos de cada paso en `PASOS`, los
tiempos en `render(t)` y el tamaño y la duración en `ANCHO`, `ALTO` y
`DURACION`. Después:

```bash
node render.cjs                         # instalacion-app-visual.mp4
node render.cjs --fps 60 --out x.mp4    # otra cadencia u otro nombre
```

Hace falta Playwright (`npm i -g playwright`) y un `ffmpeg` con libx264.
Si el del sistema no está o no trae libx264, se le pasa otro con la
variable `FFMPEG=/ruta/a/ffmpeg`.
