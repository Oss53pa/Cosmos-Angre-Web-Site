import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Testimonial {
  id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  rating: number;
  source: 'Google' | 'TripAdvisor' | 'Facebook' | 'Instagram' | 'Direct';
  source_url: string | null;
  locale: string;
  is_featured: boolean;
  display_order: number;
}

interface UseTestimonialsOptions {
  featuredOnly?: boolean;
  locale?: string;
  limit?: number;
}

export function useTestimonials({
  featuredOnly = false,
  locale,
  limit = 10,
}: UseTestimonialsOptions = {}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      let query = supabase
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .limit(limit);

      if (featuredOnly) query = query.eq('is_featured', true);
      if (locale) query = query.eq('locale', locale);

      const { data, error: fetchError } = await query;
      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setTestimonials([]);
      } else {
        setTestimonials((data ?? []) as Testimonial[]);
      }
      setIsLoading(false);
    };

    void fetchTestimonials();
    return () => {
      cancelled = true;
    };
  }, [featuredOnly, locale, limit]);

  return { testimonials, isLoading, error };
}
