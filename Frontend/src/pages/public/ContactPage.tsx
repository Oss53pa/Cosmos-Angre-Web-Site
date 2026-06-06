import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { BRANDING } from '../../utils/brochureData';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import locationAerial from '../../assets/images/branding/location-aerial.jpg';
import { submitContact } from '../../lib/api/contact';
import { toast } from '../../lib/ui/toast';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage(null);

    const result = await submitContact({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
      website,
    });

    if (result.ok) {
      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      toast.success(t('contact.form.success', 'Message envoyé avec succès'));
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? null);
      toast.error(t('contact.form.error', "Échec de l'envoi"), result.error);
    }
  };

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Contact"
        description="Coordonnées, horaires et formulaire de contact de Cosmos Angré, votre destination shopping et lifestyle à Cocody-Angré, Abidjan."
        keywords={['contact Cosmos Angré', 'horaires Cocody', 'adresse Angré', 'centre commercial Abidjan', 'coordonnées']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />
      {/* Hero */}
      <section className="relative py-32 md:py-40 bg-cosmos-night overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cosmos-gold/5 to-transparent" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{t('contact.hero.overline')}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up">{t('contact.hero.title')}</h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {t('contact.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Form */}
            <div>
              <span className="overline mb-4 block">{t('contact.form.overline')}</span>
              <h2 className="section-title mb-8">{t('contact.form.title')}</h2>

              {status === 'success' && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-green-50 border border-green-200 rounded-md" role="alert">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-sm text-green-800 font-inter font-light">{t('contact.form.success')}</p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 border border-red-200 rounded-md" role="alert">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <p className="text-sm text-red-800 font-inter font-light">
                    {errorMessage ?? t('contact.form.error')}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Honeypot — invisible aux humains */}
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
                <div>
                  <label htmlFor="fullName" className="sr-only">{t('contact.form.fullName')}</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('contact.form.fullName')}
                    className="input w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">{t('contact.form.email')}</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.email')}
                    className="input w-full"
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">{t('contact.form.phone')}</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('contact.form.phone')}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="sr-only">{t('contact.form.subject')}</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input w-full"
                    required
                    aria-required="true"
                  >
                    <option value="">{t('contact.form.subject')}</option>
                    <option value="info">{t('contact.form.subjectGeneral')}</option>
                    <option value="location">{t('contact.form.subjectSpace')}</option>
                    <option value="event">{t('contact.form.subjectEvent')}</option>
                    <option value="partnership">{t('contact.form.subjectPartnership')}</option>
                    <option value="other">{t('contact.form.subjectOther')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="sr-only">{t('contact.form.message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.message')}
                    className="input w-full resize-none"
                    required
                    aria-required="true"
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? (
                    <>{t('contact.form.sending')}</>
                  ) : (
                    <>{t('contact.form.send')} <Send className="w-4 h-4" strokeWidth={1.5} /></>
                  )}
                </button>
              </form>
            </div>

            {/* Info */}
            <div>
              <span className="overline mb-4 block">{t('contact.info.overline')}</span>
              <h2 className="section-title mb-8">{t('contact.info.title')}</h2>
              <div className="space-y-6 mb-10">
                {[
                  { icon: MapPin, label: t('contact.info.address'), value: BRANDING.contact.address.full },
                  { icon: Mail, label: t('contact.info.email'), value: BRANDING.contact.email },
                  { icon: Phone, label: t('contact.info.phone'), value: '+225 27 22 00 00 00' },
                  { icon: Clock, label: t('contact.info.hours'), value: t('contact.info.hoursValue') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-cosmos-night/5 rounded-md flex-shrink-0">
                      <item.icon className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-1">{item.label}</p>
                      <p className="text-sm font-inter font-light text-cosmos-night">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
                <img src={locationAerial} alt="Cosmos Angre" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
