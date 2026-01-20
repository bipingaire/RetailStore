# JWT Authentication & RBAC Guide

## Overview

Complete Role-Based Access Control (RBAC) system with JWT authentication for:
- **Customers** - Shop and place orders
- **Admins** - Manage store operations
- **SuperAdmins** - System-wide access

## User Roles

### 🛍️ Customer
- **Access Level:** Single store
- **Permissions:**
  - Place orders
  - View products
  - View own orders
  - Manage profile

### 👨‍💼 Admin (Store Manager)
- **Access Level:** Assigned store(s)
- **Permissions:**
  - Manage inventory
  - Process orders
  - View reports
  - Manage vendors
  - Invoice processing
  - All customer permissions

### 👑 SuperAdmin
- **Access Level:** All stores + global catalog
- **Permissions:**
  - Manage global product catalog
  - Create/manage tenants
  - System-wide analytics
  - All admin permissions
  - Cross-tenant operations

---

## Authentication Endpoints

### Customer Registration & Login

**Register Customer:**
```bash
POST /api/auth/customer/register
{
  "email": "customer@example.com",
  "password": "securepass123",
  "full_name": "John Doe",
  "phone": "555-1234",
  "subdomain": "store1"
}
```

**Customer Login:**
```bash
POST /api/auth/customer/login
Form Data:
  username: customer@example.com
  password: securepass123

Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user_role": "customer",
  "user_id": "uuid"
}
```

### Admin Registration & Login

**Register Admin:**
```bash
POST /api/auth/admin/register
{
  "email": "admin@example.com",
  "password": "securepass123",
  "full_name": "Jane Manager",
  "subdomain": "store1"
}
```

**Admin Login:**
```bash
POST /api/auth/admin/login
Form Data:
  username: admin@example.com
  password: securepass123

Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user_role": "admin",
  "user_id": "uuid"
}
```

### SuperAdmin Login

**SuperAdmin Login:**
```bash
POST /api/auth/superadmin/login
Form Data:
  username: superadmin@example.com
  password: securepass123

Response:
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "user_role": "superadmin",
  "user_id": "uuid"
}
```

**Note:** SuperAdmins are created manually in the database, not via API.

---

## Using JWT Tokens

### Include Token in Requests

```bash
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Token Contents

Access tokens include:
```json
{
  "sub": "user_id",
  "role": "customer|admin|superadmin",
  "tenant_id": "tenant_uuid",  // For customers and admins
  "customer_id": "uuid",       // For customers only
  "superadmin_id": "uuid",     // For superadmins only
  "exp": 1234567890
}
```

---

## Using RBAC in Code

### Require Specific Role

```python
from app.dependencies import require_customer, require_admin, require_superadmin

# Customer-only endpoint
@router.get("/my-orders")
async def get_my_orders(
    customer: Customer = Depends(require_customer),
    db: Session = Depends(get_db)
):
    # customer object available
    orders = db.query(Order).filter(
        Order.customer_id == customer.customer_id
    ).all()
    return orders

# Admin-only endpoint
@router.post("/inventory/adjust")
async def adjust_inventory(
    admin: TenantUser = Depends(require_admin),
    db: Session = Depends(get_db)
):
    # admin object with tenant_id available
    ...

# SuperAdmin-only endpoint
@router.post("/products")
async def create_global_product(
    superadmin: SuperadminUser = Depends(require_superadmin),
    db: Session = Depends(get_db)
):
    # superadmin object available
    ...
```

### Allow Multiple Roles

```python
from app.dependencies import require_admin_or_superadmin

@router.get("/reports")
async def get_reports(
    user = Depends(require_admin_or_superadmin),
    db: Session = Depends(get_db)
):
    # Works for both admin and superadmin
    ...
```

### Tenant Filtering (Automatic)

```python
from app.dependencies import TenantFilter

@router.get("/inventory")
async def get_inventory(
    tenant_filter: TenantFilter = Depends(),
    db: Session = Depends(get_db)
):
    # tenant_filter.tenant_id automatically set based on role:
    # - Customer: their store's tenant_id
    # - Admin: their assigned tenant_id
    # - SuperAdmin: from subdomain or query param
    
    items = db.query(InventoryItem).filter(
        InventoryItem.tenant_id == tenant_filter.tenant_id
    ).all()
    
    # Check role if needed
    if tenant_filter.is_superadmin:
        # Do something special for superadmins
        pass
    
    return items
