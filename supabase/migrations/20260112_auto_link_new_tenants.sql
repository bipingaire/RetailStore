-- =================================================================
-- AUTOMATICALLY LINK NEW TENANTS TO THEIR CREATOR
-- =================================================================

-- 1. Ensure 'owner_id' column exists (used by Frontend Registration)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'retail-store-tenant' 
        AND column_name = 'owner_id'
    ) THEN
        ALTER TABLE "retail-store-tenant" ADD COLUMN "owner_id" UUID REFERENCES auth.users(id);
        RAISE NOTICE 'Added owner_id column to retail-store-tenant';
    END IF;
END $$;

-- 2. Create Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_tenant_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if owner_id is present (it should be from registration flow)
  IF NEW.owner_id IS NOT NULL THEN
      INSERT INTO "tenant-user-role" ("tenant-id", "user-id", "role-type")
      VALUES (NEW."tenant-id", NEW.owner_id, 'owner')
      ON CONFLICT DO NOTHING; -- Avoid errors if already exists
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create Trigger
DROP TRIGGER IF EXISTS trg_auto_link_owner ON "retail-store-tenant";
CREATE TRIGGER trg_auto_link_owner
AFTER INSERT ON "retail-store-tenant"
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_tenant_entry();

RAISE NOTICE '✅ Auto-linking trigger setup complete.';
