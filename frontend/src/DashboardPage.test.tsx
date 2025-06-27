import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import '@testing-library/jest-dom';

describe('DashboardPage', () => {
  it('deve renderizar o título do dashboard', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('deve exibir gráficos ou resumo financeiro', () => {
    render(<DashboardPage />);
    expect(screen.getByTestId('dashboard-summary')).toBeInTheDocument();
  });
});
