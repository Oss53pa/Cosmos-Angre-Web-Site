# 📸 Guide d'Intégration des Images - Cosmos Angré

## 🎯 Objectif

Intégrer les vraies photos de la plaquette officielle dans le site web.

---

## 📋 **Étapes Simples**

### **Étape 1 : Extraire les Images du PDF**

#### **Méthode Recommandée : Adobe Acrobat Reader**

1. **Ouvrir** la plaquette PDF :
   ```
   C:\Users\User\Dropbox\PRAEDIUM TECH- CONTROLLED DOCUMENT\PLAQUETTE FINALE.pdf
   ```

2. **Outils** → **Exporter un PDF** → **Image** → **JPEG**

3. **Paramètres** :
   - Format : JPEG
   - Qualité : Maximale
   - Pages : Toutes

4. **Enregistrer** dans un dossier temporaire

#### **Alternative : Outil en Ligne**

1. Aller sur https://www.ilovepdf.com/fr/pdf_en_jpg
2. Uploader `PLAQUETTE FINALE.pdf`
3. Télécharger toutes les pages en JPG

---

### **Étape 2 : Identifier et Renommer**

Consultez le fichier `Frontend/src/assets/images/branding/GUIDE_IMAGES.md` pour :
- Voir toutes les images identifiées (18 pages)
- Connaître le nom à donner à chaque image
- Comprendre où chaque image sera utilisée

**Exemples de renommage :**
- Page 1 → `hero-exterior.jpg`
- Page 4 → `aerial-3d-plan.jpg`
- Page 6 → `edge-logo.png`
- etc.

---

### **Étape 3 : Placer les Images**

Déplacer toutes les images renommées dans :
```
C:\devs\Site Web Cosmos\Frontend\src\assets\images\branding\
```

---

### **Étape 4 : Vérifier l'Intégration**

1. Les images sont automatiquement prises en charge par Vite
2. Elles seront accessibles via les imports TypeScript
3. Le Hot Module Replacement mettra à jour le site automatiquement

---

## 📂 **Structure Finale**

```
Frontend/src/assets/images/branding/
├── .gitkeep
├── README.md
├── GUIDE_IMAGES.md ← Guide détaillé
│
├── logo-cosmos-angre.png ← Logo officiel
│
├── hero-exterior.jpg ← Page d'accueil
├── aerial-3d-plan.jpg ← Vue aérienne
│
├── edge-building.jpg ← Certification
├── edge-logo.png ← Logo EDGE
│
├── location-aerial.jpg ← Localisation
├── floor-plan.jpg ← Plan du centre
│
├── gallery-interior.jpg ← Galerie commerciale
├── gallery-escalators.jpg
│
├── artisan-market.jpg ← Marché artisanal
├── promenade-park.jpg ← Promenade
├── indoor-garden.jpg
│
├── cinema-experience.jpg ← Cinéma
├── cinema-screen.jpg
│
├── medical-team.jpg ← Polyclinique
├── polyclinic-interior.jpg
├── medical-staff.jpg
│
├── office-space.jpg ← Bureaux
│
├── ibis-styles-exterior.jpg ← Hôtels
├── adagio-exterior.jpg
├── hotels-facade.jpg
│
├── parking-outdoor.jpg ← Parking
│
├── family-lifestyle.jpg ← Lifestyle
├── visitors-experience.jpg
└── experience-lifestyle.jpg
```

---

## 🔧 **Utilisation dans le Code**

### **Option 1 : Import Direct (Recommandé)**

```typescript
import heroImage from '../../assets/images/branding/hero-exterior.jpg';

<section style={{ backgroundImage: `url(${heroImage})` }}>
  {/* Contenu */}
</section>
```

### **Option 2 : Configuration Centralisée**

Le fichier `Frontend/src/utils/images.ts` centralise toutes les images :

