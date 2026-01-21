# Supabase Removal - Windows PowerShell Commands

## Quick Removal Commands (Windows)

```powershell
# Navigate to project
cd C:\Users\hp\RetailStore

# 1. Remove supabase directory (PowerShell syntax)
Remove-Item -Path "supabase" -Recurse -Force

# 2. Clean install dependencies
npm install

# 3. Verify removal
Get-ChildItem | Where-Object { $_.Name -like "*supabase*" }
# Should return nothing

# 4. Check package.json updated
Get-Content package.json | Select-String "supabase"
# Should return nothing
```

## One-Line Alternative

```powershell
Remove-Item "supabase" -Recurse -Force; npm install
```

---

## What Gets Removed

✅ **Supabase Directory:**
- All SQL migrations (50+ files)
- Supabase config
- Supabase functions

✅ **From package.json:**
- `@supabase/auth-helpers-nextjs`
- `@supabase/supabase-js`

✅ **From node_modules:**
- All Supabase packages (automatic with npm install)

---

## Environment Variables to Remove

Edit `.env.local` and remove these lines:

```env
# REMOVE THESE:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Add these instead:

```env
# ADD THESE:
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SUBDOMAIN=demo1
```

---

## Frontend Files to Update

These files still use Supabase client and need to be updated to call FastAPI:

### Common Pattern

```typescript
// ❌ OLD (Supabase):
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(url, key)
const { data } = await supabase.from('inventory-items').select('*')

// ✅ NEW (FastAPI):
const token = localStorage.getItem('access_token')
const subdomain = localStorage.getItem('subdomain')

const response = await fetch('http://localhost:8000/api/inventory', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Subdomain': subdomain
  }
})
const data = await response.json()
```

---

## Files That Need Updates

Major files with Supabase usage:

1. `lib/supabase.ts` - Create new `lib/api.ts` instead
2. `app/shop/**/page.tsx` - All shop pages (~10 files)
3. `app/admin/**/page.tsx` - All admin pages (~20 files)
4. `app/super-admin/**/page.tsx` - SuperAdmin pages (~5 files)

See `REMOVE_SUPABASE.md` for complete migration patterns.

---

## After Removal Checklist

- [ ] Supabase directory removed
- [ ] npm install completed
- [ ] .env.local updated
- [ ] No errors in `npm run dev`
- [ ] Backend running (`cd backend && docker-compose up -d`)
- [ ] Create test tenant
- [ ] Start updating frontend files

---

## Need Help?

If you get stuck:
1. Check backend is running: `curl http://localhost:8000/health`
2. Check API docs: http://localhost:8000/api/docs
3. Test login: See `REMOVE_SUPABASE.md` for examples
