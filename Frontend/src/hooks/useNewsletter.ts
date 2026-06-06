import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type {
  NewsletterSubscriber,
  NewsletterSubscriberInsert,
  NewsletterStatus,
} from '../types/database';

interface NewsletterFilters {
  status?: NewsletterStatus;
  search?: string;
}

export function useNewsletter(filters?: NewsletterFilters) {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setSubscribers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.search]);

  const subscribe = useCallback(
    async (email: string, name?: string) => {
      setError(null);

      try {
        const { error: upsertError } = await supabase
          .from('newsletter_subscribers')
          .upsert({ email, name, status: 'active' }, { onConflict: 'email' });

        if (upsertError) throw upsertError;
        await fetchSubscribers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchSubscribers]
  );

  const updateSubscriber = useCallback(
    async (id: string, data: Partial<NewsletterSubscriberInsert>) => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update(data)
          .eq('id', id);

        if (updateError) throw updateError;
        await fetchSubscribers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchSubscribers]
  );

  const deleteSubscriber = useCallback(
    async (id: string) => {
      setError(null);

      try {
        const { error: deleteError } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        await fetchSubscribers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchSubscribers]
  );

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  return {
    subscribers,
    isLoading,
    error,
    fetchSubscribers,
    subscribe,
    updateSubscriber,
    deleteSubscriber,
  };
}