```

---

## Endpoint Access Matrix

| Endpoint | Customer | Admin | SuperAdmin |
|----------|----------|-------|------------|
| `POST /api/auth/customer/register` | ✅ Public | ✅ Public | ✅ Public |
| `POST /api/auth/customer/login` | ✅ | ✅ | ✅ |
| `POST /api/auth/admin/login` | ❌ | ✅ | ✅ |
| `POST /api/auth/superadmin/login` | ❌ | ❌ | ✅ |
| `GET /api/products` | ✅ | ✅ | ✅ |
| `POST /api/products` | ❌ | ❌ | ✅ |
| `GET /api/inventory` | ❌ | ✅ | ✅ |
| `POST /api/orders` | ✅ | ✅ | ✅ |
| `POST /api/invoices/process` | ❌ | ✅ | ✅ |
| `GET /api/analytics/health` | ❌ | ✅ | ✅ |
| `POST /api/audits/start` | ❌ | ✅ | ✅ |
| `GET /api/profits/summary` | ❌ | ✅ | ✅ |

---

## Token Refresh

**Refresh Access Token:**
```bash
POST /api/auth/refresh
{
  "refresh_token": "YOUR_REFRESH_TOKEN"
}

Response:
{
  "access_token": "NEW_ACCESS_TOKEN",
  "refresh_token": "NEW_REFRESH_TOKEN",
  "token_type": "bearer",
  "user_role": "customer|admin|superadmin",
  "user_id": "uuid"
}
```

---

## Security Best Practices

### Token Expiration
- **Access Token:** 30 minutes (configurable in `.env`)
- **Refresh Token:** 7 days (configurable in `.env`)

### Password Requirements
- Minimum 8 characters (add validation as needed)
- Hashed with bcrypt before storage
- Never stored in plain text

### HTTPS Only
- Always use HTTPS in production
- Tokens transmitted over secure connections only

### Token Storage (Frontend)
- Store access token in memory (state)
- Store refresh token in httpOnly cookie or secure storage
- Never store in localStorage for production

---

## Examples

### Complete Customer Flow

```python
# 1. Customer registers
response = requests.post("http://localhost:8000/api/auth/customer/register", json={
    "email": "john@example.com",
    "password": "securepass123",
    "full_name": "John Doe",
    "subdomain": "mystore"
})

# 2. Customer logs in
response = requests.post("http://localhost:8000/api/auth/customer/login", data={
    "username": "john@example.com",
    "password": "securepass123"
})
tokens = response.json()
access_token = tokens["access_token"]

# 3. Customer places order
response = requests.post(
    "http://localhost:8000/api/orders",
    headers={"Authorization": f"Bearer {access_token}"},
    json={"line_items": [...]}
)

# 4. Token expires, refresh it
response = requests.post("http://localhost:8000/api/auth/refresh", json={
    "refresh_token": tokens["refresh_token"]
})
new_tokens = response.json()
```

### Admin Managing Inventory

```python
# 1. Admin logs in
response = requests.post("http://localhost:8000/api/auth/admin/login", data={
    "username": "admin@store.com",
    "password": "adminpass123"
})
tokens = response.json()
access_token = tokens["access_token"]

# 2. Check inventory health
response = requests.get(
    "http://localhost:8000/api/analytics/health",
    headers={"Authorization": f"Bearer {access_token}"}
)
health = response.json()

# 3. Process invoice
response = requests.post(
    "http://localhost:8000/api/invoices/process",
    headers={"Authorization": f"Bearer {access_token}"},
    json={
        "supplier_name": "ABC Wholesale",
        "invoice_number": "INV-001",
        "items": [...]
    }
)
```

---

## Troubleshooting

### "Could not validate credentials"
- Token expired - use refresh endpoint
- Invalid token format
- Token tampered with

### "Not a customer/admin/superadmin account"
- Using wrong login endpoint
- User not assigned correct role

### "No tenant context available"
- Admin/customer not linked to tenant
- SuperAdmin requesting tenant-specific data without subdomain

### "Inactive user"
- Account has been deactivated
- Contact administrator

---

## Migration from Basic Auth

If updating existing endpoints:

**Before:**
```python
@router.get("/inventory")
async def get_inventory(current_user: User = Depends(get_current_user)):
    ...
```

**After:**
```python
@router.get("/inventory")
async def get_inventory(
    admin: TenantUser = Depends(require_admin),  # Specific role
    tenant_filter: TenantFilter = Depends()      # Auto tenant filtering
):
    ...
```

---

## Summary

✅ **3 user roles** with distinct permissions  
✅ **Separate login endpoints** for each role  
✅ **JWT tokens** with role information  
✅ **Automatic tenant isolation** via TenantFilter  
✅ **Role-based dependencies** for easy RBAC  
✅ **Token refresh** mechanism  
✅ **bcrypt password hashing**  
✅ **Production-ready** security
