-- ============================================================
-- Cosmos Angré — Testimonials (avis publics homepage)
-- ============================================================

CREATE TYPE testimonial_source AS ENUM ('Google', 'TripAdvisor', 'Facebook', 'Instagram', 'Direct');

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  source testimonial_source NOT NULL DEFAULT 'Direct',
  source_url TEXT,
  locale TEXT NOT NULL DEFAULT 'fr',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_published = true;
CREATE INDEX idx_testimonials_locale ON testimonials(locale) WHERE is_published = true;
CREATE INDEX idx_testimonials_order ON testimonials(display_order);

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "testimonials_select_published"
  ON testimonials FOR SELECT
  USING (is_published = true OR is_admin());

CREATE POLICY "testimonials_insert_admin"
  ON testimonials FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "testimonials_update_admin"
  ON testimonials FOR UPDATE
  USING (is_admin());

CREATE POLICY "testimonials_delete_admin"
  ON testimonials FOR DELETE
  USING (is_admin());

-- ============================================================
-- Seed initial (5 avis FR)
-- ============================================================
INSERT INTO testimonials (author_name, content, rating, source, locale, is_featured, display_order)
VALUES
  ('Aïcha K.', 'Un cadre exceptionnel, une vraie destination shopping. L''attention au détail est partout — du parking jusqu''aux boutiques.', 5, 'Google', 'fr', true, 1),
  ('Marc D.', 'Le food court est incroyable, l''offre culinaire est variée et de qualité. Les soirées événementielles valent le déplacement.', 5, 'TripAdvisor', 'fr', true, 2),
  ('Fatou C.', 'L''hôtel intégré est parfait pour les séjours d''affaires. Service impeccable et localisation idéale.', 4, 'Google', 'fr', true, 3),
  ('Jean-Paul B.', 'Plus qu''un centre commercial, une vraie expérience. Mes enfants adorent les espaces loisirs.', 5, 'Google', 'fr', true, 4),
  ('Sandrine O.', 'Architecture sublime, marché artisanal authentique. Un lieu qui célèbre la créativité ivoirienne.', 5, 'TripAdvisor', 'fr', true, 5);
