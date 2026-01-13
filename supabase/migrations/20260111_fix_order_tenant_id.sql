-- Create the missing tenant record
-- This tenant ID is being used by the admin but doesn't exist in the database

INSERT INTO "retail-store-tenant" (
  "tenant-id",
  "store-name",
  "contact-email",
  "contact-phone",
  "address-line-1",
  "city",
  "state",
  "postal-code",
  "country",
  "is-active",
  "created-at"
) VALUES (
  'b719cc04-38d2-4af8-ae52-1001791aff6f',
  'Tech Haven',
  'admin@techhaven.com',
  '+977 9861722204',
  '123 Main Street',
  'Kathmandu',
  'Bagmati',
  '44600',
  'Nepal',
  true,
  NOW()
) ON CONFLICT ("tenant-id") DO NOTHING;

-- Now update the orders to use this tenant
UPDATE "customer-order-header"
SET "tenant-id" = 'b719cc04-38d2-4af8-ae52-1001791aff6f'
WHERE "tenant-id" = '11111111-1111-1111-1111-111111111111';

-- Verify
SELECT 
  "order-id",
  "tenant-id",
  "customer-name",
  "final-amount"
FROM "customer-order-header"
WHERE "tenant-id" = 'b719cc04-38d2-4af8-ae52-1001791aff6f';
