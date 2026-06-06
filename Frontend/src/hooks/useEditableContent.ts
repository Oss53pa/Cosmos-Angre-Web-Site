import { useEffect, useState, useCallback } from 'react';

/**
 * Hook qui lit le contenu éditable depuis localStorage (clé `cosmos-content-<pageValue>`)
 * persisté par la console admin `/admin/contenu`.
 *
 * Usage côté page publique :
 *   const get = useEditableContent('devenir-enseigne');
 *   const title = get('hero_title', 'Titre par défaut');
 *
 * Si le champ n'existe pas en localStorage OU si la valeur est vide, le fallback
 * (souvent un texte hardcodé en FR) est retourné. Permet une dégradation gracieuse.
 */
const STORAGE_PREFIX = 'cosmos-content-';

type FieldMap = Record<string, string>;

function loadFromStorage(pageValue: string): FieldMap {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + pageValue);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object') return parsed as FieldMap;
  } catch {
    // ignore
  }
  return {};
}

export function useEditableContent(pageValue: string) {
  const [fields, setFields] = useState<FieldMap>(() => loadFromStorage(pageValue));

  // Re-sync si le user modifie depuis l'admin pendant qu'une autre fenêtre affiche la page
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_PREFIX + pageValue) {
        setFields(loadFromStorage(pageValue));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [pageValue]);

  /** Récupère une valeur éditable, ou retombe sur le fallback si vide/absente. */
  const get = useCallback(
    (key: string, fallback: string): string => {
      const v = fields[key];
      return v && v.trim().length > 0 ? v : fallback;
    },
    [fields]
  );

  return get;
}
