# 🌐 COSMOS ANGRÉ - Plateforme Web Multi-Tenant

## Vue d'ensemble

Plateforme web multi-tenant de standard international pour la gestion complète de centres commerciaux, offrant une expérience digitale immersive aux visiteurs et des outils de gestion avancés aux administrateurs.

---

## 🎨 Identité Visuelle

### Palette de Couleurs

- **COSMOS Blue** `#231F54` (Pantone 2755) - Couleur dominante
- **COSMOS Red** `#EB3737` - Call-to-action & alertes
- **COSMOS Teal** `#00B6AA` - Accents premium
- **COSMOS Yellow** `#FFD500` - Énergie & dynamisme
- **COSMOS Purple** `#A31EB4` - Modernité & innovation
- **COSMOS Pink** `#E61E73` - Animation, lifestyle
- **Fond général** `#FAFAFA` - Blanc cassé

### Typographie

- **Titres** → Poppins SemiBold (élégant & contemporain)
- **Textes** → Inter Regular (lisible & moderne)

---

## 📋 Table des Matières

1. [Architecture Technique](#architecture-technique)
2. [Fonctionnalités](#fonctionnalités)
3. [Structure du Projet](#structure-du-projet)
4. [Installation](#installation)
5. [Développement](#développement)
6. [Déploiement](#déploiement)

---

## 🏗️ Architecture Technique

### Stack Frontend

- **Framework**: React 18+ avec TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Styled Components
- **UI Components**: Material-UI / Ant Design
- **Animation**: Framer Motion
- **PWA**: Workbox
- **Testing**: Jest + React Testing Library
- **Internationalisation**: react-i18next

### Stack Backend

- **Langage**: Python 3.11+
- **Framework**: Django 5.0+ avec Django REST Framework
- **API**: REST API + GraphQL (Graphene-Django)
- **Base de données**: PostgreSQL 15+
- **Cache**: Redis
- **ORM**: Django ORM
- **Async Tasks**: Celery + Redis
- **Message Queue**: RabbitMQ
- **WebSockets**: Django Channels
- **Traduction**: Django-modeltranslation

### Infrastructure

- **Cloud**: AWS (Multi-AZ)
- **CDN**: CloudFront
- **Stockage**: S3 + CloudFront
- **Container**: Docker + Kubernetes
- **CI/CD**: GitLab CI + ArgoCD
- **Monitoring**: Datadog + Sentry
- **Serveur Web**: Nginx + Gunicorn

### Architecture Multi-Tenant

```yaml
Type: Database-per-tenant avec schéma partagé
Isolation:
  - Données: PostgreSQL schemas séparés
  - Fichiers: S3 buckets avec préfixes tenant
  - Cache: Redis namespaces
  - Sessions: JWT avec tenant_id

Routing:
  - Sous-domaine: mall1.platform.com, mall2.platform.com
  - Custom domain: Option de domaine personnalisé par tenant
```

---

## ✨ Fonctionnalités Principales

### 🏠 1. Page d'Accueil (Portail Visiteurs)

#### Hero Banner
- Grand carousel plein écran avec animations légères
- Accroche inspirante : "Cosmos Angré – L'art de vivre ensemble"
- CTA clair : "Découvrir le centre", "Voir les promotions"

#### Actualités & Événements
- Section modulable en 3 colonnes
- Cartes avec miniatures, date, titre et lien vers l'article complet
- Accent couleur : COSMOS Red pour les événements

#### Promotions du jour
- Slider horizontal avec cartes produits
- Visuel, titre, enseigne, prix promo
- Call-to-action : "Je profite"

#### Plan interactif 3D
- Affichage plein écran du plan du centre
- Survol interactif
- Filtrage : par étage / par catégorie / par marque

#### Widgets
- **Météo** : Widget animé en temps réel
- **Horaires** : Heure locale et statut "Centre ouvert / fermé"

---

### 🛍️ 2. Répertoire des Boutiques

#### Barre de recherche intelligente
- Auto-complétion par enseigne, catégorie ou produit
- Filtres dynamiques : catégorie, étage, type (mode, food, beauté…)

#### Listing des boutiques
- Cartes élégantes avec visuel, logo, étage, statut (ouvert/fermé)
- Hover : affiche un mini "call to shop"

#### Fiche détaillée
- Hero 360° (photo panoramique de la boutique)
- Sections :
  - Présentation & produits phares
  - Promotions en cours
  - Horaires
  - Contact direct (chat, appel)
  - Avis clients vérifiés
  - Mini plan "localisation dans le centre"

---

### 💡 3. Services Digitaux

#### Click & Collect
- Interface fluide avec suivi des commandes
- QR de retrait
- Notifications push
- Couleurs : Teal & Blue

#### Réservation Services
- UI inspirée d'app de mobilité
- Parking intelligent (vue plan, capteurs dispo, QR de paiement)
- Réservation restaurant, cinéma, bien-être
- Intégration calendrier

#### Programme de Fidélité
- Tableau de bord gamifié
- Points, badges, niveaux, historique achats
- Accent couleur : COSMOS Yellow
- Parrainage

---

### 🗺️ 4. Navigation Indoor & AR

- Vue 3D du centre avec AR overlay
- Localisation, points d'intérêt, accessibilité PMR
- Option "Retrouver un ami dans le centre"
- Interface fluide et immersive

---

### 🤖 5. Expérience Client Avancée

#### Assistant Virtuel IA
- Chat 24/7 avec bulle flottante
- Design épuré : fond blanc, texte bleu, accents rouges
- Fonctions :
  - Recherche de boutiques
  - Recommandations personnalisées
  - FAQ dynamique

#### Réalité Augmentée
- "Try On" virtuel pour mode & accessoires
- Chasse au trésor interactive
- Visualisation produits 3D dans le plan du centre

#### Social Features
- Section communautaire "#MyCosmosMoments"
- Galerie de photos partagées
- Avis
- Événements entre amis
- Intégration sociale (Instagram, TikTok, Meta)

---

### 👔 6. Interface Administrateur (Centre Commercial)

#### Dashboard Principal
- Métriques temps réel
- Heatmap des zones chaudes
- Flux de visiteurs en direct
- Prévisions météo impact
- Alertes sécurité
- KPIs personnalisables

#### Gestion des Boutiques
- CRUD Complet
- Contrats de location
- Documents légaux
- Historique des loyers
- Performance metrics
- Messagerie intégrée
- Analytics boutiques

#### Gestion Marketing & Événements
- Campagnes Marketing :
  - Création visuelle drag & drop
  - A/B testing
  - Segmentation clients
  - Multi-canal (email, SMS, push, display)
  - ROI tracking
- Événements :
  - Planification interactive
  - Gestion ressources
  - Billetterie intégrée
  - Streaming live
  - Analytics post-event

#### Gestion Opérationnelle
- Facilities Management :
  - Maintenance prédictive
  - Gestion énergétique IoT
  - Nettoyage optimisé
  - Sécurité temps réel
  - Contrôle accès
- RH & Planning :
  - Planning personnel
  - Gestion des équipes
  - Formation e-learning
  - Évaluation performance

#### Modération des Publications Locataires
- Système de modération
- File d'attente des publications à valider
- Prévisualisation avant publication
- Outils de modération (approuver/rejeter/demander modifications)
- Historique des modérations
- Filtres anti-spam automatiques

---

### 🏪 7. Interface Enseigne (Locataire)

#### Espace Dédié Enseigne
- Tableau de bord personnalisé
- Gestion de la vitrine digitale
- Templates personnalisables
- Upload photos/vidéos haute qualité
- Galerie produits avec zoom
- Vidéos 360° de la boutique

#### Gestion du Contenu
- Catalogue Produits :
  - Import bulk (CSV/Excel)
  - Gestion des stocks (optionnel)
  - Prix et promotions
  - Catégorisation produits
  - QR codes produits

#### Outils Marketing Enseigne
- Promotions et Offres :
  - Création de bons de réduction digitaux
  - Flash sales avec compte à rebours
  - Offres exclusives app mobile
  - Codes promo personnalisés
- Communication Client :
  - Newsletter dédiée
  - Push notifications ciblées
  - Chat en direct
  - FAQ personnalisable
  - Avis clients et réponses
- Analytics Enseigne :
  - Vues de la page boutique
  - Taux de conversion digital → physique
  - Performance des promotions
  - Demographics visiteurs

#### Workflow de Publication
1. Création du contenu par l'enseigne
2. Prévisualisation
3. Soumission pour validation
4. Notification admin centre commercial
5. Modération (auto ou manuelle)
6. Publication ou demande de révision
7. Notification de statut à l'enseigne

---

### 🌐 8. Interface Super Admin (Développeur)

#### Gestion Multi-Tenant
- Création/suppression tenants
- Allocation ressources
- Monitoring usage
- Backup/restore par tenant
- Migration de données

#### Gestion Abonnements
- Plans Flexibles (Starter/Pro/Enterprise)
- Facturation mensuelle/annuelle
- Add-ons modulaires
- Intégration Paiement (Stripe/PayPal/Adyen)

#### Monitoring & DevOps
- Observabilité (APM temps réel, Logs centralisés, Métriques custom)
- Déploiement (Blue/Green deployment, Feature flags, Rollback automatique)

---

### 📰 9. Blog & Content Marketing

#### Plateforme de Blog Intégrée
- Éditeur de contenu riche
- Support multilingue (FR/EN)
- SEO optimisé
- Catégorisation et tags
- Système de commentaires modérés
- Partage social intégré
- Analytics détaillés

#### Types de Contenu
- Articles par Centre Commercial
- Articles par Enseigne
- Articles Plateforme

#### Fonctionnalités
- Calendrier éditorial collaboratif
- Workflow de validation
- Programmation de publication
- Related posts intelligents
- Newsletter integration

---

### 📧 10. Newsletter & Email Marketing

#### Système de Newsletter Multi-niveaux
- Éditeur Visuel Avancé (drag & drop)
- Templates responsives pré-conçus
- Personnalisation dynamique
- A/B testing intégré

#### Segmentation Intelligente
- Par fréquence de visite
- Par centre préféré
- Par catégories favorites
- Par historique d'achat
- Par niveau d'engagement

#### Automatisation Campagnes
- Welcome series nouveaux inscrits
- Anniversaires avec offres personnalisées
- Réactivation clients inactifs
- Post-visite satisfaction
- Abandon panier (Click & Collect)

#### Analytics Newsletter
- Taux d'ouverture par segment
- Clics par zone/CTA
- Conversions (visite physique, achat)
- Heatmap des clics
- ROI par campagne

---

### 📱 11. Intégration Réseaux Sociaux

#### Hub Social Media Centralisé
- Publication multi-plateformes (Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube, Pinterest, Snapchat)
- Éditeur unifié
- Planification avancée avec calendrier
- Preview par réseau social

#### Plans de Communication Digitale
- Calendrier Editorial Social
- Templates de Campagnes
- Budget allocation

#### Social Media Analytics
- Dashboard unifié
- Métriques détaillées par plateforme
- Engagement rate
- Reach & impressions
- Top performing posts

#### Social Listening & Monitoring
- Monitoring mentions
- Tracking hashtags
- Analyse de sentiment
- Détection de crisis
- E-réputation

#### Advertising & Paid Social
- Gestion campagnes publicitaires
- Targeting avancé
- Budget optimization
- A/B testing creatives

#### Influencer Management
- Gestion des campagnes influenceurs
- Brief et requirements
- Tracking hashtags et promo codes
- Performance metrics

---

### 🌍 12. Système Multilingue

#### Configuration
- Langues supportées : Français (FR) / Anglais (EN)
- Traduction complète de l'interface
- URLs SEO-friendly (/fr/, /en/)
- Détection automatique langue navigateur
- Switcher de langue persistant

#### Gestion du Contenu Multilingue
- Django-modeltranslation pour les modèles
- react-i18next pour le frontend
- Interface de traduction pour admins
- Export/Import fichiers de traduction

---

### 👥 13. Gestion des Rôles et Permissions

#### Hiérarchie des Accès
1. **Super Administrateur** (Développeur)
   - Gestion multi-tenant complète
   - Configuration système
   - Monitoring global

2. **Administrateur Centre Commercial**
   - Configuration du centre
   - Animation du site
   - Gestion des enseignes
   - Analytics complets

3. **Modérateur Centre Commercial**
   - Modération du contenu
   - Animation du site
   - Analytics lecture seule

4. **Administrateur Enseigne**
   - Gestion vitrine digitale
   - Publications
   - Analytics enseigne

5. **Employé Enseigne**
   - Gestion vitrine digitale
   - Analytics lecture seule

6. **Visiteur**
   - Accès public

#### Matrice des Permissions
- Système de permissions granulaires
- Délégation temporaire possible
- Audit trail complet
- Notifications de changements

---

## 📁 Structure du Projet

```
Site Web Cosmos/
├── Frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/           # Pages de l'application
│   │   ├── layouts/         # Layouts (Public, Admin, etc.)
│   │   ├── features/        # Features avec Redux slices
│   │   ├── services/        # Services API (RTK Query)
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilitaires
│   │   ├── assets/          # Images, fonts, etc.
│   │   ├── styles/          # Styles globaux
│   │   └── i18n/            # Traductions
│   ├── public/
│   └── package.json
│
├── Backend/                 # Application Django
│   ├── core/                # Configuration Django
│   ├── apps/
│   │   ├── tenants/         # Multi-tenant
│   │   ├── users/           # Authentification
│   │   ├── stores/          # Gestion boutiques
│   │   ├── events/          # Événements
│   │   ├── blog/            # Blog
│   │   ├── newsletter/      # Newsletter
│   │   ├── social_media/    # Social Media
│   │   ├── analytics/       # Analytics
│   │   └── ...
│   ├── requirements.txt
│   └── manage.py
│
├── docker-compose.yml       # Configuration Docker
├── .gitlab-ci.yml          # CI/CD
└── README.md               # Ce fichier
```

---

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- Python 3.11+
- PostgreSQL 15+
- Redis
- Docker (optionnel)

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

### Backend

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 📝 Documentation

- [Guide de contribution](./CONTRIBUTING.md)
- [Documentation API](./Backend/docs/API.md)
- [Guide de style](./Frontend/docs/STYLE_GUIDE.md)
- [Architecture détaillée](./docs/ARCHITECTURE.md)

---

## 🎯 Objectifs Stratégiques

### KPIs Cibles

- Taux de conversion visiteur web → visiteur physique : +30%
- Engagement utilisateur : temps moyen > 5 minutes
- Taux d'adoption application mobile : 40% des visiteurs réguliers
- ROI marketing digital : x3 en 18 mois

### Objectifs de Performance

- Page Load Time: < 2s (3G)
- Time to Interactive: < 3s
- API Response Time: < 200ms (p95)
- Concurrent Users: 100k+
- Uptime: 99.99%

---

## 📅 Planning de Développement

### Phase 1 (3 mois): MVP
- Infrastructure de base
- Auth & Multi-tenant
- Interface visiteur basique
- Admin boutiques

### Phase 2 (3 mois): Fonctionnalités Avancées
- Analytics complet
- Marketing automation
- Navigation indoor
- Mobile apps

### Phase 3 (2 mois): Optimisation
- Performance tuning
- A/B testing
- ML recommendations
- Intégrations tierces

---

## 🧪 Tests

```bash
# Frontend
cd Frontend
npm run test
npm run test:coverage

# Backend
cd Backend
python manage.py test
coverage run --source='.' manage.py test
```

---

## 🔒 Sécurité

- Authentification SSO (SAML, OAuth2)
- 2FA/MFA obligatoire
- RGPD Compliance
- Audit trail complet
- Rate limiting
- CORS configuré
- Headers de sécurité

---

## 📞 Support

Pour toute question ou assistance :
- Email: support@cosmosangre.com
- Documentation: https://docs.cosmosangre.com
- Issues: https://github.com/cosmos-angre/issues

---

## 📄 Licence

Propriétaire - Cosmos Angré © 2024

---

## 👥 Équipe

- Product Owner
- Scrum Master
- 4 Développeurs Full-Stack
- 2 Développeurs Mobile
- 1 DevOps Engineer
- 1 UX/UI Designer
- 1 QA Engineer
- 1 Data Analyst

---

**Développé avec ❤️ par Pratium Tech**
