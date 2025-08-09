import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00ffe7',
          success: '#00ff87',
          danger: '#ff005c',
          neon: '#f7ff00',
        },
        background: {
          secondary: '#18181b',
        },
      },
      boxShadow: {
        'neon': '0 0 16px #00ffe7, 0 0 4px #fff',
      },
      dropShadow: {
        'neon': '0 0 8px #00ffe7',
      },
    },
  },
  plugins: [],
} satisfies Config;
