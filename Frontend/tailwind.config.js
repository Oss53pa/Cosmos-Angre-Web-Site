/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ===== Cosmos Design Tokens (theme-reactive) =====
        // Tous changent avec [data-theme="premium"|"proximite"]
        cosmos: {
          // Surface dark (Bleu nuit / Vert profond selon thème)
          night: 'rgb(var(--cosmos-night) / <alpha-value>)',
          'night-light': 'rgb(var(--cosmos-night-light) / <alpha-value>)',
          'night-deep': 'rgb(var(--cosmos-night-deep) / <alpha-value>)',

          // Accent universel (Or mat / Raphia selon thème)
          gold: 'rgb(var(--cosmos-gold) / <alpha-value>)',
          'gold-light': 'rgb(var(--cosmos-gold-light) / <alpha-value>)',
          'gold-bright': 'rgb(var(--cosmos-gold-bright) / <alpha-value>)',

          // ★ Accent signature (Champagne / Terracotta selon thème)
          // À utiliser pour: CTAs hero, badges, dividers signature, callouts
          accent: 'rgb(var(--cosmos-accent) / <alpha-value>)',

          // Surfaces claires
          cream: 'rgb(var(--cosmos-cream) / <alpha-value>)',
          warm: 'rgb(var(--cosmos-warm) / <alpha-value>)',

          // Texte
          text: 'rgb(var(--cosmos-text) / <alpha-value>)',

          // Métalliques / contrastes partagés
          bronze: 'rgb(var(--cosmos-bronze, 140 115 56) / <alpha-value>)',
          ebene: 'rgb(var(--cosmos-ebene, 42 24 16) / <alpha-value>)',

          // ===== Couleurs nommées (fixes par palette) =====
          // Utiliser uniquement quand on veut une couleur SPÉCIFIQUE
          // (pas réactive au thème). Ex: <span class="bg-cosmos-terracotta">

          // Palette Proximité
          'vert-profond': 'rgb(var(--cosmos-vert-profond, 45 82 56) / <alpha-value>)',
          terracotta: 'rgb(var(--cosmos-terracotta, 182 106 74) / <alpha-value>)',
          raphia: 'rgb(var(--cosmos-raphia, 197 168 116) / <alpha-value>)',
          sable: 'rgb(var(--cosmos-sable, 229 217 189) / <alpha-value>)',
          'blanc-casse': 'rgb(var(--cosmos-blanc-casse, 242 235 221) / <alpha-value>)',

          // Palette Premium
          'bleu-nuit': 'rgb(var(--cosmos-bleu-nuit, 10 27 46) / <alpha-value>)',
          marbre: 'rgb(var(--cosmos-marbre, 239 234 216) / <alpha-value>)',
          'or-mat': 'rgb(var(--cosmos-or-mat, 199 169 100) / <alpha-value>)',
          'or-clair': 'rgb(var(--cosmos-or-clair, 217 201 160) / <alpha-value>)',
        },
        // ===== Remap de la palette Tailwind `gray` sur la marque =====
        // Le back-office (admin/enseigne) utilise massivement des classes
        // gray-* (boutons, fonds, bordures, textes). On les aligne sur la
        // palette Forêt / Or / Sable pour respecter le thème partout, sans
        // réécrire chaque page. Forêt pour les surfaces sombres (800/900),
        // taupe chaud pour les textes secondaires, sable/crème pour les fonds.
        gray: {
          50: 'rgb(var(--cosmos-warm) / <alpha-value>)',
          100: 'rgb(var(--cosmos-cream) / <alpha-value>)',
          200: '#E6DCC9',
          300: '#D6C8AF',
          400: '#ADA28B',
          500: '#8A7E68',
          600: '#6B6253',
          700: '#4A4334',
          800: 'rgb(var(--cosmos-night) / <alpha-value>)',
          900: 'rgb(var(--cosmos-night-deep) / <alpha-value>)',
        },
        // Semantic
        primary: 'rgb(var(--cosmos-night) / <alpha-value>)',
        accent: 'rgb(var(--cosmos-gold) / <alpha-value>)',
        'accent-light': 'rgb(var(--cosmos-gold-light) / <alpha-value>)',
        surface: 'rgb(var(--cosmos-cream) / <alpha-value>)',
        background: 'rgb(var(--cosmos-warm) / <alpha-value>)',
        // Text
        'text-primary': 'rgb(var(--cosmos-text) / <alpha-value>)',
        'text-secondary': '#6B6253',
        'text-light': 'rgb(var(--cosmos-cream) / <alpha-value>)',
        // Status
        success: '#059669',
        warning: '#D97706',
        error: '#DC2626',
        info: '#2563EB',
        // Legacy support
        gold: 'rgb(var(--cosmos-gold) / <alpha-value>)',
        'gold-dark': 'rgb(var(--cosmos-gold) / <alpha-value>)',
        dark: 'rgb(var(--cosmos-night) / <alpha-value>)',
        elegant: '#6B6253',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond Variable"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        inter: ['"Inter Variable"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        montserrat: ['"Inter Variable"', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond Variable"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', '-apple-system', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['72px', { lineHeight: '1.1', fontWeight: '300' }],
        'hero-mobile': ['40px', { lineHeight: '1.1', fontWeight: '300' }],
        'display': ['48px', { lineHeight: '1.2', fontWeight: '400' }],
        'display-mobile': ['32px', { lineHeight: '1.2', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgb(var(--cosmos-night) / 0.05)',
        'md': '0 4px 12px rgb(var(--cosmos-night) / 0.08)',
        'lg': '0 8px 24px rgb(var(--cosmos-night) / 0.12)',
        'xl': '0 16px 48px rgb(var(--cosmos-night) / 0.16)',
        'gold': '0 4px 16px rgb(var(--cosmos-gold) / 0.3)',
        'gold-lg': '0 8px 32px rgb(var(--cosmos-gold) / 0.4)',
        'luxury': '0 10px 40px rgb(var(--cosmos-night) / 0.1)',
        'luxury-lg': '0 20px 60px rgb(var(--cosmos-night) / 0.15)',
        'inner-gold': 'inset 0 1px 0 rgb(var(--cosmos-gold) / 0.1)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, rgb(var(--cosmos-gold)), rgb(var(--cosmos-gold-light)))',
        'gradient-night': 'linear-gradient(180deg, rgb(var(--cosmos-night)), rgb(var(--cosmos-night-light)))',
        'gradient-night-deep': 'linear-gradient(180deg, rgb(var(--cosmos-night)), rgb(var(--cosmos-night-deep)))',
        'gradient-overlay': 'linear-gradient(0deg, rgb(var(--cosmos-night) / 0.8), transparent)',
        'gradient-hero': 'linear-gradient(135deg, rgb(var(--cosmos-night) / 0.9), rgb(var(--cosmos-night) / 0.7))',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideInLeft 0.8s ease-out',
        'slide-right': 'slideInRight 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'zoom-in': 'zoomIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shine': 'shine 3s infinite',
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
        'count-up': 'countUp 2s ease-out',
        'marquee': 'marquee 45s linear infinite',
        'marquee-slow': 'marquee 70s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgb(var(--cosmos-gold) / 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 0 20px rgb(var(--cosmos-gold) / 0)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200px' },
          '100%': { backgroundPosition: '200px' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
        'hero': '800ms',
      },
    },
  },
  plugins: [],
};
