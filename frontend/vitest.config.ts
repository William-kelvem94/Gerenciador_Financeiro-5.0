import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./jest.setup.js'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
