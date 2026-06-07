import React from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '../../lib/seo/Seo';
import Reveal from '../../components/common/Reveal';
import { useContent } from '../../lib/content/SiteContentProvider';
import NotFoundPage from './NotFoundPage';

/**
 * Rend une page personnalisée créée depuis l'admin (cosmos.site_pages, is_custom).
 * Le corps (body) est du HTML rédigé par un administrateur de confiance.
 */
const CustomPage: React.FC = () => {
  const { pages, ready } = useContent();
  const location = useLocation();
  const path = location.pathname.replace(/^\/en(?=\/|$)/, '') || '/';

  const page = pages.find((p) => p.path === path && p.is_custom);

  if (!ready) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page || !page.is_visible) return <NotFoundPage />;

  return (
    <div className="bg-cosmos-warm">
      <Seo title={page.label} description={page.seo_description || page.label} />

      {/* En-tête éditorial */}
      <section className="bg-cosmos-night py-28 md:py-36 text-center">
        <div className="container-cosmos">
          <span className="overline mb-4 block">Cosmos Angré</span>
          <h1 className="font-cormorant text-5xl md:text-6xl text-cosmos-cream font-light text-balance">
            {page.label}
          </h1>
        </div>
      </section>

      {/* Corps */}
      <section className="section">
        <div className="container-cosmos max-w-3xl">
          <Reveal>
            <div
              className="prose-cosmos font-inter font-light text-cosmos-night/80 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: page.body || '' }}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default CustomPage;
