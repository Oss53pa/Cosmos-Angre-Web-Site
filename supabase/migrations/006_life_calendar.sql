-- ============================================================
-- Cosmos Angré — Calendrier de la vie
-- Événements annuels du centre, catégorisés et planifiés
-- ============================================================

CREATE TYPE lc_category AS ENUM (
  'commercial',     -- promos, soldes, ventes flash
  'famille',        -- événements famille / enfants
  'communautaire',  -- don du sang, sensibilisation, collectes
  'partenaires'     -- événements partenaires & enseignes
);

CREATE TABLE life_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category lc_category NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  -- Highlight (top 3 cartes signature)
  is_highlighted BOOLEAN NOT NULL DEFAULT false,
  highlight_label TEXT,                   -- ex: 'INCONTOURNABLE', 'MÉGA PROMOTION'
  highlight_icon TEXT,                    -- nom lucide-react ex: 'Heart', 'ShoppingBag'
  highlight_color TEXT,                   -- hex ou token css
  -- Visuel et URL associée
  image TEXT,
  cta_url TEXT,
  -- Affichage / publication
  display_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lc_year ON life_calendar_events(year) WHERE is_published = true;
CREATE INDEX idx_lc_year_date ON life_calendar_events(year, start_date) WHERE is_published = true;
CREATE INDEX idx_lc_highlighted ON life_calendar_events(year, is_highlighted) WHERE is_published = true;
CREATE INDEX idx_lc_category ON life_calendar_events(category);

CREATE TRIGGER lc_events_updated_at
  BEFORE UPDATE ON life_calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE life_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lc_events_select_published"
  ON life_calendar_events FOR SELECT
  USING (is_published = true OR is_admin());

CREATE POLICY "lc_events_insert_admin"
  ON life_calendar_events FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "lc_events_update_admin"
  ON life_calendar_events FOR UPDATE
  USING (is_admin());

CREATE POLICY "lc_events_delete_admin"
  ON life_calendar_events FOR DELETE
  USING (is_admin());

-- ============================================================
-- Seed initial 2026 (basé sur le visuel fourni)
-- ============================================================
INSERT INTO life_calendar_events (year, title, description, category, start_date, end_date, is_highlighted, highlight_label, highlight_icon, display_order)
VALUES
  -- Highlights
  (2026, 'Cosmos Love Week', '2 semaines de promotions exclusives et animations romantiques.', 'commercial', '2026-02-01', '2026-02-14', true, 'INCONTOURNABLE', 'Heart', 1),
  (2026, 'Black Friday Week', 'L''évènement shopping le plus attendu de l''année.', 'commercial', '2026-11-27', '2026-11-30', true, 'MÉGA PROMOTION', 'ShoppingBag', 2),
  (2026, 'Réveillon Cosmos', 'La plus grande fête de la fin d''année.', 'commercial', '2026-12-30', '2026-12-30', true, 'EXCLUSIF', 'PartyPopper', 3),

  -- T1
  (2026, 'Fête de la Crêpe', NULL, 'communautaire', '2026-01-21', NULL, false, NULL, NULL, 10),
  (2026, 'Don de Sang', NULL, 'communautaire', '2026-02-21', NULL, false, NULL, NULL, 11),
  (2026, 'Journée de la Femme', NULL, 'famille', '2026-03-07', NULL, false, NULL, NULL, 12),
  (2026, 'Soirée Nationale', NULL, 'commercial', '2026-03-10', '2026-03-31', false, NULL, NULL, 13),
  (2026, 'Les Héros de Cosmos', NULL, 'famille', '2026-03-20', NULL, false, NULL, NULL, 14),

  -- T2
  (2026, 'Tombola Tabaski', NULL, 'partenaires', '2026-04-20', NULL, false, NULL, NULL, 20),
  (2026, 'Ivoire Paquinou Show', NULL, 'famille', '2026-04-24', '2026-04-25', false, NULL, NULL, 21),
  (2026, 'Mother Karaoké', NULL, 'famille', '2026-05-02', NULL, false, NULL, NULL, 22),
  (2026, 'Reine des Épices', NULL, 'partenaires', '2026-05-25', NULL, false, NULL, NULL, 23),
  (2026, 'Salon d''Orientation', NULL, 'communautaire', '2026-05-30', NULL, false, NULL, NULL, 24),
  (2026, 'Village Coupe du monde', NULL, 'partenaires', '2026-06-11', '2026-06-19', false, NULL, NULL, 25),
  (2026, 'Fête des Pères', NULL, 'famille', '2026-06-20', NULL, false, NULL, NULL, 26),

  -- T3
  (2026, 'Village Coupe du Monde', NULL, 'partenaires', '2026-07-01', '2026-07-12', false, NULL, NULL, 30),
  (2026, 'Don de Sang', NULL, 'communautaire', '2026-07-11', NULL, false, NULL, NULL, 31),
  (2026, 'Soirée Nationale', NULL, 'commercial', '2026-08-10', '2026-08-31', false, NULL, NULL, 32),
  (2026, 'Fashion Week', NULL, 'partenaires', '2026-08-15', NULL, false, NULL, NULL, 33),
  (2026, 'Cosmos Ivoire Rap Show', NULL, 'partenaires', '2026-08-29', NULL, false, NULL, NULL, 34),
  (2026, 'Foire Rentrée Scolaire', NULL, 'famille', '2026-09-01', '2026-09-20', false, NULL, NULL, 35),
  (2026, 'Don Orphelinat', NULL, 'communautaire', '2026-09-11', NULL, false, NULL, NULL, 36),

  -- T4
  (2026, 'Octobre Rose', NULL, 'communautaire', '2026-10-06', NULL, false, NULL, NULL, 40),
  (2026, 'Sensibilisation', NULL, 'communautaire', '2026-11-03', NULL, false, NULL, NULL, 41),
  (2026, 'Don aux Jumeaux', NULL, 'famille', '2026-11-22', NULL, false, NULL, NULL, 42),
  (2026, 'Black Friday Week', NULL, 'commercial', '2026-11-27', '2026-11-30', false, NULL, NULL, 43),
  (2026, 'Anniversaire Cosmos', NULL, 'partenaires', '2026-11-28', NULL, false, NULL, NULL, 44),
  (2026, 'Collecte de Jouets', NULL, 'communautaire', '2026-12-01', NULL, false, NULL, NULL, 45),
  (2026, 'Marché de Noël', NULL, 'famille', '2026-12-14', '2026-12-20', false, NULL, NULL, 46),
  (2026, 'Réveillon Cosmos', NULL, 'commercial', '2026-12-30', NULL, false, NULL, NULL, 47);
