# 🚀 RetailStore - Deployment Guide

## Prerequisites

- Node.js 18.18.0 or higher
- npm or yarn
- Supabase account
- Vercel account (free tier works)
- OpenAI API key (optional, for AI features)

---

## Step 1: Supabase Setup (30 minutes)

### 1.1 Create Supabase Project

Follow the complete guide: `supabase/SETUP_GUIDE.md`

**Quick checklist:**
- [ ] Create Supabase account
- [ ] Create new project "RetailStore-Production"
- [ ] Run `supabase/schema.sql` in SQL Editor
- [ ] Run `supabase/rls-policies.sql` in SQL Editor
- [ ] Copy Project URL and anon key
- [ ] Create test user and tenant

### 1.2 Create Environment Variables

Create `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# OpenAI (Optional - for invoice parsing)
OPENAI_API_KEY=sk-...

# Stripe (Optional - for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Step 2: Local Testing (2-3 hours)

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Start Development Server

```bash
npm run dev
```

### 2.3 Test All Features

**Admin Dashboard:**
- [ ] Login as owner
- [ ] Upload and parse invoice (with OpenAI)
- [ ] View inventory health
- [ ] Create a campaign
- [ ] Verify POS mapping
- [ ] Check financial reports

**Shop Interface:**
- [ ] Browse products
- [ ] View product details
- [ ] Add items to cart
- [ ] Complete checkout
- [ ] View order confirmation

**Authentication:**
- [ ] Sign up new user
- [ ] Login/Logout
- [ ] Password reset flow

---

## Step 3: Production Deployment (5 minutes)

### 3.1 Deploy to Vercel

**Option A: GitHub Integration (Recommended)**

1. Push code to GitHub:
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. Go to [https://vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (if using AI features)
6. Click "Deploy"
7. Done! ✅

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Your app will be live at:** `https://your-project.vercel.app`

### 3.2 Configure Supabase for Production

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Redirect URLs**:
   - `https://your-project.vercel.app/auth/reset-password`
3. Add to **Site URL**: `https://your-project.vercel.app`

---

## Step 4: Post-Deployment Setup (1 hour)

### 4.1 Create Production Tenant

Run in Supabase SQL Editor:

```sql
-- Create owner user via Supabase Auth Dashboard first
-- Then run:

INSERT INTO "retail-store-tenant" (
  "store-name", 
  "store-address",
  "store-city",
  "store-state",
  "email-address",
  "phone-number",
  "owner-user-id"
)
VALUES (
  'Your Store Name',
  '123 Main St',
  'New York',
  'NY',
  'owner@yourstore.com',
  '(555) 123-4567',
  'PASTE_USER_ID_HERE'
)
RETURNING "tenant-id";

-- Link user to tenant
INSERT INTO "tenant-user-role" (
  "tenant-id",
  "user-id",
  "role-type"
)
VALUES (
  'PASTE_TENANT_ID_FROM_ABOVE',
  'PASTE_USER_ID_HERE',
  'owner'
);
```

### 4.2 Add Initial Inventory

**Option 1: Upload Invoice**
- Use the invoice upload feature with a real vendor invoice
- AI will automatically extract products

**Option 2: Manual Entry via SQL**

```sql
-- Add to global catalog first
INSERT INTO "global-product-master-catalog" (
  "product-name",
  "upc-ean-code",
  "category-name",
  "image-url"
) VALUES
('Coca Cola 2L', '012000001', 'Beverages', 'URL'),
('Wonder Bread', '004186001', 'Bakery', 'URL')
RETURNING "product-id";

-- Then add to store inventory
INSERT INTO "retail-store-inventory-item" (
  "tenant-id",
  "global-product-id",
  "current-stock-quantity",
  "selling-price-amount",
  "cost-price-amount"
) VALUES
('YOUR_TENANT_ID', 'PRODUCT_ID_FROM_ABOVE', 50, 2.99, 1.50);
```

### 4.3 Configure POS Integration (If Applicable)

Contact your POS provider for API access, then update:
`app/api/sales/sync/route.ts`

---

## Step 5: Optional Enhancements

### 5.1 Add Stripe Payments

1. Get Stripe keys from [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Add to Vercel environment variables
3. Uncomment Stripe code in `app/shop/checkout/page.tsx`
4. Install: `npm install @stripe/stripe-js stripe`

### 5.2 Email Notifications

Create Supabase Edge Function:

```bash
supabase functions new order-confirmation
```

Add SendGrid or Resend integration for emails.

### 5.3 Analytics

Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

Update `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### Error: "Supabase URL missing"
→ Add env variables to Vercel dashboard and redeploy

### Error: "Network request failed"
→ Check Supabase URL configuration and CORS settings

### Orders not saving
→ Verify RLS policies are applied and user has tenant assigned

### Images not loading
→ Check Supabase Storage bucket is public

---

## Performance Optimization

### Enable Next.js Image Optimization

Update `next.config.mjs`:

```javascript
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp'],
  },
};
```

### Enable Caching

Vercel automatically caches static assets and API responses.

### Database Optimization

1. Add indexes to frequently queried columns
2. Use database connection pooling
3. Enable Supabase caching for read-heavy tables

---

## Monitoring & Maintenance

### Supabase Logs

Monitor: Dashboard → Logs → PostgreSQL Logs

### Vercel Logs

Monitor: Dashboard → Deployments → Logs

### Error Tracking (Optional)

Add Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Scaling Checklist

When ready to scale beyond 1 store:

- [ ] Upgrade Supabase to Pro ($25/month)
- [ ] Add database backups (automatic in Pro)
- [ ] Set up monitoring alerts
- [ ] Configure CDN for images
- [ ] Add rate limiting for APIs
- [ ] Set up staging environment
- [ ] Implement automated testing
- [ ] Add error tracking (Sentry)

---

## Security Checklist

- [ ] ENV variables are not committed to git
- [ ] Supabase RLS policies are enabled
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] API keys are rotated regularly
- [ ] User passwords are hashed (automatic via Supabase)
- [ ] CORS is configured properly 
- [ ] SQL injection prevented (using Supabase client)

---

## Support & Resources

**Documentation:**
- `supabase/SETUP_GUIDE.md` - Database setup
- `NEXT_STEPS.md` - Development roadmap
- `task.md` - Progress tracking

**Community Help:**
- Supabase Discord: [https://discord.supabase.com](https://discord.supabase.com)
- Next.js Discussions: [https://github.com/vercel/next.js/discussions](https://github.com/vercel/next.js/discussions)
-Vercel Support: [https://vercel.com/support](https://vercel.com/support)

---

## Success! 🎉

Your RetailStore app is now live and ready for beta testing!

**Next Steps:**
1. Train store owner on using the admin dashboard
2. Test with real customer orders
3. Gather feedback and iterate
4. Scale to more stores!

---

**Deployment Timestamp:** {{DATE}}  
**Version:** 1.0.0 Beta  
**Status:** Production Ready ✅
