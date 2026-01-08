-- 1. Create Sample Global Products (Master Catalog)
INSERT INTO "global-product-master-catalog" 
("product-name", "upc-ean-code", "brand-name", "category-name", "image-url", "description-text", "enriched-by-superadmin", "is-active")
VALUES
('Premium Organic Coffee Beans', '800001001', 'BeanMaster', 'Beverages', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1000', 'Ethically sourced, 100% Arabica beans.', true, true),
('Wireless Noise Cancelling Headphones', '800001002', 'AudioTech', 'Electronics', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000', 'Premium sound with 30h battery life.', true, true),
('Ergonomic Office Chair', '800001003', 'WorkComfort', 'Furniture', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=1000', 'Lumbar support and breathable mesh.', true, true),
('Stainless Steel Water Bottle', '800001004', 'HydraLife', 'Lifestyle', 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=1000', 'Vacuum insulated, keeps cold 24h.', true, true),
('Smart Fitness Watch', '800001005', 'FitTech', 'Electronics', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=1000', 'Track heart rate, steps, and sleep.', true, true);

-- 2. Link samples to the First Tenant found (Adding to their inventory)
WITH first_tenant AS (
  SELECT "tenant-id" FROM "retail-store-tenant" ORDER BY "created-at" ASC LIMIT 1
),
target_products AS (
  SELECT "product-id" FROM "global-product-master-catalog" WHERE "upc-ean-code" IN ('800001001', '800001002', '800001003')
)
INSERT INTO "retail-store-inventory-item" 
("tenant-id", "global-product-id", "current-stock-quantity", "selling-price-amount", "cost-price-amount", "is-active")
SELECT 
  (SELECT "tenant-id" FROM first_tenant),
  tp."product-id",
  floor(random() * 100 + 10)::int, -- Random stock 10-110
  99.99,
  49.50,
  true
FROM target_products tp
WHERE NOT EXISTS (
    SELECT 1 FROM "retail-store-inventory-item" 
    WHERE "tenant-id" = (SELECT "tenant-id" FROM first_tenant)
    AND "global-product-id" = tp."product-id"
);
