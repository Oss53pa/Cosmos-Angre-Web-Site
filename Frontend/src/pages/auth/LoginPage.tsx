import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CosmosLogo from '../../components/ui/CosmosLogo';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setIsLoading(false);
    if (signInError) {
      setError(signInError);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-cosmos-night flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cosmos-night via-cosmos-night/95 to-cosmos-gold/10" />
        <div className="relative z-10 px-16 max-w-lg">
          <Link to="/" className="inline-block mb-12" aria-label="Cosmos Angré — Retour à l'accueil">
            <CosmosLogo height={64} />
          </Link>
          <h1 className="font-cormorant text-5xl text-cosmos-cream font-light mb-6 leading-tight">
            {t('auth.login.brandingTitle')}
          </h1>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light leading-relaxed mb-10">
            {t('auth.login.brandingDesc')}
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-cosmos-gold/30" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cosmos-gold/60 font-inter">
              {t('auth.login.brandingTagline')}
            </span>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" aria-label="Cosmos Angré — Retour à l'accueil">
              <CosmosLogo height={48} />
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="font-cormorant text-3xl text-cosmos-cream font-light mb-2">
              {t('auth.login.title')}
            </h2>
            <p className="text-sm text-cosmos-cream/60 font-inter font-light">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-2 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-xs text-red-400 font-inter">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                {t('auth.login.email')}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.login.emailPlaceholder')}
                  className="input-dark w-full pl-11"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter">
                  {t('auth.login.password')}
                </label>
                <Link
                  to="/auth/forgot-password"
                  className="text-[10px] text-cosmos-gold/70 hover:text-cosmos-gold font-inter transition-colors"
                >
                  {t('auth.login.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.login.passwordPlaceholder')}
                  className="input-dark w-full pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cosmos-cream/30 hover:text-cosmos-cream/60 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-cosmos-gold focus:ring-cosmos-gold/30"
              />
              <label
                htmlFor="remember"
                className="text-xs text-cosmos-cream/60 font-inter font-light"
              >
                {t('auth.login.rememberMe')}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-cosmos-night border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.login.submit')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-cosmos-cream/30 font-inter uppercase tracking-wider">
              ou
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social login */}
          <button className="w-full py-3 px-4 border border-white/10 rounded-md text-sm text-cosmos-cream/60 font-inter font-light hover:border-cosmos-gold/30 hover:text-cosmos-cream transition-all flex items-center justify-center gap-3">
            {t('auth.login.continueGoogle')}
          </button>

          {/* Accès sur invitation uniquement — pas d'auto-inscription publique */}
          <p className="text-center mt-8 text-xs text-cosmos-cream/40 font-inter font-light">
            {t(
              'auth.login.inviteOnly',
              "L'accès aux espaces enseigne et centre se fait sur invitation."
            )}
          </p>

          {/* Back to site */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-[10px] text-cosmos-cream/30 hover:text-cosmos-cream/60 font-inter uppercase tracking-wider transition-colors"
            >
              {t('common.backToSite')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
