/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B1020',
          secondary: '#0F1629',
          card: '#131929',
          hover: '#1a2235',
        },
        primary: {
          DEFAULT: '#7C3AED',
          light: '#9D5FFF',
          dark: '#5B21B6',
          glow: 'rgba(124, 58, 237, 0.3)',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dark: '#0891B2',
          glow: 'rgba(6, 182, 212, 0.3)',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          active: 'rgba(124, 58, 237, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.25), transparent)',
        'card-gradient': 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.05))',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124, 58, 237, 0.3)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.3)',
        'glow-sm': '0 0 15px rgba(124, 58, 237, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(124,58,237,0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
