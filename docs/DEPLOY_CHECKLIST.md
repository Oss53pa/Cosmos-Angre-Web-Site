# Cosmos Angré — Checklist de déploiement production

> Liste exhaustive des étapes à accomplir AVANT d'ouvrir le site au public.
> Cocher (`[x]`) chaque ligne au fur et à mesure.

---

## 1. Supabase (BaaS)

### 1.1 Projet
- [ ] Créer un projet Supabase prod (région la plus proche d'Abidjan : EU-Frankfurt ou US-East)
- [ ] Récupérer `Project URL` et `anon public key` → à mettre dans Vercel env
- [ ] Récupérer `service_role key` → secret pour Edge Functions uniquement (NE JAMAIS exposer côté client)

### 1.2 Migrations SQL
Appliquer dans l'ordre via `supabase db push` ou le SQL Editor :
- [ ] `001_initial_schema.sql` — tables core (profiles, stores, events, blog_posts, etc.)
- [ ] `002_rls_policies.sql` — Row Level Security
- [ ] `003_storage_buckets.sql` — buckets media/avatars/stores/events/blog
- [ ] `004_rls_hardening.sql` — protection contre auto-élévation de rôle ⚠️ critique
- [ ] `005_testimonials.sql` — table avis publics + seed FR

### 1.3 Auth
- [ ] Configurer le SMTP custom Resend (Auth → SMTP)
- [ ] Activer email confirmation (Auth → Settings)
- [ ] Définir l'URL de redirect prod : `https://www.cosmos-angre.com/auth/login`
- [ ] Activer les providers OAuth voulus (Google, Apple) si besoin
- [ ] Créer le premier compte SUPER_ADMIN manuellement, puis upgrader son `role` via SQL

### 1.4 Storage
- [ ] Vérifier que les 5 buckets sont publics en lecture
- [ ] Tester upload/delete via le hook `useMedia` côté admin

### 1.5 Edge Functions
Déployer via `supabase functions deploy <name>` depuis `supabase/functions/` :
- [ ] `contact-submit` (formulaire contact)
- [ ] `newsletter-subscribe` (newsletter footer)

### 1.6 Secrets Edge Functions
`supabase secrets set` :
- [ ] `RESEND_API_KEY` — clé API Resend (commence par `re_`)
- [ ] `RESEND_FROM` — `Cosmos Angré <noreply@cosmos-angre.com>`
- [ ] `RESEND_REPLY_TO` — `contact@cosmos-angre.com`
- [ ] `CONTACT_NOTIFICATION_EMAIL` — adresse qui reçoit les messages contact

---

## 2. Vercel (hébergement)

### 2.1 Projet
- [ ] Lier le repo GitHub à Vercel
- [ ] Build command : `npm run build` (déjà dans `vercel.json`)
- [ ] Output directory : `dist`
- [ ] Framework preset : Vite

### 2.2 Variables d'environnement (Settings → Environment Variables)
- [ ] `VITE_SUPABASE_URL` (depuis Supabase 1.1)
- [ ] `VITE_SUPABASE_ANON_KEY` (depuis Supabase 1.1)
- [ ] `VITE_APP_URL` = `https://www.cosmos-angre.com`
- [ ] `VITE_SENTRY_DSN` (depuis Sentry — voir section 3)
- [ ] `VITE_SENTRY_ENVIRONMENT` = `production`
- [ ] `VITE_PLAUSIBLE_DOMAIN` = `cosmos-angre.com`
- [ ] `VITE_GOOGLE_MAPS_API_KEY` (si maps utilisé)

### 2.3 Domaine
- [ ] Configurer le domaine custom `www.cosmos-angre.com`
- [ ] Activer le redirect `cosmos-angre.com` → `www.cosmos-angre.com` (canonique)
- [ ] Vérifier le certificat SSL (auto-renew activé)

### 2.4 Headers
Déjà configurés dans `vercel.json` :
- [x] CSP strict
- [x] HSTS 2 ans + preload
- [x] X-Frame-Options DENY
- [x] Cache 1 an immutable sur assets
- [ ] Soumettre HSTS preload sur https://hstspreload.org/ (optionnel, après ~3 mois prod)

---

## 3. Sentry (monitoring)

- [ ] Créer un projet React JS sur https://sentry.io
- [ ] Récupérer le DSN
- [ ] Configurer Vercel env `VITE_SENTRY_DSN`
- [ ] Activer Source Maps upload (auto via Sentry CLI ou Vercel integration)
- [ ] Définir les alertes (Slack / email) sur erreurs prod

---

## 4. Plausible (analytics)

- [ ] Créer le site sur https://plausible.io (ou self-host)
- [ ] Configurer Vercel env `VITE_PLAUSIBLE_DOMAIN`
- [ ] Vérifier que Plausible se charge UNIQUEMENT après consentement cookie
- [ ] Ajouter goals : `Newsletter Subscribe`, `Contact Submit`, `Loyalty Click`

---

## 5. Resend (emails)

- [ ] Créer le compte Resend (https://resend.com)
- [ ] Vérifier le domaine `cosmos-angre.com` (DKIM + SPF + DMARC)
- [ ] Créer une clé API → secret Supabase Edge Function (voir 1.6)
- [ ] Configurer le webhook delivery (optionnel, pour tracking)

---

## 6. Contenu

### 6.1 Mentions légales
- [ ] Compléter le **RCCM officiel** dans `MentionsLegalesPage.tsx` (TODO marqué)
- [ ] Confirmer la forme juridique New Heaven SA + capital social
- [ ] Faire valider les **CGU** par le juridique (`CGUPage.tsx`)
- [ ] Faire valider la **politique de confidentialité** par le DPO (`ConfidentialitePage.tsx`)
- [ ] Email DPO opérationnel : `dpo@cosmos-angre.com`

### 6.2 Données
- [ ] Importer les vraies boutiques dans `stores` (via admin ou SQL)
- [ ] Importer les vrais événements dans `events`
- [ ] Publier 3-5 articles initiaux dans `blog_posts`
- [ ] Importer les vrais testimonials (table `testimonials`) ou activer le seed

### 6.3 Médias
- [ ] Lancer `npm run images:responsive` pour générer AVIF/WebP/responsive
- [ ] Uploader le logo officiel via admin (`/admin/medias`) puis le marquer `is_active_logo`
- [ ] Créer l'OG image principale `/og-image.jpg` (1200×630)
- [ ] Créer les favicons (`favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png`)
- [ ] Créer les icônes PWA (`/icons/icon-192.png`, `/icons/icon-512.png`, `/icons/icon-maskable-512.png`)

---

## 7. SEO

- [ ] Régénérer le sitemap : `npm run sitemap:generate` (avec env Supabase prod set)
- [ ] Soumettre le sitemap à Google Search Console
- [ ] Soumettre le sitemap à Bing Webmaster Tools
- [ ] Tester quelques URLs sur https://search.google.com/test/rich-results
- [ ] Vérifier `robots.txt` en prod : `https://www.cosmos-angre.com/robots.txt`

---

## 8. Performance / a11y

- [ ] Lancer Lighthouse CI : `npm run lhci` (depuis CI/CD ou local avec Chrome) — target ≥ 90
- [ ] Faire tester par un utilisateur mobile sur 3G
- [ ] Tester la navigation clavier complète (Tab, Enter, Esc)
- [ ] Tester avec un screen reader (NVDA / VoiceOver)
- [ ] Vérifier le contraste WCAG AA sur les 2 thèmes (Premium + Proximité)

---

## 9. Tests E2E (recommandé avant lancement)

- [ ] Inscription compte → confirmation email → login
- [ ] Soumettre le formulaire contact → vérifier email reçu (Resend)
- [ ] S'inscrire à la newsletter → vérifier email bienvenue (Resend)
- [ ] Naviguer en FR puis EN — vérifier hreflang
- [ ] Tester les 2 thèmes — vérifier que tous les composants basculent

---

## 10. Post-lancement

- [ ] Monitorer Sentry les premières 48h (alerte sur >5 erreurs/h)
- [ ] Surveiller Plausible (taux de rebond, pages les plus visitées)
- [ ] Vérifier l'indexation Google après ~1 semaine
- [ ] Backups Supabase : confirmer que le PITR est activé (Settings → Database)

---

✨ **Dernière vérification** : tester depuis 3 navigateurs (Chrome, Safari, Firefox) sur 2 devices (desktop + mobile).
