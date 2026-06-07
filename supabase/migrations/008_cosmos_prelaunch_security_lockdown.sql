-- ════════════════════════════════════════════════════════════
-- 008 — Verrouillage sécurité pré-lancement (schéma cosmos)
-- Appliqué via Supabase le 2026-06-07.
--
-- Modèle :
--   • Lecture PUBLIQUE du contenu conservée (le site marche sans login).
--   • Écriture réservée au STAFF (SUPER_ADMIN / MALL_ADMIN / MALL_MODERATOR)
--     via la fonction cosmos.is_staff() (SECURITY DEFINER, pas de récursion).
--   • Données SENSIBLES fermées à anon (profils, invitations, contacts,
--     newsletter, logs, club_members, promotions, publications).
--   • Les Edge Functions utilisent la service_role => bypass RLS automatique.
--   • Réversible : ALTER TABLE ... DISABLE ROW LEVEL SECURITY + re-GRANT.
-- ════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION cosmos.is_staff()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = cosmos, public AS $$
  SELECT EXISTS (
    SELECT 1 FROM cosmos.profiles p
    WHERE p.id = auth.uid()
      AND p.role IN ('SUPER_ADMIN','MALL_ADMIN','MALL_MODERATOR')
  );
$$;
GRANT EXECUTE ON FUNCTION cosmos.is_staff() TO anon, authenticated;

-- 1) Couper toute écriture anonyme sur l'ensemble du schéma cosmos
DO $$ DECLARE r record; BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='cosmos' LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON cosmos.%I FROM anon', r.tablename);
  END LOOP;
END $$;

-- 2) Tables de CONTENU : lecture publique, écriture staff
DO $$
DECLARE tbl text;
DECLARE content_tables text[] := ARRAY[
  'stores','events','blog_posts','site_content','site_pages','page_blocks',
  'club_tiers','testimonials','life_calendar_events','wayfinding_floors','wayfinding_zones','media'
];
BEGIN
  FOREACH tbl IN ARRAY content_tables LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='cosmos' AND tablename=tbl) THEN
      EXECUTE format('ALTER TABLE cosmos.%I ENABLE ROW LEVEL SECURITY', tbl);
      EXECUTE format('GRANT SELECT ON cosmos.%I TO anon, authenticated', tbl);
      EXECUTE format('GRANT INSERT, UPDATE, DELETE ON cosmos.%I TO authenticated', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON cosmos.%I', tbl||'_public_read', tbl);
      EXECUTE format('CREATE POLICY %I ON cosmos.%I FOR SELECT USING (true)', tbl||'_public_read', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON cosmos.%I', tbl||'_staff_write', tbl);
      EXECUTE format('CREATE POLICY %I ON cosmos.%I FOR ALL TO authenticated USING (cosmos.is_staff()) WITH CHECK (cosmos.is_staff())', tbl||'_staff_write', tbl);
    END IF;
  END LOOP;
END $$;

-- 2bis) Stores : l'enseigne propriétaire peut éditer SA boutique
DROP POLICY IF EXISTS stores_owner_update ON cosmos.stores;
CREATE POLICY stores_owner_update ON cosmos.stores FOR UPDATE TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

-- 3) Tables SENSIBLES : staff uniquement (anon fermé)
DO $$
DECLARE tbl text;
DECLARE staff_tables text[] := ARRAY[
  'invitations','audit_logs','club_members','promotions','publications',
  'contacts','newsletter_subscribers'
];
BEGIN
  FOREACH tbl IN ARRAY staff_tables LOOP
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='cosmos' AND tablename=tbl) THEN
      EXECUTE format('ALTER TABLE cosmos.%I ENABLE ROW LEVEL SECURITY', tbl);
      EXECUTE format('REVOKE ALL ON cosmos.%I FROM anon', tbl);
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON cosmos.%I TO authenticated', tbl);
      EXECUTE format('DROP POLICY IF EXISTS %I ON cosmos.%I', tbl||'_staff_all', tbl);
      EXECUTE format('CREATE POLICY %I ON cosmos.%I FOR ALL TO authenticated USING (cosmos.is_staff()) WITH CHECK (cosmos.is_staff())', tbl||'_staff_all', tbl);
    END IF;
  END LOOP;
END $$;

-- 4) Profils : chacun le sien, le staff tout (anon fermé)
ALTER TABLE cosmos.profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON cosmos.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON cosmos.profiles TO authenticated;
DROP POLICY IF EXISTS profiles_self_or_staff_read ON cosmos.profiles;
CREATE POLICY profiles_self_or_staff_read ON cosmos.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR cosmos.is_staff());
DROP POLICY IF EXISTS profiles_self_update ON cosmos.profiles;
CREATE POLICY profiles_self_update ON cosmos.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR cosmos.is_staff()) WITH CHECK (id = auth.uid() OR cosmos.is_staff());
DROP POLICY IF EXISTS profiles_staff_write ON cosmos.profiles;
CREATE POLICY profiles_staff_write ON cosmos.profiles FOR ALL TO authenticated
  USING (cosmos.is_staff()) WITH CHECK (cosmos.is_staff());
