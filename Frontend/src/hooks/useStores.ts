import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Store, StoreInsert, StoreUpdate, StoreStatus } from '../types/database';

interface UseStoresOptions {
  status?: StoreStatus;
  category?: string;
  search?: string;
  ownerId?: string;
}

export function useStores(options: UseStoresOptions = {}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('stores').select('*');

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.ownerId) {
        query = query.eq('owner_id', options.ownerId);
      }

      if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
      }

      query = query.order('name', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setStores(data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [options.status, options.category, options.search, options.ownerId]);

  const createStore = async (store: StoreInsert) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('stores').insert(store);

      if (insertError) {
        setError(insertError.message);
      } else {
        await fetchStores();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStore = async (id: string, updates: StoreUpdate) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.from('stores').update(updates).eq('id', id);

      if (updateError) {
        setError(updateError.message);
      } else {
        await fetchStores();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteStore = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.from('stores').delete().eq('id', id);

      if (deleteError) {
        setError(deleteError.message);
      } else {
        await fetchStores();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return {
    stores,
    isLoading,
    error,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
  };
}
