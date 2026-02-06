-- 1. Create a Test Tenant (Store) & Owner
INSERT INTO "auth"."users" (id, email, encrypted_password, email_confirmed_at)
VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'owner@test.com', crypt('TestPassword123!', gen_salt('bf')), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "retail-store-tenant" (
  "tenant-id", "store-name", "email-address", "owner-user-id"
) VALUES (
  'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 
  'InduMart Local', 
  'owner@test.com', 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
) ON CONFLICT DO NOTHING;

-- 2. Global Product Catalog
INSERT INTO "global-product-master-catalog" ("product-id", "product-name", "upc-ean-code", "category-name", "manufacturer-name", "description-text", "image-url")
VALUES 
  ('c1000000-0000-0000-0000-000000000100', 'Organic Bananas', '94011', 'Fruits', 'Fresh Farms', 'Sweet and creamy organic bananas.', 'https://images.unsplash.com/photo-1603833665858-e61d17a8622e?auto=format&fit=crop&w=800&q=80'),
  ('c1000000-0000-0000-0000-000000000101', 'Whole Milk 1 Gallon', '10001', 'Dairy', 'Happy Cow', 'Fresh whole milk from grass-fed cows.', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'),
  ('c1000000-0000-0000-0000-000000000102', 'Sourdough Bread', '20002', 'Bakery', 'Artisan Bakers', 'Traditional sourdough with a crispy crust.', 'https://images.unsplash.com/photo-1585476292452-85aa9e03d7c5?auto=format&fit=crop&w=800&q=80'),
  ('c1000000-0000-0000-0000-000000000103', 'Ribeye Steak', '30003', 'Meat', 'Prime Cuts', 'Premium ribeye steak, perfect for grilling.', 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80'),
  ('c1000000-0000-0000-0000-000000000104', 'Atlantic Salmon', '40004', 'Fish', 'Ocean Fresh', 'Wild-caught Atlantic salmon fillet.', 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80'),
  ('c1000000-0000-0000-0000-000000000105', 'Green Tea Packs', '50005', 'Beverages', 'Zen Leaf', 'Organic green tea bags for a calming brew.', 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80'),
  ('c1000000-0000-0000-0000-000000000106', 'Avocados (3 Pack)', '94012', 'Fruits', 'Green Belt', 'Creamy ripe avocados.', 'https://images.unsplash.com/photo-1523049673856-356964a71b45?auto=format&fit=crop&w=800&q=80')
ON CONFLICT DO NOTHING;

-- 3. Store Inventory
INSERT INTO "retail-store-inventory-item" ("inventory-id", "tenant-id", "global-product-id", "selling-price-amount", "current-stock-quantity", "is-active")
VALUES 
  ('10000000-0000-0000-0000-000000000100', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000100', 0.99, 150, true),
  ('10000000-0000-0000-0000-000000000101', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000101', 3.99, 40, true),
  ('10000000-0000-0000-0000-000000000102', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000102', 5.50, 20, true),
  ('10000000-0000-0000-0000-000000000103', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000103', 19.99, 10, true),
  ('10000000-0000-0000-0000-000000000104', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000104', 14.99, 15, true),
  ('10000000-0000-0000-0000-000000000105', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000105', 4.50, 50, true),
  ('10000000-0000-0000-0000-000000000106', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'c1000000-0000-0000-0000-000000000106', 2.99, 30, true)
ON CONFLICT DO NOTHING;

-- 4. Inventory Batches
INSERT INTO "inventory-batch-tracking-record" ("inventory-id", "batch-quantity-count", "expiry-date-timestamp")
VALUES 
  ('10000000-0000-0000-0000-000000000101', 20, CURRENT_DATE + 5),
  ('10000000-0000-0000-0000-000000000101', 20, CURRENT_DATE + 12),
  ('10000000-0000-0000-0000-000000000102', 10, CURRENT_DATE + 2),
  ('10000000-0000-0000-0000-000000000103', 10, CURRENT_DATE + 7);

-- 5. Promotions
INSERT INTO "promotion-discount-rule-config" ("tenant-id", "inventory-id", "discount-type", "discount-value-amount", "start-date-time", "end-date-time", "is-active-flag")
VALUES 
  ('b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', '10000000-0000-0000-0000-000000000103', 'percentage', 20, NOW(), NOW() + interval '7 days', true),
  ('b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', '10000000-0000-0000-0000-000000000101', 'fixed_price', 2.99, NOW(), NOW() + interval '3 days', true);

-- 6. Product Segments (Campaigns)
INSERT INTO "marketing-campaign-master" ("campaign-id", "tenant-id", "campaign-slug", "title-text", "subtitle-text", "badge-label", "badge-color", "sort-order", "is-active-flag")
VALUES 
  ('50000000-0000-0000-0000-000000000001', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'festive-picks', 'Weekend Essentials', 'Everything you need for a great brunch.', 'Trending', '#dcfce7', 1, true),
  ('50000000-0000-0000-0000-000000000002', 'b1f0b0a1-1b0a-4b0a-9b0a-1b0a1b0a1b0a', 'fresh-drops', 'Just Arrived', 'Fresh from the local farms.', 'New', '#e0f2fe', 2, true);

-- 7. Segment Products
INSERT INTO "campaign-product-segment-group" ("segment-id", "campaign-id", "inventory-id", "sort-order", "highlight-label")
VALUES 
  ('70000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000102', 1, 'Best Seller'),
  ('70000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000106', 2, NULL),
  ('70000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000101', 3, 'Sale'),
  ('70000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000100', 1, 'Organic'),
  ('70000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000104', 2, 'Wild Caught');
