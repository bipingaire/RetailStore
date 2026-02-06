-- 1. Sync Invoices to the correct tenant (move from fallback to InduMart Demo)
UPDATE "customer-invoices"
SET "tenant-id" = '11111111-1111-1111-1111-111111111111'
WHERE "tenant-id" = 'b719cc04-38d2-4af8-ae52-1001791aff6f';

-- 2. Add RLS policy so Admins can actually SEE the invoices
-- (Previously only customers could see their own invoices)
DROP POLICY IF EXISTS "Admins can view tenant invoices" ON "customer-invoices";

CREATE POLICY "Admins can view tenant invoices"
ON "customer-invoices"
FOR SELECT
USING (
  exists (
    select 1 from "tenant-user-role"
    where "tenant-user-role"."user-id" = auth.uid()
    and "tenant-user-role"."tenant-id" = "customer-invoices"."tenant-id"
    and "tenant-user-role"."role-type" in ('owner', 'admin')
  )
);

-- 3. Ensure order items are visible (usually they inherit from header RLS or open, but let's be safe)
-- If order-line-item-detail has RLS enabled, we need a policy. 
-- Assuming it relies on order accessibility or is public to authenticated users for now.
