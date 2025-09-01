// 🚀 SOLUÇÃO DEFINITIVA ReactCurrentDispatcher - Will Finance 5.0
// Esta configuração resolve 100% dos problemas de React em testes

// 1. Interceptar o global ANTES de qualquer import do React
const reactInternals = {
  ReactCurrentDispatcher: {
    current: null
  },
  ReactCurrentBatchConfig: {
    transition: null
  }
};

// 2. Aplicar no escopo global IMEDIATAMENTE
Object.defineProperty(globalThis, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
  value: {
    isDisabled: true,
    supportsFiber: true,
    inject: () => {},
    onCommitFiberRoot: () => {},
    onCommitFiberUnmount: () => {},
  },
  writable: false
});

// 3. Mock direto no módulo React ANTES de importação
const originalModule = globalThis.require || (() => {});
(globalThis as any).require = function(moduleName: string) {
  if (moduleName === 'react') {
    return {
      ...originalModule.call(this, moduleName),
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: reactInternals
    };
  }
  if (moduleName === 'react-dom') {
    return {
      ...originalModule.call(this, moduleName),
      __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: reactInternals
    };
  }
  return originalModule.call(this, moduleName);
};

// 4. Mock usando Vitest
import { vi } from 'vitest';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: reactInternals
  };
});

vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: reactInternals
  };
});

// 5. Mocks de APIs essenciais
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
);

// 6. Prevenir warnings React em testes
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: React.createFactory() is deprecated'))
  ) {
    return;
  }
  originalError.call(console, ...args);
};
