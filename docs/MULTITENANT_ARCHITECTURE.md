# Multi-Tenant Architecture Implementation

## Overview

This RetailStore application has been upgraded to a **multi-tenant SaaS platform** where:
- A **superadmin** manages multiple retail stores from a central dashboard
- Each retail store has its own **subdomain** (e.g., `store1.yourdomain.com`)
- A **master product catalog** is shared across all stores
- Both superadmin and store admins can **enrich product data**
- **AI-powered synchronization** automatically adds new products to the master catalog

---

## Architecture

### 1. **Subdomain Routing**
- **Main Domain** (`yourdomain.com`) → Superadmin dashboard
- **Store Subdomains** (`store1.yourdomain.com`) → Individual store admin dashboard
- Middleware extracts subdomain and resolves tenant context
- In development (localhost), tenant context passed via query parameter

### 2. **Database Schema**

#### New Tables
- **`superadmin-users`** - Superadmin user management with permissions
- **`subdomain-tenant-mapping`** - Maps subdomains to tenant IDs
- **`product-enrichment-history`** - Tracks all product enrichments (superadmin, store admin, AI)
- **`pending-product-additions`** - Queue for store admin products awaiting superadmin review

#### Enhanced Tables
- **`retail-store-tenant`** - Added `subdomain` field
- **`global-product-master-catalog`** - Added enrichment tracking fields
- **`retail-store-inventory-item`** - Added local override capabilities

### 3. **AI Product Matching**
- Uses **OpenAI GPT-4o-mini** for intelligent product matching
- Fuzzy matching handles variations in naming, misspellings, abbreviations
- Confidence scoring determines auto-action:
  - **> 85%** → Auto-link to existing product
  - **50-85%** → Queue for manual review
  - **< 50%** → Auto-add as new product

---

## Key Features

### Superadmin Dashboard (`/superadmin`)

#### 1. **Dashboard** (`/superadmin`)
- View all stores and their status
- Master catalog statistics
- Pending product reviews count
- Recent activity feed

#### 2. **Store Management** (`/superadmin/stores`)
- Create new retail stores
- Assign unique subdomains
- Edit store details (name, address, contact)
- Activate/deactivate stores
- Manage subscription tiers

#### 3. **Master Catalog** (`/superadmin/products`)
- View all products in master catalog
- Search by name, brand, UPC
- Filter by category
- Enrich product data (images, descriptions, metadata)

#### 4. **Product Enrichment** (`/superadmin/products/[id]/enrich`)
- Edit product details
- Upload product images
- Add descriptions and metadata
- **AI-powered enrichment suggestions**
- View enrichment history

#### 5. **Pending Products** (`/superadmin/pending-products`)
- Review products added by store admins
- AI analysis and confidence scores
- Suggested matches to existing products
- Actions:
  - Approve as new product
  - Link to existing product
  - Reject

### Store Admin Features

#### 1. **Local Product Enrichment**
- Override master catalog data for specific store
- Add store-specific images and descriptions
- Customize product info without affecting other stores

#### 2. **Add New Products**
- Endpoint: `POST /api/admin/products/add-new`
- Automatically triggers AI product matching
- Three possible outcomes:
  - **Auto-linked** to existing master product
  - **Queued** for superadmin review
  - **Auto-added** to master catalog (low confidence match)

---

## Setup Instructions

### 1. **Database Migration**

Run the migration script to create new tables and update schema:

```bash
# Apply migration to Supabase
supabase db push
```

Or manually execute the migration file:
```sql
-- Run: supabase/migrations/20260108_multitenant_schema.sql
```

### 2. **Environment Variables**

Ensure you have the following in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (for AI product matching)
OPENAI_API_KEY=sk-your-openai-key

# App URL (for subdomain construction)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. **Create First Superadmin**

Execute this SQL in Supabase SQL Editor:

```sql
-- Replace with actual user ID from auth.users
INSERT INTO "superadmin-users" ("user-id", "full-name", "email", "is-active")
VALUES (
  'your-user-id-here',
  'Admin Name',
  'admin@yourdomain.com',
  true
);
```

### 4. **Create First Store**

Use the superadmin dashboard or execute:

```sql
INSERT INTO "retail-store-tenant" (
  "store-name",
  "subdomain",
  "store-address",
  "phone-number",
  "email-address",
  "is-active"
)
VALUES (
  'Demo Store',
  'demo',
  '123 Main St',
  '555-1234',
  'demo@store.com',
  true
);
```

### 5. **Development Testing**

In local development:
- Superadmin: `http://localhost:3000/superadmin`
- Store Admin: `http://localhost:3000/admin?tenant=demo`

