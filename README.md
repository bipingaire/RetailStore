# 🛒 RetailStore (InduMart) — Multi-Tenant Retail OS

A **multi-tenant SaaS retail operating system** that gives every independent retail store its own branded storefront, admin dashboard, and inventory intelligence — all powered by a shared platform under `indumart.us`.

---

## 📐 High-Level Architecture

```
                        ┌──────────────────────────────────────────────┐
                        │              NGINX Reverse Proxy              │
                        │         (indumart.us / retailos.cloud)        │
                        └──────┬───────────────────────────────┬────────┘
                               │                               │
                    ┌──────────▼──────────┐        ┌──────────▼──────────┐
                    │   Next.js Frontend  │        │   NestJS Backend API │
                    │   (Port 3010/3000)  │◄──────►│    (Port 3011/3001)  │
                    │   React 18 + TS     │  HTTP  │    TypeScript + TS   │
                    └──────────┬──────────┘        └──────────┬──────────┘
                               │                              │
                    ┌──────────▼──────────┐        ┌──────────▼──────────┐
                    │   Next.js Middleware │        │   Prisma ORM (dual)  │
                    │   (Subdomain Router) │        │  Master + Per-Tenant │
                    └─────────────────────┘        └──────────┬──────────┘
                                                              │
                                               ┌─────────────▼─────────────┐
                                               │       PostgreSQL 15        │
                                               │  retail_store_master (DB1) │
                                               │  retail_store_tenant_* (N) │
                                               └───────────────────────────┘
```

---

## 🏗️ Multi-Tenancy Model

Each tenant (retail store) gets its own **isolated PostgreSQL database**. The master database tracks tenant metadata (subdomain, DB URL, subscription). Every API request resolves the calling tenant dynamically at runtime.

```
indumart.us               → Find-Store geolocation page
anuj.indumart.us          → Tenant "anuj" storefront  (shop UI)
anuj.indumart.us/admin    → Tenant "anuj" admin panel
retailos.cloud            → Business landing / onboarding
retailos.cloud/super-admin → Platform super-admin dashboard
```

---

## 📁 Project Structure

