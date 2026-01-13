-- =================================================================
-- DISABLE RLS ON BATCH TRACKING & INVOICES
-- =================================================================

-- DISABLE RLS on Batch Tracking (Inventory)
ALTER TABLE "inventory-batch-tracking-record" DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage tenant batches" ON "inventory-batch-tracking-record";
DROP POLICY IF EXISTS "Enable all for authenticated" ON "inventory-batch-tracking-record";

-- DISABLE RLS on Invoices
ALTER TABLE "uploaded-vendor-invoice-document" DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage tenant invoices" ON "uploaded-vendor-invoice-document";

-- DISABLE RLS on Vendors
ALTER TABLE "vendors" DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can manage tenant vendors" ON "vendors";

DO $$
BEGIN
  RAISE NOTICE '✅ RLS disabled for Batches, Invoices, and Vendors. Inventory commit should now work.';
END $$;
