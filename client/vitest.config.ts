// 🧪 Vitest Configuration - Will Finance 5.0 Frontend
// Comprehensive React testing setup with coverage and performance monitoring

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  test: {
    // =====================================================
    // 🌐 Test Environment
    // =====================================================
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    
    // =====================================================
    // 🎨 UI and Assets
    // =====================================================
    css: true,
    includeSource: ['src/**/*.{js,ts,jsx,tsx}'],
    
    // =====================================================
    // 📊 Coverage Configuration
    // =====================================================
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/tests/setup.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.config.{js,ts}',
        'dist/',
        'build/'
      ],
      thresholds: {
        global: {
          branches: 75,
          functions: 75,
          lines: 75,
          statements: 75
        },
        './src/components/': {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        './src/services/': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
      }
    },
    
    // =====================================================
    // ⚡ Performance and Behavior
    // =====================================================
    testTimeout: 10000,
    hookTimeout: 10000,
    maxConcurrency: 5,
    
    // =====================================================
    // 📁 File Patterns
    // =====================================================
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/__tests__/**/*.{js,ts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      'cypress/',
      '**/*.e2e.{test,spec}.{js,ts,jsx,tsx}'
    ],
    
    // =====================================================
    // 📝 Reporting
    // =====================================================
    reporters: ['default', 'verbose', 'html'],
    outputFile: {
      html: './coverage/vitest-report.html',
      json: './coverage/vitest-results.json'
    },
    
    // =====================================================
    // 🔄 Watch Mode
    // =====================================================
    watch: true,
    watchExclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**'
    ]
  },
  
  // =====================================================
  // 🌐 Module Resolution
  // =====================================================
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@tests': path.resolve(__dirname, './src/tests')
    }
  },
  
  // =====================================================
  // 🔧 Build Configuration for Tests
  // =====================================================
  define: {
    __DEV__: true,
    __TEST__: true
  }
});
