import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Grid,
  List,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  MapPin,
  Tag,
  X,
} from 'lucide-react';

export type SortOption = 'name' | 'category' | 'zone' | 'rating';

interface StoreFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedZone: string;
  onZoneChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  resultCount: number;
  totalCount: number;
  onReset: () => void;
  categories: { key: string; label: string }[];
  zones: { key: string; label: string }[];
  hasActiveFilters: boolean;
}

const StoreFilters: React.FC<StoreFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedZone,
  onZoneChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  resultCount,
  totalCount,
  onReset,
  categories,
  zones,
  hasActiveFilters,
}) => {
  const { t } = useTranslation();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterCount = (selectedCategory !== 'all' ? 1 : 0) + (selectedZone !== 'all' ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Row 1: Search + Sort + View Toggle */}
      <div className="flex gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-gold"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('stores.searchPlaceholder')}
            className="input pl-12 pr-10 w-full"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-cosmos-night transition-colors"
            >
              <X className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative hidden md:block">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none text-xs font-inter font-light border border-cosmos-cream rounded-md pl-9 pr-8 py-3 bg-white text-cosmos-night focus:outline-none focus:border-cosmos-gold cursor-pointer"
          >
            <option value="name">{t('storeDirectory.sortAZ')}</option>
            <option value="category">{t('storeDirectory.sortCategory')}</option>
            <option value="zone">{t('storeDirectory.sortZone')}</option>
            <option value="rating">{t('storeDirectory.sortRating')}</option>
          </select>
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary pointer-events-none"
            strokeWidth={1.5}
          />
          <ChevronDown
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-secondary pointer-events-none"
            strokeWidth={1.5}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className={`md:hidden flex items-center gap-2 px-4 py-3 border rounded-md transition-all ${
            showMobileFilters || activeFilterCount > 0
              ? 'border-cosmos-gold bg-cosmos-gold/5 text-cosmos-night'
              : 'border-cosmos-cream text-text-secondary'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-cosmos-gold text-cosmos-night text-[10px] font-medium rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* View Toggle */}
        <div className="flex border border-cosmos-cream rounded-md overflow-hidden flex-shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-cosmos-night text-cosmos-cream' : 'text-text-secondary hover:bg-cosmos-cream'}`}
          >
            <Grid className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-3 transition-colors ${viewMode === 'list' ? 'bg-cosmos-night text-cosmos-cream' : 'text-text-secondary hover:bg-cosmos-cream'}`}
          >
            <List className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Row 2: Category Filters (desktop always, mobile toggleable) */}
      <div className={`space-y-4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        {/* Categories */}
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-1.5 pt-2 flex-shrink-0">
            <Tag className="w-3.5 h-3.5 text-cosmos-gold" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter font-medium whitespace-nowrap">
              {t('storeDirectory.categoryLabel', 'Categorie')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onCategoryChange('all')}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-inter font-light rounded-full transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cosmos-night text-cosmos-cream'
                  : 'bg-cosmos-cream/80 text-text-secondary hover:bg-cosmos-night hover:text-cosmos-cream'
              }`}
            >
              {t('stores.allCategories')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => onCategoryChange(cat.key)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-inter font-light rounded-full transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-cosmos-night text-cosmos-cream'
                    : 'bg-cosmos-cream/80 text-text-secondary hover:bg-cosmos-night hover:text-cosmos-cream'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Zones */}
        <div className="flex items-start gap-3">
          <div className="flex items-center gap-1.5 pt-2 flex-shrink-0">
            <MapPin className="w-3.5 h-3.5 text-cosmos-gold" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter font-medium whitespace-nowrap">
              {t('storeDirectory.zoneLabel', 'Zone')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => onZoneChange('all')}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-inter font-light rounded-full border transition-all ${
                selectedZone === 'all'
                  ? 'border-cosmos-gold bg-cosmos-gold/10 text-cosmos-night'
                  : 'border-cosmos-cream bg-white text-text-secondary hover:border-cosmos-gold hover:bg-cosmos-gold/5'
              }`}
            >
              {t('storeDirectory.allZones')}
            </button>
            {zones.map((zone) => (
              <button
                key={zone.key}
                onClick={() => onZoneChange(zone.key)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.08em] font-inter font-light rounded-full border transition-all ${
                  selectedZone === zone.key
                    ? 'border-cosmos-gold bg-cosmos-gold/10 text-cosmos-night'
                    : 'border-cosmos-cream bg-white text-text-secondary hover:border-cosmos-gold hover:bg-cosmos-gold/5'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Sort (only visible when filters open on mobile) */}
        <div className="md:hidden flex items-center gap-3">
          <SlidersHorizontal
            className="w-3.5 h-3.5 text-cosmos-gold flex-shrink-0"
            strokeWidth={1.5}
          />
          <span className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter font-medium">
            {t('storeDirectory.sortLabel', 'Tri')}
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="flex-1 text-xs font-inter font-light border border-cosmos-cream rounded-full px-3 py-1.5 bg-white text-cosmos-night focus:outline-none focus:border-cosmos-gold"
          >
            <option value="name">{t('storeDirectory.sortAZ')}</option>
            <option value="category">{t('storeDirectory.sortCategory')}</option>
            <option value="zone">{t('storeDirectory.sortZone')}</option>
            <option value="rating">{t('storeDirectory.sortRating')}</option>
          </select>
        </div>
      </div>

      {/* Row 3: Results count + Active filters + Reset */}
      <div className="flex items-center justify-between pt-1 border-t border-cosmos-cream/50">
        <div className="flex items-center gap-3">
          <p className="text-sm text-cosmos-night font-inter font-light">
            <span className="font-medium">{resultCount}</span>
            <span className="text-text-secondary">
              {' '}
              / {totalCount} {t('storeDirectory.storeLabel', 'enseigne')}
              {totalCount > 1 ? 's' : ''}
            </span>
          </p>

          {/* Active filter tags */}
          {hasActiveFilters && (
            <div className="hidden sm:flex items-center gap-1.5">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cosmos-cream rounded-full text-[10px] text-cosmos-night font-inter">
                  "{searchTerm}"
                  <button
                    onClick={() => onSearchChange('')}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" strokeWidth={2} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cosmos-night/10 rounded-full text-[10px] text-cosmos-night font-inter">
                  {categories.find((c) => c.key === selectedCategory)?.label}
                  <button
                    onClick={() => onCategoryChange('all')}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" strokeWidth={2} />
                  </button>
                </span>
              )}
              {selectedZone !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cosmos-gold/15 rounded-full text-[10px] text-cosmos-night font-inter">
                  {zones.find((z) => z.key === selectedZone)?.label}
                  <button
                    onClick={() => onZoneChange('all')}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-2.5 h-2.5" strokeWidth={2} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-[11px] text-cosmos-gold font-inter font-medium uppercase tracking-[0.08em] hover:text-cosmos-night transition-colors"
          >
            <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
            {t('storeDirectory.resetFilters')}
          </button>
        )}
      </div>
    </div>
  );
};

export default StoreFilters;
