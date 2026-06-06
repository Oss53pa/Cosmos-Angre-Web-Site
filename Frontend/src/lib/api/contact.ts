import { supabase } from '../supabase';

export interface ContactInput {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  /** Honeypot — ne JAMAIS afficher dans le formulaire visible. */
  website?: string;
}

export interface NewsletterInput {
  email: string;
  name?: string;
  source?: string;
  website?: string;
}

interface ApiResponse {
  ok: boolean;
  error?: string;
  retryAfter?: number;
}

/**
 * Soumet le formulaire contact via l'Edge Function.
 * Validation côté serveur (rate limit, honeypot, champs).
 */
export async function submitContact(input: ContactInput): Promise<ApiResponse> {
  const { data, error } = await supabase.functions.invoke<ApiResponse>('contact-submit', {
    body: input,
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return data ?? { ok: false, error: 'Empty response' };
}

/**
 * Inscrit un email à la newsletter via l'Edge Function.
 */
export async function subscribeNewsletter(input: NewsletterInput): Promise<ApiResponse> {
  const { data, error } = await supabase.functions.invoke<ApiResponse>('newsletter-subscribe', {
    body: input,
  });
  if (error) return { ok: false, error: error.message };
  return data ?? { ok: false, error: 'Empty response' };
}