```
RetailStore/
├── app/                        # Next.js 14 App Router
│   ├── admin/                  # Tenant admin panel (protected)
│   │   ├── dashboard/
│   │   ├── inventory/
│   │   ├── invoices/           # Vendor invoice processing
│   │   ├── invoice-review/     # AI invoice review
│   │   ├── invoice-history/
│   │   ├── orders/             # Purchase orders
│   │   ├── restock/            # Restock management
│   │   ├── sale/               # POS / point of sale
│   │   ├── sales/              # Sales history
│   │   ├── reports/            # P&L, analytics reports
│   │   ├── campaigns/          # Marketing campaigns
│   │   ├── banners/            # Storefront banner management
│   │   ├── vendors/            # Vendor management
│   │   ├── reconciliation/     # Inventory reconciliation
│   │   ├── audit/              # Inventory audit sessions
│   │   ├── pos-mapping/        # POS item ↔ inventory mapping
│   │   ├── social/             # Social media integrations
│   │   └── settings/           # Store settings
│   ├── shop/                   # Customer-facing storefront
│   │   ├── [slug]/             # Dynamic product/category pages
│   │   ├── product/            # Product detail page
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow (Stripe)
│   │   ├── orders/             # Customer order history
│   │   ├── account/            # Customer account
│   │   ├── profile/            # Customer profile
│   │   ├── categories/         # Category browse
│   │   ├── faq/                # FAQ page
│   │   ├── shipping/           # Shipping info
│   │   ├── returns/            # Returns policy
│   │   ├── register/           # Customer registration
│   │   ├── login/              # Customer login
│   │   └── forgot-password/    # Password reset
│   ├── super-admin/            # Platform operator panel (retailos.cloud)
│   │   ├── stores/             # All tenant stores management
│   │   ├── products/           # Global product catalog management
│   │   ├── pending-products/   # AI-submitted product additions for review
│   │   ├── categories/         # Global categories
│   │   ├── taxes/              # Global tax rules by state
│   │   └── agent/              # AI agent interface
│   ├── supplier/               # Supplier-facing portal
│   │   ├── inventory/          # Supplier inventory view
│   │   ├── orders/             # Supplier order management
│   │   └── retailers/          # Retailer directory
│   ├── api/                    # Next.js API routes (BFF layer)
│   │   ├── auth/               # NextAuth.js handlers
│   │   ├── ai/                 # AI endpoint proxies
│   │   ├── customer/           # Customer API
│   │   ├── parse-invoice/      # PDF invoice parser
│   │   ├── parse-catalog/      # AI catalog parser
│   │   ├── parse-z-report/     # Z-Report parser
│   │   ├── sync-pdf/           # PDF sync endpoint
│   │   ├── generate-campaign/  # AI campaign generator
│   │   ├── domains/            # Domain lookup
│   │   ├── email/              # Email sending (Resend)
│   │   └── uploads/            # File upload handling
│   ├── auth/                   # Auth-related pages
│   ├── business/               # Business landing page (retailos.cloud root)
│   ├── find-store/             # Geolocation store finder (indumart.us root)
│   ├── login/                  # Platform-level login
│   └── layout.tsx              # Root layout
│
├── backend/                    # NestJS REST API
│   ├── src/
│   │   ├── app.module.ts       # Root module — registers all feature modules
│   │   ├── main.ts             # Bootstrap / Helmet / CORS / Throttler
│   │   ├── auth/               # JWT + Passport authentication
│   │   ├── tenant/             # Tenant CRUD + DB provisioning
│   │   ├── product/            # Product management (per-tenant DB)
│   │   ├── sale/               # POS sales recording
│   │   ├── customer/           # Customer management
│   │   ├── vendor/             # Vendor management
│   │   ├── invoice/            # Vendor invoice (inventory-in) processing
│   │   ├── purchase-order/     # Purchase order lifecycle
│   │   ├── audit/              # Inventory audit sessions
│   │   ├── campaign/           # Marketing campaign management
│   │   ├── category/           # Per-tenant product categories
│   │   ├── tax/                # Local tax rule management
│   │   ├── expense/            # Operating expense tracking
│   │   ├── reports/            # P&L and analytics reports
│   │   ├── dashboard/          # Dashboard aggregation queries
│   │   ├── settings/           # Store key-value settings
│   │   ├── pos-mapping/        # POS item ↔ product AI mapping
│   │   ├── social/             # Social media account connections
│   │   ├── super-admin/        # Super admin endpoints
│   │   ├── master-catalog/     # Shared product catalog (master DB)
│   │   ├── ai/                 # OpenAI integrations (enrichment, parsing)
│   │   ├── upload/             # File / PDF upload service
│   │   ├── prisma/             # Dual Prisma service (master + tenant)
│   │   ├── common/             # Guards, decorators, interceptors
│   │   ├── legacy-api/         # Backward-compat API shim
│   │   └── generated/          # Auto-generated Prisma clients
│   │       ├── master-client/  # Client for retail_store_master
│   │       └── tenant-client/  # Client for retail_store_tenant_*
│   └── prisma/
│       ├── schema-master.prisma   # Master DB schema
│       ├── schema-tenant.prisma   # Tenant DB schema (applied per tenant)
│       └── migrations/            # Migration history
│
├── components/                 # Shared React UI components
│   ├── admin-ui/               # Admin panel components
│   ├── shop-ui/                # Storefront components
│   ├── ui/                     # Primitives (buttons, inputs, etc.)
│   ├── nearby-stores-modal.tsx # Geolocation store finder modal
│   ├── store-map.tsx           # Map component
│   ├── tenant-context.tsx      # Tenant context provider
│   └── toast-provider.tsx      # Global toast notifications
│
├── lib/                        # Frontend utility library
│   ├── ai/                     # AI client utilities
│   ├── analytics/              # Analytics helpers
│   ├── auth/                   # Auth helpers / session utils
│   ├── formatters/             # Date, currency formatters
│   ├── geolocation/            # Browser geolocation wrappers
│   ├── hooks/                  # Custom React hooks
│   ├── inventory/              # Inventory calculation helpers
│   ├── api-client.ts           # Typed backend API client
│   ├── subdomain.ts            # Subdomain extraction logic
│   ├── email.ts                # Email utility (Resend)
│   └── social-media.ts         # Social media helpers
│
├── middleware.ts               # Next.js edge middleware (subdomain routing)
├── nginx/                      # Nginx config templates
├── nginx.conf                  # Production nginx config
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.local.yml    # Local dev Docker Compose
├── Dockerfile                  # Frontend Docker image
└── backend/Dockerfile          # Backend Docker image
```

---

## 🗄️ Database Architecture

### Dual-Database Pattern

| Database | Schema File | Purpose |
|---|---|---|
| `retail_store_master` | `schema-master.prisma` | Platform-level: tenants, subscriptions, billing, global catalog, super admins |
| `retail_store_tenant_<slug>` | `schema-tenant.prisma` | Per-tenant: products, sales, customers, vendors, invoices, etc. |

### Master DB Models (`schema-master.prisma`)

