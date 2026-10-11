---
version: 1
slug: "src-components-shop-index-tsx"
primary_target: "src/components/Shop/index.tsx"
related_targets: ["src/components/NavBar/index.tsx","src/components/ProductDetails/index.tsx"]
---

# Surface brief — the buying flow (catalogue, navigation, product)

Scope: `/shop`, the application's top navigation, and `/products/:id`. Visitor mode:
**Operate** — the visitor is finding a garment to buy among pieces from several
independent designer houses, scanning, filtering, comparing. Audience: a Romanian
shopper of designer fashion who knows the houses by name and judges by the picture
first, the house second, the price third. Constraints: English UI copy; MUI
components; burgundy and cream pinned by the user; the shop is pivoting to fashion
(dresses, shoes, jewellery, bags) sold by real houses, so every structure must hold
a photograph as its main content.

## Direction contract

THESIS: The catalogue is a house's printed lookbook, edited and sequenced, not a wall
of product cards. One piece leads each page at full size with its credit line; the
rest follow it. It refuses the category default this flow ships today — the uniform
grid of bordered, shadowed white cards where every garment is the same size, the
house is a line of small print, and the photograph is a thumbnail inside a container.

OWN-WORLD: Burgundy committed at page scale (the navigation is a full burgundy field,
section mastheads and the lead plate's credit panel are burgundy grounds), cream as
the paper, ink near-black, white only inside photographs. No card borders and no
shadows: the photograph sits directly on the paper, and the only rule drawn is the
hairline under a credit line. Marcellus in wide-tracked capitals is the house voice
for mastheads and names; Archivo carries every control, label, and figure, with
tabular numerals for prices and counts. Density is a printed page: large pictures,
few per row, generous paper around them.

STORY: The visitor reads the catalogue as an edited collection rather than a feed,
sees in the first viewport that several houses supply it, and acts by opening a look
or narrowing the collection with ordinary filters.

FIRST VIEWPORT: Standard top navigation as a full burgundy field, the categories as
wide-tracked capitals. Beneath it the collection masthead: left, the word COLLECTION
over the season line, the piece count and the number of houses set as figures; right,
the lead plate, the first piece of the current sheet at roughly twice the width of a
following plate, its credit line beneath it — number, name, house, price. Under the
masthead a hairline, then the sheet: three plates per row at desktop, each a
photograph on the paper with a credit line under a hairline. Filters stay ordinary
MUI controls in a left rail separated by one hairline; sort and search sit on the
masthead rule, right-aligned. The primary action is opening a look; add-to-cart and
favourite appear on the plate at hover and are always present on the product page.

SIGNATURE MOVE: the page turn. Hovering a plate cross-fades to the next photograph of
that same look from its gallery, the way turning a lookbook page shows the piece
again from another angle; a look with one photograph holds still rather than faking
one. Sold-out looks are covered by the tissue interleaf — a translucent warm sheet
over the photograph carrying the word printed on it — instead of a coloured pill.

FORM: The Collection Lookbook — a fashion house's printed lookbook and press kit,
candidate 1 of my ordered grounded list, presented as IMPECCABLE'S PICK against the
roll's assignment (candidate 7, the wardrobe plot) and chosen by the user, which beats
the roll. Seed key `c0865bb6`, scope direction, mode operate, build path code-led.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish
review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Raises carried from the declined challengers

- Size encodes a real quantity, never decoration (from the Labanotation score): the
  lead plate is larger because it leads the sheet, and nothing else varies in size.
- Colour commits at the scale of whole regions rather than as an accent (from the zoo
  guide map): the navigation and the mastheads are burgundy fields.
- Density without apology (from Datamatics): the sheet fills its rows.
- Fixed slots that never overflow (from the cassette j-card): every credit line
  carries the same four facts in the same order, clamped, whatever the content.
- Visible, honest structure (from the Crouwel grid specimen, competitive): the grid's
  rhythm is readable on the page rather than hidden behind containers.

## Unresolved

- Whether the lead plate stays the first piece of the current sheet (it renumbers and
  re-leads as filters change) or becomes an editorial choice the seller makes.
- Whether the product page keeps MUI's standard quantity field or takes the lookbook's
  own stepper once the fashion catalogue has sizes.
