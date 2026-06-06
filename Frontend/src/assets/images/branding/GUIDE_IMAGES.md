# 📸 Guide d'Utilisation des Images - Plaquette Cosmos Angré

## 🎯 Objectif

Ce guide vous aide à extraire et intégrer les images de la plaquette PDF dans le site web.

---

## 📋 Images Identifiées dans la Plaquette

### Page 1 - Couverture
- **Image** : Vue extérieure du complexe avec palmiers et visiteurs
- **Usage** : Hero de la page d'accueil, page À Propos
- **Nom suggéré** : `hero-exterior.jpg`
- **Description** : Photo principale montrant l'architecture moderne du centre avec verdure

### Page 2 - Introduction
- **Image** : Photo d'ambiance (café, personnes)
- **Usage** : Section "Expérience"
- **Nom suggéré** : `experience-lifestyle.jpg`

### Page 3 - Chiffres Clés
- **Images** :
  1. Vue extérieure avec logo Cosmos
  2. Cour intérieure avec végétation
- **Noms suggérés** :
  - `exterior-logo.jpg`
  - `interior-court.jpg`

### Page 4 - Pourquoi Choisir Cosmos
- **Image** : Plan 3D aérien du complexe
- **Usage** : Page "Nos Espaces", Section localisation
- **Nom suggéré** : `aerial-3d-plan.jpg`
- **Description** : Vue d'ensemble du projet avec parking et bâtiments

### Page 5 - Engagement Écoresponsable
- **Image** : Bâtiment avec végétation verticale (certification EDGE)
- **Usage** : Section EDGE, page À Propos
- **Nom suggéré** : `edge-building.jpg`
- **Description** : Architecture verte avec jardins suspendus

### Page 6 - Certification EDGE
- **Image** : Même que page 5 (bâtiment écologique)
- **Logo** : Logo EDGE officiel
- **Nom suggéré** : `edge-logo.png`

### Page 7 - Localisation Angré Château
- **Image** : Vue aérienne du quartier avec le site marqué
- **Usage** : Page À Propos, section localisation
- **Nom suggéré** : `location-aerial.jpg`

### Page 8 - Plan du Centre
- **Image** : Plan détaillé du centre commercial
- **Usage** : Page "Nos Espaces"
- **Nom suggéré** : `floor-plan.jpg`
- **Description** : Layout complet avec zones commerciales, parking, etc.

### Page 9 - Lieu de Vie
- **Images** :
  1. Famille souriante
  2. Carte de localisation
- **Noms suggérés** :
  - `family-lifestyle.jpg`
  - `location-map.jpg`

### Page 10 - Galerie Commerciale
- **Images** :
  1. Intérieur galerie moderne
  2. Cour extérieure avec verdure
- **Noms suggérés** :
  - `gallery-interior.jpg`
  - `outdoor-court.jpg`

### Page 11 - Photos d'Ambiance
- **Images** :
  1. Galerie moderne avec escalators
  2. Parking extérieur paysagé
- **Noms suggérés** :
  - `gallery-escalators.jpg`
  - `parking-outdoor.jpg`

### Page 12 - Marché Artisanal
- **Images** :
  1. Stand artisanal extérieur
  2. Promenade avec végétation
- **Noms suggérés** :
  - `artisan-market.jpg`
  - `promenade-park.jpg`

### Page 13 - Promenade
- **Images** :
  1. Deux femmes utilisant un smartphone
  2. Jardin intérieur luxuriant
- **Noms suggérés** :
  - `visitors-experience.jpg`
  - `indoor-garden.jpg`

### Page 14 - BIG BOX & Polyclinique
- **Images** :
  1. Équipe médicale
  2. Salle de cinéma
  3. Polyclinique moderne
- **Noms suggérés** :
  - `medical-team.jpg`
  - `cinema-screen.jpg`
  - `polyclinic-interior.jpg`

### Page 15 - Sport & Divertissement
- **Images** :
  1. Personnes au cinéma avec pop-corn
  2. Personnel médical
- **Noms suggérés** :
  - `cinema-experience.jpg`
  - `medical-staff.jpg`

### Page 16 - Bureaux & Hôtels
- **Images** :
  1. Espace bureau moderne
  2. Façades hôtels
- **Noms suggérés** :
  - `office-space.jpg`
  - `hotels-facade.jpg`

### Page 17 - Hôtels
- **Images** :
  1. Hôtel Ibis Styles (coloré)
  2. Hôtel Adagio (moderne)
