/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#07080a',
          900: '#0d0f14',
          850: '#12151c',
          800: '#181c25',
          700: '#222834',
          600: '#2f3747',
        },
        crimson: {
          400: '#ff4d6d',
          500: '#e61e43',
          600: '#c9183b',
          700: '#a3122e',
          900: '#520816',
        },
        cinema: {
          gold: '#f59e0b',
          amber: '#d97706',
          screen: '#e2f1ff',
          seatAvailable: '#2563eb',
          seatSelected: '#e61e43',
          seatOccupied: '#374151',
          seatVip: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 25px -5px rgba(230, 30, 67, 0.4)',
        'glow-screen': '0 0 40px -10px rgba(180, 220, 255, 0.3)',
        'glow-gold': '0 0 20px -5px rgba(245, 158, 11, 0.3)',
      }
    },
  },
  plugins: [],
}

