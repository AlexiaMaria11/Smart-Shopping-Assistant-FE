---
name: Smart Shop
description: A multi-seller fashion catalogue set as a house's printed lookbook — burgundy committed at region scale, photographs on bare cream paper, one hairline per plate.
colors:
  burgundy: "#722F37"
  burgundy-dark: "#4A1520"
  burgundy-light: "#9B4A55"
  burgundy-bright: "#8B3A44"
  burgundy-deep: "#5A2430"
  clay: "#C4907C"
  clay-dark: "#9A6855"
  clay-light: "#E8C0B0"
  blush-pale: "#F8EDE8"
  paper-cream: "#FBF5EE"
  paper-cream-dark: "#F0E6D8"
  plate-white: "#FFFFFF"
  ink: "#1C0A08"
  cocoa: "#7A4F3A"
  hairline: "#E4CEBC"
  signal-amber: "#C46A1B"
  signal-red: "#C62828"
  olive-green: "#5C8A4E"
  harbour-blue: "#2E7D9E"
  gold: "#C9A84C"
typography:
  masthead:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "clamp(2.4rem, 6vw, 4.4rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.08em"
  display:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "clamp(1.85rem, 3.4vw, 2.4rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    letterSpacing: "0.14em"
  plate-name:
    fontFamily: "Marcellus, Georgia, serif"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "0.88rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 600
    letterSpacing: "0.14em"
  figure:
    fontFamily: "Archivo, Inter, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 600
    letterSpacing: "0.01em"
    fontFeature: "tabular-nums"
rounded:
  squared: "0"
  hair: "3px"
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "18px"
  xxl: "20px"
  pill: "50px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.plate-white}"
    typography: "{typography.label}"
    rounded: "{rounded.squared}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.burgundy-dark}"
    textColor: "{colors.plate-white}"
  button-primary-disabled:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.cocoa}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.burgundy}"
    typography: "{typography.label}"
    rounded: "{rounded.squared}"
    padding: "8px 16px"
  button-outline-hover:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.plate-white}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.cocoa}"
    typography: "{typography.label}"
    rounded: "{rounded.squared}"
    padding: "4px 2px"
  nav-field:
    backgroundColor: "{colors.burgundy-dark}"
    textColor: "{colors.plate-white}"
    height: "64px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "rgba(255, 255, 255, 0.72)"
    typography: "{typography.label}"
    rounded: "{rounded.squared}"
    padding: "6px 2px"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.plate-white}"
  plate-frame:
    backgroundColor: "{colors.paper-cream-dark}"
    rounded: "{rounded.squared}"
  plate-credit:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "9px 0 0"
  plate-credit-lead:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.plate-white}"
    padding: "14px 18px 16px"
  plate-action:
    backgroundColor: "rgba(255, 255, 255, 0.94)"
    textColor: "{colors.ink}"
    rounded: "{rounded.squared}"
    size: "34px"
  plate-action-hover:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.plate-white}"
  tissue-interleaf:
    backgroundColor: "rgba(255, 255, 255, 0.74)"
    textColor: "{colors.ink}"
    typography: "{typography.plate-name}"
  input-underline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.squared}"
  chip-credit:
    backgroundColor: "transparent"
    textColor: "{colors.cocoa}"
    typography: "{typography.label}"
    rounded: "{rounded.squared}"
  gallery-thumb:
    backgroundColor: "{colors.paper-cream-dark}"
    rounded: "{rounded.squared}"
    width: "64px"
    height: "80px"
---

# Design System: Smart Shop

## Overview

**Creative North Star: "The Collection Lookbook"**

The catalogue is read as a fashion house's printed lookbook: edited and sequenced rather than stacked. One piece opens each sheet at full width with its credit line; the rest follow it at equal size. Photographs sit directly on the cream paper — no container, no border, no shadow — and the only rule drawn per plate is the hairline over its credit line. Burgundy is not an accent here: it commits at the scale of whole regions, as the flat navigation plane and as the ground under the lead plate's credits. Marcellus in wide-tracked capitals is the house voice; Archivo carries every control, label and figure.

Density is a printed page: large pictures, three per row at desktop, generous paper between them. Depth is absent by design — the lookbook world ships no shadows and no corner radius at all. Hierarchy comes from size, from the burgundy regions, and from hairlines. What this world rejects, and rejects explicitly, is the category default it replaced: a uniform grid of bordered, shadowed white cards where the photograph is a thumbnail inside a container and the house is a line of small print.

