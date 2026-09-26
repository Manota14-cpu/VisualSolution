# Cómo se instala App Visual

Animación de 5 segundos, cuadrada (1080 x 1080, 30 cuadros por segundo),
para mostrarle a un local cómo se instala la app:

1. **Conectás el pendrive** (0 a 1,1 s)
2. **Abrís el instalador**: doble clic en «Instalar App Visual» (1,1 a 2,1 s)
3. **Se instala todo solo**: la barra llega al 100% y tilda Stock, Caja y Ventas (2,1 a 3,8 s)
4. **Listo para vender**: queda el ícono en la compu, con «Sin internet»,
   «Los datos quedan en tu compu» y «Sin cuota» (3,8 a 5 s)

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

Los textos de cada paso están en `PASOS` y los tiempos en `render(t)`,
los dos en `index.html`. Después:

```bash
node render.cjs                         # instalacion-app-visual.mp4
node render.cjs --fps 60 --out x.mp4    # otra cadencia u otro nombre
```

Hace falta Playwright (`npm i -g playwright`) y un `ffmpeg` con libx264.
Si el del sistema no está o no trae libx264, se le pasa otro con la
variable `FFMPEG=/ruta/a/ffmpeg`.
