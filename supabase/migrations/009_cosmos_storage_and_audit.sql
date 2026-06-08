-- ════════════════════════════════════════════════════════════
-- 009 — Durcissement : Storage (bucket "site") + Journal d'audit
-- Appliqué via Supabase le 2026-06-07.
-- ════════════════════════════════════════════════════════════

-- 1) Storage bucket "site" : lecture publique (logos/photos), écriture STAFF
--    seulement. N'affecte PAS le bucket "tenant-assets" (autre app).
DROP POLICY IF EXISTS site_write_insert ON storage.objects;
DROP POLICY IF EXISTS site_write_update ON storage.objects;
DROP POLICY IF EXISTS site_write_delete ON storage.objects;

CREATE POLICY site_staff_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site' AND cosmos.is_staff());
CREATE POLICY site_staff_update ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'site' AND cosmos.is_staff())
  WITH CHECK (bucket_id = 'site' AND cosmos.is_staff());
CREATE POLICY site_staff_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'site' AND cosmos.is_staff());
-- (site_public_read conservée : SELECT bucket_id='site' pour tous)

-- 2) Journal d'audit : trace chaque écriture admin
CREATE OR REPLACE FUNCTION cosmos.log_audit()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = cosmos, public AS $$
DECLARE
  rec jsonb;
  rid text;
  prof record;
BEGIN
  IF TG_OP = 'DELETE' THEN rec := to_jsonb(OLD); ELSE rec := to_jsonb(NEW); END IF;
  rid := COALESCE(rec->>'id', rec->>'key', rec->>'slug', '');
  SELECT first_name, last_name, role INTO prof FROM cosmos.profiles WHERE id = auth.uid();
  INSERT INTO cosmos.audit_logs (user_id, user_name, user_role, action, resource, changes)
  VALUES (
    auth.uid(),
    NULLIF(btrim(COALESCE(prof.first_name,'') || ' ' || COALESCE(prof.last_name,'')), ''),
    prof.role,
    TG_OP,
    TG_TABLE_NAME || CASE WHEN rid <> '' THEN ' #' || rid ELSE '' END,
    rec
  );
  RETURN NULL;
END; $$;

DO $$
DECLARE tbl text;
DECLARE audited text[] := ARRAY[
  'stores','events','blog_posts','site_content','site_pages','page_blocks',
  'club_tiers','club_members','invitations','promotions','publications','profiles',
  'wayfinding_floors','wayfinding_zones','testimonials','life_calendar_events'
];
BEGIN
  FOREACH tbl IN ARRAY audited LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='cosmos' AND tablename=tbl) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS trg_audit_%I ON cosmos.%I', tbl, tbl);
      EXECUTE format('CREATE TRIGGER trg_audit_%I AFTER INSERT OR UPDATE OR DELETE ON cosmos.%I FOR EACH ROW EXECUTE FUNCTION cosmos.log_audit()', tbl, tbl);
    END IF;
  END LOOP;
END $$;
