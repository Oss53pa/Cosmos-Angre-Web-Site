-- ============================================================
-- Cosmos Angre — Row Level Security Policies
-- ============================================================

-- Helper functions
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('SUPER_ADMIN', 'MALL_ADMIN', 'MALL_MODERATOR');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'SUPER_ADMIN';
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- profiles
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own_or_admin" ON profiles
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "profiles_insert_admin" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid() OR is_admin());

CREATE POLICY "profiles_update_own_or_admin" ON profiles
  FOR UPDATE USING (id = auth.uid() OR is_admin());

-- ============================================================
-- stores
-- ============================================================
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stores_select_public_or_admin_or_owner" ON stores
  FOR SELECT USING (status = 'active' OR is_admin() OR owner_id = auth.uid());

CREATE POLICY "stores_insert_admin" ON stores
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "stores_update_admin_or_owner" ON stores
  FOR UPDATE USING (is_admin() OR owner_id = auth.uid());

CREATE POLICY "stores_delete_admin" ON stores
  FOR DELETE USING (is_admin());

-- ============================================================
-- events
-- ============================================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_select_public_or_admin" ON events
  FOR SELECT USING (visibility = 'public' OR is_admin());

CREATE POLICY "events_insert_admin" ON events
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "events_update_admin" ON events
  FOR UPDATE USING (is_admin());

CREATE POLICY "events_delete_admin" ON events
  FOR DELETE USING (is_admin());

-- ============================================================
-- blog_posts
-- ============================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_posts_select_published_or_admin" ON blog_posts
  FOR SELECT USING (status = 'published' OR is_admin() OR author_id = auth.uid());

CREATE POLICY "blog_posts_insert_admin" ON blog_posts
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "blog_posts_update_admin_or_author" ON blog_posts
  FOR UPDATE USING (is_admin() OR author_id = auth.uid());

CREATE POLICY "blog_posts_delete_admin" ON blog_posts
  FOR DELETE USING (is_admin());

-- ============================================================
-- contacts (anyone can insert — public form)
-- ============================================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contacts_select_admin" ON contacts
  FOR SELECT USING (is_admin());

CREATE POLICY "contacts_insert_anyone" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contacts_update_admin" ON contacts
  FOR UPDATE USING (is_admin());

-- ============================================================
-- newsletter_subscribers (anyone can insert — subscription form)
-- ============================================================
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_select_admin" ON newsletter_subscribers
  FOR SELECT USING (is_admin());

CREATE POLICY "newsletter_insert_anyone" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_update_admin" ON newsletter_subscribers
  FOR UPDATE USING (is_admin());

CREATE POLICY "newsletter_delete_admin" ON newsletter_subscribers
  FOR DELETE USING (is_admin());

-- ============================================================
-- media
-- ============================================================
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "media_select_admin" ON media
  FOR SELECT USING (is_admin());

CREATE POLICY "media_insert_admin" ON media
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "media_update_admin" ON media
  FOR UPDATE USING (is_admin());

CREATE POLICY "media_delete_admin" ON media
  FOR DELETE USING (is_admin());

-- ============================================================
-- promotions
-- ============================================================
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promotions_select_active_or_owner_or_admin" ON promotions
  FOR SELECT USING (
    is_active = true
    OR is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "promotions_insert_admin_or_owner" ON promotions
  FOR INSERT WITH CHECK (
    is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "promotions_update_admin_or_owner" ON promotions
  FOR UPDATE USING (
    is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "promotions_delete_admin_or_owner" ON promotions
  FOR DELETE USING (
    is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

-- ============================================================
-- publications
-- ============================================================
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "publications_select_approved_or_owner_or_admin" ON publications
  FOR SELECT USING (
    status = 'approved'
    OR is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "publications_insert_admin_or_owner" ON publications
  FOR INSERT WITH CHECK (
    is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

CREATE POLICY "publications_update_admin_or_owner" ON publications
  FOR UPDATE USING (
    is_admin()
    OR store_id IN (SELECT id FROM stores WHERE owner_id = auth.uid())
  );

-- ============================================================
-- audit_logs (super admin only for select, admins for insert)
-- ============================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_select_super_admin" ON audit_logs
  FOR SELECT USING (is_super_admin());

CREATE POLICY "audit_logs_insert_admin" ON audit_logs
  FOR INSERT WITH CHECK (is_admin());