| Model | Description |
|---|---|
| `Tenant` | Store registry — subdomain, DB URL, active flag |
| `SuperAdmin` | Platform operator accounts |
| `SharedCatalog` | Cross-tenant product catalog (synced by AI) |
| `PendingProductAddition` | AI-submitted new products awaiting super-admin approval |
| `TenantSubscription` | Plan type (free / beta / pro / enterprise) |
| `BillingTransaction` | Billing history per tenant |
| `GlobalCategory` | Platform-wide product category taxonomy |
| `GlobalTaxRule` | Tax rules by US state, category, or product |
| `MasterWebsiteConfig` | Platform domain/SSL config |

### Tenant DB Models (`schema-tenant.prisma`)

| Model | Description |
|---|---|
| `User` | Staff accounts (CASHIER, ADMIN roles) |
| `Product` | Inventory items with hierarchy (bulk ↔ unit) |
| `ProductBatch` | Expiry-tracked batches per product |
| `Sale` / `SaleItem` | POS transaction records |
| `Customer` | Loyalty customer profiles |
| `Vendor` | Supplier directory |
| `VendorInvoice` / `VendorInvoiceItem` | Vendor invoice for stock receipt |
| `PurchaseOrder` / `PurchaseOrderItem` | Outgoing restocking orders |
| `StockMovement` | Full stock movement ledger (IN / OUT / ADJUSTMENT) |
| `Invoice` | Customer-facing invoices (linked to Sale) |
| `AuditSession` / `AuditCount` | Physical inventory count sessions |
| `InventoryAdjustment` | Adjustments made after audit |
| `Reconciliation` | Z-Report reconciliation records |
| `ZReport` | End-of-day Z-report uploads |
| `Expense` | Operating expense log |
| `ProfitReport` | Computed P&L snapshots |
| `Campaign` / `CampaignProduct` | Marketing campaign management |
| `Promotion` | Per-product discount promotions |
| `POSItemMapping` | AI-assisted POS name → inventory item map |
| `SocialAccount` | Connected social media accounts |
| `Category` | Local product categories |
| `LocalTaxRule` | Per-tenant tax rate overrides by category |
| `Settings` | Key-value store settings (currency, tax, logo) |
| `ProductReview` | Customer reviews |

---

## 🔀 Request Routing (Subdomain Strategy)

The Next.js **edge middleware** (`middleware.ts`) inspects the `Host` header on every request and routes accordingly:

```
Host: indumart.us          →  Rewrite → /find-store  (geolocation store search)
Host: retailos.cloud       →  Rewrite → /business    (platform landing page)
Host: retailos.cloud/super-admin → Auth gate → Super Admin panel
Host: <slug>.indumart.us/         → Rewrite → /shop  (customer storefront)
Host: <slug>.indumart.us/admin    → Auth gate → Admin panel
```

Tenant slug is extracted from the subdomain and injected as `x-subdomain` / `x-tenant` headers for downstream consumption.

---

## 🖥️ Frontend (Next.js 14)

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| Auth | NextAuth.js v4 (JWT + Google OAuth) |
| Charts | Chart.js + react-chartjs-2 |
| PDF | jsPDF + pdfjs-dist |
| Payments | Stripe |
| Email | Resend |
| Error Tracking | Sentry |
| State | React Context (`TenantContext`) |
| Testing | Jest + React Testing Library + Playwright (E2E) |

### User Roles & Portals

| Portal | URL Pattern | Access |
|---|---|---|
| Customer Storefront | `<slug>.indumart.us/shop` | Public |
| Tenant Admin | `<slug>.indumart.us/admin` | JWT-protected (ADMIN/CASHIER) |
| Supplier Portal | `<slug>.indumart.us/supplier` | JWT-protected |
| Super Admin | `retailos.cloud/super-admin` | JWT-protected (SuperAdmin) |
| Business Landing | `retailos.cloud` | Public |

---

## ⚙️ Backend (NestJS)

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript |
| ORM | Prisma 5 (dual-client: master + tenant) |
| Auth | Passport.js + JWT (bcryptjs) |
| AI | OpenAI API (GPT-4) |
| PDF Parsing | pdf-parse + pdfjs-dist |
| Security | Helmet + @nestjs/throttler (rate limiting) |
| Payments | Stripe SDK |

### Key Backend Modules

