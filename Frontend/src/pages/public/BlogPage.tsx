import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User, ArrowRight } from 'lucide-react';
import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import familyLifestyle from '../../assets/images/branding/family-lifestyle.jpg';
import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';
import artisanMarket from '../../assets/images/branding/artisan-market.jpg';

const BlogPage: React.FC = () => {
  const { t } = useTranslation();

  const articles = [
    { id: 1, slug: 'ouverture-cosmos-angre', key: 'ouverture', image: galleryInterior },
    { id: 2, slug: 'artisans-locaux', key: 'artisans', image: artisanMarket },
    { id: 3, slug: 'destination-famille', key: 'famille', image: familyLifestyle },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Magazine & actualités"
        description="Articles, interviews, tendances lifestyle, gastronomie et culture à Cosmos Angré. Le magazine premium de Cocody-Angré."
        keywords={['blog Cosmos', 'magazine Abidjan', 'actualités shopping', 'lifestyle Cocody', 'tendances Côte Ivoire']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Magazine', url: '/blog' },
        ])}
      />
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <OptimizedImage src={familyLifestyle} alt="Blog Cosmos Angre" containerClassName="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos-night/80 via-cosmos-night/60 to-cosmos-night/80" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{t('blog.hero.overline')}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up">{t('blog.hero.title')}</h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {t('blog.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="space-y-6">
            {articles.map((article) => (
              <article key={article.id} className="card group overflow-hidden">
                <div className="grid md:grid-cols-3">
                  <div className="aspect-[4/3] md:aspect-auto">
                    <OptimizedImage src={article.image} alt={t(`blog.articles.${article.key}.title`)} containerClassName="w-full h-full" hoverZoom />
                  </div>
                  <div className="md:col-span-2 p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-2 block">
                        {t(`blog.articles.${article.key}.category`)}
                      </span>
                      <h2 className="font-cormorant text-2xl md:text-3xl text-cosmos-night font-light mb-3 group-hover:text-cosmos-gold transition-colors">
                        {t(`blog.articles.${article.key}.title`)}
                      </h2>
                      <p className="text-sm text-text-secondary font-inter font-light mb-4">
                        {t(`blog.articles.${article.key}.excerpt`)}
                      </p>
                      <div className="flex items-center gap-5 text-xs text-text-secondary font-inter font-light">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-cosmos-gold" strokeWidth={1.5} />
                          {t(`blog.articles.${article.key}.date`)}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-cosmos-gold" strokeWidth={1.5} />
                          {t(`blog.articles.${article.key}.author`)}
                        </span>
                      </div>
                    </div>
                    <Link to={`/blog/${article.slug}`} className="self-start mt-6 flex items-center gap-2 text-xs font-inter font-medium text-cosmos-night hover:text-cosmos-gold hover:gap-3 transition-all">
                      {t('blog.readMore')} <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
