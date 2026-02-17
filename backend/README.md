# Retail Store Backend - NestJS + Prisma Multi-Tenant System

## Features

- 🏢 Multi-tenant architecture with isolated databases
- 🔐 JWT-based authentication per tenant
- 📦 Product management with inventory tracking
- 💰 Point of Sale (POS) system
- 👥 Customer management with loyalty points
- 📊 Dashboard analytics
- 🔄 Master catalog synchronization
- 🚀 Automatic tenant database provisioning

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

## Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Databases

```bash
# Create master database
createdb retail_master

# Create tenant template database  
createdb retail_tenant_template
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Generate Prisma Clients

```bash
# Generate master client
npx prisma generate --schema=./prisma/schema-master.prisma

# Generate tenant client
npx prisma generate --schema=./prisma/schema-tenant.prisma
```

### 5. Run Migrations

```bash
# Master database migration
npx prisma migrate dev --schema=./prisma/schema-master.prisma --name init

# Tenant template migration
npx prisma migrate dev --schema=./prisma/schema-tenant.prisma --name init
```

### 6. Start Development Server

```bash
npm run start:dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tenants
- `POST /api/tenants` - Create new tenant (auto-provisions database)
- `GET /api/tenants` - List all tenants
- `GET /api/tenants/:subdomain` - Get tenant by subdomain

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product (syncs to master)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/:id/stock` - Update stock

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details
- `PATCH /api/sales/:id/cancel` - Cancel sale
- `GET /api/sales/stats` - Sales statistics

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Soft delete customer
- `PATCH /api/customers/:id/loyalty-points` - Update loyalty points

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview stats
- `GET /api/dashboard/sales-chart` - Sales chart data
- `GET /api/dashboard/product-analytics` - Product analytics

### Master Catalog
- `GET /api/master-catalog` - Shared catalog across tenants

## Creating a New Tenant

```bash
curl -X POST http://localhost:3000/api/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Store Name",
    "subdomain": "storename",
    "adminEmail": "admin@store.com",
    "adminPassword": "securepassword123"
  }'
```

This will:
- Create a new PostgreSQL database
- Run migrations on the new database
- Register tenant in master database
- Create default admin user

## Multi-Tenant Architecture

Each request must include the `x-tenant` header with the subdomain:

```javascript
headers: {
  'x-tenant': 'storename',
  'Authorization': 'Bearer <token>'
}
```

## Database Schema

### Master Database
- `tenants` - Tenant registry
- `shared_catalog` - Synced products from all tenants

### Tenant Databases (Isolated)
- `users` - Tenant-specific users and authentication
- `products` - Inventory management
- `sales` - Sales transactions
- `sale_items` - Sale line items
- `customers` - Customer records
- `stock_movements` - Inventory movements
- `categories` - Product categories
- `settings` - Tenant settings

## Production Deployment

1. Update environment variables for production
2. Use connection pooling (e.g., PgBouncer)
3. Enable SSL for database connections
4. Set up proper backup strategy
5. Configure rate limiting
6. Enable CORS for your frontend domain

## License

MIT