**Scope of record.** This is the system of record and, as of this redesign pass, it is applied across the whole application: the Shop catalogue, the top navigation and the product page (its original surfaces), plus Home, Favorites, the sellers directory and seller storefronts (on the shared `ProductLook` plate — `common/ProductCard` has been retired), the cart drawer and AI cart-analysis dialog, checkout, orders, auth, and every seller/admin operator screen (store, seller orders, admin orders, companies, categories, products, promotions). Operator screens keep MUI's table/dialog/form structure and density — they are Operate-mode, not plate grids — but render it in the lookbook grammar: square corners, hairlines instead of boxed borders, flat burgundy regions instead of gradients, no shadows, Marcellus for titles, tabular Archivo figures. The rounded/shadow/gradient ramps still live in `src/theme.ts` as unused legacy tokens; nothing in the shipped app reaches for them any more.

**Brand commitments carried from PRODUCT.md:** the burgundy-and-cream palette is pinned by the user and binding on every surface — a redesign may change how far the colour commits, never the colours. Interface copy is English, and MUI remains the component library, styled through the CSS custom properties `src/main.tsx` emits from the theme.

**Key Characteristics:**
- Photographs on bare paper: no card, no border, no shadow, no radius
- Burgundy committed at region scale, not sprinkled as an accent
- Exactly one hairline per plate, drawn over its credit line
- A single authored motion moment: the page turn
- Marcellus at one weight (400), Archivo for every control and figure
- Figures tabular everywhere they can be compared

## Colors

A pinned two-pole palette — burgundy as the house colour and cream as the paper — with warm clay as the only secondary and a near-black ink for text. Values are normative in the frontmatter; `src/theme.ts` is their single source and `src/main.tsx` emits each one as a custom property, including RGB channel triplets (`--primary-rgb`, `--accent-rgb`, `--ink-rgb`, `--white-rgb`) so a stylesheet can tint at any alpha without restating a hex.

### Primary
- **Burgundy** (`--primary`): the house colour. The ground of the lead plate's credit panel, the fill of the primary action, the colour of an active filter, a hovered plate name, and the "last few" note.
- **Burgundy Dark** (`--primary-dark`): the navigation plane — one flat field, the deepest commitment of the colour in the build — and the primary action's hover.
- **Burgundy Light / Bright / Deep** (`--primary-light`, `--burgundy-bright`, `--burgundy-deep`): the intermediate steps every legacy gradient runs through, plus the scrollbar thumb. Not used on a lookbook surface.

### Secondary
- **Warm Clay** (`--accent`): the avatar fill in the navigation and the hairline tint that closes the burgundy field (`rgba(var(--accent-rgb), 0.35)`). Deliberately scarce.
- **Clay Dark / Light / Blush Pale** (`--accent-dark`, `--accent-light`, `--accent-pale`): hover tints and legacy card-world surfaces.

### Neutral
- **Paper Cream** (`--cream`): the paper. The ground of `body`, the catalogue and the product page. Photographs land straight on it.
- **Paper Cream Dark** (`--cream-dark`): the plate's own ground behind a photograph while it loads, and the gallery thumbnail ground.
- **Plate White** (`--white`): type on burgundy, the action chip behind an icon on a photograph, and input fills. Never a page background in this world.
- **Ink** (`--text-primary`): all body and name text.
- **Cocoa** (`--text-secondary`): credits, labels, folios, counters, currency marks.
- **Hairline** (`--border`): the one rule per plate, the masthead rule, the rail's dividing rule, every credit-block rule.

### Status
- **Signal Amber** (`--warning`): low stock on the product page.
- **Signal Red** (`--error`), **Olive Green** (`--success`), **Harbour Blue** (`--info`), **Gold** (`--gold`): carried in the theme for forms, alerts and the not-yet-migrated surfaces.

### Named Rules
**The Region Commitment Rule.** Burgundy is committed at the scale of a whole region or not at all. The navigation is a full flat burgundy plane; the lead plate's credit panel is a burgundy ground. There is no burgundy-tinted card, no burgundy left-border stripe, and no burgundy badge floating on a photograph.

