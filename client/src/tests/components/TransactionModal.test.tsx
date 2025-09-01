import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionModal, TransactionData } from '@/components/Modal/TransactionModal';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TransactionModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(<TransactionModal {...defaultProps} />);
      
      expect(screen.getByText('Nova Transação')).toBeInTheDocument();
      expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    });

    it('should not render modal when isOpen is false', () => {
      render(<TransactionModal {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByText('Nova Transação')).not.toBeInTheDocument();
    });

    it('should render "Editar Transação" when editing existing transaction', () => {
      const transaction: TransactionData = {
        description: 'Test Transaction',
        amount: 100,
        type: 'expense',
        category: 'Food',
        date: '2025-01-01',
        status: 'completed',
      };

      render(<TransactionModal {...defaultProps} transaction={transaction} />);
      
      expect(screen.getByText('Editar Transação')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      render(<TransactionModal {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
        expect(screen.getByText(/valor deve ser maior que zero/i)).toBeInTheDocument();
      });

      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });

    it('should show validation error for negative amount', async () => {
      const user = userEvent.setup();
      render(<TransactionModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/descrição/i), 'Test Transaction');
      await user.type(screen.getByLabelText(/valor/i), '-100');

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valor deve ser maior que zero/i)).toBeInTheDocument();
      });

      expect(defaultProps.onSave).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should submit valid transaction data', async () => {
      const user = userEvent.setup();
      render(<TransactionModal {...defaultProps} />);

      // Fill form with valid data
      await user.type(screen.getByLabelText(/descrição/i), 'Test Transaction');
      await user.type(screen.getByLabelText(/valor/i), '150.75');
      await user.selectOptions(screen.getByLabelText(/tipo/i), 'expense');
      await user.selectOptions(screen.getByLabelText(/categoria/i), 'Alimentação');
      await user.type(screen.getByLabelText(/data/i), '2025-01-15');

      const submitButton = screen.getByRole('button', { name: /salvar/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(defaultProps.onSave).toHaveBeenCalledWith({
          description: 'Test Transaction',
          amount: 150.75,
          type: 'expense',
          category: 'Alimentação',
          date: '2025-01-15',
          status: 'completed',
        });
      });
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<TransactionModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /fechar/i });
      await user.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });
  });
});