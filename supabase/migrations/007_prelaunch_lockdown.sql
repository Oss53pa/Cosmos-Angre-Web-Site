-- ============================================================
-- Cosmos Angré — Verrouillage pré-lancement (Phase 2 sécurité)
-- ============================================================
-- Avant le lancement public, on révoque les écritures anon laissées
-- ouvertes en pré-lancement sur :
--   1. la table cosmos.site_content (CMS de contenu)
--   2. le bucket Storage "site" (images du CMS)
--
-- La clé anon est PUBLIQUE (embarquée dans le bundle front), donc toute
-- écriture autorisée à `anon` est exploitable directement via l'API
-- REST/Storage. On réserve donc les écritures aux admins authentifiés,
-- tout en gardant la LECTURE publique (le site reste affichable).
--
-- Les helpers is_admin() / get_user_role() viennent de 002_rls_policies.sql.
-- On fixe search_path pour que is_admin() (schéma cosmos) soit résolu et lié
-- dans les expressions de policy à la création (comme les migrations 002/003/006).
-- ============================================================

set search_path = cosmos, public;

-- ============================================================
-- 1. Table cosmos.site_content — écriture réservée aux admins
-- ============================================================
-- État pré-lancement : RLS désactivée + GRANT write au rôle anon → n'importe
-- qui pouvait écraser le contenu du site via l'API REST avec la clé publique.

-- 1.a Révoquer toute écriture directe au rôle anon (clé publique)
REVOKE INSERT, UPDATE, DELETE ON cosmos.site_content FROM anon;

-- 1.b Garder la LECTURE publique (le SiteContentProvider lit en anon)
GRANT SELECT ON cosmos.site_content TO anon, authenticated;

-- 1.c L'admin écrit en tant qu'utilisateur authentifié : il lui faut le GRANT
--     table-level (l'accès fin est ensuite filtré par les policies RLS ci-dessous).
GRANT INSERT, UPDATE, DELETE ON cosmos.site_content TO authenticated;

-- 1.d Activer RLS (deny-by-default)
ALTER TABLE cosmos.site_content ENABLE ROW LEVEL SECURITY;

-- 1.e Lecture publique explicite (sinon, RLS activée = lecture bloquée pour
--     anon, et tout le contenu CMS disparaîtrait côté public).
DROP POLICY IF EXISTS "site_content_select_public" ON cosmos.site_content;
CREATE POLICY "site_content_select_public" ON cosmos.site_content
  FOR SELECT USING (true);

-- 1.f Écriture réservée aux admins authentifiés
DROP POLICY IF EXISTS "site_content_insert_admin" ON cosmos.site_content;
CREATE POLICY "site_content_insert_admin" ON cosmos.site_content
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "site_content_update_admin" ON cosmos.site_content;
CREATE POLICY "site_content_update_admin" ON cosmos.site_content
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "site_content_delete_admin" ON cosmos.site_content;
CREATE POLICY "site_content_delete_admin" ON cosmos.site_content
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- 2. Storage bucket "site" — écriture réservée aux admins
-- ============================================================
-- État pré-lancement : policies site_write_insert/update/delete accordées au
-- rôle anon → upload/écrasement/suppression d'images possibles avec la clé
-- publique. On les remplace par des policies admin (rôle authenticated).

-- 2.a S'assurer que le bucket existe et reste en lecture publique
INSERT INTO storage.buckets (id, name, public)
VALUES ('site', 'site', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2.b Supprimer les anciennes policies d'écriture ouvertes à anon
DROP POLICY IF EXISTS "site_write_insert" ON storage.objects;
DROP POLICY IF EXISTS "site_write_update" ON storage.objects;
DROP POLICY IF EXISTS "site_write_delete" ON storage.objects;

-- 2.c Recréer les écritures, réservées aux admins authentifiés
CREATE POLICY "site_write_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site' AND is_admin());

CREATE POLICY "site_write_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site' AND is_admin())
  WITH CHECK (bucket_id = 'site' AND is_admin());

CREATE POLICY "site_write_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site' AND is_admin());

-- 2.d Lecture publique : on GARDE la policy existante "site_public_read"
--     (lecture des images du site sans authentification). Volontairement
--     non modifiée ici.

-- ============================================================
-- 3. cosmos.contacts / cosmos.newsletter_subscribers
-- ============================================================
-- On GARDE l'INSERT anon (formulaires publics — voir 002_rls_policies.sql :
-- contacts_insert_anyone / newsletter_insert_anyone). L'anti-spam est appliqué
-- côté serveur dans les Edge Functions :
--   - supabase/functions/contact-submit       (rate-limit 5/10min + honeypot)
--   - supabase/functions/newsletter-subscribe  (rate-limit 3/5min + honeypot)
-- et les formulaires publics (ContactPage, Footer, PreLaunchPage, RegisterPage)
-- passent désormais TOUS par ces Edge Functions plutôt que par un insert anon
-- direct. Aucune policy à modifier ici.
--
-- ⚠️ Résidu accepté en pré-lancement : la policy *_insert_anyone autorise
-- encore un INSERT anon DIRECT via l'API REST (hors Edge Function, donc hors
-- rate-limit). Pour durcir après lancement : révoquer l'INSERT anon et router
-- 100% des écritures via les Edge Functions (service_role), ou ajouter un
-- captcha. Voir note ci-dessous.