**The Bare Photograph Rule.** A photograph sits directly on the cream paper. No card, no border, no shadow, no radius, no overlay gradient. The 4:5 frame (4:3 for the lead) is the only container, and it is invisible.

**The One Hairline Rule.** Each plate draws exactly one rule: a 1px hairline between the photograph and its credit line. A second rule inside a plate is a defect. The lead plate drops even that one, because its burgundy ground already separates the credits.

## Typography

**Display Font:** Marcellus (with Georgia, serif)
**Body Font:** Archivo (with Inter, system-ui, sans-serif)

Both ship from Google Fonts in `index.html`: `Archivo:wght@400;500;600;700` and `Marcellus` (single weight). Playfair Display and Poppins, the previous world's pairing, are gone from the codebase.

**Character:** Marcellus is a Roman-inscriptional serif — upright, open, slightly austere — and it reads as a house mark when tracked wide in capitals. Archivo beside it is plain, modern and unsentimental, which is exactly what controls and figures should be. The pairing is a press kit, not a boutique sign.

### Hierarchy
- **Masthead** (Marcellus 400, `clamp(2.4rem, 6vw, 4.4rem)`, line-height 0.95, tracking 0.08em, uppercase): the word COLLECTION opening the catalogue. The `masthead` step (4.4rem) is the largest in the ramp and exists for this one role.
- **Display** (Marcellus 400, `clamp(1.85rem, 3.4vw, 2.4rem)`, line-height 1.1): the piece name on the product page.
- **Title** (Marcellus 400, 1rem, tracking 0.14em, uppercase): section titles — "Description", "Also in the collection" — and the rail's heading at 0.95rem with 0.16em tracking.
- **Plate Name** (Marcellus 400, 0.88rem, line-height 1.3, two-line clamp): the name in a plate's credit line; 1rem and white on the lead.
- **Body** (Archivo 400, 0.88rem, line-height 1.6; 1.75 for the product description, capped at 68ch): prose, descriptions, control text.
- **Label** (Archivo 500–600, 0.72rem, tracking 0.12–0.18em, uppercase): houses, folios, stock notes, navigation items, section labels, button text, the gallery counter.
- **Figure** (Archivo 600, 0.82rem, `font-variant-numeric: tabular-nums`): the price in a credit line, and at `var(--text-amount)` for the product page's large price — same family, no exception, so digits stay unambiguous at any size.

### Named Rules
**The One Weight Rule.** Marcellus ships at weight 400 and only 400. The family has a single weight, so every rule that once asked for 600 or 700 had the request stripped rather than letting the browser synthesize a fake bold. Emphasis in the house voice comes from size, tracking and case — never from weight. Weights 500/600/700 belong to Archivo alone.

**The Tabular Figures Rule.** Any number a reader might compare or watch change — prices, the price-range bounds, the plate folio, the gallery counter — carries `font-variant-numeric: tabular-nums`. Figures must not shuffle horizontally.

**The Wide Capitals Rule.** Marcellus goes uppercase with tracking of 0.08em and up when it names a thing (masthead, section title, rail heading, the wordmark at 0.26em, the tissue word at 0.34em with a matching `text-indent`). Marcellus set in sentence case stays untracked.

## Layout

The catalogue is an `xl` MUI container (`pt: 5, pb: 8`); the product page is `lg` (`py: 4`). Spacing runs on an 8px rhythm with five steps (8/12/16/24/32px) and only two authored exceptions: the sheet's 40px row gutter, which is the air between rows of plates, and the plate's internal 12px/9px credit offsets.

**The opening spread** is a two-column grid — `minmax(0, 1fr)` for the title column and `minmax(380px, 700px)` for the lead plate — with the masthead block, the contents index and the HOUSES block stacked in the left column and the houses pushed to the bottom (`margin-top: auto`) so the air between them is composed rather than trailing. Search and sort ride the masthead rule, right-aligned, spanning both columns. One hairline closes the spread.

**The sheet** is a fixed-column grid, not an auto-fill: three columns at desktop, four above 1601px, two below 1000px and at phone width. Row gutter 40px, column gutter 24px (16px at phone). Plate count per row is an editorial decision, which is why it is enumerated rather than derived from a min-width.

**The body** is a flex pair: a 208px sticky left rail separated by a single vertical hairline, and the sheet taking the rest. Below 900px the rail becomes a `<details>` disclosure that names itself, goes full width, and swaps its right rule for a bottom one; the contents index and the HOUSES block hide entirely, since the rail carries the same filters.

