// Script pour générer rapidement les pages template
const fs = require('fs');
const path = require('path');

const pageTemplate = (name, title, description) => `import React from 'react';

const ${name}: React.FC = () => {
  return (
    <div className="min-h-screen">
      <div className="container-cosmos py-12">
        <h1 className="text-4xl font-poppins font-bold text-cosmos-blue mb-4">
          ${title}
        </h1>
        <p className="text-gray-600 mb-8">
          ${description}
        </p>
        <div className="card p-8">
          <p className="text-gray-500">Contenu à venir...</p>
        </div>
      </div>
    </div>
  );
};

export default ${name};
`;

const pages = [
  // Public pages
  { dir: 'public', name: 'StoresPage', title: 'Nos Boutiques', desc: 'Découvrez toutes les boutiques de Cosmos Angré' },
  { dir: 'public', name: 'StoreDetailPage', title: 'Détail Boutique', desc: 'Informations détaillées sur la boutique' },
  { dir: 'public', name: 'EventsPage', title: 'Événements', desc: 'Tous les événements à venir' },
  { dir: 'public', name: 'EventDetailPage', title: 'Détail Événement', desc: 'Informations sur l\'événement' },
  { dir: 'public', name: 'ServicesPage', title: 'Nos Services', desc: 'Découvrez tous nos services' },
  { dir: 'public', name: 'BlogPage', title: 'Blog', desc: 'Actualités et articles' },
  { dir: 'public', name: 'BlogPostPage', title: 'Article', desc: 'Lire l\'article' },
  { dir: 'public', name: 'ContactPage', title: 'Contact', desc: 'Contactez-nous' },

  // Auth pages
  { dir: 'auth', name: 'LoginPage', title: 'Connexion', desc: 'Connectez-vous à votre compte' },
  { dir: 'auth', name: 'RegisterPage', title: 'Inscription', desc: 'Créez votre compte' },

  // Admin pages
  { dir: 'admin', name: 'AdminDashboard', title: 'Dashboard Admin', desc: 'Vue d\'ensemble de l\'administration' },
  { dir: 'admin', name: 'StoresManagement', title: 'Gestion des Boutiques', desc: 'Gérer les boutiques du centre' },
  { dir: 'admin', name: 'EventsManagement', title: 'Gestion des Événements', desc: 'Gérer les événements' },
  { dir: 'admin', name: 'ModerationPage', title: 'Modération', desc: 'Modérer les publications des enseignes' },

  // Store pages
  { dir: 'store', name: 'StoreDashboard', title: 'Tableau de Bord Enseigne', desc: 'Vue d\'ensemble de votre enseigne' },
  { dir: 'store', name: 'StoreShowcase', title: 'Ma Vitrine', desc: 'Gérer votre vitrine digitale' },
  { dir: 'store', name: 'StoreAnalytics', title: 'Analytics', desc: 'Statistiques de votre enseigne' },
];

pages.forEach(page => {
  const filePath = path.join(__dirname, '..', 'pages', page.dir, `${page.name}.tsx`);
  const content = pageTemplate(page.name, page.title, page.desc);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log('All pages created successfully!');
