<div align="center">

  <div>
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/-MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
    <img src="https://img.shields.io/badge/-React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  </div>

  <h3 align="center">Maison — Smart Shopping Assistant Frontend</h3>

  <p align="center">
    The client for <strong>Maison</strong>, a multi-seller fashion marketplace styled as a printed
    "collection lookbook": customers browse, buy and review across independent sellers, sellers run their
    own store, and an optional AI pipeline tells shoppers exactly which product completes their next discount.
  </p>

</div>

## 📋 Overview

This is the React + TypeScript client for the
[Smart Shopping Assistant API](https://github.com/AlexiaMaria11/Smart_Shopping_Assistant). It serves three
distinct roles behind one login screen — **Customer**, **Seller** and **Admin** — each landing on and seeing
a different part of the app, all sharing the same design language.

## ✨ Features

**Customer**
- Account **registration / login**, with cart and favorites tied to the account
- **Shop** — server-side search, category/company/price filters, in-stock toggle, sorting and pagination
- **Product page** — image gallery, stock status, applicable promotions, star-rating reviews, and a
  "similar products" strip
- **Favorites / wishlist**
- **Cart drawer** with an **AI Analyze dialog** (hidden automatically when the backend has no AI key
  configured) that shows:
  - Active deals the cart already qualifies for
  - Near-miss deals with what's missing and the exact savings
  - Concrete product suggestions to complete a deal or complement what's already in the cart, approvable
    one by one or all at once
- **Checkout** — shipping address, card (simulated) or cash-on-delivery payment, live stock and free-shipping
  feedback
- **Order history** and order detail, with per-seller delivery status
- Leaving a **review** (1–5 stars + comment) once a product has actually been delivered

**Seller**
- Self-registration that creates their **company** (pending Admin approval)
- Seller **store page**, product/promotion management scoped to their own company
- **Order management**, tabbed by to-prepare / on-the-way / finished, with status actions
- A **dashboard**: today / 30-day / all-time revenue and orders, plus top-selling products

**Admin**
- **Companies** directory with approve / reject / suspend
- Platform-wide **categories**, **products** and **promotions** management
- **All orders** across every seller
- A **dashboard** mirroring the seller one, platform-wide, plus top categories

Global state is kept in React Context (`AuthProvider`, `CartProvider`, `FavoritesProvider`), with route
guards (`RequireRole`) enforcing login and role access per page.

## 🏗️ Project structure

```text
src/
├── api/
│   ├── base/http.ts          axios instance / base config, 401 → auto sign-out
│   ├── clients/               typed API clients (Auth, Products, Categories, Promotions,
│   │                           Companies, Cart, Favorites, Orders, Reviews, Features)
│   └── models/                request/response models matching the backend DTOs
├── components/
│   ├── Auth/                   Login, Register, SellerRegister, RequireRole guard, homeForRole
│   ├── CartDrawer/             cart UI + AI AnalyzeDialog (hidden when AI is unconfigured)
│   ├── Shop/                   server-side search/filter/sort/pagination
│   ├── ProductDetails/         gallery, promotions, reviews, similar products
│   ├── Checkout/, Orders/      checkout, order history/detail, seller/admin order management
│   ├── Categories/, Products/, Promotions/   shared admin + seller management views
│   ├── Companies/, SellerStore/, Sellers/    admin companies table, seller's own store, public directory
│   ├── Dashboard/               SellerDashboard, AdminDashboard (stats + top products/categories)
│   ├── Favorites/               saved products view
│   └── common/                  shared building blocks (loading state, error alert, confirm dialog)
├── context/
│   ├── AuthContext/            session (JWT, user, role) in localStorage
│   ├── CartContext/            cart state + actions
│   └── FavoritesContext/        favorites state + actions
└── App.tsx                     routing, role-gated per Customer / Seller / Admin
```

## ⚙️ Getting started

```bash
# 1. Clone
git clone https://github.com/AlexiaMaria11/Smart-Shopping-Assistant-FE.git
cd smart-shopping-assistant-fe

# 2. Install
npm install

# 3. Point the API client at your backend (src/api/base/http.ts)

# 4. Run
npm run dev
```

Requires the [Smart Shopping Assistant API](https://github.com/AlexiaMaria11/Smart_Shopping_Assistant) running
for data and the AI analysis endpoint.

## 🎨 Design system

Styled as "The Collection Lookbook": serif **Marcellus** for titles, **Archivo** for body/figures, a
committed house burgundy on cream paper, no shadows and square corners throughout — down to the operator
screens. See [`smart-shopping-assistant-fe/DESIGN.md`](smart-shopping-assistant-fe/DESIGN.md) for the full
design language.

## 🛠️ Tech stack

- **React 19** with functional components and hooks
- **TypeScript**
- **Vite** for dev server / build tooling
- **MUI** for the component library, **Emotion** for styling
- **React Router** for client-side routing, with role-based route guards
- **Axios** for typed API access