**The product page** is a 1.1fr / 1fr grid — plate left, credits right — collapsing to one column below 900px. Breakpoints in use: 480, 600, 900, 1000, 1100, 1280, 1601px.

The shared `.product-grid` in `src/index.css` (auto-fill, `minmax(230px, 1fr)`, 24px gap) is the *card-world* grid belonging to the surfaces not yet migrated.

### Named Rules
**The Size Encodes Quantity Rule.** The lead plate is wider (4:3, up to 700px, max-height 560px) because it leads the sheet. Nothing else varies in size. Size is never decoration.

## Elevation & Depth

**This world has no shadows.** Not one lookbook surface draws a box-shadow; the navigation explicitly sets `box-shadow: none`, and the primary action does too. Depth is conveyed by three devices instead: the cream/cream-dark tonal step between paper and plate ground, the burgundy regions reading as ink laid on paper, and hairlines as the only separators. Nothing floats and nothing lifts on hover.

The shadow vocabulary in `src/theme.ts` (`sm` through `actionHover`, every one burgundy at low alpha, never neutral black) is retained **only** for the surfaces still on the previous card system. It is not available to a lookbook surface.

### Named Rules
**The No-Lift Rule.** A lookbook surface never gains a shadow, a translate, or a scale on hover. State is shown by colour, by an underline, by a border taking the house colour, or by the page turn.

## Shapes

Square. Every lookbook element is `border-radius: 0`: plates, the primary action, the favourite control, gallery thumbnails, chips, the quantity field, the rail's clear button. The frontmatter keeps the legacy radius ramp (8/10/12/16/18/20/50px) because the unmigrated surfaces consume it, and `hair: 3px` because the global focus ring uses it.

Borders are 1px hairlines and nothing heavier: `--border` for rules on paper, `--primary` for a selected thumbnail or an outlined control, `rgba(var(--ink-rgb), 0.18)` around an action chip sitting on a photograph, `rgba(var(--accent-rgb), 0.35)` closing the navigation field. Aspect ratios are fixed and editorial: 4:5 for a plate and for the product page's main plate, 4:3 for the lead, 64×80px for a thumbnail.

### Named Rules
**The Square Corner Rule.** On a lookbook surface the radius is 0. A rounded corner is the previous world showing through, and a pill is the previous world's primary action.

## Components

### Buttons
- **Shape:** square corners (0), always.
- **Primary** (`.product-detail-add`): flat burgundy, white Archivo label at 0.72rem, uppercase, tracking 0.16em, padding 14px 22px, no shadow, no gradient. Hover deepens to burgundy-dark over 0.2s. Disabled becomes the hairline colour with cocoa text.
- **Outline** (`.rail-clear`): 1px burgundy border on nothing, burgundy label at 0.72rem with 0.12em tracking, uppercase, padding 8px 16px; hover inverts to a solid burgundy field with white text.
- **Quiet** (`.product-detail-back`): transparent, cocoa label, padding 4px 2px, no background on hover — only the colour shifts to burgundy.
- **Icon action on a photograph** (`.look-act`): 34×34px, white at 94% opacity with a 1px ink-18% border; hover and both committed states (favourited, added) fill burgundy with a white glyph.

### Chips
- **Style:** squared, hairline border, cocoa text at 0.72rem, uppercase, tracking 0.12em. Categories on the product page read as credits, not as tappable tags.

### Cards / Containers
There are no cards in this world. The plate replaces them (see below). The MUI `MuiCard` override — 18px radius, card shadow, hairline border, −5px hover lift — belongs to the surfaces not yet migrated and must not be introduced onto a lookbook surface.

### Inputs / Fields
- **Style:** standard-variant underline only. 1px hairline underline, no fill, no radius, text at 0.82rem; the search carries an inline search glyph in cocoa at 18px.
- **Focus / Hover:** the underline takes the house colour; MUI's focused notched outline on outlined fields goes to 2px burgundy.
- **Quantity field:** outlined, radius forced to 0, white fill, 96px wide.
- **Focus ring (global):** 2px solid burgundy, 2px offset, 3px radius; it switches to white inside the navigation and footer so it stays visible on the burgundy plane.

