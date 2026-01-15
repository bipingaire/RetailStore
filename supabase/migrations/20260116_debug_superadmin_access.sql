-- =====================================================
-- DIAGNOSTIC: Check Superadmin Access & Product Visibility
-- =====================================================

-- 1. Who are the Superadmins?
SELECT 
  s."user-id", 
  s.email, 
  s."is-active",
  u.email as "auth_email",
  u.last_sign_in_at
FROM "superadmin-users" s
JOIN auth.users u ON s."user-id" = u.id;

-- 2. Total Product Count (What should be visible?)
SELECT 
  COUNT(*) as "Total_Products_In_DB",
  COUNT(*) FILTER (WHERE "category-name" IS NOT NULL) as "Products_With_Category",
  COUNT(*) FILTER (WHERE "image-url" LIKE 'https://%') as "HTTPS_Images"
FROM "global-product-master-catalog";

-- 3. Check RLS Status (Is it blocking?)
SELECT 
  relname as "Table Name",
  CASE WHEN relrowsecurity THEN '🔒 ENABLED' ELSE '🔓 DISABLED' END as "RLS Status"
FROM pg_class
WHERE relname IN ('global-product-master-catalog', 'superadmin-users');

-- 4. Check Policies (Are permissions correct?)
SELECT 
  tablename, 
  policyname,
  cmd as "operation",
  roles
FROM pg_policies 
WHERE tablename = 'global-product-master-catalog';
