/**
 * Plausible Analytics — sans cookie, RGPD-clean.
 * Init paresseuse : on n'injecte le script que quand l'utilisateur a consenti
 * (ou si on est en mode "legitimate interest only" sans tracking personnel).
 *
 * Doc: https://plausible.io/docs/script-extensions
 */

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const API_HOST = import.meta.env.VITE_PLAUSIBLE_API_HOST ?? 'https://plausible.io';

let injected = false;

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

/** Charge le script Plausible (one-shot). */
export function loadPlausible(): void {
  if (injected || !DOMAIN || typeof window === 'undefined') return;
  if (import.meta.env.DEV) {
    console.info('[Plausible] dev mode, script non chargé.');
    return;
  }

  const script = document.createElement('script');
  script.src = `${API_HOST}/js/script.outbound-links.js`;
  script.setAttribute('data-domain', DOMAIN);
  script.defer = true;
  document.head.appendChild(script);

  // Stub local pour les events queue-and-flush avant load
  window.plausible =
    window.plausible ??
    function (event: string, options?: { props?: Record<string, string | number | boolean> }) {
      (window.plausible as unknown as { q?: unknown[] }).q =
        (window.plausible as unknown as { q?: unknown[] }).q ?? [];
      (window.plausible as unknown as { q: unknown[] }).q.push([event, options]);
    };

  injected = true;
}

/** Track un événement custom (pageview est auto). */
export function trackEvent(name: string, props?: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return;
  if (window.plausible) {
    window.plausible(name, props ? { props } : undefined);
  }
}
