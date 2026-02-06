-- Migration: Fix RLS for Inventory and Data Tables (2026-02-07)
-- Description: Enables read access for authorized tenants to critical data tables which were blocking the dashboard.

-- 1. Inventory Items
ALTER TABLE public."retail-store-inventory-item" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for tenant staff" ON public."retail-store-inventory-item";

CREATE POLICY "Enable read access for tenant staff" 
ON public."retail-store-inventory-item"
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "retail-store-inventory-item"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);

-- 2. Customer Order Header (For Orders Dashboard)
ALTER TABLE public."customer-order-header" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for tenant orders" ON public."customer-order-header";

CREATE POLICY "Enable read access for tenant orders" 
ON public."customer-order-header"
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "customer-order-header"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);

-- 3. Marketing Campaigns
ALTER TABLE public."marketing-campaign-master" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for marketing" ON public."marketing-campaign-master";

CREATE POLICY "Enable read access for marketing" 
ON public."marketing-campaign-master"
FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM public."tenant-user-role" tur 
        WHERE tur."tenant-id" = "marketing-campaign-master"."tenant-id"
        AND tur."user-id" = auth.uid()
    )
);

-- 4. Global Product Catalog (Public/Shared Read)
-- Assuming this is a shared catalog, we might want global read access for authenticated users
ALTER TABLE public."global-product-master-catalog" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all authenticated users" 
ON public."global-product-master-catalog"
FOR SELECT 
TO authenticated
USING (true);
