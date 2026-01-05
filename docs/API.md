# 🔌 RetailStore - API Documentation

## Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:3000/api
```

## Authentication
All API routes under `/admin/*` require authentication via Supabase session cookie.

---

## Invoice Processing

### Upload Invoice
`POST /api/invoices/upload`

**Request:**
```javascript
FormData {
  file: File (PDF/Image)
}
```

**Response:**
```json
{
  "invoice_id": "uuid",
  "status": "processing",
  "message": "Invoice uploaded successfully"
}
```

---

## Z-Report Processing

### Parse Z-Report
`POST /api/parse-z-report`

**Request:**
```json
{
  "fileUrl": "https://storage.url/report.pdf"
}
```

**Response:**
```json
{
  "reportDate": "2026-01-05",
  "totalSales": 1250.50,
  "transactionCount": 45,
  "lineItems": [
    {
      "skuCode": "SKU123",
      "productName": "Product Name",
      "quantitySold": 5,
      "totalAmount": 99.95
    }
  ]
}
```

---

## Campaign Generation

### Generate Social Media Post
`POST /api/generate-campaign`

**Request:**
```json
{
  "products": [
    {
      "inventory_id": "uuid",
      "global_products": {
        "product_name": "Product Name"
      },
      "selling_price_amount": 19.99
    }
  ]
}
```

**Response:**
```json
{
  "post": "🎉 FLASH SALE! Get Product Name for only $19.99..."
}
```

---

## Social Media Integration

### Post to Facebook
`POST /api/social/facebook`

**Request:**
```json
{
  "message": "Promotional post content",
  "imageUrl": "https://...",
  "accessToken": "facebook-page-token",
  "pageId": "your-page-id"
}
```

**Response:**
```json
{
  "success": true,
  "postId": "123456789",
  "message": "Posted successfully to Facebook"
}
```

### Post to Instagram
`POST /api/social/instagram`

**Request:**
```json
{
  "caption": "Post caption with hashtags",
  "imageUrl": "https://...",
  "accessToken": "instagram-token",
  "accountId": "instagram-business-id"
}
```

**Response:**
```json
{
  "success": true,
  "postId": "987654321",
  "message": "Posted successfully to Instagram"
}
```

---

## Database Queries

### Get Inventory Health
Direct Supabase query using client:

```javascript
const { data } = await supabase
  .from('store_inventory')
  .select(`
    inventory_id,
    current_stock_quantity,
    reorder_point_value,
    global_products (product_name)
  `)
  .eq('is_active', true);
```

### Get Reconciliations
```javascript
const { data } = await supabase
  .from('inventory_reconciliation')
  .select('*')
  .order('created_at', { ascending: false });
```

### Add Expense
```javascript
const { data, error } = await supabase
  .from('expenses')
  .insert({
    expense_date: '2026-01-05',
    category: 'utilities',
    amount: 150.00,
    description: 'Electricity bill'
  });
```

---

## RPC Functions

### Apply Reconciliation
```javascript
const { error } = await supabase.rpc('apply_reconciliation', {
  p_reconciliation_id: 'uuid'
});
```

### Get Inventory Health Stats
```javascript
const { data } = await supabase.rpc('get_inventory_health_stats', {
  p_tenant_id: 'uuid'
});
```

**Response:**
```json
{
  "total_items": 150,
  "low_stock_count": 12,
  "out_of_stock_count": 3,
  "expiring_soon_count": 8
}
```

---

## Error Responses

All APIs follow standard error format:

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
- `400` - Bad Request (missing parameters)
- `401` - Unauthorized (no valid session)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

**Default Limits:**
- AI Parsing APIs: 10 requests/minute
- Social Media Posts: 5 posts/hour
- General APIs: 100 requests/minute

---

## Webhooks

### Order Webhook
Configure in Stripe dashboard:
```
URL: https://your-domain.com/api/webhooks/stripe
Events: checkout.session.completed
```

---

## SDK Usage Examples

### JavaScript/TypeScript
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch inventory
const { data, error } = await supabase
  .from('store_inventory')
  .select('*')
  .limit(10);
```

---

*API Documentation v1.0 - January 2026*
