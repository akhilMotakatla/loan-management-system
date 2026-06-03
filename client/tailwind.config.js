/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian:  '#0A0A0F',
        navy: {
          deep:  '#050B1A',
          mid:   '#0D1B3E',
          light: '#1A2D5A',
        },
        gold: {
          primary: '#C9A84C',
          bright:  '#F0C040',
          pale:    '#E8D5A3',
          dark:    '#8B6914',
        },
        platinum: '#E8E8F0',
        silver:   '#A8A8C0',
        muted:    '#5A5A7A',
        emerald:  '#0F7B5E',
        ruby:     '#8B1A2E',
        sapphire: '#1A4B8B',
        amber:    '#B8860B',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Cormorant Garamond', 'serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #8B6914 0%, #C9A84C 50%, #F0C040 100%)',
        'navy-gradient': 'linear-gradient(180deg, #050B1A 0%, #0D1B3E 100%)',
        'hero-gradient': 'linear-gradient(135deg, rgba(5,11,26,0.9) 0%, rgba(13,27,62,0.8) 100%)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
        'shimmer':     'shimmer 2s linear infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        glow:    { from: { boxShadow: '0 0 20px rgba(201,168,76,0.3)' }, to: { boxShadow: '0 0 40px rgba(201,168,76,0.7)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'gold':    '0 0 30px rgba(201,168,76,0.3)',
        'gold-lg': '0 0 60px rgba(201,168,76,0.4)',
        'glass':   '0 8px 32px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
};
