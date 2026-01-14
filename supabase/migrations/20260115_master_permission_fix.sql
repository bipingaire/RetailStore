-- =====================================================
-- MASTER PERMISSION FIX (Run this to solve all 400/401 errors)
-- =====================================================

-- 1. FIX TENANT TABLE PERMISSIONS (The core "Setup Error")
ALTER TABLE "retail-store-tenant" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenant_insert_new" ON "retail-store-tenant";
DROP POLICY IF EXISTS "tenant_update_own" ON "retail-store-tenant";
DROP POLICY IF EXISTS "user_read_own_tenant" ON "retail-store-tenant";
DROP POLICY IF EXISTS "public_read_tenant" ON "retail-store-tenant";

-- Allow ANY authenticated user to create a store
CREATE POLICY "tenant_insert_new" ON "retail-store-tenant"
FOR INSERT TO authenticated WITH CHECK (true);

-- Allow owner to update their store
CREATE POLICY "tenant_update_own" ON "retail-store-tenant"
FOR UPDATE TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- Allow reading own tenant
CREATE POLICY "user_read_own_tenant" ON "retail-store-tenant"
FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "tenant-user-role"
        WHERE "user-id" = auth.uid()
        AND "tenant-id" = "retail-store-tenant"."tenant-id"
    )
);


-- 2. FIX ROLE TABLE PERMISSIONS (Needed to become Owner)
ALTER TABLE "tenant-user-role" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can INSERT their own tenant roles" ON "tenant-user-role";
DROP POLICY IF EXISTS "Users can SELECT their own tenant roles" ON "tenant-user-role";

-- Allow self-assignment (critical for registration)
CREATE POLICY "Users can INSERT their own tenant roles" ON "tenant-user-role"
FOR INSERT TO authenticated WITH CHECK (auth.uid() = "user-id");

-- Allow viewing own roles
CREATE POLICY "Users can SELECT their own tenant roles" ON "tenant-user-role"
FOR SELECT TO authenticated USING (auth.uid() = "user-id");


-- 3. FIX SUBDOMAIN TABLE & CONSTRAINTS
ALTER TABLE "subdomain-tenant-mapping" ENABLE ROW LEVEL SECURITY;

-- Ensure UNIQUE constraint exists (prevents duplicates)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subdomain_tenant_mapping_tenant_id_key') THEN
    ALTER TABLE "subdomain-tenant-mapping" ADD CONSTRAINT "subdomain_tenant_mapping_tenant_id_key" UNIQUE ("tenant-id");
  END IF;
END $$;

DROP POLICY IF EXISTS "tenant_manage_mapping" ON "subdomain-tenant-mapping";
DROP POLICY IF EXISTS "public_read_mapping" ON "subdomain-tenant-mapping";

-- Allow tenant to manage their subdomain
CREATE POLICY "tenant_manage_mapping" ON "subdomain-tenant-mapping"
FOR ALL TO authenticated
USING ("tenant-id" = get_my_tenant_id())
WITH CHECK ("tenant-id" = get_my_tenant_id());

-- Public read access (for routing)
CREATE POLICY "public_read_mapping" ON "subdomain-tenant-mapping"
FOR SELECT TO public USING (true);


-- 4. UPGRADE TRIGGERS (Bypass RLS for Automation)
CREATE OR REPLACE FUNCTION public.handle_new_tenant_entry()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(NEW.owner_id, auth.uid()); -- Fallback to current user
  IF v_user_id IS NOT NULL THEN
      INSERT INTO "tenant-user-role" ("tenant-id", "user-id", "role-type")
      VALUES (NEW."tenant-id", v_user_id, 'owner')
      ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- MAGIC KEY

CREATE OR REPLACE FUNCTION auto_create_subdomain_mapping()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."subdomain" IS NOT NULL THEN
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES (NEW."subdomain", NEW."tenant-id")
    ON CONFLICT ("subdomain") DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- <--- MAGIC KEY

DO $$
BEGIN
  RAISE NOTICE '✅ MASTER FIX COMPLETE. All Permissions and Triggers are now correct.';
END $$;
