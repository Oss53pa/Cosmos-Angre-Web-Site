-- ============================================================
-- Cosmos Angre — Storage Buckets
-- ============================================================

-- Create buckets (all public for read access)
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('stores', 'stores', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('events', 'events', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('blog', 'blog', true);

-- ============================================================
-- Storage Policies
-- ============================================================

-- media bucket: admins can upload/update/delete
CREATE POLICY "media_upload_admin" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'media' AND (SELECT is_admin()));

CREATE POLICY "media_update_admin" ON storage.objects
  FOR UPDATE USING (bucket_id = 'media' AND (SELECT is_admin()));

CREATE POLICY "media_delete_admin" ON storage.objects
  FOR DELETE USING (bucket_id = 'media' AND (SELECT is_admin()));

-- avatars bucket: users can upload their own avatar
CREATE POLICY "avatars_upload_own" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- stores bucket: admins + store owners can upload
CREATE POLICY "stores_upload_admin_or_owner" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'stores'
    AND (
      (SELECT is_admin())
      OR (storage.foldername(name))[1] IN (
        SELECT id::text FROM stores WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "stores_update_admin_or_owner" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'stores'
    AND (
      (SELECT is_admin())
      OR (storage.foldername(name))[1] IN (
        SELECT id::text FROM stores WHERE owner_id = auth.uid()
      )
    )
  );

CREATE POLICY "stores_delete_admin_or_owner" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'stores'
    AND (
      (SELECT is_admin())
      OR (storage.foldername(name))[1] IN (
        SELECT id::text FROM stores WHERE owner_id = auth.uid()
      )
    )
  );

-- events bucket: admins can upload
CREATE POLICY "events_upload_admin" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'events' AND (SELECT is_admin()));

CREATE POLICY "events_update_admin" ON storage.objects
  FOR UPDATE USING (bucket_id = 'events' AND (SELECT is_admin()));

CREATE POLICY "events_delete_admin" ON storage.objects
  FOR DELETE USING (bucket_id = 'events' AND (SELECT is_admin()));

-- blog bucket: admins can upload
CREATE POLICY "blog_upload_admin" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog' AND (SELECT is_admin()));

CREATE POLICY "blog_update_admin" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog' AND (SELECT is_admin()));

CREATE POLICY "blog_delete_admin" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog' AND (SELECT is_admin()));
