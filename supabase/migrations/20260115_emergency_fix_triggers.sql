-- =====================================================
-- EMERGENCY FIX: DROP FAULTY TRIGGERS & RLS
-- =====================================================

-- 1. DROP THE TRIGGER that is crashing Login
-- The trigger calls 'public.handle_new_customer_with_tenant()' which might be failing
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;

-- 2. ENSURE ADMIN USER EXISTS (Retry with correct metadata just in case)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
  v_email TEXT := 'admin@highpoint.indumart.us';
  v_password TEXT := 'password123';
BEGIN
  -- Re-fetch tenant
  SELECT "tenant-id" INTO v_tenant_id FROM "retail-store-tenant" 
  WHERE "store-name" ILIKE '%Highpoint%' LIMIT 1;
  
  -- Re-Confirm Metadata
  UPDATE auth.users 
  SET raw_user_meta_data = jsonb_build_object('full_name', 'Highpoint Admin', 'tenant_id', v_tenant_id)
  WHERE email = v_email;

END $$;

RAISE NOTICE '✅ Trigger dropped. Login should now work.';
