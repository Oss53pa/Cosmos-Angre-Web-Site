import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `404 — ${t('notFound.title', 'Page introuvable')} | Cosmos Angré`;
    return () => {
      document.title = prevTitle;
    };
  }, [t]);

  return (
    <main
      role="main"
      className="min-h-screen flex items-center justify-center bg-cosmos-night px-6"
    >
      <div className="text-center max-w-lg">
        <div
          aria-hidden="true"
          className="font-cormorant text-8xl md:text-9xl text-cosmos-cream/10 font-light mb-4"
        >
          404
        </div>
        <h1 className="font-cormorant text-3xl md:text-4xl text-cosmos-cream font-light mb-4">
          {t('notFound.title', 'Page introuvable')}
        </h1>
        <p className="text-cosmos-cream/60 font-inter font-light mb-10 max-w-md mx-auto">
          {t(
            'notFound.description',
            "La page que vous recherchez n'existe pas ou a été déplacée."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-cosmos-gold text-cosmos-night hover:bg-cosmos-gold/90 transition rounded font-inter text-sm tracking-wide"
          >
            {t('notFound.cta', "Retour à l'accueil")}
          </Link>
          <Link
            to="/boutiques"
            className="px-6 py-3 border border-cosmos-gold/40 text-cosmos-gold hover:bg-cosmos-gold/10 transition rounded font-inter text-sm tracking-wide"
          >
            {t('notFound.ctaSecondary', 'Explorer les boutiques')}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
