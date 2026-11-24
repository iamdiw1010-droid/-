/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: '#0b1026',
          800: '#1a1f4d',
          700: '#2d2a6e',
        },
        gold: {
          light: '#ffe8a3',
          DEFAULT: '#ffcf6b',
          dark: '#ffb347',
        },
        romance: {
          pink: '#ffb7d5',
          rose: '#ff8fb1',
        },
        candle: {
          flame: '#ff9800',
          glow: '#ffea88',
        },
        cream: {
          50: '#fffbf2',
          100: '#fff6e5',
          200: '#fdedcf',
        }
      },
      fontFamily: {
        mali: ['Mali', 'cursive', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -3px rgba(255, 207, 107, 0.45)',
        'glow-gold-lg': '0 0 40px 0px rgba(255, 179, 71, 0.55)',
        'glow-candle': '0 0 15px 4px rgba(255, 200, 80, 0.65)',
        'glow-pink': '0 0 25px -3px rgba(255, 183, 213, 0.5)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '25%': { transform: 'scale(1.08, 0.95) rotate(-2deg)', opacity: '0.92' },
          '50%': { transform: 'scale(0.96, 1.05) rotate(1.5deg)', opacity: '1' },
          '75%': { transform: 'scale(1.04, 0.98) rotate(-1deg)', opacity: '0.88' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px 2px rgba(255, 207, 107, 0.4)' },
          '50%': { boxShadow: '0 0 35px 8px rgba(255, 179, 71, 0.75)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      },
      animation: {
        'flicker': 'flicker 1.8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float-slow': 'floatSlow 3.5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
