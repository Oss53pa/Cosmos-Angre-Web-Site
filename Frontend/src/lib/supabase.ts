import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const PLACEHOLDER_VALUES = new Set([
  '',
  'your-anon-key',
  'placeholder-key',
  'https://your-project.supabase.co',
  'https://placeholder.supabase.co',
]);

const isPlaceholder = (v: string | undefined) => !v || PLACEHOLDER_VALUES.has(v);

if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  const message =
    '[Cosmos] Variables Supabase manquantes ou invalides. ' +
    'Renseigne VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env.local ' +
    "(voir .env.example). Les requêtes Supabase échoueront jusqu'à configuration.";

  // On log très bruyamment (prod ET dev) mais on ne THROW PAS :
  // - les hooks gèrent l'erreur via leur state `error`
  // - les pages publiques retombent sur leurs mocks (StoresPage, TestimonialsSection)
  // - faire crasher l'app entière ferait perdre la SEO + UX statique
  console.error(message);
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: { 'x-client-info': 'cosmos-angre-web' },
    },
  }
);
