-- Add Greensboro Tenant with Subdomain
-- Admin user must be created separately via Supabase Auth Dashboard

-- 1. Create the tenant
INSERT INTO "retail-store-tenant" (
  "tenant-id",
  "store-name",
  "subdomain",
  "store-address",
  "store-city",
  "subscription-tier"
)
VALUES (
  gen_random_uuid(),
  'Greensboro Store',
  'greensboro',
  '123 Main Street, Greensboro, NC',
  'Greensboro',
  'beta'
)
ON CONFLICT ("subdomain") DO UPDATE
SET "store-name" = EXCLUDED."store-name"
RETURNING "tenant-id";

-- 2. Get the tenant ID and create subdomain mapping
DO $$
DECLARE
  greensboro_tenant_id UUID;
BEGIN
  -- Get the Greensboro tenant ID
  SELECT "tenant-id" INTO greensboro_tenant_id
  FROM "retail-store-tenant"
  WHERE "subdomain" = 'greensboro'
  LIMIT 1;

  IF greensboro_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Greensboro tenant not found.';
  END IF;

  -- Create subdomain mapping
  INSERT INTO "subdomain-tenant-mapping" (
    "subdomain",
    "tenant-id",
    "is-active"
  )
  VALUES (
    'greensboro',
    greensboro_tenant_id,
    true
  )
  ON CONFLICT ("subdomain") DO NOTHING;

  RAISE NOTICE '✅ Greensboro tenant created successfully!';
  RAISE NOTICE 'Tenant ID: %', greensboro_tenant_id;
  RAISE NOTICE 'Subdomain: greensboro.indumart.us';
  RAISE NOTICE '';
  RAISE NOTICE '📋 NEXT STEPS:';
  RAISE NOTICE '1. Go to Supabase Auth → Users → Add User';
  RAISE NOTICE '2. Email: admin@greensboro.indumart.us';
  RAISE NOTICE '3. Password: greensboro123 (or your choice)';
  RAISE NOTICE '4. After creating user, run this to link them:';
  RAISE NOTICE '';
  RAISE NOTICE 'UPDATE auth.users SET raw_user_meta_data = jsonb_build_object(''tenant_id'', ''%'') WHERE email = ''admin@greensboro.indumart.us'';', greensboro_tenant_id;
END $$;

-- Verify the setup
SELECT 
  t."tenant-id",
  t."store-name",
  t."subdomain",
  t."store-city",
  s."subdomain" as mapped_subdomain,
  s."is-active" as subdomain_active
FROM "retail-store-tenant" t
LEFT JOIN "subdomain-tenant-mapping" s ON t."tenant-id" = s."tenant-id"
WHERE t."subdomain" = 'greensboro';
