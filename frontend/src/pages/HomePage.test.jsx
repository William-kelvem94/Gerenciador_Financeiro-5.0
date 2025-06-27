import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

test('renderiza título do dashboard', () => {
  render(<HomePage />);
  expect(screen.getByText(/Dashboard Financeiro/i)).toBeInTheDocument();
});
