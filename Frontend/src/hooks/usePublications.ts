import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  Publication,
  PublicationInsert,
  PublicationUpdate,
  PublicationStatus,
} from '../types/database';

interface PublicationFilters {
  storeId?: string;
  status?: PublicationStatus;
}

export function usePublications(filters?: PublicationFilters) {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.storeId) {
        query = query.eq('store_id', filters.storeId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPublications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.storeId, filters?.status]);

  const createPublication = useCallback(
    async (data: PublicationInsert) => {
      setError(null);

      try {
        const { error: insertError } = await supabase.from('publications').insert(data);

        if (insertError) throw insertError;
        await fetchPublications();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchPublications]
  );

  const updatePublication = useCallback(
    async (id: string, data: PublicationUpdate) => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from('publications')
          .update(data)
          .eq('id', id);

        if (updateError) throw updateError;
        await fetchPublications();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchPublications]
  );

  const deletePublication = useCallback(
    async (id: string) => {
      setError(null);

      try {
        const { error: deleteError } = await supabase.from('publications').delete().eq('id', id);

        if (deleteError) throw deleteError;
        await fetchPublications();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchPublications]
  );

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  return {
    publications,
    isLoading,
    error,
    fetchPublications,
    createPublication,
    updatePublication,
    deletePublication,
  };
}
