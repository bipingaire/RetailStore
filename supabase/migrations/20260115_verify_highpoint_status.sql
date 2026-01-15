-- =====================================================
-- DIAGNOSTIC: VERIFY HIGHPOINT STATUS
-- =====================================================

DO $$
DECLARE
  v_tenant_id UUID;
  v_user_id UUID;
  v_role TEXT;
  v_email TEXT := 'admin@highpoint.indumart.us';
BEGIN
  RAISE NOTICE '------------------------------------------------';
  RAISE NOTICE '🔍 DIAGNOSTIC REPORT FOR HIGHPOINT';
  RAISE NOTICE '------------------------------------------------';

  -- 1. CHECK TENANT
  SELECT "tenant-id" INTO v_tenant_id 
  FROM "subdomain-tenant-mapping" WHERE "subdomain" = 'highpoint';
  
  IF v_tenant_id IS NOT NULL THEN
    RAISE NOTICE '✅ Subdomain "highpoint" found. Maps to Tenant ID: %', v_tenant_id;
  ELSE
    RAISE NOTICE '❌ Subdomain "highpoint" NOT found in mapping!';
    -- Check tenant table directly
    SELECT "tenant-id" INTO v_tenant_id 
    FROM "retail-store-tenant" WHERE "store-name" ILIKE '%Highpoint%' LIMIT 1;
    
    IF v_tenant_id IS NOT NULL THEN
         RAISE NOTICE '   ⚠️ Found "Highpoint" in tenant table (ID: %), but mapping is missing.', v_tenant_id;
    ELSE
         RAISE NOTICE '   ❌ No "Highpoint" tenant found anywhere.';
    END IF;
  END IF;

  -- 2. CHECK USER
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;
  
  IF v_user_id IS NOT NULL THEN
    RAISE NOTICE '✅ User "%" found. ID: %', v_email, v_user_id;
  ELSE
    RAISE NOTICE '❌ User "%" NOT found in auth.users.', v_email;
  END IF;

  -- 3. CHECK ROLE LINK
  IF v_tenant_id IS NOT NULL AND v_user_id IS NOT NULL THEN
     SELECT "role-type" INTO v_role 
     FROM "tenant-user-role" 
     WHERE "tenant-id" = v_tenant_id AND "user-id" = v_user_id;
     
     IF v_role IS NOT NULL THEN
        RAISE NOTICE '✅ Role Link Exists: User has role "%" for this tenant.', v_role;
     ELSE
        RAISE NOTICE '❌ NO ROLE LINK FOUND between User and Tenant!';
     END IF;
  END IF;

  RAISE NOTICE '------------------------------------------------';
END $$;
