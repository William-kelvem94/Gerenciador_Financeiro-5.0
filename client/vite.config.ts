// Vite config em formato ESM puro para suportar plugin ESM-only
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    // Importação dinâmica do plugin React
    (await import('@vitejs/plugin-react')).default()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
