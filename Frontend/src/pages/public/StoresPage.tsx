import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useStores } from '../../hooks/useStores';
import { type StoreData } from '../../components/features/stores/StoreCard';
import StoreDetailModal from '../../components/features/stores/StoreDetailModal';
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import GrainOverlay from '../../components/features/galaxy/GrainOverlay';
import CosmicDivider from '../../components/features/galaxy/CosmicDivider';
import { useContent } from '../../lib/content/SiteContentProvider';

import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';

interface Brand {
  slug: string;
  name: string;
  category: string;
  categoryKey: string;
  zone: string;
  zoneKey: string;
  logo?: string;
  image?: string;
  description: string;
  hours: string;
  phone: string;
  locationCode: string;
  rating: number;
}

const StoresPage: React.FC = () => {
  const { c } = useContent();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  const { stores: supabaseStores } = useStores({ status: 'active' });

  const brands: Brand[] = useMemo(
    () =>
      supabaseStores.map((s) => ({
        slug: s.slug ?? s.id,
        name: s.name,
        category: s.category ?? '',
        categoryKey: s.category_key ?? 'all',
        zone: s.zone ?? '',
        zoneKey: s.zone_key ?? 'gallery',
        logo: s.logo ?? undefined,
        image: s.cover_image ?? undefined,
        description: s.description ?? '',
        hours: s.hours ?? '',
        phone: s.phone ?? '',
        locationCode: s.location_code ?? '',
        rating: s.rating ?? 0,
      })),
    [supabaseStores]
  );

  // Catégories dérivées des données réelles
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of brands) if (b.categoryKey && b.category) map.set(b.categoryKey, b.category);
    return Array.from(map, ([key, label]) => ({ key, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [brands]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return brands
      .filter((b) => selectedCategory === 'all' || b.categoryKey === selectedCategory)
      .filter((b) => q === '' || b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, selectedCategory, searchTerm]);

  const openBrand = (b: Brand) =>
    setSelectedStore({
      id: b.slug,
      name: b.name,
      categoryKey: b.categoryKey,
      category: b.category,
      zone: b.zone,
      zoneKey: b.zoneKey,
      locationCode: b.locationCode,
      hours: b.hours,
      phone: b.phone,
      description: b.description,
      rating: b.rating,
      image: b.image ?? '',
      logo: b.logo,
    });

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Les Enseignes"
        description="Les enseignes signées de Cosmos Angré : mode, beauté, restaurants, high-tech, services et plus, au cœur d'Angré, Cocody."
        keywords={['enseignes Cosmos Angré', 'boutiques Cocody', 'marques Abidjan', 'shopping Angré']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Enseignes', url: '/boutiques' },
        ])}
      />

      <PageHero
        image={c('stores.hero.image') || galleryInterior}
        alt="Les enseignes de Cosmos Angré"
        overline={c('stores.hero.overline', 'Les Enseignes')}
        title={c('stores.hero.title', 'Vos marques,')}
        titleAccent={c('stores.hero.accent', 'réunies.')}
        subtitle={c(
          'stores.hero.subtitle',
          `${brands.length} enseignes signées — mode, beauté, restaurants, high-tech et plus. Cliquez pour découvrir chacune.`
        )}
      />

      {/* Filtres épurés */}
      <section className="sticky top-0 z-20 bg-cosmos-warm/90 backdrop-blur border-b border-cosmos-night/5">
        <div className="container-cosmos py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-night/40" strokeWidth={1.5} />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une enseigne…"
                className="input w-full pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2 -mb-1 overflow-x-auto">
              <FilterPill active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
                Toutes
              </FilterPill>
              {categories.map((cat) => (
                <FilterPill
                  key={cat.key}
                  active={selectedCategory === cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mur de logos */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          {filtered.length === 0 ? (
            <p className="text-center text-cosmos-night/50 font-inter font-light py-20">
              Aucune enseigne pour ce filtre.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 md:gap-3">
              {filtered.map((b, i) => (
                <Reveal key={b.slug} delay={Math.min(i, 14) * 30}>
                  <button
                    type="button"
                    onClick={() => openBrand(b)}
                    className="group w-full h-28 md:h-32 bg-white rounded-lg border border-cosmos-night/5 flex flex-col items-center justify-center px-3 text-center transition-all duration-400 hover:-translate-y-1 hover:border-cosmos-gold/40 hover:shadow-[0_16px_36px_-22px_rgb(var(--cosmos-night)/0.35)]"
                  >
                    {b.logo ? (
                      <img
                        src={b.logo}
                        alt={b.name}
                        className="max-h-10 md:max-h-12 max-w-[78%] object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-cormorant text-base md:text-lg text-cosmos-night font-light leading-tight line-clamp-2 group-hover:text-cosmos-gold transition-colors">
                        {b.name}
                      </span>
                    )}
                    <span className="mt-1.5 text-[9px] uppercase tracking-[0.14em] text-cosmos-night/40 font-inter line-clamp-1">
                      {b.category}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <StoreDetailModal store={selectedStore} onClose={() => setSelectedStore(null)} />

      {/* CTA leasing */}
      <section className="section-dark relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="container-cosmos relative z-10 text-center">
          <CosmicDivider variant="dark" className="mb-10" />
          <span className="overline mb-4 block">{c('stores.pro.overline', 'Espace Pro')}</span>
          <h2 className="section-title-light">
            {c('stores.pro.title', 'Vous voulez ouvrir une enseigne ?')}
          </h2>
          <p className="section-subtitle-light max-w-lg mx-auto">
            {c(
              'stores.pro.subtitle',
              "Rejoignez la destination qui fait déjà parler tout Angré. Notre équipe leasing vous accompagne, de l'emplacement à l'ouverture."
            )}
          </p>
          <Link to="/professionnels/devenir-enseigne" className="btn-primary">
            {c('stores.pro.cta', 'Devenir enseigne')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FilterPill: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.12em] font-inter whitespace-nowrap transition-all ${
      active
        ? 'bg-cosmos-night text-cosmos-cream'
        : 'bg-white text-cosmos-night/60 border border-cosmos-night/10 hover:border-cosmos-gold/40 hover:text-cosmos-night'
    }`}
  >
    {children}
  </button>
);

export default StoresPage;
