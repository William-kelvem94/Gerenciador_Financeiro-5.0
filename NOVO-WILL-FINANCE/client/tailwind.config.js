module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          primary: '#00FFFF',
          secondary: '#FF0080',
          accent: '#39FF14',
        },
        background: {
          primary: '#0A0A0F',
          secondary: '#1A1A2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
