# Caldera — Style Reference
> neon pressed into obsidian. The canvas is total black, and every magenta or violet element reads as light glowing up from beneath the surface.

**Theme:** dark

Caldera now runs on a pure black canvas lit by two chromatic accents. The interface is flat and unshadowed, letting ultrabold compressed type at near-architectural scale (up to 189px) carry all structural weight. A single vivid magenta (#EC4899) acts as the primary aggressive chromatic accent against total black, with a violet (#8B5CF6) reserved for the hero gradient, glow effects, and a secondary card, plus a lighter violet tint used for tags. The visual language is nocturnal rather than volcanic: condensed heavy letterforms, halftone dot patterns, 40px radii on cards and buttons, and 800px pill controls — light contained within a void-black surface.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Magenta | `#EC4899` | `--color-magenta` | Primary action buttons, featured stat cards, key visual highlights — the only warm chromatic accent; its vivid saturation against black creates urgency without needing supporting decorative weight |
| Violet | `#8B5CF6` | `--color-violet` | Hero gradient base, single secondary card surface, glow/effect treatments — appears in the hero dot pattern, effect washes, and one standout card; never used for controls |
| Violet Mist | `#C4B5FD` | `--color-violet-mist` | Tag and category badge backgrounds, small highlight washes — a light tint of Violet that labels blog post categories and program announcements |
| Carbon | `#18151E` | `--color-carbon` | Card surfaces, content block backgrounds, secondary button fills — the violet-tinted charcoal that lifts elements off the black canvas |
| Onyx | `#000000` | `--color-onyx` | Page canvas, dominant background — pure black that grounds every section; darker than card surfaces to create figure/ground separation without shadows |
| Obsidian | `#070607` | `--color-obsidian` | Text on bright accent fills, button borders, dotted dividers — near-black used only against Magenta, Violet, or Violet Mist surfaces, never against the black canvas |
| Chalk | `#ffffff` | `--color-chalk` | Primary text, headings, link text, high-contrast overlays — pure white, now the primary text color everywhere since every surface in the system is dark |

## Tokens — Typography

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

Filled Magenta (#EC4899) with Obsidian (#070607) text. 800px border-radius (full pill). Padding 12px vertical, 24px horizontal. DM Sans 500 weight at 16px. No shadow. The pill shape is the most distinctive control shape in the system — never rectangular.

### Secondary Pill Button
**Role:** Alternative action or paired CTA

Transparent background, 1.5px Chalk (#ffffff) border, Chalk text. 40px border-radius. Padding 16px all sides. DM Sans 500 at 16px. Border style is solid here, not dotted. Sits beside the primary CTA as the quieter counterpart.

### Outlined Ghost Link
**Role:** Low-emphasis text link or nav item

Transparent background, no visible border, Chalk text. 800px pill radius. Padding 0 vertical, 12px horizontal. DM Sans 500 at 16px. Used for nav items and inline links — relies on color and position rather than container weight.

### Stat Feature Card
**Role:** Highlight key metrics (TVL, transactions, etc.)

Magenta (#EC4899) solid background, Chalk (#ffffff) text. 40px border-radius. Padding 40px on all sides. No shadow. The large metric number uses PP Neue Corp Compact at 80px+; the label above uses DM Sans 500 at 14–16px. These cards are the system's most visually dominant elements after the hero.

### Content Card
**Role:** Blog posts, announcements, program entries

Carbon (#18151E) background, no border, no shadow. 40px border-radius. Padding 40px all sides. Contains a category tag, headline (PP Neue Corp Compact 26–32px in Chalk), and date metadata. The image area at the top can be a halftone or solid Magenta block.

### Violet Hero Card
**Role:** Single standout content surface

Violet (#8B5CF6) background with a white halftone dot pattern overlay. 40px border-radius. Used sparingly — appears once as a signature visual anchor. No shadow.

### Category Tag Badge
**Role:** Label blog posts and announcements

Violet Mist (#C4B5FD) background, Obsidian (#070607) text. Pill shape (800px radius). DM Sans 500 at 12–14px. Padding approximately 3–4px vertical, 8–10px horizontal. Small, soft, and functionally distinct — the only tinted element in the system.

### Navigation Bar
**Role:** Top-level site navigation

Onyx (#000000) page background continues through. Nav items are Chalk text in DM Sans 500 at 16px, separated by 9px gaps. The entire nav row can sit inside a Carbon (#18151E) pill container with 800px radius — a signature element. Logo lockup (mountain icon + wordmark) sits left, social icons and CTA right.

### Hero Halftone Block
**Role:** Hero section visual centerpiece

Large rounded rectangle filled with a Violet (#8B5CF6) to Magenta (#EC4899) gradient overlaid with a magenta halftone dot pattern. 40px border-radius. Dimensions are hero-scale (roughly 50% of viewport width). The halftone effect is the system's most distinctive visual signature — pixel-art-like, high-density dot grid that fades to solid magenta at the top right.

### Input Field
**Role:** Form input

Transparent background, 1.5px Chalk (#ffffff) border. 100px border-radius (pill). Padding 24px vertical, 32px left, 64px right. Chalk text. DM Sans 500. This treatment now applies throughout, since the entire interface sits on a dark canvas.

### Partner Logo Strip
**Role:** Display ecosystem partners or integrations

Carbon (#18151E) background card, 40px radius, 40px padding. Logos arranged in a single row with consistent height, separated by vertical 1.5px Chalk dotted dividers. No individual logo containers — flat inline treatment.

### Dotted Divider
**Role:** Section separator and decorative detail

1.5px dotted line in Chalk (#ffffff). Used as vertical dividers in nav and partner strips, and occasionally as horizontal section breaks. The dotted (not dashed, not solid) style is a small but consistent signature detail.

## Do's and Don'ts

### Do
- Use PP Neue Corp Compact at 48px or larger for any heading that needs to feel structural — below 40px the ultrabold weight overwhelms and loses its industrial character
- Apply 40px border-radius to all cards, content blocks, and non-pill buttons as the default surface radius
- Use 800px border-radius (full pill) for all buttons, tags, nav containers, and small interactive elements
- Set primary CTAs to Magenta (#EC4899) with Obsidian (#070607) text, sized at 12px/24px padding — never rectangular, always pill-shaped
- Keep body text at DM Sans 500 (Medium) — never drop to Regular weight, which reads as anemic against the ultrabold display type
- Use the halftone dot pattern (magenta dots on a violet-to-magenta gradient) as the hero/signature visual treatment — it is the system's most recognizable motif
- Layer surfaces using color contrast (Onyx canvas → Carbon cards → Magenta features) rather than shadows or borders

### Don't
- Do not add drop shadows to any element — the system is intentionally flat; shadows would undermine the void-black depth
- Do not use rectangular (low-radius) buttons — the pill/40px-radius treatment is non-negotiable
- Do not introduce additional accent colors beyond Magenta and Violet (plus its Violet Mist tint) — the palette is deliberately constrained to two chromatic hues
- Do not use Regular or Bold weights of DM Sans for body — Medium (500) is the only correct weight
- Do not set headings below 26px or above 189px — the display type only works at architectural scale
- Do not use Violet for buttons or controls — it is reserved for the hero gradient, effects, and a single accent card
- Do not apply negative letter-spacing to PP Neue Corp Compact — the +0.02em positive tracking is intentional at display sizes to prevent stroke collision
- Do not use Obsidian text directly on the black canvas — it only works on top of Magenta, Violet, or Violet Mist fills; body copy and headings on the canvas always use Chalk

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Onyx Canvas | `#000000` | Page background — pure black that grounds all content |
| 1 | Carbon Surface | `#18151E` | Cards, content blocks, secondary buttons — violet-tinted dark charcoal |
| 2 | Magenta Feature | `#EC4899` | Featured stat cards and emphasis surfaces — the only warm chromatic surface elevation |
| 3 | Violet Hero | `#8B5CF6` | Hero gradient block — reserved for the homepage hero pattern overlay |

## Elevation

Deliberately shadowless. The design relies on color contrast (black canvas vs. dark charcoal cards vs. vivid magenta/violet) and generous 40px corner radii to create surface hierarchy. No element casts a shadow anywhere in the system — the flatness keeps the heavy type and bold color from feeling overwrought against the dark.

## Imagery

Imagery is minimal and deliberate. The hero uses an abstract halftone dot pattern (magenta dots on a violet-to-magenta gradient) rather than photography — it functions as brand artwork, not decoration. Product and announcement cards use either solid Magenta blocks or the Violet halftone as image-area fills, keeping a consistent graphic system. Partner/integration logos are rendered as monochrome white marks on dark backgrounds. No photography, no 3D renders, no lifestyle imagery anywhere. Icons are small, monochrome, and minimal — Discord, X, and Telegram sit in the nav as simple white glyphs. The visual language is graphic and editorial, not photographic: think poster design under blacklight, not stock imagery.

## Agent Prompt Guide

## Quick Color Reference
- Page background: #000000 (Onyx)
- Card/content surface: #18151E (Carbon)
- Primary text/headings: #ffffff (Chalk)
- Primary action: #EC4899 (filled action, Obsidian text)
- Accent: #8B5CF6 (Violet) — hero gradient and effects
- Tag/badge: #C4B5FD (Violet Mist)
- Text/border on bright fills: #070607 (Obsidian)

## 3-5 Example Component Prompts
1. Create a Primary Action Button: #EC4899 background, #070607 text, 9999px radius, compact pill padding. Use this filled treatment for the main CTA.

2. **Stat Row**: Four Magenta (#EC4899) cards in a row, each 40px radius, 40px padding. Label in DM Sans 500 at 14px, Chalk (#ffffff) text. Metric value in PP Neue Corp Compact at 80px weight 400, Chalk text, line-height 1.1.

3. **Content Card**: Carbon (#18151E) background, 40px radius, 40px padding. Violet Mist (#C4B5FD) pill tag at top with DM Sans 500 12px Obsidian text, 800px radius. Headline at 32px PP Neue Corp Compact, Chalk, letter-spacing 0.64px. Date at 12px system sans-serif, Chalk.


5. **Dark Input Section**: Onyx (#000000) background. Chalk (#ffffff) pill input with 100px radius, 24px/32px padding, 1.5px Chalk border. DM Sans 500 16px Chalk text. Submit button: Magenta fill, 800px radius, 12px/24px padding.

## Signature Motifs

Three visual signatures define Caldera's identity and should be reused across new pages: (1) The halftone dot pattern — magenta dots on a violet-to-magenta gradient, always at hero scale with 40px radius, is the most recognizable motif. (2) The 189px display headline — ultrabold compressed type at near-architectural scale, with tight 0.94 line-height, signals the page is a Caldera page. (3) The triple-radius system — 100px for inputs, 40px for cards and rectangular buttons, 800px for pills — creates a consistent roundness without monotony.

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
  --color-magenta: #EC4899;
  --color-violet: #8B5CF6;
  --color-violet-mist: #C4B5FD;
  --color-carbon: #18151E;
  --color-onyx: #000000;
  --color-obsidian: #070607;
  --color-chalk: #ffffff;

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
  --surface-onyx-canvas: #000000;
  --surface-carbon-surface: #18151E;
  --surface-magenta-feature: #EC4899;
  --surface-violet-hero: #8B5CF6;
}
```

### Tailwind v4

```css
@theme {
  /* Colors */
  --color-magenta: #EC4899;
  --color-violet: #8B5CF6;
  --color-violet-mist: #C4B5FD;
  --color-carbon: #18151E;
  --color-onyx: #000000;
  --color-obsidian: #070607;
  --color-chalk: #ffffff;

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
