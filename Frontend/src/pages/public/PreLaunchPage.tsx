import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import GalaxyCanvas from '../../components/features/galaxy/GalaxyCanvas';
import GrainOverlay from '../../components/features/galaxy/GrainOverlay';
import CosmosLogo from '../../components/ui/CosmosLogo';
import { supabase } from '../../lib/supabase';

/**
 * PreLaunchPage — Page de pré-lancement (vague 1, teasing).
 * Signature « Vivez l'exception » + compte à rebours + pré-inscription des
 * membres fondateurs du Cosmos Club. Page autonome, immersive, plein écran.
 */

// J-Day cible (soft opening). À ajuster quand la date officielle est arrêtée.
const TARGET_DATE = new Date('2026-10-15T18:00:00');

const styles = `
  @keyframes pl-fade { 0% { opacity: 0; transform: translateY(18px); } 100% { opacity: 1; transform: translateY(0); } }
  .pl-anim { opacity: 0; animation: pl-fade 1s cubic-bezier(0.4,0,0.2,1) forwards; }
  @keyframes pl-flip { 0% { opacity: 0.4; transform: translateY(-4px); } 100% { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .pl-anim { opacity: 1 !important; animation: none !important; transform: none !important; } }
`;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

const Countdown: React.FC = () => {
  const [time, setTime] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = useMemo(
    () => [
      { value: time.days, label: 'Jours' },
      { value: time.hours, label: 'Heures' },
      { value: time.minutes, label: 'Minutes' },
      { value: time.seconds, label: 'Secondes' },
    ],
    [time]
  );

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5">
      {units.map((u, i) => (
        <React.Fragment key={u.label}>
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-20 sm:w-24 sm:h-28 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm overflow-hidden">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--cosmos-gold) / 0.5), transparent)' }}
              />
              <span
                key={u.value}
                className="font-cormorant text-3xl sm:text-5xl text-cosmos-cream font-light tabular-nums"
                style={{ animation: 'pl-flip 0.5s ease-out' }}
              >
                {String(u.value).padStart(2, '0')}
              </span>
            </div>
            <span className="mt-2 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-cosmos-cream/50 font-inter font-light">
              {u.label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="font-cormorant text-2xl sm:text-4xl text-cosmos-gold/40 -mt-6 hidden sm:inline">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PreLaunchPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const value = email.trim().toLowerCase();
      if (!EMAIL_RE.test(value)) {
        setStatus('error');
        setMessage('Cette adresse ne semble pas valide. Réessayez ?');
        return;
      }
      setStatus('loading');
      setMessage('');
      try {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .upsert({ email: value, status: 'active' }, { onConflict: 'email' });
        if (error) throw error;
        setStatus('success');
      } catch {
        setStatus('error');
        setMessage("Un souci est survenu de notre côté. Réessayez dans un instant.");
      }
    },
    [email]
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cosmos-night-deep text-cosmos-cream">
      <style>{styles}</style>
      <Seo
        titleTemplate="Vivez l'exception | Cosmos Angré"
        description="Quelque chose de grand se prépare à Angré. Rejoignez les membres fondateurs du Cosmos Club et soyez les premiers à vivre Cosmos Angré."
      />

      {/* Galaxie plein écran */}
      <div className="absolute inset-0">
        <GalaxyCanvas density="high" interactive />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, transparent 40%, rgb(var(--cosmos-night-deep) / 0.7) 100%)',
        }}
      />
      <GrainOverlay opacity={0.06} />

      {/* Contenu */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-16 text-center">
        {/* Logo */}
        <div className="pl-anim" style={{ animationDelay: '0.1s' }}>
          <div className="scale-[1.3] sm:scale-150 md:scale-[1.75] inline-block">
            <CosmosLogo height={48} />
          </div>
        </div>
        <div className="h-10 sm:h-14 md:h-16" />

        {/* Overline */}
        <div className="pl-anim inline-flex items-center gap-3 mb-6" style={{ animationDelay: '0.3s' }}>
          <span className="w-6 h-px bg-cosmos-gold/60" />
          <span className="overline text-cosmos-gold">Angré · Cocody · Abidjan</span>
          <span className="w-6 h-px bg-cosmos-gold/60" />
        </div>

        {/* Signature */}
        <h1
          className="pl-anim font-cormorant text-5xl sm:text-7xl md:text-8xl text-cosmos-cream font-light leading-[1.02] mb-6"
          style={{ animationDelay: '0.45s' }}
        >
          Vivez <span className="text-gradient-gold italic">l'exception</span>
        </h1>

        {/* Accroche */}
        <p
          className="pl-anim text-base md:text-lg text-cosmos-cream/70 font-inter font-light max-w-xl mb-12"
          style={{ animationDelay: '0.6s' }}
        >
          Quelque chose de grand se prépare au cœur d'Angré. Le jour J approche.
          Soyez-y avant tout le monde.
        </p>

        {/* Compte à rebours */}
        <div className="pl-anim mb-14" style={{ animationDelay: '0.75s' }}>
          <Countdown />
        </div>

        {/* Capture email / membres fondateurs */}
        <div className="pl-anim w-full max-w-md" style={{ animationDelay: '0.9s' }}>
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/[0.04] border border-cosmos-gold/30 p-8">
              <span className="w-12 h-12 flex items-center justify-center rounded-full bg-cosmos-gold/15 border border-cosmos-gold/40">
                <Check className="w-6 h-6 text-cosmos-gold" strokeWidth={1.5} />
              </span>
              <p className="font-cormorant text-2xl text-cosmos-cream">Bienvenue parmi les fondateurs.</p>
              <p className="text-sm text-cosmos-cream/60 font-inter font-light">
                Un email vient de partir. Confirmez-le pour garder votre place dans le
                tout premier cercle du Cosmos Club.
              </p>
            </div>
          ) : (
            <>
              <p className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-cosmos-gold font-inter font-medium mb-4">
                <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                Les 15 000 premiers deviennent membres fondateurs
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Votre adresse email"
                  aria-label="Votre adresse email"
                  className="input-dark flex-1 text-center sm:text-left"
                  required
                />
                <button type="submit" className="btn-primary px-6 whitespace-nowrap" disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <>
                      Je réserve ma place
                      <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                    </>
                  )}
                </button>
              </form>
              <p className="mt-3 text-xs text-cosmos-cream/45 font-inter font-light">
                {status === 'error' ? (
                  <span className="text-cosmos-accent">{message}</span>
                ) : (
                  "Un email de confirmation, et rien d'autre. Vous partez quand vous voulez."
                )}
              </p>
            </>
          )}
        </div>

        {/* Réseaux + accès site */}
        <div className="pl-anim mt-14 flex flex-col items-center gap-6" style={{ animationDelay: '1.05s' }}>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-cosmos-cream/50 hover:text-cosmos-gold transition-colors"
            >
              <Instagram className="w-5 h-5" strokeWidth={1.5} />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-cosmos-cream/50 hover:text-cosmos-gold transition-colors"
            >
              <Facebook className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.2em] text-cosmos-cream/40 hover:text-cosmos-gold font-inter font-light transition-colors"
          >
            Découvrir Cosmos Angré
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreLaunchPage;
