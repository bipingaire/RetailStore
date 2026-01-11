-- FIX RLS SELECT POLICIES
-- The previous schema enabled RLS but forgot to add SELECT policies for detail tables.
-- This caused fetched arrays (like items) to be empty for users.

DO $$
BEGIN
    -- 1. Enable Select for Order Line Items
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order-line-item-detail' AND policyname = 'Enable select for all') THEN
        CREATE POLICY "Enable select for all" ON "order-line-item-detail" FOR SELECT USING (true);
    END IF;

    -- 2. Enable Select for Delivery Address
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'delivery-address-information' AND policyname = 'Enable select for all') THEN
        CREATE POLICY "Enable select for all" ON "delivery-address-information" FOR SELECT USING (true);
    END IF;

    -- 3. Enable Select for Invoices (just in case)
    -- Assuming customer-invoices might have similar issue if created without explicit policy
    -- Check if table exists first to avoid error
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'customer-invoices') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer-invoices' AND policyname = 'Enable select for all') THEN
             CREATE POLICY "Enable select for all" ON "customer-invoices" FOR SELECT USING (true);
        END IF;
    END IF;

END $$;
