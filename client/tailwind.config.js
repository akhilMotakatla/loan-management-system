/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#04030f',
        navy: {
          deep:  '#070515',
          mid:   '#0e1035',
          light: '#1a2060',
        },
        gold: {
          primary: '#D4AF37',
          bright:  '#FFD700',
          pale:    '#F0E0A0',
          dark:    '#8B6914',
        },
        platinum: '#F0F0FF',
        silver:   '#9090B8',
        muted:    '#484870',
        emerald:  '#0F9B6E',
        ruby:     '#B01A3A',
        sapphire: '#1A5BAB',
        amber:    '#C87800',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Cormorant Garamond', 'serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #8B6914 0%, #D4AF37 40%, #FFD700 60%, #B8860B 100%)',
        'navy-gradient': 'linear-gradient(180deg, #070515 0%, #0e1035 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(4,3,15,0.95) 0%, rgba(14,16,53,0.8) 100%)',
        'radial-gold':   'radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold':    '0 0 30px rgba(212,175,55,0.3)',
        'gold-lg': '0 0 60px rgba(212,175,55,0.45), 0 0 120px rgba(212,175,55,0.15)',
        'glass':   '0 8px 40px rgba(0,0,0,0.6)',
        'card':    '0 20px 60px rgba(0,0,0,0.5)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'spin-slow':   'spin 10s linear infinite',
        'gold-shimmer':'gold-shimmer 4s linear infinite',
      },
      keyframes: {
        float:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        'glow-pulse': { '0%,100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' }, '50%': { boxShadow: '0 0 50px rgba(212,175,55,0.6)' } },
        'gold-shimmer': { '0%': { backgroundPosition: '0% center' }, '100%': { backgroundPosition: '200% center' } },
      },
    },
  },
  plugins: [],
};
