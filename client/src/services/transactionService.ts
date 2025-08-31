/**
 * Serviço robusto de transações com validação e cálculos seguros
 */
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: string;
  userId?: string;
  metadata?: {
    source?: string;
    tags?: string[];
    attachments?: string[];
  };
}

export interface TransactionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export class TransactionService {
  private static readonly MAX_AMOUNT = 999999999.99;
  private static readonly MIN_AMOUNT = 0.01;

  /**
   * Valida uma transação antes de criar/atualizar
   */
  public static validateTransaction(transaction: Partial<Transaction>): TransactionValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar descrição
    if (!transaction.description || transaction.description.trim().length < 3) {
      errors.push('Descrição deve ter pelo menos 3 caracteres');
    }

    // Validar valor
    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Valor deve ser positivo');
    } else if (transaction.amount < this.MIN_AMOUNT) {
      errors.push(`Valor mínimo é R$ ${this.MIN_AMOUNT.toFixed(2)}`);
    } else if (transaction.amount > this.MAX_AMOUNT) {
      errors.push(
        `Valor máximo é R$ ${this.MAX_AMOUNT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      );
    }

    // Validar tipo
    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
      errors.push('Tipo deve ser "income" ou "expense"');
    }

    // Validar categoria
    if (!transaction.category || transaction.category.trim().length === 0) {
      errors.push('Categoria é obrigatória');
    }

    // Validar data
    if (!transaction.date) {
      errors.push('Data é obrigatória');
    } else {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(today.getFullYear() + 1);

      if (isNaN(transactionDate.getTime())) {
        errors.push('Data inválida');
      } else if (transactionDate > maxFutureDate) {
        warnings.push('Data muito distante no futuro');
      }
    }

    // Warnings para valores altos
    if (transaction.amount && transaction.amount > 50000) {
      warnings.push('Valor alto detectado - verifique se está correto');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Cria uma nova transação com validação
   */
  public static createTransaction(
    transactionData: Omit<Transaction, 'id' | 'timestamp'>
  ): Transaction {
    const validation = this.validateTransaction(transactionData);

    if (!validation.isValid) {
      const errorMessage = `Erro ao criar transação: ${validation.errors.join(', ')}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        toast.warning(warning);
      });
    }

    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4(), // ID único universal
      timestamp: new Date().toISOString(),
      amount: parseFloat(transactionData.amount.toFixed(2)), // Garantir precisão decimal
    };

    toast.success(`Transação "${newTransaction.description}" criada com sucesso!`);
    return newTransaction;
  }

  /**
   * Atualiza uma transação existente
   */
  public static updateTransaction(
    id: string,
    updates: Partial<Omit<Transaction, 'id' | 'timestamp'>>,
    originalTransaction: Transaction
  ): Transaction {
    const updatedData = { ...originalTransaction, ...updates };
    const validation = this.validateTransaction(updatedData);

    if (!validation.isValid) {
      const errorMessage = `Erro ao atualizar transação: ${validation.errors.join(', ')}`;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (validation.warnings.length > 0) {
      validation.warnings.forEach(warning => {
        toast.warning(warning);
      });
    }

    const updatedTransaction: Transaction = {
      ...updatedData,
      id,
      timestamp: originalTransaction.timestamp,
      amount: parseFloat(updatedData.amount.toFixed(2)),
    };

    toast.success(`Transação "${updatedTransaction.description}" atualizada!`);
    return updatedTransaction;
  }

  /**
   * Calcula saldo com validação e tratamento de erro
   */
  public static calculateBalance(transactions: Transaction[]): number {
    if (!Array.isArray(transactions)) {
      console.error('calculateBalance: transactions deve ser um array');
      return 0;
    }

    try {
      return transactions.reduce((acc, curr) => {
        if (!curr || typeof curr.amount !== 'number' || !curr.type) {
          console.warn('Transação inválida encontrada:', curr);
          return acc;
        }

        const amount = parseFloat(curr.amount.toFixed(2));

        if (isNaN(amount)) {
          console.warn('Valor inválido na transação:', curr);
          return acc;
        }

        return curr.type === 'income' ? acc + amount : acc - amount;
      }, 0);
    } catch (error) {
      console.error('Erro ao calcular saldo:', error);
      toast.error('Erro no cálculo do saldo');
      return 0;
    }
  }

  /**
   * Calcula total de receitas
   */
  public static calculateTotalIncome(transactions: Transaction[]): number {
    return this.calculateTotalByType(transactions, 'income');
  }

  /**
   * Calcula total de despesas
   */
  public static calculateTotalExpenses(transactions: Transaction[]): number {
    return this.calculateTotalByType(transactions, 'expense');
  }

  /**
   * Calcula total por tipo com validação
   */
  private static calculateTotalByType(
    transactions: Transaction[],
    type: 'income' | 'expense'
  ): number {
    if (!Array.isArray(transactions)) {
      return 0;
    }

    try {
      return transactions
        .filter(t => t && t.type === type && typeof t.amount === 'number')
        .reduce((sum, t) => {
          const amount = parseFloat(t.amount.toFixed(2));
          return isNaN(amount) ? sum : sum + amount;
        }, 0);
    } catch (error) {
      console.error(`Erro ao calcular total de ${type}:`, error);
      return 0;
    }
  }

  /**
   * Filtra transações por critérios
   */
  public static filterTransactions(
    transactions: Transaction[],
    filters: {
      search?: string;
      type?: 'all' | 'income' | 'expense';
      category?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Transaction[] {
    if (!Array.isArray(transactions)) {
      return [];
    }

    return transactions.filter(transaction => {
      // Filtro por busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !transaction.description.toLowerCase().includes(searchLower) &&
          !transaction.category.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Filtro por tipo
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
        return false;
      }

      // Filtro por categoria
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Filtro por data
      if (filters.startDate) {
        const transactionDate = new Date(transaction.date);
        const startDate = new Date(filters.startDate);
        if (transactionDate < startDate) {
          return false;
        }
      }

      if (filters.endDate) {
        const transactionDate = new Date(transaction.date);
        const endDate = new Date(filters.endDate);
        if (transactionDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Gera relatório de transações
   */
  public static generateTransactionReport(transactions: Transaction[]) {
    const totalIncome = this.calculateTotalIncome(transactions);
    const totalExpenses = this.calculateTotalExpenses(transactions);
    const balance = totalIncome - totalExpenses;

    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const expenseTransactions = transactions.filter(t => t.type === 'expense');

    // Agrupar por categoria
    const expensesByCategory = expenseTransactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const incomeByCategory = incomeTransactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      summary: {
        totalIncome,
        totalExpenses,
        balance,
        transactionCount: transactions.length,
        averageTransaction:
          transactions.length > 0 ? (totalIncome + totalExpenses) / transactions.length : 0,
      },
      breakdown: {
        incomeByCategory,
        expensesByCategory,
      },
      period: {
        startDate:
          transactions.length > 0
            ? transactions.reduce((min, t) => (t.date < min ? t.date : min), transactions[0].date)
            : null,
        endDate:
          transactions.length > 0
            ? transactions.reduce((max, t) => (t.date > max ? t.date : max), transactions[0].date)
            : null,
      },
    };
  }

  /**
   * Valida integridade de um conjunto de transações
   */
  public static validateTransactionIntegrity(transactions: Transaction[]): {
    isValid: boolean;
    issues: string[];
    fixedTransactions: Transaction[];
  } {
    const issues: string[] = [];
    const fixedTransactions: Transaction[] = [];

    if (!Array.isArray(transactions)) {
      return {
        isValid: false,
        issues: ['Dados de transação não são um array válido'],
        fixedTransactions: [],
      };
    }

    transactions.forEach((transaction, index) => {
      try {
        // Verificar se a transação tem campos obrigatórios
        if (!transaction.id) {
          transaction.id = uuidv4();
          issues.push(`Transação ${index}: ID gerado automaticamente`);
        }

        if (!transaction.timestamp) {
          transaction.timestamp = new Date().toISOString();
          issues.push(`Transação ${index}: Timestamp gerado automaticamente`);
        }

        // Corrigir valores numéricos
        if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
          const parsedAmount = parseFloat(String(transaction.amount));
          if (!isNaN(parsedAmount)) {
            transaction.amount = parsedAmount;
            issues.push(`Transação ${index}: Valor convertido para número`);
          } else {
            issues.push(`Transação ${index}: Valor inválido - transação ignorada`);
            return;
          }
        }

        // Garantir precisão decimal
        transaction.amount = parseFloat(transaction.amount.toFixed(2));

        fixedTransactions.push(transaction);
      } catch (error) {
        issues.push(
          `Transação ${index}: Erro ao processar - ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        );
      }
    });

    return {
      isValid: issues.length === 0,
      issues,
      fixedTransactions,
    };
  }
}

// Exportar instância singleton para facilitar uso
export const transactionService = TransactionService;
