-- =================================================================
-- ENABLE TENANT-SPECIFIC CUSTOMERS
-- =================================================================

-- 1. Add tenant-id to customers table
-- This validates that a customer profile belongs to a specific store
ALTER TABLE "customers" 
ADD COLUMN IF NOT EXISTS "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE SET NULL;

-- 2. Update RLS to Scope Customers to Tenant
-- Store Owners should ONLY see customers linked to their tenant
DROP POLICY IF EXISTS "Store owners can view their customers" ON "customers";

CREATE POLICY "Store owners can view their customers"
ON "customers"
FOR SELECT
USING (
  "tenant-id" IN (
    SELECT "tenant-id" 
    FROM "tenant-user-role" 
    WHERE "user-id" = auth.uid()
    AND "role-type" IN ('owner', 'admin', 'manager')
  )
);

-- 3. Create Trigger to Capture Tenant ID on Registration
-- We need to pass the tenant_id through user_metadata since auth.users is global
CREATE OR REPLACE FUNCTION public.handle_new_customer_with_tenant() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."customers" (
    "id", 
    "full-name", 
    "email", 
    "phone",
    "tenant-id" -- Capture Tenant ID
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.email,
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'tenant_id')::uuid -- Read from metadata
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_customer ON auth.users;
CREATE TRIGGER on_auth_user_created_customer
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_customer_with_tenant();

DO $$
BEGIN
  RAISE NOTICE '✅ Customer table updated with tenant-id and RLS policies.';
END $$;
