/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Outfit"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"Monaco"', '"Courier New"', 'monospace'],
        outfit: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f3f0f7',
          100: '#e8e1f0',
          200: '#d4c6e0',
          300: '#c9b5d3',
          400: '#bda6ce',
          500: '#b399c7',
          600: '#9b8ec7',
          700: '#8b7db8',
          800: '#7b6ca9',
          900: '#6b5b9a',
        },
        parchment: '#F2EAE0',
        slate: {
          night: 'var(--bg-primary)',
          deep: 'var(--bg-secondary)',
          card: 'var(--bg-tertiary)',
          muted: 'var(--bg-hover)',
        }
      },
      backgroundImage: {
        'paper': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
        'count-up': 'countUp 0.8s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
