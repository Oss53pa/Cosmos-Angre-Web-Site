import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabase';

/**
 * SiteContentProvider — CMS de contenu éditable.
 * Charge une fois toutes les paires clé→valeur de cosmos.site_content et
 * expose `c(key, fallback)`. Si la base est vide / injoignable, on retombe
 * sur le texte par défaut passé en fallback (le site reste toujours affichable).
 *
 * Deux conventions de clés cohabitent dans la même table :
 *  - clés « plates »     : ex. `home.hero.title` (gérées via /admin/contenu-site)
 *  - clés « composites » : ex. `pro-devenir-enseigne.hero.overline`
 *    (page.section.field, gérées via /admin/contenu — éditeur structuré)
 *
 * `getByPage(pageValue, fieldKey, fallback)` résout une valeur pour une page
 * donnée, qu'elle soit stockée en `page.field` ou `page.section.field`.
 */

type ContentMap = Record<string, string>;

export interface SitePage {
  key: string;
  label: string;
  path: string;
  nav_group: string;
  is_visible: boolean;
  is_custom: boolean;
  body: string | null;
  seo_description: string | null;
  sort: number;
}

interface SiteContentCtx {
  c: (key: string, fallback?: string) => string;
  getByPage: (pageValue: string, fieldKey: string, fallback?: string) => string;
  map: ContentMap;
  pages: SitePage[];
  /** true si la page (par path) est visible OU inconnue (par défaut visible). */
  isPathVisible: (path: string) => boolean;
  ready: boolean;
  reload: () => void;
}

const SiteContentContext = createContext<SiteContentCtx>({
  c: (_key, fallback = '') => fallback,
  getByPage: (_p, _k, fallback = '') => fallback,
  map: {},
  pages: [],
  isPathVisible: () => true,
  ready: false,
  reload: () => {},
});

export const useContent = () => useContext(SiteContentContext);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  // Les surcharges CMS s'appliquent en français (langue par défaut). En anglais,
  // on garde les traductions i18n (fallback) pour ne pas casser la localisation.
  const isFr = !(i18n.language || 'fr').toLowerCase().startsWith('en');
  const [map, setMap] = useState<ContentMap>({});
  const [pages, setPages] = useState<SitePage[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const anyDb = supabase as unknown as {
      from: (t: string) => {
        select: (c: string) => Promise<{ data: unknown[] | null; error: unknown }>;
      };
    };
    try {
      const { data, error } = await anyDb.from('site_content').select('key,value');
      if (!error && data) {
        const next: ContentMap = {};
        for (const row of data as { key: string; value: string | null }[]) {
          if (row.value != null && row.value !== '') next[row.key] = row.value;
        }
        setMap(next);
      }
    } catch {
      // silencieux — on garde les valeurs par défaut
    }
    try {
      const { data, error } = await anyDb
        .from('site_pages')
        .select('key,label,path,nav_group,is_visible,is_custom,body,seo_description,sort');
      if (!error && data) {
        setPages(
          (data as SitePage[])
            .slice()
            .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        );
      }
    } catch {
      // silencieux — site_pages optionnelle
    }
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const c = useCallback(
    (key: string, fallback = '') => (isFr ? map[key] ?? fallback : fallback),
    [map, isFr]
  );

  const getByPage = useCallback(
    (pageValue: string, fieldKey: string, fallback = '') => {
      if (!isFr) return fallback;
      // 1) clé plate page.field
      const direct = map[`${pageValue}.${fieldKey}`];
      if (direct != null && direct !== '') return direct;
      // 2) clé composite page.section.field (on prend la première qui matche)
      const prefix = `${pageValue}.`;
      const suffix = `.${fieldKey}`;
      for (const k of Object.keys(map)) {
        if (k.startsWith(prefix) && k.endsWith(suffix)) {
          const v = map[k];
          if (v != null && v !== '') return v;
        }
      }
      return fallback;
    },
    [map, isFr]
  );

  const isPathVisible = useCallback(
    (path: string) => {
      const p = pages.find((x) => x.path === path);
      // Page inconnue de la table => visible par défaut (ne casse rien).
      return p ? p.is_visible : true;
    },
    [pages]
  );

  return (
    <SiteContentContext.Provider
      value={{ c, getByPage, map, pages, isPathVisible, ready, reload: load }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};
