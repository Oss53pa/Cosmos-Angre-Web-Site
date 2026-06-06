import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CosmosLogo from '../ui/CosmosLogo';
import { subscribeNewsletter } from '../../lib/api/contact';
import { toast } from '../../lib/ui/toast';
import { enableDevAdminBypass } from '../../contexts/AuthContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // honeypot

  /**
   * Accès console admin via le point discret du copyright.
   * En DEV : active le bypass auth + navigue direct vers /admin (SUPER_ADMIN factice).
   * En PROD : navigation classique vers /admin → ProtectedRoute → /auth/login.
   */
  const handleAdminAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    if (import.meta.env.DEV) {
      enableDevAdminBypass();
      // Force le re-mount d'AuthProvider en rechargeant la page sur /admin
      window.location.href = '/admin';
    } else {
      navigate('/admin');
    }
  };
  const [newsletterStatus, setNewsletterStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleNewsletterSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error(t('footer.newsletterInvalid', 'Email invalide'));
      return;
    }
    setNewsletterStatus('loading');
    const res = await subscribeNewsletter({ email, source: 'footer', website });
    if (res.ok) {
      setNewsletterStatus('success');
      setEmail('');
      toast.success(t('footer.newsletterSuccess', 'Inscription confirmée. Bienvenue !'));
      setTimeout(() => setNewsletterStatus('idle'), 4000);
    } else {
      setNewsletterStatus('error');
      toast.error(t('footer.newsletterError', 'Inscription impossible'), res.error);
      setTimeout(() => setNewsletterStatus('idle'), 4000);
    }
  };

  const footerSections = [
    {
      title: t('footer.shopping'),
      links: [
        { label: t('footer.storeDirectory'), path: '/boutiques' },
        { label: t('footer.currentOffers'), path: '/boutiques?filter=offres' },
        { label: t('footer.newArrivals'), path: '/boutiques?filter=nouveau' },
      ],
    },
    {
      title: t('footer.gastronomy'),
      links: [
        { label: t('footer.restaurants'), path: '/gastronomie' },
        { label: t('footer.foodCourt'), path: '/gastronomie#food-court' },
        { label: t('footer.reservation'), path: '/gastronomie#reservation' },
      ],
    },
    {
      title: t('footer.services'),
      links: [
        { label: t('footer.interactiveMap'), path: '/plan-interactif' },
        { label: t('footer.parking'), path: '/preparer-visite#parking' },
        { label: t('footer.hours'), path: '/preparer-visite#horaires' },
        { label: t('footer.concierge'), path: '/services' },
        { label: t('footer.faq'), path: '/preparer-visite#faq' },
      ],
    },
    {
      title: t('footer.fidelity'),
      links: [
        { label: t('footer.cosmosClub'), path: '/fidelite' },
        { label: t('footer.giftCard'), path: '/fidelite#carte-cadeau' },
        { label: t('footer.memberOffers'), path: '/fidelite#offres' },
      ],
    },
    {
      title: t('footer.journal', 'Journal'),
      links: [
        { label: t('footer.blog', 'Blog / Actualites'), path: '/blog' },
        { label: t('footer.events', 'Evenements'), path: '/evenements' },
        { label: t('footer.newsletterLink', 'Newsletter'), path: '#newsletter' },
        { label: t('footer.about', 'A propos'), path: '/a-propos' },
      ],
    },
    {
      title: t('footer.professionals'),
      links: [
        { label: t('footer.becomePartner'), path: '/professionnels/devenir-enseigne' },
        { label: t('footer.adSpaces'), path: '/professionnels/annonceurs' },
        { label: t('footer.investors'), path: '/professionnels/investisseurs' },
        { label: t('footer.press'), path: '/professionnels/presse' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/cosmosangre' },
    { icon: Facebook, label: 'Facebook', href: 'https://www.facebook.com/cosmosangre' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/cosmos-angre' },
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@cosmosangre' },
  ];

  return (
    <footer className="bg-cosmos-night relative overflow-hidden">
      {/* Top gold line */}
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(var(--cosmos-gold) / 0.4), transparent)',
        }}
      />

      {/* Newsletter Section */}
      <div id="newsletter" className="border-b border-white/5">
        <div className="container-cosmos py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="overline mb-4 block">{t('footer.newsletter')}</span>
            <h3 className="font-cormorant text-3xl md:text-4xl text-cosmos-cream font-light mb-3">
              {t('footer.newsletterTitle')}
            </h3>
            <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-8">
              {t('footer.newsletterSubtitle')}
            </p>
            <form
              className="flex gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                void handleNewsletterSubmit();
              }}
              noValidate
            >
              <label htmlFor="newsletter-email" className="sr-only">
                {t('footer.emailPlaceholder', 'Votre email')}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')}
                className="input-dark flex-1"
                aria-invalid={newsletterStatus === 'error'}
              />
              {/* Honeypot — invisible aux utilisateurs, attractif pour les bots */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="btn-primary px-6 flex-shrink-0 disabled:opacity-60"
                aria-label={t('footer.subscribe', "S'inscrire")}
              >
                {newsletterStatus === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-cosmos-night/30 border-t-cosmos-night rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                )}
              </button>
            </form>
            {newsletterStatus === 'success' && (
              <p className="text-sm text-cosmos-gold font-inter font-light mt-4 animate-fade-in">
                Merci ! Vous recevrez nos actualit&eacute;s tr&egrave;s bient&ocirc;t.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-cosmos py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-8 lg:gap-6">
          {/* Brand Column — spans 2 cols */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <CosmosLogo height={32} />
            </Link>
            <p className="text-cosmos-cream/30 text-xs font-inter font-light italic tracking-wide mb-6">
              {t('footer.tagline')}
            </p>
            <p className="text-sm text-cosmos-cream/60 font-inter font-light leading-relaxed mb-8">
              {t('footer.description')}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-white/10 flex items-center justify-center text-cosmos-cream/60 hover:border-cosmos-gold hover:text-cosmos-gold transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h6 className="text-[11px] uppercase tracking-[0.15em] text-cosmos-cream/70 font-inter font-medium mb-5">
                {section.title}
              </h6>
              <div className="w-8 h-px bg-cosmos-gold/30 mb-5" />
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-sm text-cosmos-cream/35 hover:text-cosmos-gold font-inter font-light transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Bar */}
      <div className="border-t border-white/5">
        <div className="container-cosmos py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              <a
                href="https://maps.google.com/?q=Cosmos+Angre,+Cocody,+Abidjan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-cosmos-cream/35 hover:text-cosmos-gold transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-inter font-light">{t('footer.address')}</span>
              </a>
              <a
                href="tel:+2252722000000"
                className="flex items-center gap-2 text-cosmos-cream/35 hover:text-cosmos-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-inter font-light">{t('footer.phone')}</span>
              </a>
              <a
                href="mailto:info@cosmosangre.com"
                className="flex items-center gap-2 text-cosmos-cream/35 hover:text-cosmos-gold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="text-xs font-inter font-light">{t('footer.email')}</span>
              </a>
            </div>
            <div className="text-xs text-cosmos-cream/20 font-inter font-light">
              {t('footer.openingHoursWeek')}{' '}
              <span className="text-cosmos-gold/60">{t('footer.openingHoursWeekValue')}</span> |{' '}
              {t('footer.openingHoursSun')}{' '}
              <span className="text-cosmos-gold/60">{t('footer.openingHoursSunValue')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="container-cosmos py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-cosmos-cream/20 font-inter font-light uppercase tracking-[0.1em]">
              {(() => {
                const fullText = t('footer.copyright', { year: currentYear });
                // On split sur le premier ". " pour insérer un point cliquable discret
                // qui sert d'accès admin (ex: "...New Heaven SA[.] Tous droits réservés.")
                const dotIdx = fullText.indexOf('. ');
                if (dotIdx === -1) return fullText;
                const before = fullText.slice(0, dotIdx);
                const after = fullText.slice(dotIdx + 2);
                return (
                  <>
                    {before}
                    <button
                      type="button"
                      onClick={handleAdminAccess}
                      aria-label="Console d'administration"
                      title="Admin"
                      className="inline-block px-0.5 hover:text-cosmos-gold transition-colors duration-300 cursor-pointer bg-transparent border-0 p-0 text-inherit font-inherit"
                    >
                      .
                    </button>{' '}
                    {after}
                  </>
                );
              })()}
            </p>
            <div className="flex gap-6">
              {[
                { label: t('footer.legalNotice'), path: '/mentions-legales' },
                { label: t('footer.privacy'), path: '/confidentialite' },
                { label: t('footer.terms'), path: '/cgu' },
                { label: t('footer.cookies'), path: '/confidentialite#cookies' },
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-[10px] text-cosmos-cream/20 hover:text-cosmos-gold/60 font-inter font-light uppercase tracking-[0.1em] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
