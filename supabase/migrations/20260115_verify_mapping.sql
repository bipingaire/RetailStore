-- =====================================================
-- VERIFY HIGHPOINT MAPPING
-- =====================================================

DO $$
DECLARE
  v_tenant_id UUID;
  v_tenant_name TEXT;
  v_user_id UUID;
  v_user_email TEXT := 'admin@highpoint.indumart.us';
  v_role TEXT;
BEGIN

  RAISE NOTICE '---------------------------------------------------';
  RAISE NOTICE '🔍 INSPECTING MAPPING FOR HIGHPOINT';
  RAISE NOTICE '---------------------------------------------------';

  -- 1. FIND TENANT via Subdomain
  SELECT t."tenant-id", t."store-name"
  INTO v_tenant_id, v_tenant_name
  FROM "subdomain-tenant-mapping" m
  JOIN "retail-store-tenant" t ON m."tenant-id" = t."tenant-id"
  WHERE m."subdomain" = 'highpoint';

  IF v_tenant_id IS NOT NULL THEN
    RAISE NOTICE '✅ Tenant Found:';
    RAISE NOTICE '   Name: %', v_tenant_name;
    RAISE NOTICE '   ID:   %', v_tenant_id;
    RAISE NOTICE '   URL:  highpoint.indumart.us';
  ELSE
    RAISE NOTICE '❌ Tenant NOT FOUND for subdomain "highpoint"';
  END IF;

  -- 2. FIND USER
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_user_email;

  IF v_user_id IS NOT NULL THEN
    RAISE NOTICE '✅ User Found:';
    RAISE NOTICE '   Email: %', v_user_email;
    RAISE NOTICE '   ID:    %', v_user_id;
  ELSE
    RAISE NOTICE '❌ User % NOT FOUND', v_user_email;
  END IF;

  -- 3. CHECK ROLE LINK
  IF v_tenant_id IS NOT NULL AND v_user_id IS NOT NULL THEN
    SELECT "role-type" INTO v_role
    FROM "tenant-user-role"
    WHERE "tenant-id" = v_tenant_id AND "user-id" = v_user_id;

    IF v_role IS NOT NULL THEN
      RAISE NOTICE '✅ LINK CONFIRMED: User is "%" of Tenant', v_role;
    ELSE
      RAISE NOTICE '❌ LINK MISSING: User has NO role in this tenant!';
    END IF;
  END IF;
  
  RAISE NOTICE '---------------------------------------------------';

END $$;
