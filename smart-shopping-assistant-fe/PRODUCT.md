# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three roles, treated as equally important — this is a complete platform, not a
storefront with admin tooling bolted on:

- **Customer.** Browses the catalog, compares products, keeps favorites, fills a
  cart and checks out. May receive items from several sellers in one order.
- **Seller.** A company with its own store page inside the marketplace. Manages
  its products, stock and promotions, and fulfils its own packages.
- **Admin.** Operates the platform: approves or suspends companies, moderates the
  catalog, and oversees all orders.

Each signed-in user has their own cart and favorites. Sellers may only touch
their own company's data; admins may touch everything.

## Product Purpose

A multi-seller marketplace where several independent companies sell through one
catalog and one checkout. Customers shop the whole catalog without caring which
company holds the stock; each seller ships its own package and the platform takes
a commission per company.

Success for this project is a convincing, coherent end-to-end marketplace: the
piece is built as a **portfolio and demo project**, so it is judged by how
complete and believable the whole flow looks when someone is shown it, not by
production traffic or revenue.

## Positioning

- **One order, several sellers.** An order splits into a package per company,
  each with its own status track (Pending → Confirmed → Shipped → Delivered), and
  a package can be cancelled without killing the order.
- **Promotions apply themselves.** No discount codes to hunt for. Promotions are
  defined per product, category or company, and valid ones are applied
  automatically to the cart and recorded on the order.
- **Designer fashion, several houses, one basket.** Decided 2026-10-11: the shop
  sells fashion — dresses, shoes, jewellery, bags — from real designer houses,
  each selling under its own name. Every surface must therefore be built to hold
  a photograph as its main content. The catalogue is being reseeded with real
  houses and fashion categories after this redesign.

## Operating Context

- Desktop and mobile browsers. No native app.
- Romanian market: prices in RON, shipping addresses use Romanian counties, demo
  companies and accounts use `.ro` domains.
- Runs locally for demonstration: a .NET API on `https://localhost:7032` and a
  Vite dev server on `:5173`. Database migrations and demo data are seeded
  automatically when the API starts.
- The product is shown by walking through it live with the seeded demo accounts,
  switching between the customer, seller and admin views.

## Capabilities and Constraints

**Built today:** accounts and JWT roles; companies/sellers with approval status
and per-company commission; categories; products with stock, multiple images and
a main image; a product page with gallery, seller link, applicable promotions,
quantity picker and similar products; per-user cart and favorites; promotions;
checkout with simulated card or cash on delivery; orders split into per-seller
packages; seller and admin order views.

**Planned, in this order:** reviews and 1–5 star ratings (only from customers who
received the product); server-side search, filtering, sorting and pagination;
product variants with their own stock; a seller dashboard; an admin dashboard.

**Constraints:**

- The UI is written in **English**, even though the team speaks Romanian.
- Components stay on **MUI**, styled through the CSS variables generated from
  `theme.ts`. No second UI framework.
- React + TypeScript + Vite front end against a REST API; all state the user owns
  (cart, favorites) lives on the server, per user.
- The AI cart analysis is **optional** — without an OpenAI key configured the
  backend disables it and the frontend hides the feature. Nothing may depend on
  it being present.
- Payment is **simulated**. No real money moves and no card data is stored.

## Brand Commitments

- The name **Smart Shopping Assistant**, shown in the product as **Smart Shop**.
- English interface copy.
- MUI as the component library.
- **Burgundy and cream.** Pinned by the user on 2026-10-11 and binding on every
  surface; a redesign may change how far the colour commits, never the colours.

Not binding: the typefaces. Playfair Display + Poppins were replaced on
2026-10-11 by Marcellus (the house voice, wide-tracked capitals) and Archivo
(controls, labels and figures).

## Evidence on Hand

- **Seeded demo data only.** 41 products across 10 categories, a handful of demo
  companies, demo accounts (`admin@smartshop.ro`, `client@smartshop.ro`,
  `contact@technova.ro`), and seeded promotions and orders. All of it is written
  by `DataSeeder*.cs`.
- Product photography is hotlinked from Unsplash.
- **There are no real customers, sellers, orders, reviews, testimonials, press,
  pricing or usage metrics.** Future work must not invent any — no fake review
  counts, no "trusted by N shops", no made-up ratings in mockups or copy. Where a
  surface needs social proof, it has to come from the seeded data or be left out.

## Product Principles

1. **Three roles, one product.** Customer, seller and admin surfaces are held to
   the same standard; none is treated as a back office afterthought.
2. **The marketplace is visible, not hidden.** Who sells an item, who ships it and
   what state that package is in are always legible to the customer.
3. **The system does the work.** Promotions, stock checks and order splitting
   happen on their own; the user is not asked to manage what the platform knows.
4. **Nothing is faked.** The data shown comes from the real seeded catalog, and
   absences are left visible rather than filled with invented proof.
5. **Degrade without breaking.** Optional pieces — the AI assistant above all —
   can be absent and the shop still works end to end.
