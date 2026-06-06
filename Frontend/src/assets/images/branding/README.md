# Branding Guide - Cosmos Angré

Ce dossier contient les assets visuels et les directives de branding basées sur la plaquette officielle de Cosmos Angré.

## 🎨 Palette de Couleurs

Les couleurs sont déjà configurées dans `tailwind.config.js` :

```javascript
colors: {
  cosmos: {
    blue: '#231F54',     // Couleur dominante (Pantone 2755)
    red: '#EB3737',      // Call-to-action & alertes
    teal: '#00B6AA',     // Accents premium
    yellow: '#FFD500',   // Énergie & dynamisme
    purple: '#A31EB4',   // Modernité & innovation
    pink: '#E61E73',     // Animation, lifestyle
  },
  background: '#FAFAFA', // Blanc cassé
  gold: '#D4AF37',       // Or premium
}
```

## 📝 Wording & Slogans

### Slogan Principal
**"L'art de vivre ensemble"**

### Titres & Accroches
- "LE PLUS GRAND COMPLEXE COMMERCIAL DE CÔTE D'IVOIRE"
- "Votre succès commence ici !"
- "Votre destination préférée, pour toutes les bonnes raisons"
- "Un lieu de vie et de convergence incomparable"

### Messages Clés
1. **Introduction**
   - "Une destination unique qui révolutionne l'expérience du commerce, des loisirs et de la vie quotidienne à Abidjan"
   - "Situé à Angré Château, Cocody - Abidjan"

2. **Positionnement**
   - "Bien plus qu'un centre commercial, une expérience à vivre"
   - "Un carrefour d'émotions, de rencontres et de découvertes"
   - "Un lieu exceptionnel où innovation, commerce et convivialité se rencontrent"

3. **Écosystème**
   - "intégrer un écosystème où innovation, commerce et convivialité se rencontrent"
   - "Une expérience complète : shopping, gastronomie, divertissement et services"

4. **Engagement Durable**
   - "Certification EDGE (Excellence in Design for Greater Efficiencies)"
   - "Un engagement écoresponsable pour un avenir durable"

## 🏢 Composantes du Centre

### 1. Galerie Commerciale
- Surface totale : X m²
- Offre variée : Mode, Beauté, Gastronomie, Services

### 2. Marché Artisanal
- Surface : 456 m²
- "L'âme authentique de Cosmos Angré"
- Produits locaux et artisanat

### 3. BIG BOX 1 - Cinéma
- Surface : 1463 m²
- Technologie de pointe
- Programmation variée

### 4. BIG BOX 2 - Sport & Jeux
- Salle de sport moderne
- Salle de jeux avec simulateurs

### 5. BIG BOX 3 - Sports Bar
- Espace dédié aux événements sportifs

### 6. BIG BOX 4 - Bureaux
- Surface : 501 m²
- Espaces de coworking

### 7. Polyclinique Médicale
- Surface : 500 m²
- Services médicaux complets
- "La santé au cœur de Cosmos Angré"

### 8. Hôtels
- **Ibis Styles** : Design coloré et convivial
- **Adagio** : Appartements équipés pour séjours prolongés

### 9. Parking
- **Souterrain** : 100 places
- **Ouvert** : 325 places
- Total : 425 places sécurisées

## 📍 Localisation

**Adresse complète :**
Angré Château, Cocody
Abidjan, Côte d'Ivoire

**Quartier :** L'un des quartiers les plus prisés d'Abidjan
- Larges avenues arborées
- Résidences haut de gamme
- Infrastructures modernes

## 📧 Contact

**Email :** infos@cosmos-angre.com

**Phrase de contact :**
"Ne ratez pas cette opportunité unique de donner une visibilité exceptionnelle à votre activité au sein de l'emblématique Cosmos Angré."

## 🌱 Développement Durable

### Certification EDGE
En voie d'obtention de la certification EDGE

**Points clés :**
- Réduction de l'impact écologique
- Technologies innovantes
- Limitation de la consommation d'énergie et d'eau
- Minimisation de l'empreinte carbone
- Pratiques écoresponsables

## 🎯 Valeurs & Positionnement

### Points Différenciants
1. **Emplacement stratégique** : Au cœur d'Angré Château
2. **Offre complète** : Shopping, loisirs, santé, hébergement
3. **Modernité** : Design contemporain et technologies de pointe
4. **Écoresponsabilité** : Certification EDGE
5. **Services haut de gamme** : Parking, espaces familiaux, services personnalisés

### Public Cible
- Familles
- Jeunes actifs
- Professionnels
- Visiteurs réguliers au fort potentiel de consommation

## 📸 Images à Intégrer

Pour intégrer les images de la plaquette :
1. Extraire les images du PDF de la plaquette
2. Les placer dans ce dossier (`Frontend/src/assets/images/branding/`)
3. Nommer les fichiers de manière descriptive :
   - `hero-exterior.jpg`
   - `gallery-interior.jpg`
   - `artisan-market.jpg`
   - `cinema-bigbox.jpg`
   - `edge-certification.jpg`
   - etc.

## 🎨 Typographie

- **Titres** : Poppins SemiBold (élégant & contemporain)
- **Textes** : Inter Regular (lisible & moderne)

Déjà configuré dans `tailwind.config.js` :
```javascript
fontFamily: {
  poppins: ['Poppins', 'sans-serif'],
  inter: ['Inter', 'sans-serif'],
}
```

## ✅ Checklist d'Intégration

- [x] Couleurs configurées dans Tailwind
- [x] Typographie configurée
- [x] Slogan principal intégré sur la page d'accueil
- [x] Section EDGE ajoutée
- [x] Contact mis à jour (infos@cosmos-angre.com)
- [x] Localisation mise à jour (Angré Château)
- [ ] Images de la plaquette à extraire et intégrer
- [ ] Section "Chiffres clés" à compléter avec les vraies données
- [ ] Plan interactif du centre à développer
- [ ] Section "Pourquoi choisir Cosmos Angré" enrichie

## 📋 Notes

Tous les ajouts respectent la structure existante du site :
- Utilisation des composants existants (Button, Card, etc.)
- Respect de la mise en page actuelle
- Ajout de sections sans modifier l'architecture
- Conservation du système de traduction i18n
