import { useEffect, useState, useCallback } from 'react';
import { useContent } from '../lib/content/SiteContentProvider';

/**
 * Hook qui lit le contenu éditable d'une page.
 *
 * Source de vérité : cosmos.site_content (via SiteContentProvider), avec des
 * clés composites `page.section.field` écrites par la console `/admin/contenu`.
 * Repli hors-ligne : localStorage (`cosmos-content-<pageValue>`), au cas où la
 * base est injoignable.
 *
 * Usage côté page publique :
 *   const get = useEditableContent('pro-devenir-enseigne');
 *   const title = get('title', 'Titre par défaut');
 *
 * Le champ est résolu d'abord en base (`page.field` puis `page.section.field`),
 * sinon en localStorage, sinon le fallback (texte hardcodé FR) est retourné.
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

/** Cherche une valeur dans un objet localStorage (clé plate OU composite). */
function findLocal(fields: FieldMap, pageValue: string, key: string): string | undefined {
  // clé plate
  if (fields[key] && fields[key].trim().length > 0) return fields[key];
  // clé composite page.field
  const direct = fields[`${pageValue}.${key}`];
  if (direct && direct.trim().length > 0) return direct;
  // clé composite page.section.field
  const prefix = `${pageValue}.`;
  const suffix = `.${key}`;
  for (const k of Object.keys(fields)) {
    if (k.startsWith(prefix) && k.endsWith(suffix) && fields[k] && fields[k].trim().length > 0) {
      return fields[k];
    }
  }
  return undefined;
}

export function useEditableContent(pageValue: string) {
  const { getByPage } = useContent();
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

  /** Récupère une valeur éditable : Supabase → localStorage → fallback. */
  const get = useCallback(
    (key: string, fallback: string): string => {
      const local = findLocal(fields, pageValue, key);
      // Supabase est prioritaire ; sinon localStorage ; sinon fallback codé.
      return getByPage(pageValue, key, local ?? fallback);
    },
    [fields, getByPage, pageValue]
  );

  return get;
}
