# Visual Solution — Tinta Azul · Style Reference
> blue ink on paper. The canvas is light, and everything with weight — text, logo, action — is printed in one corporate blue.

**Theme:** light

*Palette replaced in September 2026. The system was previously Caldera (black canvas, magenta and violet accents); typography, spacing, radii and the no-shadow rule carry over unchanged. Only color changed.*

Tinta Azul runs on a pale blue-grey canvas (#EAF0F6) with white surfaces, and a single ink in three strengths: corporate blue (#0036A5) for text, logo and primary actions; a secondary blue (#155BCD) for accents, hovers and active lines; and a mist blue (#AECDED) for tags and soft fills. The interface stays flat and unshadowed, letting ultrabold compressed type at near-architectural scale (up to 189px) carry structural weight. The print metaphor that shaped the hero is now literal: halftone dots in blue ink on light paper, and the VS monogram printed solid in corporate blue. Full-strength blue appears as bands — the marquee, the closing call to action, the opened service and the footer — so the brand color has weight and the page never reads as pale.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Fondo | `#EAF0F6` | `--color-fondo` | Page canvas, dominant background |
| Papel | `#FFFFFF` | `--color-papel` | Cards, inputs, nav pill, and all text on blue surfaces |
| Azul | `#0036A5` | `--color-azul` | Primary text, headings, logo, primary action fills, full-strength bands — 8.8:1 on the canvas, 10.1:1 on white |
| Azul medio | `#155BCD` | `--color-azul-medio` | Accents: heading underline bars, hovers, the process rail, focus rings, the halftone's 15° screen — 5.4:1 on the canvas |
| Bruma | `#AECDED` | `--color-bruma` | Tag and badge fills, soft washes, the light end of the image gradient — always with Azul text (6.2:1), never white (1.65:1) |
| Error | `#C62828` | `--color-error` | Form validation only — the one color that is not ink. 5.6:1 on white |

**Image and mockup gradient:** `#0036A5 → #155BCD → #AECDED`, with the mist stop kept to the far corner so white type rests on the blue part.

**Measured pairs that fail and are never used:** white on Bruma (1.65:1), Azul on Azul medio (1.65:1).

## Tokens — Typography

*Since September 2026 all display type on the site — section headings, service titles, project names, step numerals — is DM Sans 500 in sentence case with tight negative tracking (−0.04em to −0.06em, tighter as the size grows), matching the video hero. Anton (the free substitute for PP Neue Corp Compact described below) is no longer loaded on the page; it survives only in the generated share images. The character of the brand is carried by the halftone, the blue ink, the liquid-metal buttons and the VS mark, not by the display face. Blue bands (marquee, closing CTA, footer) sit in rounded frames inset 8–12px from the viewport edge, like the hero.*

### PP Neue Corp Compact — All headings and display text. A custom condensed ultrabold face that gives headlines an industrial, sign-painted weight. The 189px display size in the hero is the signature — compressed, almost structural rather than typographic. Feature settings "ss06" and "ss10" activate alternate letterforms and spacing for a more aggressive condensed rhythm. Positive tracking (+0.02em) is unusual for display sizes and keeps the heavy strokes from feeling claustrophobic at 80–189px. · `--font-pp-neue-corp-compact`
- **Substitute:** Bebas Neue, Anton, Druk Wide Bold
- **Weights:** 400 (Ultrabold cut)
- **Sizes:** 26px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 189px
- **Line height:** 0.94–1.20
- **Letter spacing:** 0.64px at 32px (0.02em), scaling proportionally to ~3.78px at display 189px
- **OpenType features:** `"ss06", "ss10"`
- **Role:** All headings and display text. A custom condensed ultrabold face that gives headlines an industrial, sign-painted weight. The 189px display size in the hero is the signature — compressed, almost structural rather than typographic. Feature settings "ss06" and "ss10" activate alternate letterforms and spacing for a more aggressive condensed rhythm. Positive tracking (+0.02em) is unusual for display sizes and keeps the heavy strokes from feeling claustrophobic at 80–189px.

### DM Sans — Body copy, nav links, button labels, supporting headings up to 30px. Medium weight throughout is deliberate — Regular would feel too thin against the ultrabold display type, and Bold would compete with it. DM Sans provides a humanist, slightly geometric counterpoint to the industrial display face. · `--font-dm-sans`
- **Substitute:** Inter, Manrope
- **Weights:** 500 (Medium only — never Regular or Bold)
- **Sizes:** 14px, 16px, 18px, 30px
- **Line height:** 1.20–1.55
- **Role:** Body copy, nav links, button labels, supporting headings up to 30px. Medium weight throughout is deliberate — Regular would feel too thin against the ultrabold display type, and Bold would compete with it. DM Sans provides a humanist, slightly geometric counterpoint to the industrial display face.

### System sans-serif — Captions, meta text, dates, micro-labels. Only used at 12px where weight and brand presence matter less than size economy. · `--font-system-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.20
- **Role:** Captions, meta text, dates, micro-labels. Only used at 12px where weight and brand presence matter less than size economy.

### Type Scale

| Role | Size | Line Height | Letter Spacing | Token |
|------|------|-------------|----------------|-------|
| caption | 12px | 1.2 | — | `--text-caption` |
| body-sm | 14px | 1.2 | — | `--text-body-sm` |
| body | 16px | 1.55 | — | `--text-body` |
| subheading | 26px | 1.2 | — | `--text-subheading` |
| heading-sm | 30px | 1.5 | — | `--text-heading-sm` |
| heading | 32px | 1 | 0.64px | `--text-heading` |
| heading-lg | 48px | 1 | — | `--text-heading-lg` |
| heading-2xl | 80px | 1.1 | — | `--text-heading-2xl` |
| heading-3xl | 96px | 0.95 | — | `--text-heading-3xl` |
| display | 189px | 0.94 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** comfortable

### Spacing Scale

| Name | Value | Token |
|------|-------|-------|
| 4 | 4px | `--spacing-4` |
| 8 | 8px | `--spacing-8` |
| 9 | 9px | `--spacing-9` |
| 10 | 10px | `--spacing-10` |
| 12 | 12px | `--spacing-12` |
| 16 | 16px | `--spacing-16` |
| 18 | 18px | `--spacing-18` |
| 20 | 20px | `--spacing-20` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 56 | 56px | `--spacing-56` |
| 64 | 64px | `--spacing-64` |
| 80 | 80px | `--spacing-80` |
| 92 | 92px | `--spacing-92` |

### Border Radius

| Element | Value |
|---------|-------|
| cards | 40px |
| pills | 800px |
| small | 16px |
| inputs | 100px |
| medium | 20px |
| buttons | 40px |

### Layout

- **Page max-width:** 1280px
- **Section gap:** 80px
- **Card padding:** 40px
- **Element gap:** 16px

## Components

### Primary CTA Button
**Role:** Main conversion action

Liquid-metal pill: Azul (#0036A5) plate with Papel (#FFFFFF) label; the metal is the rim — two counter-rotating conic rings in Azul, Azul medio, Bruma and white highlights. 800px border-radius. Padding 12px vertical, 24px horizontal. DM Sans 500 weight at 16px. No shadow. On a full-blue band the plate inverts to Papel with an Azul label.

### Secondary Pill Button
**Role:** Alternative action or paired CTA

Same liquid-metal pill with a transparent plate, Azul (#0036A5) label and the rim at reduced opacity. Sits beside the primary CTA as the quieter counterpart.

### Outlined Ghost Link
**Role:** Low-emphasis text link or nav item

Transparent background, no visible border, Azul text. 800px pill radius. Padding 0 vertical, 12px horizontal. DM Sans 500 at 16px. Used for nav items and inline links — relies on color and position rather than container weight.

### Stat Feature Card
**Role:** Highlight key metrics (TVL, transactions, etc.)

Azul (#0036A5) solid background, Papel (#FFFFFF) text. 40px border-radius. Padding 40px on all sides. No shadow. The large metric number uses PP Neue Corp Compact at 80px+; the label above uses DM Sans 500 at 14–16px. These cards are the system's most visually dominant elements after the hero.

### Content Card
**Role:** Blog posts, announcements, program entries

Papel (#FFFFFF) background, no border, no shadow. 40px border-radius. Padding 40px all sides. Contains a category tag, headline (PP Neue Corp Compact 26–32px in Azul), and date metadata. The image area at the top uses the image gradient (#0036A5 → #155BCD → #AECDED) with a mist halftone overlay.

### Full-Blue Band
**Role:** Emphasis surfaces — marquee, closing CTA, opened service, footer

Azul (#0036A5) to Azul medio (#155BCD) gradient at 42°, with a Bruma halftone overlay at low opacity. Text on it is Papel. No shadow.

### Category Tag Badge
**Role:** Label blog posts and announcements

Bruma (#AECDED) background, Azul (#0036A5) text. Pill shape (800px radius). DM Sans 500 at 12–14px. Padding approximately 3–4px vertical, 8–10px horizontal. Small, soft, and functionally distinct — the only tinted element in the system.

### Navigation Bar
**Role:** Top-level site navigation

The entire nav row sits inside a Papel (#FFFFFF) pill with a faint Azul border at 15% — a signature element. Nav items are Azul text in DM Sans 500 at 16px, and a single Azul pill slides under the hovered or active link, flipping its text to Papel. Logo lockup (mountain icon + wordmark) sits left, social icons and CTA right.

### Hero Halftone Block
**Role:** Hero section visual centerpiece

Full-bleed band of light paper — Bruma (#AECDED) at the bottom-left opening to the canvas (#EAF0F6) at the top-right — printed with two halftone screens in blue ink: Azul medio at 15° and Azul at 75°, so the grids never moiré. The VS monogram sits on top in solid Azul, with two misregistered copies (Azul medio and Bruma) peeking from its edges. The headline bites the paper from below but never touches the monogram: they are the same blue and would fuse.

### Input Field
**Role:** Form input

Papel (#FFFFFF) background, 1.5px Azul border at 35% opacity, Azul medio on focus, Error (#C62828) when invalid. 100px border-radius (pill). Padding 24px vertical, 32px left, 64px right. Azul text. DM Sans 500.

### Partner Logo Strip
**Role:** Display ecosystem partners or integrations

Papel (#FFFFFF) background card, 40px radius, 40px padding. Logos arranged in a single row with consistent height, separated by vertical 1.5px Azul dotted dividers at low opacity. No individual logo containers — flat inline treatment.

### Dotted Divider
**Role:** Section separator and decorative detail

1.5px dotted line in Azul at about 22% opacity (white at 30% on blue bands). Used as vertical dividers in nav and partner strips, and occasionally as horizontal section breaks. The dotted (not dashed, not solid) style is a small but consistent signature detail.

## Do's and Don'ts

### Do
- Use PP Neue Corp Compact at 48px or larger for any heading that needs to feel structural — below 40px the ultrabold weight overwhelms and loses its industrial character
- Apply 40px border-radius to all cards, content blocks, and non-pill buttons as the default surface radius
- Use 800px border-radius (full pill) for all buttons, tags, nav containers, and small interactive elements
- Set primary CTAs as liquid-metal pills with an Azul (#0036A5) plate and Papel label, sized at 12px/24px padding — never rectangular, always pill-shaped
- Keep body text at DM Sans 500 (Medium) — never drop to Regular weight, which reads as anemic against the ultrabold display type
- Use the halftone dot pattern (blue ink on light paper) as the hero/signature visual treatment — it is the system's most recognizable motif
- Layer surfaces using value contrast (Fondo canvas → Papel cards → Azul bands) rather than shadows
- Put Azul text on Bruma, never white; keep Azul off Azul medio

### Don't
- Do not add drop shadows to any element — the system is intentionally flat
- Do not use rectangular (low-radius) buttons — the pill/40px-radius treatment is non-negotiable
- Do not introduce colors beyond the one ink in three strengths — Error red is the only exception, and only for validation
- Do not use Regular or Bold weights of DM Sans for body — Medium (500) is the only correct weight
- Do not set headings below 26px or above 189px — the display type only works at architectural scale
- Do not let the headline touch the hero monogram — both are Azul and the letters fuse with the strokes
- Do not apply negative letter-spacing to PP Neue Corp Compact — the +0.02em positive tracking is intentional at display sizes to prevent stroke collision
- Do not drop secondary text below 80% Azul on the canvas — at 70% it measures 4.3:1, just under AA

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Fondo Canvas | `#EAF0F6` | Page background |
| 1 | Papel Surface | `#FFFFFF` | Cards, inputs, nav pill |
| 2 | Azul Band | `#0036A5` | Marquee, closing CTA, opened service, footer |
| 3 | Image Gradient | `#0036A5 → #155BCD → #AECDED` | Project mockups and image areas |

## Elevation

Deliberately shadowless. The design relies on value contrast (pale canvas vs. white cards vs. full-strength blue bands) and generous 40px corner radii to create surface hierarchy. No element casts a shadow anywhere in the system.

## Imagery

Imagery is minimal and deliberate. The hero uses an abstract halftone dot pattern (blue ink on light paper) rather than photography — it functions as brand artwork, not decoration. Project cards without a screenshot use the image gradient (#0036A5 → #155BCD → #AECDED) with a mist halftone as the image-area fill, keeping a consistent graphic system. No photography, no 3D renders, no lifestyle imagery anywhere. Icons are small, monochrome, and minimal — Discord, X, and Telegram sit in the nav as simple white glyphs. The visual language is graphic and editorial, not photographic: think a one-ink print run, not stock imagery.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #EAF0F6 (Fondo)
- Card/content surface: #FFFFFF (Papel)
- Primary text/headings/logo: #0036A5 (Azul)
- Primary action: liquid-metal pill, #0036A5 plate, white label
- Accent, hover, active line: #155BCD (Azul medio)
- Tag/badge: #AECDED (Bruma) with #0036A5 text
- Text on blue bands: #FFFFFF (Papel)
- Image gradient: #0036A5 → #155BCD → #AECDED
- Validation error: #C62828

## 3-5 Example Component Prompts
1. Create a Primary Action Button: #0036A5 plate, #FFFFFF label, 800px radius, compact pill padding, with a liquid-metal rim of counter-rotating conic gradients in #0036A5, #155BCD, #AECDED and white.

2. **Stat Row**: Four Azul (#0036A5) cards in a row, each 40px radius, 40px padding. Label in DM Sans 500 at 14px, white text. Metric value in PP Neue Corp Compact at 80px weight 400, white, line-height 1.1.

3. **Content Card**: Papel (#FFFFFF) background, 40px radius, 40px padding. Bruma (#AECDED) pill tag at top with DM Sans 500 12px Azul text, 800px radius. Headline at 32px PP Neue Corp Compact, Azul, letter-spacing 0.64px. Date at 12px system sans-serif, Azul at 78%.

4. **Input Section**: Fondo (#EAF0F6) background. White pill input with 100px radius, 24px/32px padding, 1.5px Azul border at 35%. DM Sans 500 16px Azul text. Submit: the primary liquid-metal pill.

## Signature Motifs

Three visual signatures define the identity and should be reused across new pages: (1) The halftone dot pattern — blue ink in two screens (15° and 75°) on light paper, at hero scale. (2) The 189px display headline — ultrabold compressed type at near-architectural scale, with tight 0.94 line-height. (3) The triple-radius system — 100px for inputs, 40px for cards and rectangular buttons, 800px for pills — creates a consistent roundness without monotony.

## Similar Brands

- **Berachain** — Similar crypto/web3 site language with warm off-white canvas, massive condensed display type, and a single bold accent color dominating featured surfaces
- **Monad** — Matching approach of ultrabold compressed headlines at near-architectural scale, flat no-shadow surfaces, and pill-shaped controls with aggressive border-radius
- **Dymension** — Shared visual DNA of warm neutral canvas, single vivid accent color for CTAs and stat cards, and condensed industrial display typography
- **Blast** — Same flat-design philosophy on warm background, pill buttons in one dominant accent color, and oversized compressed headlines as structural anchors
- **Arbitrum** — Comparable crypto ecosystem site pattern with generous 40px surface radii, warm light canvas, and medium-weight body sans against heavy display type

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-fondo: #EAF0F6;
  --color-papel: #FFFFFF;
  --color-azul: #0036A5;
  --color-azul-medio: #155BCD;
  --color-bruma: #AECDED;
  --color-error: #C62828;

  /* Typography — Font Families */
  --font-pp-neue-corp-compact: 'PP Neue Corp Compact', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.55;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.5;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: 0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-heading-2xl: 80px;
  --leading-heading-2xl: 1.1;
  --text-heading-3xl: 96px;
  --leading-heading-3xl: 0.95;
  --text-display: 189px;
  --leading-display: 0.94;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-92: 92px;

  /* Layout */
  --page-max-width: 1280px;
  --section-gap: 80px;
  --card-padding: 40px;
  --element-gap: 16px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 100px;
  --radius-full-2: 800px;

  /* Named Radii */
  --radius-cards: 40px;
  --radius-pills: 800px;
  --radius-small: 16px;
  --radius-inputs: 100px;
  --radius-medium: 20px;
  --radius-buttons: 40px;

  /* Surfaces */
  --surface-fondo-canvas: #EAF0F6;
  --surface-papel-surface: #FFFFFF;
  --surface-azul-band: #0036A5;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-fondo: #EAF0F6;
  --color-papel: #FFFFFF;
  --color-azul: #0036A5;
  --color-azul-medio: #155BCD;
  --color-bruma: #AECDED;
  --color-error: #C62828;

  /* Typography */
  --font-pp-neue-corp-compact: 'PP Neue Corp Compact', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-dm-sans: 'DM Sans', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-system-sans-serif: 'System sans-serif', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --text-body-sm: 14px;
  --leading-body-sm: 1.2;
  --text-body: 16px;
  --leading-body: 1.55;
  --text-subheading: 26px;
  --leading-subheading: 1.2;
  --text-heading-sm: 30px;
  --leading-heading-sm: 1.5;
  --text-heading: 32px;
  --leading-heading: 1;
  --tracking-heading: 0.64px;
  --text-heading-lg: 48px;
  --leading-heading-lg: 1;
  --text-heading-2xl: 80px;
  --leading-heading-2xl: 1.1;
  --text-heading-3xl: 96px;
  --leading-heading-3xl: 0.95;
  --text-display: 189px;
  --leading-display: 0.94;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-8: 8px;
  --spacing-9: 9px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-56: 56px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-92: 92px;

  /* Border Radius */
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 24px;
  --radius-3xl-2: 32px;
  --radius-3xl-3: 40px;
  --radius-full: 100px;
  --radius-full-2: 800px;
}
```
