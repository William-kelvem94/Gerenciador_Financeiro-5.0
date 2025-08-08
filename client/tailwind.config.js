/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cyberpunk theme colors
        cyber: {
          primary: '#00FFFF',    // Cyan
          secondary: '#FF00FF',  // Magenta
          accent: '#39FF14',     // Neon Green
          warning: '#FFD700',    // Gold
          danger: '#FF0040',     // Neon Red
          dark: '#0A0A0A',       // Deep Black
          surface: '#1A1A1A',    // Dark Gray
          border: '#333333',     // Medium Gray
        },
        // Traditional colors with cyberpunk twist - Flat structure for proper utility generation
        background: '#0A0A0A',
        'background-secondary': '#1A1A1A',
        'background-tertiary': '#2A2A2A',
        foreground: '#FFFFFF',
        'foreground-secondary': '#CCCCCC',
        'foreground-muted': '#888888',
        // Border colors - Flat structure
        border: '#333333',
        'border-secondary': '#444444',
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'matrix': 'matrix 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF, 0 0 15px #00FFFF',
          },
          '100%': { 
            boxShadow: '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
          },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        matrix: {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 50%, #39FF14 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 5px #00FFFF',
        'glow': '0 0 10px #00FFFF',
        'glow-lg': '0 0 20px #00FFFF',
        'glow-xl': '0 0 30px #00FFFF',
        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
