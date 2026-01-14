-- =====================================================
-- FIX TRIGGERS: SECURITY DEFINER + AUTH.UID() FALLBACK
-- =====================================================

-- 1. ENHANCE "Auto Link Owner" Trigger
-- Check for owner_id OR fall back to auth.uid()
CREATE OR REPLACE FUNCTION public.handle_new_tenant_entry()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Determine the user ID (explicit owner_id or current logged in user)
  v_user_id := COALESCE(NEW.owner_id, auth.uid());

  IF v_user_id IS NOT NULL THEN
      INSERT INTO "tenant-user-role" ("tenant-id", "user-id", "role-type")
      VALUES (NEW."tenant-id", v_user_id, 'owner')
      ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
-- ^ SECURITY DEFINER allows inserting into "tenant-user-role" even if user lacks permission


-- 2. ENHANCE "Auto Create Subdomain" Trigger
-- Ensure it can write to subdomain map even if user lacks RLS permission
CREATE OR REPLACE FUNCTION auto_create_subdomain_mapping()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."subdomain" IS NOT NULL THEN
    INSERT INTO "subdomain-tenant-mapping" ("subdomain", "tenant-id")
    VALUES (NEW."subdomain", NEW."tenant-id")
    ON CONFLICT ("subdomain") DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


DO $$
BEGIN
  RAISE NOTICE '✅ Triggers updated to SECURITY DEFINER with auth.uid() fallback.';
END $$;
