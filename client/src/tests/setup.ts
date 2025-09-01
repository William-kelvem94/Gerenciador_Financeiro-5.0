// 🧪 Test Setup Configuration - Will Finance 5.0
// Enterprise-grade testing environment with React hooks support

import '@testing-library/jest-dom';
import { beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Fix React Hooks in test environment
import React from 'react';

// Configure React for testing environment
globalThis.React = React;

// Polyfills for Node.js environment
if (!globalThis.TextEncoder) {
  const { TextEncoder, TextDecoder } = require('util');
  globalThis.TextEncoder = TextEncoder;
  globalThis.TextDecoder = TextDecoder;
}

// Configuração global para testes
beforeEach(() => {
  // Setup antes de cada teste - limpar mocks
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup após cada teste
  cleanup();
});

// Enhanced React Testing Environment Setup
const reactTestingSetup = () => {
  // Ensure React is available globally for hooks
  if (typeof window !== 'undefined') {
    (window as any).React = React;
  }
  
  // Mock missing DOM APIs for React
  if (!window.customElements) {
    window.customElements = {
      define: vi.fn(),
      get: vi.fn(),
      upgrade: vi.fn(),
      whenDefined: vi.fn(() => Promise.resolve()),
    } as any;
  }
};

// Initialize React testing setup
reactTestingSetup();

// Mock de funções globais se necessário
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock para localStorage com Vitest
const localStorageMock = {
  getItem: vi.fn((_key: string) => null),
  setItem: vi.fn((_key: string, _value: string) => {}),
  removeItem: vi.fn((_key: string) => {}),
  clear: vi.fn(() => {}),
  length: 0,
  key: vi.fn((_index: number) => null),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: { ...localStorageMock },
});

// Mock para URL.createObjectURL e revokeObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  value: vi.fn(() => 'mock-url'),
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  value: vi.fn(),
});

// Mock para fetch API
globalThis.fetch = vi.fn();

// Mock para ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock para IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  root: null,
  rootMargin: '',
  thresholds: [],
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
  takeRecords: vi.fn(() => []),
}));

// Mock para crypto API
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-123'),
    getRandomValues: vi.fn((arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
  },
});

// Mock console methods to avoid noise in tests
const originalConsole = { ...console };
globalThis.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: process.env.NODE_ENV === 'test' ? vi.fn() : originalConsole.log,
  info: process.env.NODE_ENV === 'test' ? vi.fn() : originalConsole.info,
};
