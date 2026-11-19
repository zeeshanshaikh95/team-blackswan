/**
 * Team BlackSwan design system — "black tie".
 *
 * Obsidian paper, ivory ink and champagne gold, sampled from the brand's own
 * Instagram emblem (black field, gold ornament). Hairline gold rules, wide
 * display caps and generous negative space; it deliberately shares no palette,
 * type or layout rhythm with the previous Team BlackSwan build.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#0B0B0C', // page
        ivory: '#151517', // raised surfaces
        sand: '#232120', // fills, image wells
        clay: '#2E2B27', // hairlines on dark
        ink: '#F2EDE3', // primary text
        'ink-soft': '#A79E90',
        'ink-faint': '#7B7468',
        obsidian: '#070708', // scrims, overlays, deepest black
        gold: {
          200: '#F2E4C2',
          300: '#E4CD93',
          400: '#D3B264',
          500: '#C39A3E',
          600: '#9C7826',
          700: '#6F5416',
        },
        wine: {
          500: '#7C2B33',
          600: '#63222A',
          700: '#4D1A20',
        },
      },
      fontFamily: {
        display: ['Marcellus', 'Georgia', 'serif'],
        body: ['Manrope', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        micro: '0.28em',
        wide2: '0.16em',
        logo: '0.34em',
      },
      borderRadius: {
        none: '0',
        xs: '1px',
        sm: '2px',
      },
      boxShadow: {
        lift: '0 24px 60px -36px rgba(0, 0, 0, 0.9)',
        panel: '0 32px 80px -40px rgba(0, 0, 0, 0.95)',
        gold: '0 0 0 1px rgba(195, 154, 62, 0.35)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1.09)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'fade-in': 'fade-in 0.6s ease-out both',
        'slide-in-right': 'slide-in-right 0.34s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        'ken-burns': 'ken-burns 10s ease-out both',
        marquee: 'marquee 34s linear infinite',
      },
    },
  },
  plugins: [],
};