- **Noms suggérés** :
  - `ibis-styles-exterior.jpg`
  - `adagio-exterior.jpg`

### Page 18 - Contact / Fin
- **Image** : Logo Cosmos Angré (version finale)
- **Nom suggéré** : `logo-cosmos-angre.png`

---

## 🛠️ Méthode d'Extraction Manuelle

### Option 1 : Capture d'écran (Simple)
1. Ouvrir la plaquette PDF dans Adobe Reader ou navigateur
2. Zoomer à 200-300% pour la qualité
3. Utiliser l'outil de capture (Windows + Shift + S)
4. Sauvegarder dans `Frontend/src/assets/images/branding/`

### Option 2 : Export depuis Adobe Reader (Recommandé)
1. Ouvrir le PDF dans Adobe Acrobat Reader DC
2. **Outils** → **Exporter un PDF** → **Image** → **JPEG** ou **PNG**
3. Qualité : **Maximale**
4. Dossier de sortie : `Frontend/src/assets/images/branding/`

### Option 3 : Avec un outil en ligne
1. Utiliser **iLovePDF** (https://www.ilovepdf.com/fr/pdf_en_jpg)
2. Uploader la plaquette
3. Télécharger toutes les pages en JPG haute qualité
4. Déplacer dans `Frontend/src/assets/images/branding/`

---

## 📁 Structure Finale des Images

```
Frontend/src/assets/images/branding/
├── logo-cosmos-angre.png
├── hero-exterior.jpg
├── aerial-3d-plan.jpg
├── edge-building.jpg
├── edge-logo.png
├── location-aerial.jpg
├── floor-plan.jpg
├── gallery-interior.jpg
├── gallery-escalators.jpg
├── artisan-market.jpg
├── promenade-park.jpg
├── indoor-garden.jpg
├── cinema-experience.jpg
├── medical-team.jpg
├── polyclinic-interior.jpg
├── office-space.jpg
├── ibis-styles-exterior.jpg
├── adagio-exterior.jpg
├── parking-outdoor.jpg
└── visitors-experience.jpg
```

---

## 🔄 Intégration dans le Code

Une fois les images extraites, remplacez les URLs Unsplash par les vraies images :

### Exemple dans HomePage.tsx
```typescript
// Avant (placeholder)
backgroundImage: 'url(https://images.unsplash.com/...)'

// Après (vraie image)
backgroundImage: 'url(/src/assets/images/branding/hero-exterior.jpg)'
```

### Ou avec import
```typescript
import heroImage from '../../assets/images/branding/hero-exterior.jpg';

// Utilisation
<section style={{ backgroundImage: `url(${heroImage})` }}>
```

---

## ✅ Checklist d'Intégration

- [ ] Extraire toutes les images de la plaquette
- [ ] Renommer selon la nomenclature ci-dessus
- [ ] Placer dans `Frontend/src/assets/images/branding/`
- [ ] Mettre à jour HomePage.tsx
- [ ] Mettre à jour AboutPage.tsx
- [ ] Mettre à jour SpacesPage.tsx
- [ ] Vérifier l'affichage sur http://localhost:5174/
- [ ] Optimiser les images (compression sans perte de qualité)

---

## 🎨 Optimisation des Images

Après extraction, optimisez pour le web :

### Outils Recommandés
1. **TinyPNG** (https://tinypng.com/) - Compression PNG/JPG
2. **Squoosh** (https://squoosh.app/) - Outil Google
3. **ImageOptim** (Mac) ou **Caesium** (Windows)

### Paramètres
- **Format** : JPG pour photos, PNG pour logos
- **Qualité** : 85-90% (bon compromis)
- **Taille max** : 1920px de largeur
- **Poids** : < 500 KB par image

---

## 📝 Notes Importantes

1. **Droits d'utilisation** : Ces images proviennent de la plaquette officielle, utilisez-les uniquement pour le site Cosmos Angré

2. **Logo Cosmos** : Le logo doit être en PNG avec transparence

3. **Hero Images** : Préférez les images haute résolution (min. 1920x1080px)

4. **Responsive** : Les images seront automatiquement adaptées par le CSS

---

## 🚀 Après l'Intégration

Une fois toutes les images intégrées :
1. Testez sur différentes résolutions
2. Vérifiez les temps de chargement
3. Configurez le lazy loading si nécessaire
4. Ajoutez des alt tags descriptifs

---

**Pour toute question, consultez le fichier `brochureData.ts` pour voir où chaque image doit être utilisée.**