In production with DNS:
- Superadmin: `https://yourdomain.com/superadmin`
- Store Admin: `https://demo.yourdomain.com/admin`

---

## API Endpoints

### Store Admin Endpoints

#### Add New Product
```typescript
POST /api/admin/products/add-new
Body: {
  tenantId: string,
  productName: string,
  upc?: string,
  brand?: string,
  manufacturer?: string,
  category?: string,
  description?: string,
  imageUrl?: string,
  sellingPrice: number,
  costPrice: number,
  initialStock: number
}
Response: {
  success: true,
  action: 'linked' | 'queued' | 'added',
  message: string,
  inventoryId: string,
  globalProductId?: string,
  pendingId?: string
}
```

#### Enrich Product Locally
```typescript
POST /api/admin/products/enrich
Body: {
  inventoryId: string,
  tenantId: string,
  overrideImageUrl?: string,
  overrideDescription?: string,
  customData?: object
}
Response: {
  success: true,
  message: string,
  data: InventoryItem
}
```

---

## AI Product Matching Flow

```
Store Admin adds new product
         ↓
AI Product Matcher analyzes
         ↓
    ┌────┴────┐
    ↓         ↓
Exact UPC   Fuzzy Name/Brand
   Match      Matching (AI)
    ↓         ↓
    └────┬────┘
         ↓
  Confidence Score
         ↓
    ┌────┼────┐
    ↓    ↓    ↓
  >85%  50-  <50%
         85%
    ↓    ↓    ↓
  Auto  Queue Auto
  Link  Review Add
```

---

## Workflows

### Superadmin: Add New Store
1. Navigate to `/superadmin/stores`
2. Click "Add New Store"
3. Fill in store details
4. Assign unique subdomain
5. Save → Subdomain mapping created automatically

### Superadmin: Enrich Master Product
1. Navigate to `/superadmin/products`
2. Click on product card
3. Edit product details
4. Optionally click "AI Enrich" for suggestions
5. Save → Changes applied to all stores

### Store Admin: Add Product Not in Master Catalog
1. Add product via inventory management
2. AI automatically checks master catalog
3. One of three outcomes:
   - **Linked**: Product already exists, inventory item linked
   - **Queued**: Needs review, inventory created without global link
   - **Added**: New product, added to both master catalog and inventory

### Superadmin: Review Pending Product
1. Navigate to `/superadmin/pending-products`
2. View AI analysis and confidence score
3. Check suggested match (if any)
4. Choose action:
   - Approve as new → Adds to master catalog
   - Link to existing → Links to suggested match
   - Reject → Removes from queue

---

## Utilities

### `lib/subdomain.ts`
- `extractSubdomain(host)` - Extract subdomain from hostname
- `getTenantFromSubdomain(subdomain)` - Resolve tenant ID
- `isSuperadminDomain(host)` - Check if superadmin domain
- `isValidSubdomain(subdomain)` - Validate subdomain format
- `isSubdomainAvailable(subdomain)` - Check availability

### `lib/auth/superadmin.ts`
- `isSuperadmin(userId)` - Check if user is superadmin
- `requireSuperadmin(request)` - Middleware for protected routes
- `hasSuperadminPermission(userId, permission)` - Permission check

### `lib/ai/product-matcher.ts`
- `matchProductToMasterCatalog(product, catalog)` - AI product matching
- `generateProductEnrichment(product)` - AI enrichment suggestions
- `batchMatchProducts(products, catalog)` - Batch matching

### `lib/ai/auto-sync.ts`
- `autoSyncProduct(tenantId, userId, productData)` - Auto-sync workflow
- `approvePendingProduct(pendingId, reviewerId, action)` - Approve pending
- `rejectPendingProduct(pendingId, reviewerId, reason)` - Reject pending

---

## Security Considerations

1. **Superadmin Access**: Protected by `isSuperadmin()` check in layout
2. **Tenant Isolation**: Middleware sets tenant context from subdomain
3. **API Authorization**: All endpoints verify user authentication
4. **Row-Level Security**: Implement RLS policies in Supabase for additional security

---

## Future Enhancements

- [ ] Bulk product import for superadmin
- [ ] Analytics dashboard per store
- [ ] Product sync audit trail
- [ ] Image upload to Supabase storage
- [ ] Custom branding per store subdomain
- [ ] Multi-language support
- [ ] Product recommendations using AI
- [ ] Automated reordering based on sales data

---

## Support

For issues or questions:
1. Check database migration logs
2. Verify environment variables
3. Check Supabase logs for auth/api errors
4. Review OpenAI API usage for AI features

---

**Version**: 1.0.0  
**Last Updated**: January 8, 2026
