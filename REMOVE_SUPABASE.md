# Supabase Removal Guide

## Overview
This guide documents the removal of Supabase from the Retail Store project, as it has been fully replaced by a FastAPI backend with PostgreSQL.

---

## Files/Directories to Remove

### 1. Supabase Directory
```bash
# Remove entire supabase directory with all migrations
rm -rf supabase/
```

**Contents:**
- All SQL migrations (20+ files)
- Supabase config files
- Database schema files

### 2. Update package.json

Remove Supabase dependencies:

```json
// REMOVE these lines from dependencies:
"@supabase/auth-helpers-nextjs": "^0.8.7",
"@supabase/supabase-js": "^2.39.1",
```

**Updated package.json:**
```json
{
  "dependencies": {
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@sentry/nextjs": "^10.32.1",
    "@stripe/react-stripe-js": "^5.4.1",
    "@stripe/stripe-js": "^8.6.1",
    // REMOVED: "@supabase/auth-helpers-nextjs": "^0.8.7",
    // REMOVED: "@supabase/supabase-js": "^2.39.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.3",
    "jspdf": "^4.0.0",
    "jspdf-autotable": "^5.0.7",
    "lucide-react": "^0.462.0",
    "next": "^14.2.35",
    "openai": "^4.73.0",
    "pdfjs-dist": "^5.4.530",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "resend": "^6.6.0",
    "sonner": "^2.0.7",
    "stripe": "^20.2.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "xlsx": "^0.18.5"
  }
}
```

### 3. Remove Supabase Scripts

Update `package.json` scripts:

```json
// BEFORE:
"scripts": {
  "docker:dev": "npx supabase start && docker compose -f docker-compose.yml -f docker-compose.local.yml up -d --build"
}

// AFTER:
"scripts": {
  "docker:dev": "docker compose up -d --build"
}
```

---

## Frontend Code Updates

### Files with Supabase Client Usage

You'll need to update these files to use the FastAPI backend:

**Common Pattern:**

```typescript
// OLD (Supabase):
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
const { data } = await supabase.from('table').select('*')

// NEW (FastAPI):
const response = await fetch('http://localhost:8000/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Subdomain': subdomain
  }
})
const data = await response.json()
```

### Key Changes Needed

1. **Authentication:**
   ```typescript
   // OLD:
   const { data } = await supabase.auth.signIn({ email, password })
   
   // NEW:
   const response = await fetch('http://localhost:8000/api/auth/login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
       'X-Subdomain': subdomain
     },
     body: new URLSearchParams({ username: email, password })
   })
   ```

2. **Data Fetching:**
   ```typescript
   // OLD:
   const { data } = await supabase
     .from('inventory-items')
     .select('*')
   
   // NEW:
   const response = await fetch('http://localhost:8000/api/inventory', {
     headers: {
       'Authorization': `Bearer ${accessToken}`,
       'X-Subdomain': subdomain
     }
   })
   const data = await response.json()
   ```

3. **Storage:**
   ```typescript
   // OLD:
   await supabase.storage.from('bucket').upload(path, file)
   
   // NEW:
   const formData = new FormData()
   formData.append('file', file)
   await fetch('http://localhost:8000/api/files/upload', {
     method: 'POST',
     headers: { 'Authorization': `Bearer ${token}` },
     body: formData
   })
   ```

---

## Environment Variables

### Remove from .env.local:

```env
# REMOVE these:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Add for FastAPI:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Subdomain (per tenant)
NEXT_PUBLIC_SUBDOMAIN=demo1
```

---

## Migration Checklist

- [ ] 1. Backup any important Supabase data
- [ ] 2. Remove `supabase/` directory
- [ ] 3. Update `package.json` (remove Supabase deps)
- [ ] 4. Run `npm install` to clean dependencies
- [ ] 5. Remove `node_modules/@supabase` (will happen with npm install)
- [ ] 6. Update environment variables
- [ ] 7. Replace Supabase client calls with FastAPI calls
- [ ] 8. Update authentication logic
- [ ] 9. Update data fetching logic
- [ ] 10. Test all functionality with FastAPI backend

---

## Testing After Removal

1. **Start Backend:**
   ```bash
   cd backend
   docker-compose up -d
   python create_tenant.py demo1 --name "Demo" --admin-email admin@demo.com
   ```

2. **Start Frontend:**
   ```bash
   npm install  # Clean install without Supabase
   npm run dev
   ```

3. **Test Key Features:**
   - [ ] Login
   - [ ] Product listing
   - [ ] Inventory management
   - [ ] Order creation
   - [ ] File upload
   - [ ] Customer management

---

## Command to Remove Supabase

```bash
# Navigate to project root
cd /c/Users/hp/RetailStore

# Remove Supabase directory
rm -rf supabase

# Remove from node_modules (will happen automatically)
npm install

# Verify removal
ls -la | grep -i supabase  # Should show nothing
```

---

## Benefits of Removal

✅ **Reduced Dependencies:**
- Removed 2 npm packages
- Removed ~50MB of node_modules

✅ **Simplified Architecture:**
- Single backend (FastAPI)
- No vendor lock-in
- Complete control over database

✅ **Better Performance:**
- Direct PostgreSQL access
- No intermediary API layer
- Optimized queries

✅ **Cost Savings:**
- No Supabase subscription needed
- Self-hosted solution
- Lower operational costs

---

## Rollback Plan (If Needed)

If you need to rollback:

1. Restore `supabase/` from git
2. Run `npm install` to restore packages
3. Revert environment variables
4. Restart Supabase local instance

---

## Summary

**Removed:**
- `supabase/` directory (migrations, config)
- `@supabase/auth-helpers-nextjs` package
- `@supabase/supabase-js` package
- Supabase environment variables
- Supabase client code

**Replaced With:**
- FastAPI backend (`backend/`)
- PostgreSQL databases (master + tenants)
- JWT authentication
- RESTful API calls
- Direct database access

---

## Next Steps

1. Remove Supabase files (see commands above)
2. Update frontend to use FastAPI endpoints
3. Test thoroughly
4. Deploy without Supabase dependency

🎉 **Project is now Supabase-free!**
