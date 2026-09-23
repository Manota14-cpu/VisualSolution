# Prompt para generar las tarjetas de contacto

Copiá todo lo que está debajo de la línea y pegalo en ChatGPT **adjuntando el
logo** (`public/logo.svg` o un PNG del monograma sobre fondo transparente).

El correo, el Instagram y la web ya están completos con los datos reales. Antes
de mandarlo, reemplazá lo que quedó marcado con `«»`: nombre, rol y teléfono.

---

Necesito el diseño de una tarjeta de contacto para un estudio llamado **Visual
Solution**. Te adjunto el logo: **usalo tal cual, no lo redibujes, no lo
alteres, no le agregues efectos.**

Generá **dos imágenes separadas**: una para el frente y una para el dorso.

## Formato

- 85 × 55 mm, horizontal (proporción 1,545:1), calidad de impresión.
- Dejá 3 mm de sangrado en cada lado y no pongas nada importante a menos de
  5 mm del borde.
- Fondo a sangre completo, sin marco blanco alrededor.

## El sistema visual — respetalo al pie de la letra

**Paleta.** Una sola tinta azul en tres fuerzas, sobre papel. Estos colores y
ninguno más. No inventes acentos.

| Color | Hex | Para qué |
|---|---|---|
| Azul | `#0036A5` | el color de la marca: texto, logo, fondos plenos |
| Azul medio | `#155BCD` | acentos y una de las dos retículas de puntos |
| Bruma | `#AECDED` | rellenos suaves y detalles chicos |
| Fondo | `#EAF0F6` | el papel: fondo claro dominante |
| Blanco | `#FFFFFF` | texto sobre el azul pleno |

**Dos combinaciones prohibidas**, porque no se leen: texto blanco sobre bruma, y
azul `#0036A5` sobre azul medio `#155BCD`.

**Tipografía.**

- Titulares: **Anton** (o Bebas Neue / Druk Wide Bold). Siempre en MAYÚSCULAS,
  interletrado **positivo** de +0,02 em e interlineado 0,94. El interletrado
  positivo a tamaño grande es deliberado: sin él los trazos gruesos se chocan.
  **Nunca uses interletrado negativo.**
- Datos y texto chico: **DM Sans Medium (peso 500)**. Nunca Regular, nunca Bold.

**El motivo firma: la trama de serigrafía.** Es lo más reconocible del sistema.
Papel claro —bruma `#AECDED` abajo a la izquierda que se abre hacia el fondo
`#EAF0F6` arriba a la derecha— con una **retícula de puntos de medio tono**
impresa encima en tinta azul. Los puntos siguen los ángulos de pantalla reales de
una serigrafía a dos tintas: **15° el azul medio y 75° el azul**, para que las dos
retículas no formen muaré. Puntos chicos, que cubran poco más de un cuarto de la
superficie. Que se lea como algo impreso, no como un filtro digital.

**El fuera de registro.** El monograma va impreso en azul `#0036A5` macizo, y
debajo asoman dos copias idénticas corridas en direcciones opuestas: una en azul
medio `#155BCD` hacia arriba a la derecha y otra en bruma `#AECDED` hacia abajo a
la izquierda, unos 2–3 % del ancho del logo. Es el error clásico de la impresión
a varias tintas cuando las planchas no se alinean, usado a propósito.

**Formas.** Radios generosos: 40 px de radio en bloques (escalado a la tarjeta) y
píldora completa —lados totalmente redondos— en cualquier botón o etiqueta.
Nada rectangular de esquina viva.

## Reglas duras — no las rompas

- **Sin sombras.** Ninguna, en ningún elemento. El sistema es plano a propósito
  y la jerarquía se arma sólo con contraste.
- Sin brillos, resplandores, biselados, relieves, reflejos ni efectos 3D.
- Sin degradados fuera del del papel del frente.
- Sin colores nuevos. Nada de negro, nada de gris.
- Sin texturas de papel, ruido, granulado ni maquetas fotográficas.
- Nada de íconos genéricos de stock (sobrecitos, teléfonos, pines). Si hace
  falta un ícono, que sea una forma geométrica simple de un solo trazo.

## Cara A — el frente

El papel a sangre: el degradado claro con la trama de puntos azules, ocupando la
tarjeta entera. El **monograma centrado y grande**, ocupando cerca del 55 % del
ancho, en azul `#0036A5` macizo y con el fuera de registro descrito arriba.

**Nada de texto en esta cara.** Ni el nombre, ni la web, ni un eslogan. El frente
es un objeto impreso, no una etiqueta.

## Cara B — el dorso

Fondo azul `#0036A5` pleno, sin trama.

Alineado a la izquierda, con márgenes amplios:

1. Arriba, chico: el monograma en **blanco**, de unos 9 mm de ancho.
2. El nombre en Anton, mayúsculas, blanco, en dos líneas:
   **VISUAL / SOLUTION**
3. Debajo, en DM Sans Medium, blanco al 75 % de opacidad, una sola línea:
   `Desarrollo web y producción audiovisual`
4. Un bloque de datos en DM Sans Medium 500, blanco, con buen aire entre líneas:

```
«NOMBRE Y APELLIDO»
«Rol»

visualsolutionn@gmail.com
«+54 9 11 0000 0000»
@visualsolution.com.ar
visual-solution.vercel.app
```

5. Abajo a la derecha, una **píldora blanca `#FFFFFF` con texto azul `#0036A5`**
   en DM Sans Medium, que diga: `Empezar proyecto`

## El resultado

Que parezca un afiche impreso reducido a 85 mm, no una plantilla de tarjeta de
visita. Una sola tinta azul sobre papel: el frente claro e impreso, el dorso
en azul pleno.

Mostrame las dos caras como imágenes separadas, planas y de frente —sin maquetas,
sin manos sosteniendo la tarjeta, sin perspectiva, sin sombra proyectada.
