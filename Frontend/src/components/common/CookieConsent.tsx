import React, { useEffect, useState } from 'react';
import { loadPlausible } from '../../lib/analytics/plausible';

const STORAGE_KEY = 'cosmos_consent_v1';
type Decision = 'accepted' | 'rejected';

/**
 * Banner de consentement RGPD-friendly.
 * - Plausible étant cookieless, le consentement n'est pas légalement requis,
 *   mais on l'affiche par transparence (et c'est requis si on ajoute autre chose).
 * - Bouton "Personnaliser" → page /confidentialite (à venir).
 */
const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Decision | null;
      if (stored === 'accepted') {
        loadPlausible();
        return;
      }
      if (stored !== 'rejected') {
        setVisible(true);
      }
    } catch {
      // localStorage indispo (Safari private) → on affiche le banner
      setVisible(true);
    }
  }, []);

  const persist = (decision: Decision) => {
    try {
      localStorage.setItem(STORAGE_KEY, decision);
    } catch {
      // ignore
    }
    setVisible(false);
    if (decision === 'accepted') loadPlausible();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-cosmos-night/95 backdrop-blur-sm border-t border-cosmos-gold/30 text-cosmos-cream shadow-2xl"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <p className="text-sm font-light leading-relaxed max-w-2xl">
          Nous utilisons une mesure d'audience{' '}
          <strong className="text-cosmos-gold">sans cookies</strong> (Plausible) pour améliorer
          votre expérience. Aucune donnée personnelle n'est collectée.{' '}
          <a
            href="/confidentialite"
            className="underline underline-offset-4 hover:text-cosmos-gold"
          >
            En savoir plus
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => persist('rejected')}
            className="px-4 py-2 border border-cosmos-cream/30 hover:border-cosmos-cream text-cosmos-cream/80 hover:text-cosmos-cream text-sm transition rounded"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => persist('accepted')}
            className="px-4 py-2 bg-cosmos-gold hover:bg-cosmos-gold/90 text-cosmos-night text-sm font-medium transition rounded"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
