-- ============================================================
-- Cosmos Angre — RLS Hardening (Phase 1 sécurité)
-- ============================================================
-- Corrige les failles d'élévation de privilèges et complète les
-- politiques manquantes (DELETE sur profiles/contacts/publications).
-- ============================================================

-- ------------------------------------------------------------
-- 1. profiles : empêcher l'auto-élévation de rôle / store_id
-- ------------------------------------------------------------
-- Avant: un user pouvait UPDATE profiles WHERE id = auth.uid()
-- et changer son propre `role` à 'SUPER_ADMIN'.
-- Après: deux policies — une pour l'utilisateur (champs limités via trigger),
-- une pour l'admin (libre).

DROP POLICY IF EXISTS "profiles_update_own_or_admin" ON profiles;

CREATE POLICY "profiles_update_admin"
  ON profiles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "profiles_update_own_safe_fields"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Trigger garde-fou : un non-admin ne peut PAS modifier role ni store_id
CREATE OR REPLACE FUNCTION profiles_guard_role_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_admin() THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Modification du rôle interdite (auth.uid=%)', auth.uid();
    END IF;
    IF NEW.store_id IS DISTINCT FROM OLD.store_id THEN
      RAISE EXCEPTION 'Modification du store_id interdite (auth.uid=%)', auth.uid();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS profiles_guard_role_change_trg ON profiles;
CREATE TRIGGER profiles_guard_role_change_trg
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION profiles_guard_role_change();

-- INSERT : un user ne peut s'inscrire qu'avec rôle VISITOR
DROP POLICY IF EXISTS "profiles_insert_admin" ON profiles;
CREATE POLICY "profiles_insert_admin_or_self_visitor"
  ON profiles FOR INSERT
  WITH CHECK (
    is_admin()
    OR (id = auth.uid() AND role = 'VISITOR' AND store_id IS NULL)
  );

-- DELETE : super-admin uniquement
CREATE POLICY "profiles_delete_super_admin"
  ON profiles FOR DELETE
  USING (is_super_admin());

-- ------------------------------------------------------------
-- 2. contacts : DELETE par admin uniquement
-- ------------------------------------------------------------
CREATE POLICY "contacts_delete_admin"
  ON contacts FOR DELETE
  USING (is_admin());

-- ------------------------------------------------------------
-- 3. publications : DELETE manquante
-- ------------------------------------------------------------
CREATE POLICY "publications_delete_admin_or_owner"
  ON publications FOR DELETE
  USING (
    is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

-- ------------------------------------------------------------
-- 4. audit_logs : empêcher l'UPDATE (logs immutables)
-- ------------------------------------------------------------
-- Aucune policy UPDATE/DELETE = par défaut RLS bloque (RLS activée).
-- On laisse en l'état : les logs sont append-only.

-- ------------------------------------------------------------
-- 5. newsletter / contacts : rate-limit côté Edge Function recommandé
-- ------------------------------------------------------------
-- Note: la rate-limit ne se fait pas dans RLS. Voir Edge Function
-- supabase/functions/contact-submit pour la limite côté serveur.

-- ------------------------------------------------------------
-- 6. profiles : protéger l'email contre changements directs
-- ------------------------------------------------------------
-- L'email canonique est dans auth.users. profiles.email doit suivre.
-- On bloque les UPDATE non-admin sur ce champ.
CREATE OR REPLACE FUNCTION profiles_guard_email_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT is_admin() AND NEW.email IS DISTINCT FROM OLD.email THEN
    RAISE EXCEPTION 'Modification de l''email via profiles interdite (utiliser supabase.auth.updateUser)';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS profiles_guard_email_change_trg ON profiles;
CREATE TRIGGER profiles_guard_email_change_trg
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION profiles_guard_email_change();
