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
- Auth.js sign-in with either email/password (demo credentials) or Google OAuth
- Google session-to-backend registration sync (`POST /api/auth/google/register`) with address completion flow
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
NEXT_PUBLIC_DEMO_MODE=false
AUTH_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=replace_with_google_client_id
GOOGLE_CLIENT_SECRET=replace_with_google_client_secret
AUTH_DEMO_EMAIL=seller@storemesh.local
AUTH_DEMO_PASSWORD=storemesh123
```

- `NEXT_PUBLIC_API_URL`: backend base URL (frontend appends `/api`)
- `NEXT_PUBLIC_DEMO_MODE`: set to 'true' for live demo mode with mock data, 'false' for normal mode with real API
- `AUTH_SECRET`: Auth.js session secret
- `GOOGLE_CLIENT_ID`: Google OAuth client id
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `AUTH_DEMO_EMAIL`: demo email for credentials sign-in
- `AUTH_DEMO_PASSWORD`: demo password for credentials sign-in

## Google OAuth Setup

1. Create OAuth credentials in Google Cloud Console (`OAuth 2.0 Client ID`).
2. Add redirect URI:
   `http://localhost:3000/api/auth/callback/google`
3. Put credentials in `frontend/.env.local`.
4. Restart the app and use `/login` for either credentials or Google sign-in.

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
  - `NEXT_PUBLIC_DEMO_MODE=false`
