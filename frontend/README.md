# Storemesh Frontend

Modern e-commerce frontend scaffold built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. It starts with mock data and an async service layer, so it is ready to connect to a real backend API later.

## Features

- Responsive desktop, tablet, and mobile layout
- Modern minimal shop UI with soft shadows and rounded cards
- Reusable component-based architecture
- Product listing grid and product detail pages
- Cart page with order summary + empty state handling
- Seller dashboard with performance cards and inventory table
- Add Product form page
- Route-level loading states and reusable skeletons
- Mock-first data flow through `services/api.ts`

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

## Project Structure

```text
src/
  app/
    cart/
      page.tsx
    products/[id]/
      loading.tsx
      page.tsx
    seller/add-product/
      page.tsx
    seller/dashboard/
      page.tsx
    globals.css
    layout.tsx
    loading.tsx
    page.tsx
  components/
    Button.tsx
    CartItem.tsx
    EmptyState.tsx
    LoadingGrid.tsx
    Navbar.tsx
    ProductCard.tsx
    ProductGrid.tsx
    Sidebar.tsx
  data/
    products.ts
  services/
    api.ts
  types/
    index.ts
```

## Page Routes

- `/` - Home / Product Listing
- `/products/[id]` - Product Detail
- `/cart` - Cart
- `/seller/dashboard` - Seller Dashboard
- `/seller/add-product` - Add Product Form

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Backend Integration Plan

The file `src/services/api.ts` is intentionally asynchronous and centralized.

To connect a real backend later:

1. Replace mock return values in `api.getProducts`, `api.getProductById`, `api.getCart`, and `api.getSellerStats` with real `fetch` calls.
2. Keep UI pages/components unchanged because they already consume the service abstraction.
3. Update endpoint constants in `endpoints` as backend routes become available.
