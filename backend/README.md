# Storemesh Backend

Express + Prisma REST API for Storemesh e-commerce.

## Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- TypeScript

## Setup

### Local (without Docker)

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run db:seed
npm run dev
```

Default base URL: `http://localhost:5000/api`

### Docker (recommended for this project)

From repo root:

```bash
docker compose up --build
```

This starts:

- `db` (PostgreSQL)
- `backend` (Express API)

Seed demo data when needed:

```bash
docker compose exec backend npm run db:seed
```

## Environment Variables

```env
DATABASE_URL=postgresql://...
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Scripts

- `npm run dev` - start with nodemon
- `npm run build` - TypeScript build
- `npm start` - run compiled server
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:migrate:deploy`
- `npm run db:seed`

## API Endpoints

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/stock`
- `PATCH /api/products/:id/inventory`

### Orders

- `POST /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/shipping-label`
- `GET /api/orders/:id/shipping-label/print`
  - shipment step creates shipping label, reduces inventory, writes stock logs, and marks order as `SHIPPED`
  - print endpoint returns a print-ready HTML shipping label for parcel attachment

### Payments

- `POST /api/payments`

### Helper Endpoints

- `GET /api/cart`
- `GET /api/seller/stats`
- `POST /api/auth/google`
- `POST /api/auth/google/register`
- `POST /api/uploads/product-image` (multipart form field: `image`)

### Static Uploads

- Uploaded product files are served from:
  - `GET /uploads/products/<filename>`

## Response Format

```json
{
  "success": true,
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "message": "Error message"
  }
}
```

## Deployment Notes (Render / Railway)

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Run migrations on deploy: `npm run prisma:migrate:deploy`
- Set `CORS_ORIGIN` to deployed frontend domain.
