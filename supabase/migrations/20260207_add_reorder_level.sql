-- Add reorder level column to inventory items
-- Fixes 400 Bad Request on Restock and Dashboard pages

ALTER TABLE "retail-store-inventory-item" 
ADD COLUMN IF NOT EXISTS "reorder-level-quantity" INTEGER DEFAULT 10;

-- Optional: Index for performance on low stock queries
CREATE INDEX IF NOT EXISTS "idx_inventory_reorder_level" ON "retail-store-inventory-item"("reorder-level-quantity");
