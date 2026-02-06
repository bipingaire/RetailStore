-- =================================================================
-- DEBUG SCRIPT: ADMIN DATA VISIBILITY
-- Run this in Supabase SQL Editor to diagnose why orders aren't showing.
-- =================================================================

-- 1. CHECK CURRENT USER & TENANT LINK
-- Replace 'admin@retailstore.com' with the email you are logging in with if different.
SELECT 
    au.id AS "User ID",
    au.email,
    tur."tenant-id" AS "Linked Tenant ID",
    rst."store-name"
FROM auth.users au
LEFT JOIN "tenant-user-role" tur ON au.id = tur."user-id"
LEFT JOIN "retail-store-tenant" rst ON tur."tenant-id" = rst."tenant-id"
WHERE au.email = 'admin@retailstore.com';

-- 2. CHECK ORDERS FOR THE TENANT (InduMart)
-- We expect to see orders for tenant '11111111-1111-1111-1111-111111111111'
SELECT 
    "tenant-id",
    COUNT(*) as "Total Orders",
    COUNT(*) FILTER (WHERE "order-status-code" = 'pending') as "Pending",
    COUNT(*) FILTER (WHERE "order-status-code" = 'confirmed') as "Confirmed"
FROM "customer-order-header"
WHERE "tenant-id" = '11111111-1111-1111-1111-111111111111'
GROUP BY "tenant-id";

-- 3. CHECK INVOICES FOR THE TENANT
-- If this returns 0, the join in Order Fulfillment will fail/return null for invoice data.
SELECT 
    "tenant-id",
    COUNT(*) as "Total Invoices"
FROM "customer-invoices"
WHERE "tenant-id" = '11111111-1111-1111-1111-111111111111'
GROUP BY "tenant-id";

-- 4. CHECK RLS POLICIES
-- See if policies exist that might block access.
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('customer-order-header', 'customer-invoices', 'tenant-user-role', 'retail-store-tenant');