| Module | Responsibility |
|---|---|
| `AuthModule` | Login, JWT issuance, token guard |
| `TenantModule` | Tenant onboarding, DB provisioning, lookup |
| `ProductModule` | CRUD, bulk-to-unit hierarchy, stock levels |
| `SaleModule` | POS transaction recording, stock deduction |
| `InvoiceModule` | Vendor invoice ingestion → stock increment |
| `AuditModule` | Physical count sessions → adjustments |
| `PurchaseOrderModule` | Restocking order lifecycle |
| `CampaignModule` | Marketing campaign + product association |
| `ReportsModule` | P&L, revenue, COGS computation |
| `DashboardModule` | Aggregated KPI data for dashboard widgets |
| `PosMappingModule` | Fuzzy-match POS item names to inventory |
| `SuperAdminModule` | Platform-wide management endpoints |
| `AIModule` | OpenAI calls for product enrichment, parsing |
| `UploadModule` | Multipart file handling, storage |
| `SocialModule` | Social platform OAuth token management |
| `ExpenseModule` | Expense logging for P&L |
| `TaxModule` | Local tax rule management |
| `CategoryModule` | Tenant category management |
| `SettingsModule` | Key-value store for per-tenant settings |

---

## 🤖 AI Features

| Feature | Description |
|---|---|
| **Invoice Parser** | Uploads vendor PDF invoice → AI extracts line items → queued for review |
| **Catalog Sync** | AI enriches product data (description, image, category) from SKU |
| **POS Mapping** | AI fuzzy-matches POS receipt item names to inventory entries |
| **Z-Report Parser** | Parses end-of-day Z-report PDFs for reconciliation |
| **Campaign Generator** | Generates marketing copy and campaign details from product data |
| **Pending Product Review** | Staff can submit unknown barcodes; AI classifies and super-admin approves |

---

## 🐳 Docker / Deployment

### Services (docker-compose.yml)

| Service | Container | Internal Port | Host Port |
|---|---|---|---|
| Frontend (Next.js) | `retail_store_frontend` | 3000 | 3010 |
| Backend (NestJS) | `retail_store_backend` | 3001 | 3011 |
| Database (PostgreSQL 15) | `retail_store_db` | 5432 | 5435 |

### Network

All services communicate over the `retailos_net` bridge network. NGINX on the host machine reverse-proxies public traffic into the Docker network.

### Volumes

| Volume | Purpose |
|---|---|
| `postgres_data_prod` | Persistent PostgreSQL data |
| `public_uploads` | Shared upload storage (frontend + backend) |

### Deployment Domains

| Domain | Purpose |
|---|---|
| `indumart.us` | Customer-facing storefront platform |
| `*.indumart.us` | Individual tenant subdomains |
| `retailos.cloud` | B2B / SaaS operator site + super-admin |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker + Docker Compose
- PostgreSQL 15 (or use Docker)

### Local Development

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Copy environment files
cp .env.example .env.local
cp backend/.env.example backend/.env

# 4. Start database
docker compose -f docker-compose.local.yml up -d

# 5. Run migrations
cd backend
npx prisma migrate deploy --schema=prisma/schema-master.prisma
npx prisma migrate deploy --schema=prisma/schema-tenant.prisma

# 6. Seed master DB
node prisma/seed-superadmin.js

# 7. Start backend
npm run start:dev

# 8. Start frontend (new terminal)
cd ..
npm run dev
```

### Production Deployment

```bash
# Build and start all containers
docker compose up -d --build

# Run migrations inside container
docker exec retail_store_backend npx prisma migrate deploy
```

---

## 🧪 Testing

```bash
# Frontend unit tests
npm test

# Frontend E2E (Playwright)
npm run test:e2e

# Backend unit tests
cd backend && npm test

# Coverage report
npm run test:coverage
```

---

## 📦 Key Environment Variables

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXTAUTH_URL` | NextAuth base URL |
| `NEXTAUTH_SECRET` | JWT signing secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Master DB connection string |
| `TENANT_DATABASE_URL` | Default tenant DB connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRATION` | Token expiry (e.g. `7d`) |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `FRONTEND_URL` | Allowed CORS origin |

---

## 📝 Key Design Decisions

1. **Database-per-tenant**: Complete data isolation with one PostgreSQL DB per store — no row-level tenant filtering required.
2. **Dual Prisma clients**: `PrismaService` (master DB) and `TenantPrismaService` (tenant DB, resolved per request) coexist in the same NestJS app.
3. **Edge middleware routing**: Subdomain-based routing happens at the Next.js edge layer before any React code runs — zero client-side flicker.
4. **BFF API routes**: Next.js `/app/api/` routes act as a Backend-for-Frontend layer, keeping secrets server-side and simplifying the frontend.
5. **AI-assisted inventory**: PDF parsing, catalog enrichment, and POS reconciliation are all AI-powered to minimize manual data entry.
