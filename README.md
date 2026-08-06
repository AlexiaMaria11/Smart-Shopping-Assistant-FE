<div align="center">

  <div>
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/-MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="MUI" />
  </div>

  <h3 align="center">Smart Shopping Assistant — Frontend</h3>

  <p align="center">
    The storefront for an AI-assisted shopping cart: browse the catalog, manage promotions,
    and let an AI agent pipeline tell you exactly which product completes your next discount.
  </p>

</div>

## 📋 Overview

This is the React + TypeScript client for the
[Smart Shopping Assistant API](https://github.com/AlexiaMaria11/Smart_Shopping_Assistant). It's built as a
small storefront + admin hybrid: catalog browsing on one side, CRUD management for products, categories and
promotions on the other, all wrapped around a cart experience with an AI "Analyze" step.

## ✨ Features

- **Shop** — browse the product catalog and add items to the cart
- **Cart drawer** with an **Analyze dialog** that calls the backend's AI pipeline and shows:
  - Active deals the cart already qualifies for
  - Near-miss deals with what's missing and the exact savings
  - Concrete product suggestions to complete a deal or complement what's already in the cart
- **Products / Categories / Promotions** admin views with create/edit dialogs, backed by dedicated typed API clients
- **Favorites** — save products for later, backed by its own context
- Global cart and favorites state via React Context (`CartProvider`, `FavoritesProvider`)

## 🏗️ Project structure

```text
src/
├── api/
│   ├── base/http.ts          axios instance / base config
│   ├── clients/               typed API clients (Cart, Product, Category, Promotion)
│   └── models/                request/response models matching the backend DTOs
├── components/
│   ├── CartDrawer/            cart UI + AI AnalyzeDialog
│   ├── Categories/            category list + form dialog
│   ├── Products/               product list + form dialog
│   ├── Promotions/             promotion list + form dialog
│   ├── Shop/                   catalog browsing view
│   ├── Favorites/              saved products view
│   └── common/                 shared building blocks (loading state, error alert, confirm dialog)
├── context/
│   ├── CartContext/            cart state + actions
│   └── FavoritesContext/       favorites state + actions
└── App.tsx                     routing (Home, Categories, Products, Promotions, Shop, Favorites)
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

## 🛠️ Tech stack

- **React 19** with functional components and hooks
- **TypeScript**
- **Vite** for dev server / build tooling
- **MUI** for the component library, **Emotion** for styling
- **React Router** for client-side routing
- **Axios** for typed API access
