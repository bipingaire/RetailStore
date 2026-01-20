# FastAPI Retail Store Backend

Complete backend replacement for Supabase using FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- ✅ **JWT Authentication** - Token-based auth with access/refresh tokens
- ✅ **Multi-Tenant Architecture** - Automatic tenant isolation (RLS equivalent)
- ✅ **RESTful API** - CRUD operations for products, inventory, orders
- ✅ **Auto-Generated Docs** - Swagger UI at `/api/docs`
- ✅ **Role-Based Access** - Superadmin and tenant user permissions
- ✅ **SQLAlchemy ORM** - Type-safe database models
- ✅ **CORS Support** - Cross-origin requests enabled

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Database

Create a PostgreSQL database and update `.env`:

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL
```

### 3. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Server will start at: http://localhost:8000

- **API Docs**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings from environment
│   ├── database.py          # SQLAlchemy setup
│   ├── dependencies.py      # Auth & tenant filtering
│   ├── models/
│   │   └── __init__.py      # Database models
│   ├── routers/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── products.py      # Product CRUD
│   │   ├── inventory.py     # Inventory management
│   │   └── orders.py        # Order management
│   └── utils/
│       └── auth.py          # JWT & password utilities
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (get tokens)
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token

### Products (`/api/products`)

- `GET /products` - List products (with search & filters)
- `GET /products/{id}` - Get product by ID
- `POST /products` - Create product (superadmin)
- `PUT /products/{id}` - Update product (superadmin)
- `DELETE /products/{id}` - Delete product (superadmin)

### Inventory (`/api/inventory`)

- `GET /inventory` - List inventory (tenant-filtered)
- `GET /inventory/{id}` - Get inventory item
- `PUT /inventory/{id}` - Update inventory

### Orders (`/api/orders`)

- [Coming soon]

## Authentication

### Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepass123"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=securepass123"
```

Response:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

### Use Token

```bash
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer eyJ..."
```

## Tenant Isolation (RLS Equivalent)

The backend automatically filters data by tenant based on:
1. **Subdomain** - Extracted from `Host` header
2. **User Context** - User's assigned tenant

Example:
- Request to `store1.example.com` → Only sees `store1` data
- User linked to `tenant_id=123` → Only sees tenant 123's data

Superadmins can override this filter.

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Optional
UPLOAD_DIR=./uploads
AWS_S3_BUCKET=your-bucket
```

## Database Models

All Supabase tables are mapped to SQL Alchemy models:

- `User` - Authentication users
- `Tenant` - Retail store tenants
- `TenantUser` - User-tenant relationships
- `SuperadminUser` - Global admins
- `GlobalProduct` - Product catalog
- `InventoryItem` - Store inventory
- `CustomerOrder` - Orders
- `OrderLineItem` - Order details
- `Vendor` - Suppliers

## Migrating from Supabase

### 1. Export Data from Supabase

Use Supabase dashboard or `pg_dump` to export data.

### 2. Import to PostgreSQL

```bash
psql -U postgres -d retailstore < supabase_export.sql
```

### 3. Update Frontend

Replace Supabase client calls:

**Before (Supabase):**
```typescript
const { data } = await supabase
  .from('global-product-master-catalog')
  .select('*');
```

**After (FastAPI):**
```typescript
const response = await fetch('http://localhost:8000/api/products', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const data = await response.json();
```

## Development

### Add a New Endpoint

1. Create router in `app/routers/`
2. Add to `main.py`:
   ```python
   app.include_router(new_router, prefix="/api/new", tags=["New"])
   ```

### Add a New Model

1. Define in `app/models/__init__.py`
2. Run migrations:
   ```bash
   alembic revision --autogenerate -m "description"
   alembic upgrade head
   ```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Production Deployment

```bash
# Using Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker

# Using Docker
docker build -t retail-backend .
docker run -p 8000:8000 retail-backend
```

## Next Steps

- [ ] Add remaining API endpoints (orders, customers, vendors)
- [ ] Implement file storage (S3 integration)
- [ ] Add database migrations (Alembic)
- [ ] Add comprehensive tests
- [ ] Set up CI/CD
- [ ] Deploy to production

## License

Private - Internal Use Only
