import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { setUserContext } from '../lib/monitoring/sentry';
import type { Profile, UserRole } from '../types/database';

// ============================================================
// DEV BYPASS — accès console admin sans login
// ------------------------------------------------------------
// Activé UNIQUEMENT quand :
//   1. `import.meta.env.DEV === true` (= `npm run dev`, jamais en build prod)
//   2. `localStorage.getItem('cosmos_dev_admin') === '1'`
// En production (Vercel build), import.meta.env.DEV est constant `false`,
// donc le bloc entier est éliminé par tree-shaking → 0 risque sécurité.
// ============================================================
const DEV_BYPASS_KEY = 'cosmos_dev_admin';

// ============================================================
// 🔒 LIBRE ACCÈS — DÉSACTIVÉ (lancement public)
// ------------------------------------------------------------
// Quand `true`, un profil SUPER_ADMIN factice était injecté sans connexion :
// tous les espaces (admin, enseigne, superadmin) étaient accessibles
// librement, en DEV **et** en PROD, sans mot de passe.
//
// Repassé à `false` pour le lancement public : l'accès admin passe désormais
// par la vraie authentification Supabase (LoginPage → signIn →
// supabase.auth.signInWithPassword), et les routes sont gardées par
// ProtectedRoute selon le rôle du profil.
//
// ⚠️ NE PAS REMETTRE À `true` EN PRODUCTION.
// Pour un accès console en dev local sans login : voir le DEV BYPASS
// ci-dessus (localStorage `cosmos_dev_admin = '1'`, dev uniquement).
// ============================================================
const OPEN_ACCESS = false;

const isDevBypassActive = (): boolean => {
  if (!import.meta.env.DEV) return false;
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DEV_BYPASS_KEY) === '1';
  } catch {
    return false;
  }
};

const DEV_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  email: 'dev@cosmos.local',
  first_name: 'Dev',
  last_name: 'Admin',
  phone: null,
  role: 'SUPER_ADMIN',
  avatar: null,
  store_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEV_USER = { id: DEV_PROFILE.id, email: DEV_PROFILE.email } as User;
const DEV_SESSION = { user: DEV_USER } as Session;

/** Active le bypass dev (dev uniquement). À appeler depuis le point cliquable du Footer. */
export function enableDevAdminBypass(): void {
  if (!import.meta.env.DEV) {
    console.warn('[Cosmos] Dev bypass refusé — uniquement disponible en dev local.');
    return;
  }
  try {
    localStorage.setItem(DEV_BYPASS_KEY, '1');
    console.info('[Cosmos] Dev admin bypass activé. Reload page pour appliquer.');
  } catch {
    // ignore
  }
}

/** Désactive le bypass dev (logout côté admin). */
export function disableDevAdminBypass(): void {
  try {
    localStorage.removeItem(DEV_BYPASS_KEY);
  } catch {
    // ignore
  }
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  profileError: string | null;
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    meta?: { first_name?: string; last_name?: string; phone?: string }
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: string | null }>;
  hasRole: (...roles: UserRole[]) => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    profileError: null,
  });

  const mountedRef = useRef(true);

  const fetchProfile = useCallback(
    async (userId: string): Promise<{ profile: Profile | null; error: string | null }> => {
      // Retry court : l'exposition du schéma cosmos peut être momentanément
      // indisponible (rechargement du cache PostgREST). On réessaie plutôt que
      // de renvoyer l'utilisateur à l'accueil sur une erreur transitoire.
      let lastError: string | null = null;
      for (let attempt = 0; attempt < 4; attempt++) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (!error && data) return { profile: data, error: null };
        lastError = error?.message ?? 'Profil introuvable';
        // Pas de retry si le profil n'existe simplement pas (0 ligne).
        if (error && (error as { code?: string }).code === 'PGRST116') break;
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
      return { profile: null, error: lastError };
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    if (!state.user) return;
    const { profile, error } = await fetchProfile(state.user.id);
    if (!mountedRef.current) return;
    setState((prev) => ({ ...prev, profile, profileError: error }));
  }, [state.user, fetchProfile]);

  useEffect(() => {
    mountedRef.current = true;

    // === DEV BYPASS ===
    // Si actif (dev local + flag localStorage), on injecte un profil SUPER_ADMIN
    // factice et on n'écoute PAS Supabase Auth. Bloc compilé hors prod.
    if (OPEN_ACCESS || isDevBypassActive()) {
      console.warn(
        '[Cosmos] LIBRE ACCÈS ACTIF — connecté en SUPER_ADMIN factice, sans login. Pour le désactiver : OPEN_ACCESS = false dans AuthContext.tsx.'
      );
      setState({
        session: DEV_SESSION,
        user: DEV_USER,
        profile: DEV_PROFILE,
        isLoading: false,
        profileError: null,
      });
      setUserContext({ id: DEV_PROFILE.id, email: DEV_PROFILE.email, role: DEV_PROFILE.role });
      return () => {
        mountedRef.current = false;
      };
    }
    // === /DEV BYPASS ===

    const hydrate = async (session: Session | null) => {
      if (!session?.user) {
        if (!mountedRef.current) return;
        setState({
          session: null,
          user: null,
          profile: null,
          isLoading: false,
          profileError: null,
        });
        setUserContext(null);
        return;
      }
      const { profile, error } = await fetchProfile(session.user.id);
      if (!mountedRef.current) return;
      setState({ session, user: session.user, profile, isLoading: false, profileError: error });
      setUserContext(
        profile
          ? { id: profile.id, email: profile.email, role: profile.role }
          : { id: session.user.id, email: session.user.email }
      );
    };

    supabase.auth.getSession().then(({ data }) => hydrate(data.session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      meta?: { first_name?: string; last_name?: string; phone?: string }
    ) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: meta },
      });
      return { error: error?.message ?? null };
    },
    []
  );

  const signOut = useCallback(async () => {
    // Désactive le dev bypass au passage (si actif)
    disableDevAdminBypass();
    await supabase.auth.signOut();
    if (!mountedRef.current) return;
    setState({ session: null, user: null, profile: null, isLoading: false, profileError: null });
    setUserContext(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login`,
    });
    return { error: error?.message ?? null };
  }, []);

  const updateProfile = useCallback(
    async (data: Partial<Profile>) => {
      if (!state.user) return { error: 'Non authentifié' };
      const { error } = await supabase.from('profiles').update(data).eq('id', state.user.id);
      if (!error && mountedRef.current) {
        setState((prev) => ({
          ...prev,
          profile: prev.profile ? { ...prev.profile, ...data } : null,
        }));
      }
      return { error: error?.message ?? null };
    },
    [state.user]
  );

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!state.profile) return false;
      return roles.includes(state.profile.role);
    },
    [state.profile]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        hasRole,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
