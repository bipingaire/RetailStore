-- APPLY RESTRICTIVE SHIELD (The "AND" Gate)
-- Most policies are "PERMISSIVE" (OR). If one says YES, you see it.
-- "RESTRICTIVE" policies (AND) restrict access further. Even if a permissive rule says YES,
-- this rule MUST ALSO say YES.
-- This neutralizes any "Zombie" rules we missed.

BEGIN;

-- =================================================================
-- 1. SHIELD INVENTORY
-- =================================================================
-- Drop if exists (in case we ran it before)
DROP POLICY IF EXISTS "SHIELD: Tenant Isolation" ON "retail-store-inventory-item";

CREATE POLICY "SHIELD: Tenant Isolation"
ON "retail-store-inventory-item"
AS RESTRICTIVE  -- <--- The Magic Word
FOR ALL
TO authenticated
USING (
  "tenant-id" = get_my_tenant_id() 
  OR 
  is_superadmin(auth.uid())
);

-- =================================================================
-- 2. SHIELD CAMPAIGNS
-- =================================================================
DROP POLICY IF EXISTS "SHIELD: Tenant Isolation" ON "marketing-campaign-master";

CREATE POLICY "SHIELD: Tenant Isolation"
ON "marketing-campaign-master"
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
  "tenant-id" = get_my_tenant_id() 
  OR 
  is_superadmin(auth.uid())
);

-- =================================================================
-- 3. SHIELD BATCHES (Linking via Inventory)
-- =================================================================
DROP POLICY IF EXISTS "SHIELD: Tenant Isolation" ON "inventory-batch-tracking-record";

CREATE POLICY "SHIELD: Tenant Isolation"
ON "inventory-batch-tracking-record"
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM "retail-store-inventory-item" i 
    WHERE i."inventory-id" = "inventory-batch-tracking-record"."inventory-id"
    AND (
       i."tenant-id" = get_my_tenant_id()
       OR
       is_superadmin(auth.uid())
    )
  )
);

COMMIT;

-- VERIFY
SELECT tablename, policyname, permissive, roles 
FROM pg_policies 
WHERE tablename IN ('retail-store-inventory-item', 'marketing-campaign-master');
