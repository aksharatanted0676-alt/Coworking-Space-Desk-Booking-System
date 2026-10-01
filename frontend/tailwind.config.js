/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          eucalyptus: '#CDD4B1',
          pistachio: '#EBECCC',
          peach: '#FEECD0',
          ivory: '#FFF9E2',
          clay: '#DCA278',
          'clay-dark': '#C88D63',
          dark: '#2A3026',
          muted: '#62685B',
          border: '#DCE0C8'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'organic-sm': '0 2px 8px rgba(42, 48, 38, 0.04)',
        'organic-md': '0 8px 24px rgba(42, 48, 38, 0.07)',
        'organic-lg': '0 16px 40px rgba(42, 48, 38, 0.10)'
      }
    },
  },
  plugins: [],
}
