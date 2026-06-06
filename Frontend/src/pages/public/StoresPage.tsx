import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Store, ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useStores } from '../../hooks/useStores';
import StoreCard, { type StoreData } from '../../components/features/stores/StoreCard';
import StoreListItem from '../../components/features/stores/StoreListItem';
import StoreDetailModal from '../../components/features/stores/StoreDetailModal';
import StoreFilters, { type SortOption } from '../../components/features/stores/StoreFilters';
import GalaxyPageHeader from '../../components/features/galaxy/GalaxyPageHeader';
import CosmicDivider from '../../components/features/galaxy/CosmicDivider';
import GrainOverlay from '../../components/features/galaxy/GrainOverlay';

import luxuryBoutique from '../../assets/images/branding/luxury-boutique.jpg';
import sneakersStore from '../../assets/images/branding/sneakers-store.jpg';
import fashionStore from '../../assets/images/branding/fashion-store.jpg';
import techStore from '../../assets/images/branding/tech-store.jpg';
import beautyCosmetics from '../../assets/images/branding/beauty-cosmetics.jpg';
import jewelryStore from '../../assets/images/branding/jewelry-store.jpg';
import pharmacyStore from '../../assets/images/branding/pharmacy-store.jpg';
import eyewearStore from '../../assets/images/branding/eyewear-store.jpg';
import luxuryRestaurant from '../../assets/images/branding/luxury-restaurant.jpg';
import restaurantInterior from '../../assets/images/branding/restaurant-interior.jpg';
import sushiJapanese from '../../assets/images/branding/sushi-japanese.jpg';
import italianRestaurant from '../../assets/images/branding/italian-restaurant.jpg';
import fineDiningFood from '../../assets/images/branding/fine-dining-food.jpg';
import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';

const StoresPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedZone, setSelectedZone] = useState(searchParams.get('zone') || 'all');
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name');
  // Filter spécial : 'offres' (boutiques avec currentOffers), 'nouveau' (récentes)
  const [contentFilter, setContentFilter] = useState<'all' | 'offres' | 'nouveau'>(
    (searchParams.get('filter') as 'offres' | 'nouveau') ?? 'all'
  );
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  const categories = [
    { key: 'fashion', label: t('stores.categories.fashion') },
    { key: 'beauty', label: t('stores.categories.beauty') },
    { key: 'electronics', label: t('stores.categories.electronics') },
    { key: 'restaurants', label: t('stores.categories.restaurants') },
    { key: 'foodCourt', label: t('stores.categories.foodCourt') },
    { key: 'supermarket', label: t('stores.categories.supermarket') },
    { key: 'jewelry', label: t('stores.categories.jewelry') },
    { key: 'services', label: t('stores.categories.services') },
    { key: 'bigBox', label: t('stores.categories.bigBox') },
  ];

  const zones = [
    { key: 'gallery', label: t('storeDirectory.zones.gallery') },
    { key: 'foodCourt', label: t('storeDirectory.zones.foodCourt') },
    { key: 'restaurants', label: t('storeDirectory.zones.restaurants') },
    { key: 'bigBox', label: t('storeDirectory.zones.bigBox') },
    { key: 'supermarket', label: t('storeDirectory.zones.supermarket') },
  ];

  const mockStores: StoreData[] = [
    // Supermarché
    {
      id: '1', name: 'Carrefour Market', categoryKey: 'supermarket', category: t('stores.categories.supermarket'),
      zone: t('storeDirectory.zones.supermarket'), zoneKey: 'supermarket', locationCode: 'C14 — 2 216 m²',
      hours: 'Lun-Dim: 8h-21h', phone: '+225 27 22 00 01 01',
      description: t('storeDirectory.stores.carrefour.description'),
      rating: 4.5, image: galleryInterior,
    },
    // Mode & Chaussures
    {
      id: '2', name: 'Nike Store', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C1 — 85 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 10 10',
      description: t('storeDirectory.stores.nike.description'),
      rating: 4.8, image: sneakersStore,
      currentOffers: [t('storeDirectory.stores.nike.offer1')],
    },
    {
      id: '3', name: 'Zara', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C2 — 120 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 20 20',
      description: t('storeDirectory.stores.zara.description'),
      rating: 4.6, image: fashionStore,
      currentOffers: [t('storeDirectory.stores.zara.offer1')],
    },
    {
      id: '4', name: 'Mango', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C3 — 95 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 03 03',
      description: t('storeDirectory.stores.mango.description'),
      rating: 4.4, image: fashionStore,
    },
    {
      id: '5', name: 'Adidas', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C4 — 78 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 04 04',
      description: t('storeDirectory.stores.adidas.description'),
      rating: 4.7, image: sneakersStore,
    },
    {
      id: '6', name: 'LC Waikiki', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C5 — 160 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 05 05',
      description: t('storeDirectory.stores.lcWaikiki.description'),
      rating: 4.3, image: fashionStore,
    },
    {
      id: '7', name: 'Kiabi', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C6 — 130 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 06 06',
      description: t('storeDirectory.stores.kiabi.description'),
      rating: 4.2, image: fashionStore,
    },
    {
      id: '8', name: 'Celio', categoryKey: 'fashion', category: t('stores.categories.fashion'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C7 — 70 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 07 07',
      description: t('storeDirectory.stores.celio.description'),
      rating: 4.1, image: fashionStore,
    },
    // Tech / Multimédia
    {
      id: '9', name: 'Tech Paradise', categoryKey: 'electronics', category: t('stores.categories.electronics'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C8 — 148 m²',
      hours: 'Lun-Sam: 10h-20h', phone: '+225 27 22 00 30 30',
      description: t('storeDirectory.stores.techParadise.description'),
      rating: 4.3, image: techStore,
    },
    {
      id: '10', name: 'iStore', categoryKey: 'electronics', category: t('stores.categories.electronics'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C10 — 90 m²',
      hours: 'Lun-Sam: 10h-20h', phone: '+225 27 22 00 10 30',
      description: t('storeDirectory.stores.iStore.description'),
      rating: 4.5, image: techStore,
    },
    // Beauté
    {
      id: '11', name: 'Beauty Corner', categoryKey: 'beauty', category: t('stores.categories.beauty'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C16 — 65 m²',
      hours: 'Lun-Dim: 9h30-20h30', phone: '+225 27 22 00 40 40',
      description: t('storeDirectory.stores.beautyCorner.description'),
      rating: 4.2, image: beautyCosmetics,
      currentOffers: [t('storeDirectory.stores.beautyCorner.offer1')],
    },
    {
      id: '12', name: 'Sephora', categoryKey: 'beauty', category: t('stores.categories.beauty'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C17 — 110 m²',
      hours: 'Lun-Dim: 9h-21h', phone: '+225 27 22 00 17 17',
      description: t('storeDirectory.stores.sephora.description'),
      rating: 4.6, image: beautyCosmetics,
    },
    // Bijoux
    {
      id: '13', name: 'Bijouterie Prestige', categoryKey: 'jewelry', category: t('stores.categories.jewelry'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C18 — 45 m²',
      hours: 'Mar-Dim: 10h-20h', phone: '+225 27 22 00 50 50',
      description: t('storeDirectory.stores.bijouteriePrestige.description'),
      rating: 4.9, image: jewelryStore,
    },
    {
      id: '14', name: 'Or & Diamant', categoryKey: 'jewelry', category: t('stores.categories.jewelry'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C19 — 40 m²',
      hours: 'Mar-Dim: 10h-20h', phone: '+225 27 22 00 19 19',
      description: t('storeDirectory.stores.orDiamant.description'),
      rating: 4.7, image: jewelryStore,
    },
    // Services
    {
      id: '15', name: 'Pharmacie du Centre', categoryKey: 'services', category: t('stores.categories.services'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C20 — 640 m²',
      hours: 'Lun-Dim: 8h-22h', phone: '+225 27 22 00 70 70',
      description: t('storeDirectory.stores.pharmacie.description'),
      rating: 4.8, image: pharmacyStore,
    },
    {
      id: '16', name: 'Optique Vision', categoryKey: 'services', category: t('stores.categories.services'),
      zone: t('storeDirectory.zones.gallery'), zoneKey: 'gallery', locationCode: 'C21 — 297 m²',
      hours: 'Lun-Sam: 9h-20h', phone: '+225 27 22 00 80 80',
      description: t('storeDirectory.stores.optiqueVision.description'),
      rating: 4.7, image: eyewearStore,
      currentOffers: [t('storeDirectory.stores.optiqueVision.offer1')],
    },
    // Restaurants
    {
      id: '17', name: 'Le Cosmos', categoryKey: 'restaurants', category: t('stores.categories.restaurants'),
      zone: t('storeDirectory.zones.restaurants'), zoneKey: 'restaurants', locationCode: 'R1',
      hours: 'Lun-Dim: 11h-23h', phone: '+225 27 22 00 91 91',
      description: t('storeDirectory.stores.leCosmos.description'),
      rating: 4.8, image: luxuryRestaurant,
    },
    {
      id: '18', name: 'La Brasserie', categoryKey: 'restaurants', category: t('stores.categories.restaurants'),
      zone: t('storeDirectory.zones.restaurants'), zoneKey: 'restaurants', locationCode: 'R2',
      hours: 'Lun-Dim: 11h-23h', phone: '+225 27 22 00 92 92',
      description: t('storeDirectory.stores.laBrasserie.description'),
      rating: 4.6, image: restaurantInterior,
    },
    {
      id: '19', name: 'Sakura Sushi', categoryKey: 'restaurants', category: t('stores.categories.restaurants'),
      zone: t('storeDirectory.zones.restaurants'), zoneKey: 'restaurants', locationCode: 'R3',
      hours: 'Lun-Dim: 11h-22h', phone: '+225 27 22 00 93 93',
      description: t('storeDirectory.stores.sakura.description'),
      rating: 4.5, image: sushiJapanese,
    },
    {
      id: '20', name: 'Trattoria Bella', categoryKey: 'restaurants', category: t('stores.categories.restaurants'),
      zone: t('storeDirectory.zones.restaurants'), zoneKey: 'restaurants', locationCode: 'R4',
      hours: 'Lun-Dim: 11h-22h', phone: '+225 27 22 00 94 94',
      description: t('storeDirectory.stores.trattoriaBella.description'),
      rating: 4.4, image: italianRestaurant,
    },
    // Food Court
    {
      id: '21', name: 'Grillades d\'Afrique', categoryKey: 'foodCourt', category: t('stores.categories.foodCourt'),
      zone: t('storeDirectory.zones.foodCourt'), zoneKey: 'foodCourt', locationCode: 'FC3',
      hours: 'Lun-Dim: 10h-21h', phone: '+225 27 22 00 95 95',
      description: t('storeDirectory.stores.grilladesAfrique.description'),
      rating: 4.3, image: fineDiningFood,
    },
    {
      id: '22', name: 'Asia Bowl', categoryKey: 'foodCourt', category: t('stores.categories.foodCourt'),
      zone: t('storeDirectory.zones.foodCourt'), zoneKey: 'foodCourt', locationCode: 'FC4',
      hours: 'Lun-Dim: 10h-21h', phone: '+225 27 22 00 96 96',
      description: t('storeDirectory.stores.asiaBowl.description'),
      rating: 4.2, image: sushiJapanese,
    },
  ];

  // Sync filters to URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedZone !== 'all') params.zone = selectedZone;
    if (sortBy !== 'name') params.sort = sortBy;
    if (contentFilter !== 'all') params.filter = contentFilter;
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategory, selectedZone, sortBy, contentFilter, setSearchParams]);

  // Fetch stores actives depuis Supabase. Si vide (env placeholder ou table vide),
  // on retombe sur les mocks pour que la page reste affichable hors ligne.
  const { stores: supabaseStores, isLoading: isLoadingStores } = useStores({ status: 'active' });

  const stores: StoreData[] = useMemo(() => {
    if (supabaseStores.length === 0) return mockStores;

    const fallbackImages = [
      galleryInterior, sneakersStore, fashionStore, techStore, beautyCosmetics,
      jewelryStore, pharmacyStore, eyewearStore, luxuryRestaurant, restaurantInterior,
      sushiJapanese, italianRestaurant, fineDiningFood, luxuryBoutique,
    ];

    return supabaseStores.map((s, i) => ({
      id: s.slug ?? s.id,
      name: s.name,
      categoryKey: s.category_key ?? 'all',
      category: s.category ?? '',
      zone: s.zone ?? '',
      zoneKey: s.zone_key ?? 'gallery',
      locationCode: s.location_code ?? '',
      hours: s.hours ?? '',
      phone: s.phone ?? '',
      description: s.description ?? '',
      rating: s.rating ?? 0,
      image: s.cover_image ?? fallbackImages[i % fallbackImages.length] ?? galleryInterior,
    }));
  }, [supabaseStores, mockStores]);

  const hasActiveFilters =
    searchTerm !== '' || selectedCategory !== 'all' || selectedZone !== 'all' || contentFilter !== 'all';

  const filteredStores = useMemo(() => {
    const result = stores.filter((store) => {
      const matchesSearch = searchTerm === '' ||
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || store.categoryKey === selectedCategory;
      const matchesZone = selectedZone === 'all' || store.zoneKey === selectedZone;
      const matchesContent =
        contentFilter === 'all' ||
        (contentFilter === 'offres' && Array.isArray(store.currentOffers) && store.currentOffers.length > 0) ||
        (contentFilter === 'nouveau' && store.rating >= 4.5); // proxy : "nouveautés" = top notées
      return matchesSearch && matchesCategory && matchesZone && matchesContent;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'category': return a.category.localeCompare(b.category);
        case 'zone': return a.zoneKey.localeCompare(b.zoneKey);
        case 'rating': return b.rating - a.rating;
        default: return 0;
      }
    });

    return result;
  }, [searchTerm, selectedCategory, selectedZone, sortBy, contentFilter, stores]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedZone('all');
    setSortBy('name');
    setContentFilter('all');
  };

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Les Enseignes"
        description="Plus de 80 enseignes à Cosmos Angré : mode, beauté, gastronomie, tech, joaillerie et bien plus. Cherchez, filtrez, et trouvez la vôtre au cœur d'Angré, Cocody."
        keywords={['enseignes Cosmos Angré', 'boutiques Cocody', 'mode Abidjan', 'shopping Angré', "Côte d'Ivoire"]}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Boutiques', url: '/boutiques' },
        ])}
      />
      {/* Hero galaxie */}
      <GalaxyPageHeader
        overline="Les Enseignes"
        title="Vos marques préférées,"
        titleAccent="réunies."
        subtitle={`${stores.length} enseignes à explorer. Mode, beauté, tech, gastronomie, maison. Cherchez, filtrez, et trouvez la vôtre en un clin d'œil.`}
      />

      {/* Bandeau filtre actif (offres / nouveautés) */}
      {contentFilter !== 'all' && (
        <div className="bg-cosmos-gold/10 border-y border-cosmos-gold/30">
          <div className="container-cosmos py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-cosmos-night font-inter font-medium">
              {contentFilter === 'offres'
                ? 'Les enseignes avec une offre en ce moment'
                : 'Les nouveautés du moment'}
              <span className="ml-2 text-cosmos-text/60 font-light">
                · {filteredStores.length} enseigne{filteredStores.length > 1 ? 's' : ''}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setContentFilter('all')}
              className="text-xs text-cosmos-night/70 hover:text-cosmos-gold underline underline-offset-4 font-inter"
            >
              Voir toutes
            </button>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <section className="py-6 md:py-8 bg-white border-b border-cosmos-cream">
        <div className="container-cosmos">
          <StoreFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            resultCount={filteredStores.length}
            totalCount={stores.length}
            onReset={handleReset}
            categories={categories}
            zones={zones}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </section>

      {/* Stores Grid/List */}
      <section className="py-16 bg-cosmos-warm">
        <div className="container-cosmos">
          {isLoadingStores && supabaseStores.length === 0 && filteredStores.length === 0 ? (
            <div
              role="status"
              aria-label={t('stores.loading', 'Chargement des boutiques')}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-cosmos-cream/40 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-cosmos-text/10" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-cosmos-text/10 rounded w-3/4" />
                    <div className="h-3 bg-cosmos-text/10 rounded w-1/2" />
                    <div className="h-3 bg-cosmos-text/10 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20 bg-cosmos-cream/40 rounded-lg">
              <Store className="w-10 h-10 text-cosmos-text/40 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-cosmos-text/60 font-inter font-light">{t('stores.noResults')}</p>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="mt-4 text-sm text-cosmos-gold font-inter font-medium hover:underline"
                >
                  {t('storeDirectory.resetFilters')}
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              <AnimatePresence mode="popLayout">
                {filteredStores.map((store, index) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    index={index}
                    onClick={setSelectedStore}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredStores.map((store, index) => (
                  <StoreListItem
                    key={store.id}
                    store={store}
                    index={index}
                    onClick={setSelectedStore}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Store Detail Modal */}
      <StoreDetailModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
      />

      {/* CTA leasing */}
      <section className="py-20 bg-cosmos-night relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="container-cosmos relative z-10 text-center">
          <CosmicDivider variant="dark" className="mb-10" />
          <span className="overline mb-4 block">Espace Pro</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">
            Vous voulez ouvrir une enseigne ?
          </h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            Rejoignez la destination qui fait déjà parler tout Angré. Notre équipe leasing
            vous accompagne, de l'emplacement à l'ouverture.
          </p>
          <Link to="/professionnels/devenir-enseigne" className="btn-primary">
            Devenir enseigne
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StoresPage;
