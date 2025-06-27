import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionsPage from './TransactionsPage';
import '@testing-library/jest-dom';

describe('TransactionsPage', () => {
  it('deve renderizar o título da página', () => {
    render(<TransactionsPage />);
    expect(screen.getByText(/transa[cç][aã]o/i)).toBeInTheDocument();
  });

  it('deve permitir adicionar uma nova transação', async () => {
    render(<TransactionsPage />);
    const user = userEvent.setup();
    const inputDescricao = screen.getByLabelText(/descri[cç][aã]o/i);
    const inputValor = screen.getByLabelText(/valor/i);
    const btnAdicionar = screen.getByRole('button', { name: /adicionar/i });
    await user.type(inputDescricao, 'Teste Jest');
    await user.type(inputValor, '123');
    await user.click(btnAdicionar);
    expect(screen.getByText(/teste jest/i)).toBeInTheDocument();
  });

  it('deve exibir lista de transações', () => {
    render(<TransactionsPage />);
    expect(screen.getByTestId('transactions-list')).toBeInTheDocument();
  });
});
