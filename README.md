# Storemesh Full-Stack E-Commerce

Assessment-ready full-stack e-commerce project with a responsive frontend, REST backend, relational data model, and clear documentation.

## Live Demo

[Open Frontend Live Demo](https://YOUR-VERCEL-URL.vercel.app)

## Tech Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS
- Backend: Node.js, Express.js, Prisma ORM
- Database: PostgreSQL
- Runtime: Docker (database), local Node services

## Assessment Requirement Coverage

### Frontend

- UI built with modern web stack (Next.js/TS/Tailwind over HTML/CSS/JS foundations) and responsive layout
- Product listing and detail interfaces
- Seller Dashboard for product and inventory management
- Reusable components, loading states, empty states, error states, and toast feedback
- The frontend implementation follows the provided assessment concept and required product/seller flows. The design is implemented as a clean responsive e-commerce interface using Next.js, Tailwind CSS, and TypeScript.

### Backend

- Online shopping APIs (products, orders, payments, shipping labels)
- Product and inventory management (`/products`, stock/inventory endpoints)
- Sale order creation with stock validation (stock is reduced at shipping step)
- Payment recording with partial payment support (multiple payments per order)
- Shipping label creation + print workflow (`POST /orders/:id/shipping-label`, `GET /orders/:id/shipping-label/print`) with inventory reduction and stock logs
- Real Google-authenticated buyer registration sync (`POST /auth/google/register`) plus profile completion flow

### Documentation

- ER diagram included
- Component/API flow diagram included
- API lifecycle explanation included
- Product API and core endpoint request/response examples included

## ER Diagram

```mermaid
erDiagram
    User ||--o{ Product : sells
    User ||--o{ SaleOrder : places
    Product ||--o{ StockLog : logs
    Product ||--o{ SaleOrderItem : included_in
    SaleOrder ||--o{ SaleOrderItem : contains
    SaleOrder ||--o{ Payment : paid_by
    SaleOrder ||--o| ShippingLabel : ships_with

    User {
      int id PK
      string username
      string email
      string address
      enum role
      string googleId
      datetime createdAt
    }
    Product {
      int id PK
      int sellerId FK
      string image
      string title
      string description
      decimal unitPrice
      int quantity
      datetime createdAt
    }
    StockLog {
      int id PK
      int productId FK
      int quantityAdded
      datetime createdAt
    }
    SaleOrder {
      int id PK
      int buyerId FK
      enum status
      decimal totalAmount
      datetime createdAt
    }
    SaleOrderItem {
      int id PK
      int saleOrderId FK
      int productId FK
      int quantity
      decimal unitPrice
      decimal subtotal
    }
    Payment {
      int id PK
      int saleOrderId FK
      decimal amount
      enum paymentMethod
      datetime paymentDate
    }
    ShippingLabel {
      int id PK
      int saleOrderId FK
      string trackingNo
      string recipientAddress
      datetime printedAt
    }
```

## Component/API Flow

```mermaid
flowchart LR
    A[Browser UI] --> B[Next.js App Router]
    B --> C[Frontend Service Layer]
    C --> D[Express Routes]
    D --> E[Controllers]
    E --> F[Validation]
    F --> G[Service Layer]
    G --> H[Prisma]
    H --> I[(PostgreSQL)]
    I --> H --> G --> E --> D --> C --> B --> A
```

## API Request Lifecycle

`Client Request -> Route -> Controller -> Validation -> Service -> Prisma -> PostgreSQL -> JSON Response`

## Inventory Reduction Timing

- `POST /api/orders` validates stock availability and creates order records.
- `POST /api/orders/:id/shipping-label` performs shipment workflow and reduces inventory quantities in a transaction.
- `GET /api/orders/:id/shipping-label/print` returns a print-ready label page for parcel attachment.

## How to Test in 3 Minutes

```bash
# 1) Clone repo
git clone <your-repo-url>
cd Storemesh

# 2) Install frontend dependencies
cd frontend
npm install
cd ..

# 3) Install backend dependencies
cd backend
npm install
cd ..

# 4) Run Docker database
docker compose up -d db

# 5) Run Prisma migration/seed
cd backend
npx prisma migrate deploy
npm run db:seed
cd ..

# 6) Run backend
cd backend
npm run dev

# 7) Run frontend (new terminal)
cd frontend
npm run dev
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## Quick API Tests

```bash
# GET /api/products
curl http://localhost:5000/api/products

# POST /api/auth/google
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"googleId":"google_123","email":"user@example.com","username":"Demo User"}'

