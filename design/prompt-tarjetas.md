# Prompt para generar las tarjetas de contacto

Copiá todo lo que está debajo de la línea y pegalo en ChatGPT **adjuntando el
logo** (`public/logo.svg` o un PNG del monograma sobre fondo transparente).

Antes de mandarlo, reemplazá los datos marcados con `«»`: hoy en el sitio son
placeholders.

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

**Paleta.** Estos siete colores y ninguno más. No inventes acentos.

| Color | Hex | Para qué |
|---|---|---|
| Ónix | `#000000` | el fondo dominante |
| Carbón | `#18151E` | superficie apenas levantada del negro |
| Obsidiana | `#070607` | texto **encima de un relleno brillante**, nunca sobre el negro |
| Tiza | `#FFFFFF` | todo el texto que va sobre el negro |
| Magenta | `#EC4899` | la acción y el acento principal |
| Violeta | `#8B5CF6` | el degradado y los efectos; **nunca** en un botón |
| Tinte violeta | `#C4B5FD` | sólo etiquetas y detalles chicos |

**Tipografía.**

- Titulares: **Anton** (o Bebas Neue / Druk Wide Bold). Siempre en MAYÚSCULAS,
  interletrado **positivo** de +0,02 em e interlineado 0,94. El interletrado
  positivo a tamaño grande es deliberado: sin él los trazos gruesos se chocan.
  **Nunca uses interletrado negativo.**
- Datos y texto chico: **DM Sans Medium (peso 500)**. Nunca Regular, nunca Bold.

**El motivo firma: la trama de serigrafía.** Es lo más reconocible del sistema.
Un degradado diagonal de violeta `#8B5CF6` (abajo a la izquierda) a magenta
`#EC4899` (arriba a la derecha), con una **retícula de puntos de medio tono**
encima. Los puntos siguen los ángulos de pantalla reales de una serigrafía a dos
tintas: **15° el magenta y 75° el violeta**, para que las dos retículas no formen
muaré. Que se lea como algo impreso, no como un filtro digital.

**El fuera de registro.** El monograma va calado en obsidiana `#070607`, y debajo
asoman dos copias idénticas corridas en direcciones opuestas: una en magenta
hacia arriba a la derecha y otra en tinte violeta `#C4B5FD` hacia abajo a la
izquierda, unos 2–3 % del ancho del logo. Es el error clásico de la impresión a
varias tintas cuando las planchas no se alinean, usado a propósito.

**Formas.** Radios generosos: 40 px de radio en bloques (escalado a la tarjeta) y
píldora completa —lados totalmente redondos— en cualquier botón o etiqueta.
Nada rectangular de esquina viva.

## Reglas duras — no las rompas

- **Sin sombras.** Ninguna, en ningún elemento. El sistema es plano a propósito
  y la jerarquía se arma sólo con contraste de color.
- Sin brillos, resplandores, biselados, relieves, reflejos ni efectos 3D.
- Sin degradados fuera del de la plancha.
- Sin colores nuevos.
- Sin texturas de papel, ruido, granulado ni maquetas fotográficas.
- No pongas obsidiana sobre el negro: no se ve. Obsidiana existe **sólo** para
  escribir encima del magenta, el violeta o el tinte.
- Nada de íconos genéricos de stock (sobrecitos, teléfonos, pines). Si hace
  falta un ícono, que sea una forma geométrica simple de un solo trazo.

## Cara A — el frente

La plancha a sangre: el degradado con la trama de puntos, ocupando la tarjeta
entera. El **monograma centrado y grande**, ocupando cerca del 55 % del ancho,
calado en obsidiana y con el fuera de registro descrito arriba.

**Nada de texto en esta cara.** Ni el nombre, ni la web, ni un eslogan. El frente
es un objeto impreso, no una etiqueta.

## Cara B — el dorso

Fondo ónix `#000000` pleno, sin trama.

Alineado a la izquierda, con márgenes amplios:

1. Arriba, chico: el monograma en **magenta**, de unos 9 mm de ancho.
2. El nombre en Anton, mayúsculas, tiza, en dos líneas:
   **VISUAL / SOLUTION**
3. Debajo, en DM Sans Medium, tiza al 60 % de opacidad, una sola línea:
   `Desarrollo web y producción audiovisual`
4. Un bloque de datos en DM Sans Medium 500, tiza, con buen aire entre líneas:

```
«NOMBRE Y APELLIDO»
«Rol»

«mail@dominio.com»
«+54 9 11 0000 0000»
«@usuario»
«dominio.com»
```

5. Abajo a la derecha, una **píldora magenta `#EC4899` con texto obsidiana
   `#070607`** en DM Sans Medium, que diga: `Empezar proyecto`

## El resultado

Que parezca un afiche impreso reducido a 85 mm, no una plantilla de tarjeta de
visita. Neón prensado contra obsidiana: cada elemento magenta o violeta se lee
como luz que sube desde abajo de la superficie.

Mostrame las dos caras como imágenes separadas, planas y de frente —sin maquetas,
sin manos sosteniendo la tarjeta, sin perspectiva, sin sombra proyectada.
