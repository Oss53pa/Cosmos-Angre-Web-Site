import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeNewsletter } from '../../lib/api/contact';
import CosmosLogo from '../../components/ui/CosmosLogo';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: true,
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.passwordMismatch', 'Les mots de passe ne correspondent pas'));
      return;
    }
    setIsLoading(true);
    setError(null);
    const { error: signUpError } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
    });
    if (signUpError) {
      setIsLoading(false);
      setError(signUpError);
      return;
    }
    // Newsletter opt-in — via l'Edge Function (rate-limit + honeypot) plutôt
    // qu'un insert anon direct.
    if (formData.newsletter) {
      await subscribeNewsletter({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        source: 'registration',
      });
    }
    setIsLoading(false);
    navigate('/');
  };

  const benefits = t('auth.register.benefits', { returnObjects: true }) as string[];

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
            {t('auth.register.brandingTitle')
              .split('\n')
              .map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && <br />}
                </React.Fragment>
              ))}
          </h1>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light leading-relaxed mb-10">
            {t('auth.register.brandingDesc')}
          </p>

          <div className="space-y-4 mb-10">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-cosmos-gold/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-cosmos-gold" strokeWidth={2} />
                </div>
                <span className="text-sm text-cosmos-cream/60 font-inter font-light">
                  {benefit}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-cosmos-gold/30" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cosmos-gold/60 font-inter">
              {t('auth.register.brandingTagline')}
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

          <div className="mb-8">
            <h2 className="font-cormorant text-3xl text-cosmos-cream font-light mb-2">
              {t('auth.register.title')}
            </h2>
            <p className="text-sm text-cosmos-cream/60 font-inter font-light">
              {t('auth.register.subtitle')}
            </p>
          </div>

          {error && (
            <div className="p-3 mb-2 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-xs text-red-400 font-inter">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                  {t('auth.register.firstName')}
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder={t('auth.register.firstNamePlaceholder')}
                    className="input-dark w-full pl-11"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                  {t('auth.register.lastName')}
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder={t('auth.register.lastNamePlaceholder')}
                  className="input-dark w-full"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                {t('auth.register.email')}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder={t('auth.register.emailPlaceholder')}
                  className="input-dark w-full pl-11"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                {t('auth.register.phone')}
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder={t('auth.register.phonePlaceholder')}
                  className="input-dark w-full pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                {t('auth.register.password')}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={t('auth.register.passwordPlaceholder')}
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

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter block mb-2">
                {t('auth.register.confirmPassword')}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
                  strokeWidth={1.5}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder={t('auth.register.confirmPasswordPlaceholder')}
                  className="input-dark w-full pl-11"
                  required
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 text-cosmos-gold focus:ring-cosmos-gold/30"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-cosmos-cream/60 font-inter font-light"
                >
                  {t('auth.register.acceptTermsText')}
                </label>
              </div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={formData.newsletter}
                  onChange={(e) => handleChange('newsletter', e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 text-cosmos-gold focus:ring-cosmos-gold/30"
                />
                <label
                  htmlFor="newsletter"
                  className="text-xs text-cosmos-cream/60 font-inter font-light"
                >
                  {t('auth.register.newsletter')}
                </label>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full justify-center mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-cosmos-night border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.register.submit')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center mt-8 text-xs text-cosmos-cream/60 font-inter font-light">
            {t('auth.register.hasAccount')}{' '}
            <Link
              to="/auth/login"
              className="text-cosmos-gold hover:text-cosmos-gold-light transition-colors"
            >
              {t('auth.register.signIn')}
            </Link>
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

export default RegisterPage;
