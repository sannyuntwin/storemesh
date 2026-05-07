# Storemesh Frontend

Modern Next.js storefront for Storemesh with API-first integration and graceful mock fallback.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4

## Features

- Responsive product listing and product detail experience
- Cart flow with quantity controls and order submission
- Seller dashboard and add-product flow
- Loading skeletons, empty states, error states, and toast notifications
- API service abstraction with fallback to local mock data

## Setup

Start backend + database first (from repo root):

```bash
docker compose up --build
```

Then run frontend:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_ENABLE_MOCK_FALLBACK=true
```

- `NEXT_PUBLIC_API_URL`: backend base URL (frontend appends `/api`)
- `NEXT_PUBLIC_ENABLE_MOCK_FALLBACK`: fallback to mock data when backend is unavailable

## API Integration

- Service files: `src/services/fetcher.ts`, `src/services/api.ts`
- Pattern:
  1. call backend API
  2. if request fails and fallback enabled, return local mock data
  3. display warning banner when fallback is active

## Vercel Deployment

- Root directory: `frontend`
- Build command: `npm run build`
- Set env vars:
  - `NEXT_PUBLIC_API_URL=https://<your-backend-domain>`
  - `NEXT_PUBLIC_ENABLE_MOCK_FALLBACK=false`