```typescript
import { BRANDING_IMAGES } from '../../utils/images';

// Utilisation
<img src={BRANDING_IMAGES.hero.exterior} alt="Cosmos Angré" />
```

---

## ✅ **Checklist d'Intégration**

### Images Principales (Priorité Haute)

- [ ] **logo-cosmos-angre.png** - Logo officiel
- [ ] **hero-exterior.jpg** - Photo principale de couverture
- [ ] **aerial-3d-plan.jpg** - Plan 3D du projet
- [ ] **edge-building.jpg** - Bâtiment avec végétation
- [ ] **edge-logo.png** - Logo certification EDGE
- [ ] **location-aerial.jpg** - Vue aérienne du quartier
- [ ] **floor-plan.jpg** - Plan détaillé du centre

### Images des Espaces (Priorité Moyenne)

- [ ] **gallery-interior.jpg** - Galerie commerciale
- [ ] **artisan-market.jpg** - Marché artisanal
- [ ] **promenade-park.jpg** - Promenade extérieure
- [ ] **cinema-experience.jpg** - Expérience cinéma
- [ ] **medical-team.jpg** - Équipe médicale
- [ ] **polyclinic-interior.jpg** - Intérieur polyclinique
- [ ] **office-space.jpg** - Espace bureau
- [ ] **ibis-styles-exterior.jpg** - Hôtel Ibis
- [ ] **adagio-exterior.jpg** - Hôtel Adagio

### Images Complémentaires

- [ ] **parking-outdoor.jpg** - Parking extérieur
- [ ] **gallery-escalators.jpg** - Galerie avec escalators
- [ ] **indoor-garden.jpg** - Jardin intérieur
- [ ] **visitors-experience.jpg** - Visiteurs
- [ ] **family-lifestyle.jpg** - Ambiance familiale

---

## 🎨 **Optimisation (Optionnel)**

### Avant de Placer les Images

Pour de meilleures performances, optimisez les images :

1. **TinyPNG** : https://tinypng.com/
   - Compression sans perte visible
   - Drag & drop jusqu'à 20 images

2. **Paramètres Recommandés** :
   - Format : JPEG (photos), PNG (logos avec transparence)
   - Qualité : 85-90%
   - Largeur max : 1920px
   - Poids cible : < 500 KB par image

---

## 📝 **Notes Importantes**

### 1. **Format des Images**
- **JPG** pour les photos
- **PNG** pour les logos (avec transparence)

### 2. **Nommage**
- Utilisez exactement les noms du guide
- Tout en minuscules
- Tirets pour séparer les mots
- Pas d'espaces ni de caractères spéciaux

### 3. **Qualité**
- Privilégiez la haute résolution
- Le site s'adaptera automatiquement

### 4. **Alt Text**
- Sera ajouté automatiquement via le code
- Basé sur les descriptions dans `brochureData.ts`

---

## 🚀 **Résultat Final**

Une fois toutes les images intégrées :

✅ Site web avec **vraies photos professionnelles**
✅ **Cohérence totale** avec la plaquette officielle
✅ **Chargement optimisé** (lazy loading automatique)
✅ **Responsive** sur tous les appareils

---

## 🆘 **Besoin d'Aide ?**

### Fichiers de Référence

1. **`GUIDE_IMAGES.md`** - Liste détaillée de toutes les images
2. **`images.ts`** - Configuration centralisée
3. **`brochureData.ts`** - Textes et données de la plaquette

### Support

Si vous avez besoin d'aide pour :
- Extraire les images du PDF
- Renommer les fichiers
- Optimiser les images

Contactez l'équipe technique.

---

## 📊 **Progression**

```
[ ] Extraction : 0/20 images
[ ] Renommage : 0/20 images
[ ] Placement : 0/20 images
[ ] Vérification : 0/20 images
```

Une fois terminé, le site aura un rendu **100% professionnel** avec les vraies images ! 🎉

---

**Temps estimé : 15-30 minutes**

**Développé avec excellence** ❤️
