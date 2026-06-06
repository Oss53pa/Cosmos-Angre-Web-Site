# 📸 Extraction des Images - Mode Simple

## 🎯 **Mission : Extraire les Photos de la Plaquette**

Vous avez la plaquette PDF, voici le moyen **le plus simple** pour extraire les images.

---

## ⚡ **Méthode Ultra-Simple (5 Minutes)**

### **Utiliser iLovePDF (En Ligne - Gratuit)**

1. **Ouvrir le navigateur** et aller sur :
   ```
   https://www.ilovepdf.com/fr/pdf_en_jpg
   ```

2. **Cliquer sur "Sélectionner fichier PDF"**

3. **Naviguer vers** :
   ```
   C:\Users\User\Dropbox\PRAEDIUM TECH- CONTROLLED DOCUMENT\PLAQUETTE FINALE.pdf
   ```

4. **Sélectionner** le fichier et cliquer "Ouvrir"

5. **Choisir les options** :
   - ✅ "Toutes les pages"
   - ✅ Qualité : **Maximum**

6. **Cliquer sur "Convertir en JPG"**

7. **Télécharger** le fichier ZIP

8. **Décompresser** le ZIP → Vous obtenez 18 images (une par page)

---

## 📁 **Organiser les Images**

### **Correspondance Pages → Noms**

Une fois les images extraites, **renommez-les** :

```
Page 1  →  hero-exterior.jpg          (Couverture avec palmiers)
Page 2  →  experience-lifestyle.jpg   (Café/ambiance)
Page 3  →  exterior-logo.jpg          (Vue avec logo Cosmos)
Page 4  →  aerial-3d-plan.jpg         (Plan 3D aérien)
Page 5  →  edge-building.jpg          (Bâtiment écologique)
Page 6  →  edge-logo.png              (Logo EDGE)
Page 7  →  location-aerial.jpg        (Vue aérienne quartier)
Page 8  →  floor-plan.jpg             (Plan du centre)
Page 9  →  family-lifestyle.jpg       (Famille)
Page 10 →  gallery-interior.jpg       (Galerie moderne)
Page 11 →  gallery-escalators.jpg     (Escalators)
Page 12 →  artisan-market.jpg         (Marché artisanal)
Page 13 →  promenade-park.jpg         (Promenade)
Page 14 →  polyclinic-interior.jpg    (Polyclinique)
Page 15 →  cinema-experience.jpg      (Cinéma)
Page 16 →  office-space.jpg           (Bureaux)
Page 17 →  ibis-styles-exterior.jpg   (Hôtel Ibis)
Page 18 →  logo-cosmos-angre.png      (Logo final)
```

---

## 💾 **Placer les Images**

1. **Ouvrir l'Explorateur de fichiers**

2. **Naviguer vers** :
   ```
   C:\devs\Site Web Cosmos\Frontend\src\assets\images\branding\
   ```

3. **Copier-coller** toutes les images renommées

4. **C'est tout !** 🎉

---

## ✅ **Vérification**

### **Le dossier doit contenir :**

```
Frontend/src/assets/images/branding/
├── hero-exterior.jpg
├── aerial-3d-plan.jpg
├── edge-building.jpg
├── edge-logo.png
├── location-aerial.jpg
├── floor-plan.jpg
├── gallery-interior.jpg
├── artisan-market.jpg
├── promenade-park.jpg
├── cinema-experience.jpg
├── polyclinic-interior.jpg
├── office-space.jpg
├── ibis-styles-exterior.jpg
├── logo-cosmos-angre.png
└── ... (autres images)
```

---

## 🔄 **Mise à Jour Automatique**

Une fois les images placées :

1. Le serveur Vite détecte automatiquement les nouvelles images
2. Le site se met à jour instantanément
3. Rafraîchissez le navigateur sur http://localhost:5174/

**Les vraies photos apparaissent !** 🎊

---

## 🎨 **Images Prioritaires (Top 5)**

Si vous voulez commencer petit, extrayez d'abord ces 5 images :

1. **Page 1** → `hero-exterior.jpg` (Page d'accueil)
2. **Page 4** → `aerial-3d-plan.jpg` (Plan 3D)
3. **Page 5** → `edge-building.jpg` (EDGE)
4. **Page 8** → `floor-plan.jpg` (Plan du centre)
5. **Page 18** → `logo-cosmos-angre.png` (Logo)

---

## ⚠️ **Notes Importantes**

### **Format**
- Pages avec photos → **JPG**
- Pages avec logos/textes → **PNG** (si fond transparent)

### **Qualité**
- Toujours choisir **qualité maximale**
- Ne pas compresser (on le fera après si besoin)

### **Nommage**
- Tout en **minuscules**
- Utiliser des **tirets** (pas d'espaces)
- Extension correcte (`.jpg` ou `.png`)

---

## 🚀 **Résultat Final**

### Avant (Placeholders)
❌ Images génériques Unsplash

### Après (Vraies Photos)
✅ Photos professionnelles de la plaquette
✅ Cohérence totale avec le branding
✅ Site 100% fidèle à la plaquette officielle

---

## 💡 **Astuce Rapide**

**Pas le temps de tout renommer ?**

1. Extrayez toutes les pages en JPG
2. Regardez chaque image
3. Renommez seulement celles que vous reconnaissez
4. Placez-les dans le dossier
5. Le site utilisera celles disponibles

---

## ⏱️ **Temps Estimé**

- Extraction (iLovePDF) : **2 minutes**
- Renommage : **5 minutes**
- Placement : **1 minute**

**Total : ~10 minutes pour tout !**

---

## 🎯 **Checklist Ultra-Rapide**

```
[ ] 1. Aller sur iLovePDF.com
[ ] 2. Uploader PLAQUETTE FINALE.pdf
[ ] 3. Télécharger le ZIP
[ ] 4. Décompresser
[ ] 5. Renommer les images
[ ] 6. Copier dans Frontend/src/assets/images/branding/
[ ] 7. Rafraîchir le site (Ctrl+F5)
[ ] 8. Admirer le résultat ! 🎉
```

---

**C'est vraiment aussi simple que ça !** 😊

Pour plus de détails, voir `IMAGES_INTEGRATION.md`