# POST /api/auth/google/register
curl -X POST http://localhost:5000/api/auth/google/register \
  -H "Content-Type: application/json" \
  -d '{"googleId":"google_123","providerAccountId":"google_123","email":"user@example.com","username":"Demo User"}'

# POST /api/orders
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"buyerId":2,"items":[{"productId":1,"quantity":1}]}'

# POST /api/orders/:id/shipping-label
curl -X POST http://localhost:5000/api/orders/1/shipping-label \
  -H "Content-Type: application/json" \
  -d '{"recipientAddress":"12 Lake Rd, Springfield","trackingNo":"TRK-TEST-001"}'

# GET /api/orders/:id/shipping-label/print
curl http://localhost:5000/api/orders/1/shipping-label/print

# POST /api/payments
curl -X POST http://localhost:5000/api/payments \
  -H "Content-Type: application/json" \
  -d '{"saleOrderId":1,"amount":89.99,"paymentMethod":"CREDIT_CARD"}'
```

## Product API Response Examples

### `GET /api/products`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sellerId": 1,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      "title": "Wireless Headphones",
      "description": "Noise-cancelling headphones with long battery life.",
      "unitPrice": 89.99,
      "quantity": 25,
      "createdAt": "2026-05-07T06:40:19.831Z",
      "price": 89.99,
      "stock": 25,
      "seller": "seller_demo"
    }
  ]
}
```

### `GET /api/products/:id`

```json
{
  "success": true,
  "data": {
    "id": 1,
    "sellerId": 1,
    "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
    "title": "Wireless Headphones",
    "description": "Noise-cancelling headphones with long battery life.",
    "unitPrice": 89.99,
    "quantity": 25,
    "createdAt": "2026-05-07T06:40:19.831Z",
    "price": 89.99,
    "stock": 25,
    "seller": "seller_demo"
  }
}
```

### `POST /api/products`

```json
{
  "success": true,
  "data": {
    "id": 8,
    "sellerId": 1,
    "image": "https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
    "title": "Laptop Stand",
    "description": "Adjustable aluminum stand",
    "unitPrice": 35.5,
    "quantity": 20,
    "createdAt": "2026-05-07T07:15:10.112Z",
    "price": 35.5,
    "stock": 20,
    "seller": "seller_demo"
  }
}
```

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_DEMO_MODE=false
AUTH_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=replace_with_google_client_id
GOOGLE_CLIENT_SECRET=replace_with_google_client_secret
AUTH_DEMO_EMAIL=seller@storemesh.local
AUTH_DEMO_PASSWORD=storemesh123
```

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/storemesh?schema=public
PORT=5000
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Seller/Admin Scope

- Implemented: **Seller Dashboard for product and inventory management**
- Admin-specific role management is outside this assessment scope.

## Google OAuth Setup (Auth.js)

1. Create OAuth credentials in Google Cloud Console (`OAuth 2.0 Client ID`).
2. Add authorized redirect URI:
   `http://localhost:3000/api/auth/callback/google`
3. Copy credentials into `frontend/.env.local`:

```env
AUTH_SECRET=replace_with_a_long_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AUTH_DEMO_EMAIL=seller@storemesh.local
AUTH_DEMO_PASSWORD=storemesh123
```

4. Restart frontend and open `/login` for either credentials or Google sign-in.
5. After Google sign-in, frontend syncs the authenticated profile to backend via `POST /api/auth/google/register` (idempotent upsert).

## Final Submission Checklist

- [x] Frontend completed
- [x] Backend completed
- [ ] Live demo URL updated (`https://YOUR-VERCEL-URL.vercel.app`)
- [x] ER diagram included
- [x] API examples included
- [x] Mock Google auth included
- [x] Shipping workflow included
- [x] Payment recording included
- [x] README completed

## Future Improvements (Post-Assessment)

- Full OAuth provider flow and session auth
- Dedicated admin panel
- Automated tests (unit/integration/E2E)
