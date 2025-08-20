
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

// Tipos para os mocks
type MockRouterProps = {
  children: React.ReactNode;
};

type MockNavigateProps = {
  to: string;
};

// Mock do router com tipagem forte
vi.mock('react-router-dom', async (importOriginal) => {
  const actualModule = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actualModule,
    BrowserRouter: ({ children }: MockRouterProps) => (
      <div data-testid="browser-router">{children}</div>
    ),
    Routes: ({ children }: MockRouterProps) => (
      <div data-testid="routes">{children}</div>
    ),
    Route: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="route">{children}</div>
    ),
    Navigate: ({ to }: MockNavigateProps) => (
      <div data-testid="navigate" data-to={to}>Navigate to {to}</div>
    ),
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock do contexto de tema
vi.mock('../contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useTheme: () => ({
    currentTheme: {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      colors: {
        primary: '#00ffff',
        secondary: '#ff00ff',
        accent: '#ffff00',
        background: { primary: '#000011', card: '#001122' },
        text: { primary: '#ffffff', secondary: '#cccccc' },
        neon: { glow: '#00ffff', pulse: '#ff00ff' }
      },
      effects: { glitch: true, scanlines: true, glow: true, particles: true },
      sounds: { enabled: true, volume: 0.5 }
    },
    availableThemes: [],
    setTheme: vi.fn(),
    customizeTheme: vi.fn(),
    resetTheme: vi.fn(),
    exportTheme: vi.fn(),
    importTheme: vi.fn(),
  }),
}));

describe('App', () => {
  it('deve renderizar sem erros', () => {
    // Act
    const { container } = render(<App />);
    // Assert
    expect(container).toBeInTheDocument();
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('deve aplicar o tema cyberpunk corretamente', () => {
    render(<App />);
    // Exemplo genérico - adapte para suas classes reais:
    const themedElement = document.querySelector('.theme-cyberpunk');
    expect(themedElement).toBeInTheDocument();
    // Ou verifique estilos específicos se aplicável:
    // const primaryColorElement = screen.getByTestId('some-element');
    // expect(primaryColorElement).toHaveStyle({ color:'#00ffff' });
  });

  it('deve conter as rotas principais', () => {
    render(<App />);
    expect(screen.getByTestId('routes')).toBeInTheDocument();
    expect(screen.getAllByTestId('route').length).toBeGreaterThan(0);
  });
});
