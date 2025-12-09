# Catalog Explorer App

A small React + Vite catalog explorer demo application with a json-server mock API. It demonstrates browsing products, search, filtering, sorting, saved items (favorites/wishlist), and a mock categories endpoint.

Here is how to run the app locally.

---

## Quick start

Prerequisites:
- Node.js 18+ (preferred)

Install dependencies:

```powershell
npm install
```

Run the mock API (json-server) which serves `/products` and `/categories` (port 4001):

```powershell
npm run mock
```

Start the Vite dev server:

```powershell
npm run dev
```

Open the app in your browser at the URL printed by Vite (usually http://localhost:5173).

---

## Available scripts

- `npm run dev` - start the Vite development server
- `npm run build` - run TypeScript build and produce a production build with Vite
- `npm run preview` - preview the production build
- `npm run mock` - start json-server watching `catalog-db.json` on port `4001`
- `npm run lint` - run ESLint

---

## API / Mock server

The project uses `json-server` with `catalog-db.json` as the data source.

Endpoints exposed by the mock server (default: http://localhost:4001):

- `GET /products` - returns product list; supports json-server query params like `_page`, `_limit`, `_sort`, `_order`, and `q` for simple full-text search
- `GET /products/:id` - single product
- `GET /categories` - list of category strings (added to top-level `catalog-db.json` so the endpoint is available)

If you need to regenerate or update the `categories` array inside `catalog-db.json`, there's a helper script:

```powershell
node scripts/add-categories.mjs
```

This will overwrite `catalog-db.json` with a top-level `categories` array (deduped, sorted) and the existing `products` array.

---


## Developer notes

- The mock API base is `http://localhost:4001` by default. override the base by setting the `VITE_API_BASE` environment variable.
- The project keeps product-data in `catalog-db.json`.
- API helpers in `src/api.ts` (fetchProducts, searchProducts, fetchProductById, fetchProductCategories).

---
