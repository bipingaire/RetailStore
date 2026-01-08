-- Create master website configuration table

CREATE TABLE IF NOT EXISTS "master-website-config" (
  "config-id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "primary-domain" TEXT NOT NULL,
  "ssl-enabled" BOOLEAN DEFAULT true,
  "dns-configured" BOOLEAN DEFAULT true,
  "updated-at" TIMESTAMPTZ DEFAULT NOW(),
  "updated-by" UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE "master-website-config" ENABLE ROW LEVEL SECURITY;

-- Allow superadmins to manage website config
CREATE POLICY "superadmin_manage_website_config"
ON "master-website-config"
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM "superadmin-users"
        WHERE "user-id" = auth.uid()
        AND "is-active" = true
    )
);

-- Insert default configuration if none exists
INSERT INTO "master-website-config" ("primary-domain", "ssl-enabled", "dns-configured")
VALUES ('retailos.com', true, true)
ON CONFLICT DO NOTHING;
