import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { supabase } from '../supabase';

/**
 * SiteContentProvider — CMS de contenu éditable.
 * Charge une fois toutes les paires clé→valeur de cosmos.site_content et
 * expose `c(key, fallback)`. Si la base est vide / injoignable, on retombe
 * sur le texte par défaut passé en fallback (le site reste toujours affichable).
 */

type ContentMap = Record<string, string>;

interface SiteContentCtx {
  c: (key: string, fallback?: string) => string;
  ready: boolean;
  reload: () => void;
}

const SiteContentContext = createContext<SiteContentCtx>({
  c: (_key, fallback = '') => fallback,
  ready: false,
  reload: () => {},
});

export const useContent = () => useContext(SiteContentContext);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [map, setMap] = useState<ContentMap>({});
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    try {
      // site_content vit dans le schéma cosmos (hors typage Database public)
      const { data, error } = await (supabase as unknown as {
        from: (t: string) => {
          select: (c: string) => Promise<{
            data: { key: string; value: string | null }[] | null;
            error: unknown;
          }>;
        };
      })
        .from('site_content')
        .select('key,value');

      if (!error && data) {
        const next: ContentMap = {};
        for (const row of data) {
          if (row.value != null && row.value !== '') next[row.key] = row.value;
        }
        setMap(next);
      }
    } catch {
      // silencieux — on garde les valeurs par défaut
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const c = useCallback(
    (key: string, fallback = '') => map[key] ?? fallback,
    [map]
  );

  return (
    <SiteContentContext.Provider value={{ c, ready, reload: load }}>
      {children}
    </SiteContentContext.Provider>
  );
};
