# 🚀 RetailStore - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase project created
- Domain name (optional, for production)

---

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourorg/retailstore.git
cd retailstore
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-key

# Facebook/Instagram (optional)
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret

# Stripe (for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Database Setup

### 1. Run Schema in Supabase

1. Open Supabase SQL Editor
2. Copy contents of `supabase/complete_idempotent_schema.sql`
3. Paste and run
4. Wait for completion message

### 2. Verify Tables
Check that these tables exist:
- `retail-store-tenant`
- `global-product-master-catalog`
- `retail-store-inventory-item`
- `inventory_reconciliation`
- `reconciliation_line_items`
- `expenses`

### 3. Enable Storage
In Supabase dashboard:
1. Go to Storage
2. Create bucket: `documents`
3. Set to public
4. Create bucket: `product-images`
5. Set to public

---

## Local Development

### Start Dev Server
```bash
npm run dev
```

Access at `http://localhost:3000`

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

---

## Production Deployment

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   - Go to vercel.com
   - Import Git repository
   - Select `retailstore` project

2. **Configure Environment**
   - Add all `.env.local` variables
   - Click "Deploy"

3. **Post-Deployment**
   - Verify at your-domain.vercel.app
   - Test authentication
   - Upload test invoice

### Option 2: Docker

```bash
# Build image
docker build -t retailstore .

# Run container
docker run -p 3000:3000 --env-file .env.local retailstore
```

### Option 3: Self-Hosted

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## Post-Deployment Checklist

### Authentication
- [ ] Test signup flow
- [ ] Test login
- [ ] Verify protected routes redirect
- [ ] Test password reset

### Features
- [ ] Upload test invoice
- [ ] Upload test Z-report
- [ ] Create reconciliation
- [ ] View profit dashboard
- [ ] Create campaign
- [ ] Test restock page

### E-Commerce
- [ ] Browse products
- [ ] Add to cart
- [ ] Complete checkout
- [ ] Verify order created

---

## Performance Optimization

### Enable Caching
Add to `next.config.mjs`:
```javascript
experimental: {
  optimizeCss: true,
}
```

### Image Optimization
Use Supabase CDN for images:
```javascript
const imageUrl = supabase.storage
  .from('product-images')
  .getPublicUrl('image.jpg')
  .data.publicUrl;
```

### Database Indexes
Already included in schema:
- Product name search
- Inventory tenant lookup
- Order status queries

---

## Monitoring & Maintenance

### Setup Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs
```

### Database Backups
Supabase automatically backs up daily.

Manual backup:
1. Go to Supabase Dashboard
2. Settings → Database
3. Click "Create Backup"

### Performance Monitoring
Use Vercel Analytics:
1. Enable in Vercel dashboard
2. View metrics in Analytics tab

---

## Scaling Considerations

### Multi-Tenant Load
- Database: Uses Row Level Security (RLS)
- Each tenant isolated by `tenant_id`
- Scales to 1000s of tenants

### High Traffic
1. Enable caching
2. Use CDN for images
3. Consider adding Redis for session management

### Database Performance
Monitor slow queries:
```sql
SELECT * FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

### Database Connection Issues
- Check Supabase URL and key
- Verify project is not paused
- Check RLS policies

### Authentication Not Working
- Verify middleware is enabled
- Check auth helpers version
- Test with incognito window

---

## Security Checklist

- [ ] Environment variables secured
- [ ] RLS policies enabled
- [ ] API routes protected
- [ ] HTTPS enforced in production
- [ ] CORS configured properly
- [ ] Rate limiting enabled

---

## Support & Updates

**Documentation:** `/docs`  
**Issues:** GitHub Issues  
**Updates:** Check for npm package updates monthly

---

*Deployment Guide v1.0 - January 2026*
