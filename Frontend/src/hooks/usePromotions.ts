import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Promotion, PromotionInsert, PromotionUpdate } from '../types/database';

interface PromotionFilters {
  storeId?: string;
  isActive?: boolean;
}

export function usePromotions(filters?: PromotionFilters) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPromotions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('promotions').select('*').order('created_at', { ascending: false });

      if (filters?.storeId) {
        query = query.eq('store_id', filters.storeId);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq('is_active', filters.isActive);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setPromotions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.storeId, filters?.isActive]);

  const createPromotion = useCallback(
    async (data: PromotionInsert) => {
      setError(null);

      try {
        const { error: insertError } = await supabase.from('promotions').insert(data);

        if (insertError) throw insertError;
        await fetchPromotions();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchPromotions]
  );

  const updatePromotion = useCallback(
    async (id: string, data: PromotionUpdate) => {
      setError(null);

      try {
        const { error: updateError } = await supabase.from('promotions').update(data).eq('id', id);

        if (updateError) throw updateError;
        await fetchPromotions();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchPromotions]
  );

  const deletePromotion = useCallback(
    async (id: string) => {
      setError(null);

      try {
        const { error: deleteError } = await supabase.from('promotions').delete().eq('id', id);

        if (deleteError) throw deleteError;
        await fetchPromotions();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchPromotions]
  );

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return {
    promotions,
    isLoading,
    error,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
}
