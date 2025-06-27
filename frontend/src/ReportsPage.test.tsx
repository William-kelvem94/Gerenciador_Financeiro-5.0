import { render, screen } from '@testing-library/react';
import ReportsPage from './ReportsPage';
import '@testing-library/jest-dom';

describe('ReportsPage', () => {
  it('deve renderizar o título de relatórios', () => {
    render(<ReportsPage />);
    expect(screen.getByText(/relat[óo]rio/i)).toBeInTheDocument();
  });

  it('deve exibir filtros ou opções de relatório', () => {
    render(<ReportsPage />);
    expect(screen.getByTestId('reports-filters')).toBeInTheDocument();
  });
});
