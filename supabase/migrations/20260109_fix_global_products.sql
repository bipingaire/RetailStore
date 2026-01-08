-- Fix global_products table to support AI enrichment

-- Add ai_enriched_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'global_products' 
        AND column_name = 'ai_enriched_at'
    ) THEN
        ALTER TABLE global_products 
        ADD COLUMN ai_enriched_at TIMESTAMPTZ;
    END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE global_products ENABLE ROW LEVEL SECURITY;

-- Allow superadmins to read and update all products
DROP POLICY IF EXISTS "superadmin_manage_global_products" ON global_products;

CREATE POLICY "superadmin_manage_global_products"
ON global_products
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "superadmin-users"
        WHERE "user-id" = auth.uid()
        AND "is-active" = true
    )
);
