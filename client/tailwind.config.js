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
        background: {
          DEFAULT: '#0A0A0A',
          secondary: '#1A1A1A',
          tertiary: '#2A2A2A',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          secondary: '#CCCCCC',
          muted: '#888888',
        },
        cyber: {
          primary: '#00FFFF',
          secondary: '#FF00FF',
          accent: '#39FF14',
          warning: '#FFD700',
          danger: '#FF0040',
          dark: '#0A0A0A',
          surface: '#1A1A1A',
          border: '#333333',
        },
      },
      fontFamily: {
        'cyber': ['Orbitron', 'monospace'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
      },
      boxShadow: {
        'glow-sm': '0 0 5px #00FFFF',
        'glow': '0 0 10px #00FFFF',
        'glow-lg': '0 0 20px #00FFFF',
        'glow-xl': '0 0 30px #00FFFF',
      },
    },
  },
  plugins: [],
}
