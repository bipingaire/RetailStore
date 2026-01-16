-- DEEP DIVE: WHY CAN YOU SEE THIS?
-- This script checks the "Chain of Custody" for the data leak.

-- 1. WHAT POLICIES ARE ACTUALLY ACTIVE? (Did the reset work?)
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'retail-store-inventory-item';

-- 2. WHO ARE YOU? (And which Tenant do you belong to?)
-- Replace this email with the one you are logged in as
SELECT u.email, t."tenant-id", t.subdomain, t."store-name", tur."role-type"
FROM auth.users u
JOIN "tenant-user-role" tur ON u.id = tur."user-id"
JOIN "retail-store-tenant" t ON tur."tenant-id" = t."tenant-id"
WHERE u.email = 'admin1@indumart.com';

-- 3. WHO OWNS THE "LIZZAT" ITEMS?
-- We look at the inventory items you are seeing.
-- If their Tenant ID matches YOUR Tenant ID (from step 2), 
-- then RLS is working, but your user is linked to the WRONG store.
SELECT 
    i."inventory-id", 
    i."tenant-id" as "item_owner_tenant_id", 
    t."store-name" as "item_owner_store_name",
    g."product-name"
FROM "retail-store-inventory-item" i
JOIN "retail-store-tenant" t ON i."tenant-id" = t."tenant-id"
JOIN "global-product-master-catalog" g ON i."global-product-id" = g."product-id"
WHERE g."product-name" ILIKE '%LIZZAT%'
LIMIT 5;

-- 4. TEST RLS "PRETENDING" TO BE YOU
-- We simulate a session as your user to see what the database returns correctly.
-- (This requires the user ID from Step 2, so we can't fully automate this in one go without dynamic SQL,
-- but Steps 1-3 will tell us the answer).
