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
        teal: '#426F80',
        'teal-deep': '#2f5464',
        'teal-light': '#5a92a6',
        terracotta: '#BA5B47',
        'terra-deep': '#9e4535',
        stone: '#A49692',
        sky: '#A1B9C5',
        gold: '#D38C46',
        'gold-light': '#e4a86a',
        dark: '#0f1a1f',
        'dark-card': '#152229',
        'dark-surface': '#1a2e38',
      },
      fontFamily: {
        primary: ['Plus Jakarta Sans', 'sans-serif'],
        secondary: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
