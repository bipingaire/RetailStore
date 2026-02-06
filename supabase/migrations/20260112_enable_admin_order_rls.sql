-- ENABLE ADMIN ACCESS TO ORDERS
-- Previously, only customers could see their own orders.
-- This policy allows Admins and Owners to view ALL orders for their linked tenant.

DROP POLICY IF EXISTS "Admins can view tenant orders" ON "customer-order-header";

CREATE POLICY "Admins can view tenant orders"
ON "customer-order-header"
FOR SELECT
USING (
  exists (
    select 1 from "tenant-user-role"
    where "tenant-user-role"."user-id" = auth.uid()
    and "tenant-user-role"."tenant-id" = "customer-order-header"."tenant-id"
    and "tenant-user-role"."role-type" in ('owner', 'admin')
  )
);
