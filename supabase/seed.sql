-- ============================================================
-- Cosmos Angre — Seed Data
-- ============================================================

-- Note: L'admin user doit etre cree via Supabase Auth (dashboard ou API).
-- Apres creation, mettre a jour son profil:
-- UPDATE profiles SET role = 'SUPER_ADMIN', first_name = 'Admin', last_name = 'Cosmos' WHERE email = 'admin@cosmosangre.com';

-- ============================================================
-- Stores (~20 boutiques correspondant au plan reel)
-- ============================================================
INSERT INTO stores (name, slug, description, zone, zone_key, location_code, category, category_key, hours, phone, plan, status, rating, is_open) VALUES
  ('Carrefour Market', 'carrefour-market', 'Supermarche offrant une large gamme de produits alimentaires et de grande consommation.', 'Supermarche', 'supermarket', 'C14 — 2 216 m²', 'Supermarche', 'supermarket', 'Lun-Dim: 8h-21h', '+225 27 22 00 01 01', 'Platinum', 'active', 4.5, true),
  ('Nike Store', 'nike-store', 'Boutique officielle Nike proposant chaussures, vetements et accessoires de sport.', 'Galerie Marchande', 'gallery', 'C1 — Niveau 1', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 02 02', 'Gold', 'active', 4.7, true),
  ('Zara', 'zara', 'Pret-a-porter tendance pour homme, femme et enfant.', 'Galerie Marchande', 'gallery', 'C2 — Niveau 1', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 03 03', 'Platinum', 'active', 4.6, true),
  ('Mango', 'mango', 'Mode feminine et masculine inspiree de la Mediterranee.', 'Galerie Marchande', 'gallery', 'C3 — Niveau 1', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 04 04', 'Gold', 'active', 4.4, true),
  ('Adidas', 'adidas', 'Articles de sport et streetwear de la marque aux trois bandes.', 'Galerie Marchande', 'gallery', 'C4 — Niveau 1', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 05 05', 'Gold', 'active', 4.5, true),
  ('LC Waikiki', 'lc-waikiki', 'Mode accessible pour toute la famille.', 'Galerie Marchande', 'gallery', 'C5 — Niveau 1', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 06 06', 'Free', 'active', 4.2, true),
  ('Kiabi', 'kiabi', 'Mode petit prix pour toute la famille.', 'Galerie Marchande', 'gallery', 'C6 — Niveau 2', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 07 07', 'Free', 'active', 4.1, true),
  ('Celio', 'celio', 'Mode masculine decontractee et elegante.', 'Galerie Marchande', 'gallery', 'C7 — Niveau 2', 'Mode', 'fashion', 'Lun-Sam: 10h-21h', '+225 27 22 00 08 08', 'Free', 'active', 4.0, true),
  ('Tech Paradise', 'tech-paradise', 'Electronique, smartphones, ordinateurs et gadgets dernier cri.', 'Galerie Marchande', 'gallery', 'C8 — Niveau 2', 'Electronique', 'electronics', 'Lun-Sam: 10h-20h', '+225 27 22 00 09 09', 'Gold', 'active', 4.3, true),
  ('iStore', 'istore', 'Revendeur agree Apple : iPhone, MacBook, iPad et accessoires.', 'Galerie Marchande', 'gallery', 'C9 — Niveau 2', 'Electronique', 'electronics', 'Lun-Sam: 10h-20h', '+225 27 22 00 10 10', 'Gold', 'active', 4.6, true),
  ('Beauty Corner', 'beauty-corner', 'Institut de beaute et cosmetiques haut de gamme.', 'Galerie Marchande', 'gallery', 'C10 — Niveau 1', 'Beaute', 'beauty', 'Lun-Sam: 10h-21h', '+225 27 22 00 11 11', 'Gold', 'active', 4.4, true),
  ('Sephora', 'sephora', 'Parfums, maquillage et soins du visage et du corps.', 'Galerie Marchande', 'gallery', 'C11 — Niveau 1', 'Beaute', 'beauty', 'Lun-Sam: 10h-21h', '+225 27 22 00 12 12', 'Platinum', 'active', 4.8, true),
  ('Bijouterie Prestige', 'bijouterie-prestige', 'Bijoux en or, diamants et pierres precieuses.', 'Galerie Marchande', 'gallery', 'C12 — Niveau 1', 'Bijouterie', 'jewelry', 'Lun-Sam: 10h-20h', '+225 27 22 00 13 13', 'Gold', 'active', 4.5, true),
  ('Pharmacie du Centre', 'pharmacie-du-centre', 'Pharmacie, parapharmacie et conseils sante.', 'Galerie Marchande', 'gallery', 'C15 — Niveau 0', 'Services', 'services', 'Lun-Sam: 8h-21h', '+225 27 22 00 14 14', 'Free', 'active', 4.3, true),
  ('Optique Vision', 'optique-vision', 'Lunettes de vue et solaires, lentilles de contact.', 'Galerie Marchande', 'gallery', 'C16 — Niveau 0', 'Services', 'services', 'Lun-Sam: 9h-20h', '+225 27 22 00 15 15', 'Free', 'active', 4.1, true),
  ('Le Cosmos', 'le-cosmos', 'Restaurant gastronomique avec terrasse panoramique.', 'Restaurants', 'restaurants', 'R1 — Niveau 3', 'Restaurants', 'restaurants', 'Lun-Dim: 12h-23h', '+225 27 22 00 16 16', 'Platinum', 'active', 4.7, true),
  ('La Brasserie', 'la-brasserie', 'Cuisine francaise contemporaine dans un cadre elegant.', 'Restaurants', 'restaurants', 'R2 — Niveau 3', 'Restaurants', 'restaurants', 'Lun-Dim: 11h-22h', '+225 27 22 00 17 17', 'Gold', 'active', 4.5, true),
  ('Sakura Sushi', 'sakura-sushi', 'Sushi, sashimi et specialites japonaises fraiches.', 'Restaurants', 'restaurants', 'R3 — Niveau 3', 'Restaurants', 'restaurants', 'Mar-Dim: 12h-22h', '+225 27 22 00 18 18', 'Gold', 'active', 4.6, true),
  ('KFC', 'kfc', 'Poulet frit croustillant et menus rapides.', 'Food Court', 'foodCourt', 'F1 — Niveau 2', 'Food Court', 'foodCourt', 'Lun-Dim: 10h-22h', '+225 27 22 00 19 19', 'Gold', 'active', 4.0, true),
  ('Brico Depot', 'brico-depot', 'Grande surface de bricolage et amenagement maison.', 'Retail Park', 'bigBox', 'BP1 — Exterieur', 'Grandes Surfaces', 'bigBox', 'Lun-Sam: 8h-20h', '+225 27 22 00 20 20', 'Free', 'active', 3.9, true);

-- ============================================================
-- Events (5 exemples)
-- ============================================================
INSERT INTO events (title, slug, description, start_date, end_date, start_time, end_time, location, category, organizer, max_participants, status, visibility, is_featured) VALUES
  ('Fashion Week Cosmos', 'fashion-week-cosmos', 'Decouvrez les dernieres tendances mode avec nos boutiques partenaires.', '2026-03-15', '2026-03-22', '10:00', '21:00', 'Galerie Marchande — Niveau 1', 'Mode', 'Cosmos Angre', 500, 'upcoming', 'public', true),
  ('Soiree Gastronomique', 'soiree-gastronomique', 'Degustations exclusives par les chefs de nos restaurants.', '2026-03-20', '2026-03-20', '19:00', '23:00', 'Le Cosmos — Niveau 3', 'Gastronomie', 'Le Cosmos Restaurant', 80, 'upcoming', 'public', true),
  ('Black Friday 2026', 'black-friday-2026', 'Promotions exceptionnelles dans toutes les boutiques du centre.', '2026-11-27', '2026-11-29', '08:00', '23:00', 'Tout le centre', 'Promotions', 'Cosmos Angre', 0, 'upcoming', 'public', true),
  ('Atelier Kids — Vacances', 'atelier-kids-vacances', 'Activites creatives pour les enfants pendant les vacances scolaires.', '2026-04-05', '2026-04-19', '10:00', '17:00', 'Espace Loisirs — Niveau 2', 'Famille', 'Cosmos Angre', 30, 'upcoming', 'public', false),
  ('Concert Live @ Cosmos', 'concert-live-cosmos', 'Concert en plein air avec artistes locaux et internationaux.', '2026-06-21', '2026-06-21', '18:00', '23:00', 'Parvis exterieur', 'Culture', 'Cosmos Events', 1000, 'upcoming', 'public', true);

-- ============================================================
-- Blog Posts (4 exemples)
-- ============================================================
INSERT INTO blog_posts (title, slug, excerpt, content, author_name, category, tags, status, publish_date, views, likes) VALUES
  ('Cosmos Angre ouvre ses portes', 'ouverture-cosmos-angre', 'Le plus grand centre commercial de Cote d''Ivoire accueille ses premiers visiteurs.', 'Apres plusieurs annees de construction, Cosmos Angre ouvre enfin ses portes au public. Avec plus de 200 boutiques, des restaurants, un cinema et un hotel, le centre commercial promet une experience de shopping inegalee en Afrique de l''Ouest.', 'Equipe Cosmos', 'Actualites', ARRAY['ouverture', 'cosmos', 'abidjan'], 'published', NOW() - INTERVAL '30 days', 2450, 189),
  ('Rencontrez nos artisans locaux', 'artisans-locaux', 'Decouvrez les talents ivoiriens qui font vivre notre galerie marchande.', 'Cosmos Angre s''engage a mettre en valeur le savoir-faire local. Chaque mois, notre espace Artisans accueille de nouveaux createurs ivoiriens. Bijoux, mode, decoration — venez decouvrir des pieces uniques faites main.', 'Equipe Cosmos', 'Culture', ARRAY['artisans', 'local', 'mode'], 'published', NOW() - INTERVAL '15 days', 1820, 134),
  ('Cosmos : une destination famille', 'destination-famille', 'Des activites pour petits et grands toute l''annee.', 'Avec son espace loisirs, son cinema, ses aires de jeux et ses restaurants family-friendly, Cosmos Angre est la destination ideale pour une sortie en famille a Abidjan. Decouvrez notre programme d''animations.', 'Equipe Cosmos', 'Famille', ARRAY['famille', 'loisirs', 'enfants'], 'published', NOW() - INTERVAL '7 days', 980, 76),
  ('Guide : preparer votre visite a Cosmos', 'guide-visite-cosmos', 'Tout ce que vous devez savoir avant de venir au centre.', 'Horaires, acces, parking, services disponibles... Retrouvez toutes les informations pratiques pour profiter au maximum de votre visite a Cosmos Angre.', 'Equipe Cosmos', 'Pratique', ARRAY['guide', 'visite', 'pratique'], 'draft', NULL, 0, 0);

-- ============================================================
-- Newsletter Subscribers (quelques exemples)
-- ============================================================
INSERT INTO newsletter_subscribers (email, name, status, source) VALUES
  ('marie.dupont@example.com', 'Marie Dupont', 'active', 'website'),
  ('jean.kouassi@example.com', 'Jean Kouassi', 'active', 'registration'),
  ('sophie.aka@example.com', 'Sophie Aka', 'active', 'website'),
  ('paul.koffi@example.com', 'Paul Koffi', 'active', 'registration'),
  ('ama.traore@example.com', 'Ama Traore', 'unsubscribed', 'website');
