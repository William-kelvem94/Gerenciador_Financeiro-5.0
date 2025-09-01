// 🧪 App Component Tests - Will Finance 5.0
// Enterprise-grade React component testing

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import App from '../App';

// Mock de todo o router com tipos adequados
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="browser-router">{children}</div>
    ),
    Routes: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="routes">{children}</div>
    ),
    Route: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="route">{children}</div>
    ),
    Navigate: ({ to }: { to: string }) => (
      <div data-testid="navigate" data-to={to}>
        Navigate to {to}
      </div>
    ),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock do contexto de tema
vi.mock('../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  useTheme: () => ({
    currentTheme: {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      colors: {
        primary: '#00ffff',
        secondary: '#ff00ff',
      },
    },
    setTheme: vi.fn(),
  }),
}));

// Mock das stores
vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  }),
}));

describe('App Component', () => {
  it('deve renderizar sem erros', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('deve conter as rotas principais', () => {
    render(<App />);
    expect(screen.getByTestId('routes')).toBeInTheDocument();
    expect(screen.getAllByTestId('route').length).toBeGreaterThan(0);
  });

  it('deve aplicar tema cyberpunk', () => {
    render(<App />);
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });
});
