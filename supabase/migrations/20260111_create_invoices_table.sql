-- =====================================================
-- INVOICE SCHEMA
-- Creates customer-invoices table and auto-generation logic
-- =====================================================

-- 1. Create Invoices Table
CREATE TABLE IF NOT EXISTS "customer-invoices" (
  "invoice-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "customer-id" UUID REFERENCES auth.users(id),
  "order-id" UUID REFERENCES "customer-order-header"("order-id") ON DELETE CASCADE UNIQUE,
  "invoice-number" TEXT NOT NULL UNIQUE,
  "issue-date" TIMESTAMPTZ DEFAULT NOW(),
  "due-date" TIMESTAMPTZ DEFAULT NOW(),
  "subtotal-amount" DECIMAL(10, 2) NOT NULL,
  "tax-amount" DECIMAL(10, 2) NOT NULL,
  "total-amount" DECIMAL(10, 2) NOT NULL,
  "status" TEXT DEFAULT 'issued' CHECK ("status" IN ('draft', 'issued', 'paid', 'void', 'cancelled')),
  "payment-status" TEXT DEFAULT 'pending', 
  "created-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-at" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE "customer-invoices" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices" 
ON "customer-invoices" FOR SELECT 
USING (auth.uid() = "customer-id");

-- 3. Invoice Number Sequence & Generator
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq;

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    seq_val INTEGER;
    date_part TEXT;
BEGIN
    seq_val := nextval('invoice_number_seq');
    date_part := to_char(NOW(), 'YYYYMMDD');
    -- Format: INV-20260111-0001
    RETURN 'INV-' || date_part || '-' || lpad(seq_val::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to Auto-Create Invoice from Order
CREATE OR REPLACE FUNCTION create_invoice_for_order()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "customer-invoices" (
        "tenant-id",
        "customer-id",
        "order-id",
        "invoice-number",
        "issue-date",
        "due-date",
        "subtotal-amount",
        "tax-amount",
        "total-amount",
        "status",
        "payment-status"
    ) VALUES (
        NEW."tenant-id",
        NEW."customer-id",
        NEW."order-id",
        generate_invoice_number(),
        NEW."created-at",
        NEW."created-at", -- Due immediately upon order
        NEW."total-amount-value",
        NEW."tax-amount",
        NEW."final-amount",
        'issued',
        NEW."payment-status"
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Attach Trigger to Order Table
DROP TRIGGER IF EXISTS trg_create_invoice_after_order ON "customer-order-header";
CREATE TRIGGER trg_create_invoice_after_order
  AFTER INSERT ON "customer-order-header"
  FOR EACH ROW
  EXECUTE FUNCTION create_invoice_for_order();

DO $$
BEGIN
  RAISE NOTICE '✅ Customer Invoices table and auto-generation trigger created.';
END $$;
