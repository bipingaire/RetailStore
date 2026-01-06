# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub or email
4. Click "New Project"
5. Fill in:
   - **Name:** RetailStore-Beta
   - **Database Password:** (strong password - save this!)
   - **Region:** US East (closest to your users)
   - **Pricing Plan:** Free (for development)
6. Click "Create new project"
7. Wait 2-3 minutes for provisioning

## Step 2: Run Database Schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Wait for success message ✅

## Step 3: Enable Row Level Security

1. Still in SQL Editor, click "New query"
2. Copy the entire contents of `supabase/rls-policies.sql`
3. Paste and click "Run"
4. Verify no errors ✅

## Step 4: Get Your API Credentials

1. Go to **Project Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon/public** key (starts with: eyJ...)

## Step 5: Create Environment File

1. In your project root, create `.env.local` file
2. Add these lines (replace with your actual values):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Add your OpenAI key for invoice parsing
OPENAI_API_KEY=sk-your-key-here
```

## Step 6: Create Test Tenant

1. In Supabase, go to **Authentication** → **Users**
2. Click "Add user" → "Create new user"
3. Email: `owner@test.com`
4. Password: `TestPassword123!`
5. Click "Create user"
6. Copy the User ID (UUID)

7. Go to **SQL Editor**, run this (replace USER_ID):

```sql
-- Create test tenant
INSERT INTO "retail-store-tenant" (
  "store-name", 
  "email-address", 
  "owner-user-id"
)
VALUES (
  'Test Store',
  'owner@test.com',
  'PASTE_USER_ID_HERE'
)
RETURNING "tenant-id";

-- Copy the tenant-id from the result

-- Link user to tenant
INSERT INTO "tenant-user-role" (
  "tenant-id",
  "user-id", 
  "role-type"
)
VALUES (
  'PASTE_TENANT_ID_HERE',
  'PASTE_USER_ID_HERE',
  'owner'
);
```

## Step 7: Add Sample Products

```sql
-- Add sample global products
INSERT INTO "global-product-master-catalog" (
  "product-name",
  "upc-ean-code",
  "category-name",
  "image-url"
) VALUES
('Coca Cola 2L', '012000001000', 'Beverages', 'https://via.placeholder.com/150'),
('Lays Chips Classic', '028400001002', 'Snacks', 'https://via.placeholder.com/150'),
('Wonder Bread', '004186001001', 'Bakery', 'https://via.placeholder.com/150')
RETURNING *;
```

## Step 8: Test Your Setup

1. Stop your Next.js dev server if running
2. Start it again: `npm run dev`
3. Go to http://localhost:3000
4. You should see no more "Supabase URL missing" warning!
5. Try logging in with: `owner@test.com` / `TestPassword123!`

## Troubleshooting

**Error: "relation does not exist"**
→ Schema not created. Re-run schema.sql

**Error: "new row violates row-level security"**
→ RLS policies not applied. Re-run rls-policies.sql

**Error: "invalid input syntax for type uuid"**
→ Check your user ID and tenant ID are valid UUIDs

## Next Steps

After successful setup:
1. ✅ Update task.md - Mark "Supabase Setup" as complete
2. → Move to frontend completion (checkout, auth enhancement)
3. → Test all features with real database

## Need Help?

Check Supabase logs:
- **Logs** → **Postgres Logs** for database errors
- **API** → **Logs** for API errors
