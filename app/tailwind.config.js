/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF3EB',
        'cream-dark': '#f0e6d9',
        teal: '#3D8FA8',
        'teal-deep': '#2d6e84',
        'teal-light': '#5aafc8',
        terracotta: '#E07060',
        'terra-deep': '#c45848',
        stone: '#C0B5B0',
        sky: '#D4E8F5',
        gold: '#F0A84E',
        'gold-light': '#f5c07a',
        dark: '#0d1b24',
        'dark-card': '#162635',
        'dark-surface': '#1e3344',
      },
      fontFamily: {
        primary: ['Plus Jakarta Sans', 'sans-serif'],
        secondary: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(12px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        popIn: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both',
      },
    },
  },
  plugins: [],
}
