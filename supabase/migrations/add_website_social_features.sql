-- =====================================================
-- WEBSITE PUSH & SOCIAL MEDIA INTEGRATION
-- Migration: Add promotion and social media features
-- =====================================================

-- Add promotion fields to marketing campaigns
ALTER TABLE "marketing-campaign-master" 
ADD COLUMN IF NOT EXISTS "is-promoted" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "promotion-ends-at" TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS "discount-percentage" INTEGER CHECK ("discount-percentage" BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS "featured-on-website" BOOLEAN DEFAULT false;

-- Add sale pricing to campaign products
ALTER TABLE "campaign-product-segment-group"
ADD COLUMN IF NOT EXISTS "sale-price" NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS "original-price" NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS "discount-percentage" INTEGER;

-- Create social media posts tracking table
CREATE TABLE IF NOT EXISTS "social-media-posts" (
  "post-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "campaign-id" UUID REFERENCES "marketing-campaign-master"("campaign-id") ON DELETE SET NULL,
  "platform" TEXT NOT NULL CHECK ("platform" IN ('facebook', 'instagram', 'twitter', 'linkedin')),
  "post-content" TEXT NOT NULL,
  "image-url" TEXT,
  "facebook-post-id" TEXT,
  "instagram-post-id" TEXT,
  "posted-at" TIMESTAMPTZ DEFAULT NOW(),
  "status" TEXT DEFAULT 'published' CHECK ("status" IN ('draft', 'scheduled', 'published', 'failed')),
  "error-message" TEXT,
  "engagement-likes" INTEGER DEFAULT 0,
  "engagement-shares" INTEGER DEFAULT 0,
  "engagement-comments" INTEGER DEFAULT 0,
  "created-at" TIMESTAMPTZ DEFAULT NOW()
);

-- Create social media accounts table (OAuth tokens)
CREATE TABLE IF NOT EXISTS "social-media-accounts" (
  "account-id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tenant-id" UUID REFERENCES "retail-store-tenant"("tenant-id") ON DELETE CASCADE,
  "platform" TEXT NOT NULL CHECK ("platform" IN ('facebook', 'instagram', 'twitter', 'linkedin')),
  "account-name" TEXT,
  "page-id" TEXT, -- Facebook Page ID or Instagram Business Account ID
  "access-token" TEXT, -- Encrypted in production
  "token-expires-at" TIMESTAMPTZ,
  "is-active" BOOLEAN DEFAULT true,
  "connected-at" TIMESTAMPTZ DEFAULT NOW(),
  "last-used-at" TIMESTAMPTZ,
  UNIQUE("tenant-id", "platform", "page-id")
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_tenant ON "social-media-posts"("tenant-id");
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign ON "social-media-posts"("campaign-id");
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON "social-media-posts"("status");
CREATE INDEX IF NOT EXISTS idx_social_accounts_tenant ON "social-media-accounts"("tenant-id");
CREATE INDEX IF NOT EXISTS idx_campaign_promoted ON "marketing-campaign-master"("is-promoted") WHERE "is-promoted" = true;

-- RLS Policies for social media tables
ALTER TABLE "social-media-posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "social-media-accounts" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their tenant's social media posts
DROP POLICY IF EXISTS "tenant_social_posts_select" ON "social-media-posts";
CREATE POLICY "tenant_social_posts_select" ON "social-media-posts"
  FOR SELECT USING (
    "tenant-id" IN (
      SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()
    )
  );

-- Policy: Users can insert posts for their tenant
DROP POLICY IF EXISTS "tenant_social_posts_insert" ON "social-media-posts";
CREATE POLICY "tenant_social_posts_insert" ON "social-media-posts"
  FOR INSERT WITH CHECK (
    "tenant-id" IN (
      SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()
    )
  );

-- Policy: Users can only see their tenant's connected accounts
DROP POLICY IF EXISTS "tenant_social_accounts_select" ON "social-media-accounts";
CREATE POLICY "tenant_social_accounts_select" ON "social-media-accounts"
  FOR SELECT USING (
    "tenant-id" IN (
      SELECT "tenant-id" FROM "tenant-user-role" WHERE "user-id" = auth.uid()
    )
  );

-- Policy: Users can manage their tenant's social accounts
DROP POLICY IF EXISTS "tenant_social_accounts_all" ON "social-media-accounts";
CREATE POLICY "tenant_social_accounts_all" ON "social-media-accounts"
  FOR ALL USING (
    "tenant-id" IN (
      SELECT "tenant-id" FROM "tenant-user-role" 
      WHERE "user-id" = auth.uid() AND "role-type" IN ('owner', 'manager')
    )
  );

-- Comments for documentation
COMMENT ON TABLE "social-media-posts" IS 'Tracks all social media posts made by campaigns';
COMMENT ON TABLE "social-media-accounts" IS 'Stores OAuth tokens for connected social media accounts';
COMMENT ON COLUMN "marketing-campaign-master"."is-promoted" IS 'Whether this campaign is actively promoted on website';
COMMENT ON COLUMN "marketing-campaign-master"."promotion-ends-at" IS 'When the website promotion expires';
