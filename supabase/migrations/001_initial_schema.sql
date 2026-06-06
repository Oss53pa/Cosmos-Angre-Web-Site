-- ============================================================
-- Cosmos Angre — Initial Schema
-- ============================================================

-- Enums
CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'MALL_ADMIN', 'MALL_MODERATOR', 'STORE_ADMIN', 'STORE_EMPLOYEE', 'VISITOR');
CREATE TYPE store_plan AS ENUM ('Free', 'Gold', 'Platinum');
CREATE TYPE store_status AS ENUM ('active', 'pending', 'suspended', 'rejected');
CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE event_visibility AS ENUM ('public', 'private');
CREATE TYPE blog_status AS ENUM ('published', 'draft', 'scheduled');
CREATE TYPE newsletter_status AS ENUM ('active', 'unsubscribed');
CREATE TYPE media_type AS ENUM ('logo', 'banner', 'favicon', 'partner', 'other');
CREATE TYPE publication_status AS ENUM ('draft', 'pending', 'approved', 'rejected');
CREATE TYPE audit_status AS ENUM ('success', 'warning', 'error');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

-- ============================================================
-- Helper: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 1. profiles
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'VISITOR',
  avatar TEXT,
  store_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_store_id ON profiles(store_id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2. stores
-- ============================================================
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo TEXT,
  cover_image TEXT,
  zone TEXT,
  zone_key TEXT,
  location_code TEXT,
  category TEXT,
  category_key TEXT,
  hours TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  plan store_plan NOT NULL DEFAULT 'Free',
  status store_status NOT NULL DEFAULT 'pending',
  owner_id UUID REFERENCES profiles(id),
  rating NUMERIC(2,1) DEFAULT 0,
  view_count INT DEFAULT 0,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_category ON stores(category);

CREATE TRIGGER stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RPC: increment store views
CREATE OR REPLACE FUNCTION increment_store_views(store_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE stores SET view_count = view_count + 1 WHERE id = store_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. events
-- ============================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  start_date DATE,
  end_date DATE,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  category TEXT,
  organizer TEXT,
  max_participants INT,
  registered_participants INT DEFAULT 0,
  status event_status NOT NULL DEFAULT 'upcoming',
  visibility event_visibility NOT NULL DEFAULT 'public',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. blog_posts
-- ============================================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES profiles(id),
  author_name TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status blog_status NOT NULL DEFAULT 'draft',
  publish_date TIMESTAMPTZ,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_publish_date ON blog_posts(publish_date);

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. contacts
-- ============================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_is_read ON contacts(is_read);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- ============================================================
-- 6. newsletter_subscribers
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  status newsletter_status NOT NULL DEFAULT 'active',
  source TEXT DEFAULT 'website',
  subscribed_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- ============================================================
-- 7. media
-- ============================================================
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_name TEXT,
  url TEXT NOT NULL,
  type media_type NOT NULL DEFAULT 'other',
  mime_type TEXT,
  size BIGINT,
  uploaded_by UUID REFERENCES profiles(id),
  is_active_logo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_is_active_logo ON media(is_active_logo);

CREATE TRIGGER media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 8. promotions
-- ============================================================
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  discount_type discount_type NOT NULL,
  discount_value NUMERIC(10,2) NOT NULL,
  code TEXT,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  uses INT DEFAULT 0,
  max_uses INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promotions_store_id ON promotions(store_id);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);

CREATE TRIGGER promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 9. publications
-- ============================================================
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  image TEXT,
  status publication_status NOT NULL DEFAULT 'draft',
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_publications_store_id ON publications(store_id);
CREATE INDEX idx_publications_status ON publications(status);

CREATE TRIGGER publications_updated_at
  BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 10. audit_logs
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  user_name TEXT,
  user_role user_role,
  action TEXT NOT NULL,
  resource TEXT,
  details TEXT,
  ip TEXT,
  status audit_status NOT NULL DEFAULT 'success',
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Add FK from profiles to stores (deferred because stores was created after profiles)
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_store_id FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL;
