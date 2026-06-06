import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from './locales/fr/translation.json';
import translationEN from './locales/en/translation.json';

// Configuration des ressources de traduction
const resources = {
  fr: {
    translation: translationFR,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  // Détection automatique de la langue du navigateur
  .use(LanguageDetector)
  // Intégration avec React
  .use(initReactI18next)
  // Configuration
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut
    lng: 'fr', // Langue initiale
    debug: import.meta.env.DEV, // Mode debug en développement

    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },

    detection: {
      // Ordre de détection de la langue
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Clé dans le localStorage
      lookupLocalStorage: 'cosmos-language',
      // Cache la langue détectée
      caches: ['localStorage'],
    },
  });

export default i18n;
