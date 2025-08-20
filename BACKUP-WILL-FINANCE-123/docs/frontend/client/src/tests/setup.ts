import '@testing-library/jest-dom';
import { beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Configuração global para testes
beforeEach(() => {
  // Setup antes de cada teste
});

afterEach(() => {
  // Cleanup após cada teste
  cleanup();
});

// Mock de funções globais se necessário
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock para localStorage
const localStorageMock = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
  clear: () => {},
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock para IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  observe() {
    return null;
  }

  disconnect() {
    return null;
  }

  unobserve() {
    return null;
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};