### Navigation
- **Style:** one flat burgundy-dark field, 64px minimum toolbar, no shadow and no gradient, closed by a single clay-tinted hairline.
- **Wordmark:** Marcellus, 0.95rem, uppercase, tracking 0.26em, white; tightens to 0.82rem with 0.16em tracking below 480px.
- **Links:** Archivo 500 at 0.72rem, uppercase, tracking 0.18em, white at 72%, squared, padding 6px 2px, with a transparent 1px bottom border held in reserve. Hover brings the text to full white and the rule to white-40%; the active section carries a solid white rule. No fill, ever.
- **Mobile:** a hamburger opens a 240px drawer; links are uppercase with 0.14em tracking, and the active one takes a burgundy-8% wash.

### The Plate (signature component)
The unit of the whole system, shared verbatim by the collection sheet and the product page's "also in the collection" strip so both read as the same book.
- **Frame:** 4:5, cream-dark ground, overflow hidden, no border and no radius. The whole photograph is one link.
- **Page turn:** if the piece has a second photograph, it is stacked at opacity 0 and cross-fades in over 0.55s `cubic-bezier(0.2, 0.7, 0.2, 1)` on hover or focus-within. A piece photographed once holds still rather than faking a second view. This is the only authored motion moment in the world.
- **Tissue interleaf:** a sold-out piece is covered by a translucent warm sheet (white at 74%) carrying the word SOLD OUT in Marcellus, uppercase, tracking 0.34em, centred. It is the sold-out state in full — there is no pill and no badge.
- **Actions:** favourite and add-to-cart sit bottom-right, revealed at opacity 0 → 1 over 0.25s on hover or focus-within, and pinned permanently visible below 600px where there is no hover.
- **Credit line — a fixed four-slot contract:** folio (two-digit, zero-padded, tabular, renumbering with the current filter), name, house, price-with-currency, in that order, under the one hairline. Low stock adds a "Last N" note in burgundy beneath. Every plate prints the same facts in the same order.
- **Lead variant:** the frame widens to 4:3 (max-height 560px) and the credit block becomes a burgundy ground with white type, its hairline dropped. Width is what makes it the lead; it does not get taller.

### Product Gallery
A 4:5 main plate on cream-dark, the photograph count set as a tabular uppercase credit *under* a hairline below the plate rather than as a pill on the image, then 64×80px squared thumbnails at 72% opacity — full opacity on hover, burgundy border when active.

## Do's and Don'ts

### Do:
- **Do** put the photograph straight on the cream paper with no container, border, shadow or radius.
- **Do** commit burgundy at region scale — a whole plane or a whole panel — per **The Region Commitment Rule**.
- **Do** draw exactly one hairline per plate, over its credit line.
- **Do** keep Marcellus at weight 400 and get emphasis from size, tracking and case (**The One Weight Rule**).
- **Do** set every comparable figure with `font-variant-numeric: tabular-nums`.
- **Do** print the credit line in its fixed order: folio, name, house, price.
- **Do** enumerate sheet columns per breakpoint (3 at desktop, 4 above 1601px, 2 below 1000px) rather than auto-filling from a min-width.
- **Do** make the lead plate wider and never taller; size encodes rank and nothing else.
- **Do** route every colour, size, space and radius through the theme tokens and the custom properties `main.tsx` emits, and tint with the `-rgb` triplets rather than restating a hex.
- **Do** keep every motion device inside the `prefers-reduced-motion` guard; the global rule flattens them all, and the page turn names itself again locally.

### Don't:
- **Don't** add a box-shadow to a lookbook surface; this world ships none (**The No-Lift Rule**).
- **Don't** round a corner on a lookbook surface, and don't bring back the pill-shaped primary action.
- **Don't** use a gradient for a burgundy region; the navigation is a flat field, and the theme's gradients belong to the unmigrated surfaces.
- **Don't** put a coloured badge or pill on a photograph — availability is the tissue interleaf, and the photograph count is a credit beneath a hairline.
- **Don't** lift, scale or shadow a plate on hover; the page turn is the response.
- **Don't** reach for `.product-grid` or `MuiCard` on a lookbook surface; both belong to the previous card world.
- **Don't** let Marcellus render a synthetic bold by asking for weight 600 or 700.
- **Don't** vary plate size for emphasis, and don't add a second rule inside a plate.
- **Don't** change the burgundy-and-cream poles; the palette is pinned in PRODUCT.md and binding on every surface.
