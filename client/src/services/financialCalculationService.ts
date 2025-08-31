/**
 * Serviço de cálculos financeiros com validação robusta
 * Resolve problemas de cálculos incorretos e overflow
 */

export interface FinancialCalculationResult {
  value: number;
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

export interface TransactionSummary {
  totalIncome: FinancialCalculationResult;
  totalExpenses: FinancialCalculationResult;
  netBalance: FinancialCalculationResult;
  averageTransaction: FinancialCalculationResult;
  transactionCount: number;
}

export interface BudgetAnalysis {
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: FinancialCalculationResult;
  percentageUsed: FinancialCalculationResult;
  isOverBudget: boolean;
  daysRemaining?: number;
  projectedSpending?: FinancialCalculationResult;
}

export class FinancialCalculationService {
  private static readonly MAX_SAFE_VALUE = 999999999.99;
  private static readonly MIN_SAFE_VALUE = -999999999.99;
  private static readonly PRECISION = 2;

  /**
   * Valida se um valor numérico é seguro para cálculos financeiros
   */
  private static validateNumber(value: number, context?: string): FinancialCalculationResult {
    if (typeof value !== 'number' || isNaN(value)) {
      return {
        value: 0,
        isValid: false,
        error: `Valor inválido${context ? ` para ${context}` : ''}: não é um número`,
      };
    }

    if (!isFinite(value)) {
      return {
        value: 0,
        isValid: false,
        error: `Valor inválido${context ? ` para ${context}` : ''}: infinito ou muito grande`,
      };
    }

    if (value > this.MAX_SAFE_VALUE) {
      return {
        value: this.MAX_SAFE_VALUE,
        isValid: false,
        error: `Valor muito alto${context ? ` para ${context}` : ''}: limitado ao máximo permitido`,
        warnings: [`Valor original: ${value}, limitado a: ${this.MAX_SAFE_VALUE}`],
      };
    }

    if (value < this.MIN_SAFE_VALUE) {
      return {
        value: this.MIN_SAFE_VALUE,
        isValid: false,
        error: `Valor muito baixo${context ? ` para ${context}` : ''}: limitado ao mínimo permitido`,
        warnings: [`Valor original: ${value}, limitado a: ${this.MIN_SAFE_VALUE}`],
      };
    }

    return {
      value: this.roundToPrecision(value),
      isValid: true,
    };
  }

  /**
   * Arredonda um valor para a precisão financeira especificada
   */
  private static roundToPrecision(value: number): number {
    const factor = Math.pow(10, this.PRECISION);
    return Math.round(value * factor) / factor;
  }

  /**
   * Calcula o total de receitas com validação
   */
  public static calculateTotalIncome(
    transactions: Array<{ amount: number; type: string }>
  ): FinancialCalculationResult {
    try {
      if (!Array.isArray(transactions)) {
        return {
          value: 0,
          isValid: false,
          error: 'Lista de transações inválida',
        };
      }

      let total = 0;
      const warnings: string[] = [];
      let hasInvalidTransactions = false;

      for (const transaction of transactions) {
        if (transaction.type === 'income') {
          const validation = this.validateNumber(transaction.amount, 'receita');

          if (!validation.isValid) {
            hasInvalidTransactions = true;
            if (validation.warnings) {
              warnings.push(...validation.warnings);
            }
          }

          total += validation.value;
        }
      }

      const finalValidation = this.validateNumber(total, 'total de receitas');

      return {
        value: finalValidation.value,
        isValid: finalValidation.isValid && !hasInvalidTransactions,
        error: finalValidation.error,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      return {
        value: 0,
        isValid: false,
        error: `Erro no cálculo de receitas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
  }

  /**
   * Calcula o total de despesas com validação
   */
  public static calculateTotalExpenses(
    transactions: Array<{ amount: number; type: string }>
  ): FinancialCalculationResult {
    try {
      if (!Array.isArray(transactions)) {
        return {
          value: 0,
          isValid: false,
          error: 'Lista de transações inválida',
        };
      }

      let total = 0;
      const warnings: string[] = [];
      let hasInvalidTransactions = false;

      for (const transaction of transactions) {
        if (transaction.type === 'expense') {
          const validation = this.validateNumber(transaction.amount, 'despesa');

          if (!validation.isValid) {
            hasInvalidTransactions = true;
            if (validation.warnings) {
              warnings.push(...validation.warnings);
            }
          }

          total += validation.value;
        }
      }

      const finalValidation = this.validateNumber(total, 'total de despesas');

      return {
        value: finalValidation.value,
        isValid: finalValidation.isValid && !hasInvalidTransactions,
        error: finalValidation.error,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      return {
        value: 0,
        isValid: false,
        error: `Erro no cálculo de despesas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
  }

  /**
   * Calcula o saldo líquido com validação
   */
  public static calculateNetBalance(income: number, expenses: number): FinancialCalculationResult {
    try {
      const incomeValidation = this.validateNumber(income, 'receitas');
      const expensesValidation = this.validateNumber(expenses, 'despesas');

      if (!incomeValidation.isValid || !expensesValidation.isValid) {
        return {
          value: 0,
          isValid: false,
          error: 'Valores de entrada inválidos para cálculo do saldo',
          warnings: [...(incomeValidation.warnings || []), ...(expensesValidation.warnings || [])],
        };
      }

      const balance = incomeValidation.value - expensesValidation.value;
      return this.validateNumber(balance, 'saldo líquido');
    } catch (error) {
      return {
        value: 0,
        isValid: false,
        error: `Erro no cálculo do saldo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
  }

  /**
   * Calcula resumo completo das transações
   */
  public static calculateTransactionSummary(
    transactions: Array<{ amount: number; type: string }>
  ): TransactionSummary {
    const totalIncome = this.calculateTotalIncome(transactions);
    const totalExpenses = this.calculateTotalExpenses(transactions);
    const netBalance = this.calculateNetBalance(totalIncome.value, totalExpenses.value);

    const transactionCount = Array.isArray(transactions) ? transactions.length : 0;
    const totalTransactionValue = totalIncome.value + totalExpenses.value;

    const averageTransaction =
      transactionCount > 0
        ? this.validateNumber(totalTransactionValue / transactionCount, 'média de transações')
        : { value: 0, isValid: true };

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      averageTransaction,
      transactionCount,
    };
  }

  /**
   * Analisa orçamento com projeções
   */
  public static analyzeBudget(
    budgetAmount: number,
    spentAmount: number,
    startDate: Date,
    endDate: Date,
    currentDate: Date = new Date()
  ): BudgetAnalysis {
    const budgetValidation = this.validateNumber(budgetAmount, 'orçamento');
    const spentValidation = this.validateNumber(spentAmount, 'valor gasto');

    if (!budgetValidation.isValid || !spentValidation.isValid) {
      return {
        budgetAmount: budgetValidation.value,
        spentAmount: spentValidation.value,
        remainingAmount: { value: 0, isValid: false, error: 'Valores de entrada inválidos' },
        percentageUsed: { value: 0, isValid: false, error: 'Valores de entrada inválidos' },
        isOverBudget: false,
      };
    }

    const remaining = budgetValidation.value - spentValidation.value;
    const remainingAmount = this.validateNumber(remaining, 'valor restante');

    const percentage =
      budgetValidation.value > 0 ? (spentValidation.value / budgetValidation.value) * 100 : 0;
    const percentageUsed = this.validateNumber(percentage, 'percentual usado');

    const isOverBudget = spentValidation.value > budgetValidation.value;

    // Calcular dias restantes e projeção
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const daysElapsed = Math.ceil(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysRemaining = Math.max(0, totalDays - daysElapsed);

    let projectedSpending: FinancialCalculationResult | undefined;

    if (daysElapsed > 0 && daysRemaining > 0) {
      const dailySpendingRate = spentValidation.value / daysElapsed;
      const projectedTotal = dailySpendingRate * totalDays;
      projectedSpending = this.validateNumber(projectedTotal, 'projeção de gastos');
    }

    return {
      budgetAmount: budgetValidation.value,
      spentAmount: spentValidation.value,
      remainingAmount,
      percentageUsed,
      isOverBudget,
      daysRemaining,
      projectedSpending,
    };
  }

  /**
   * Formata valor monetário de forma segura
   */
  public static formatCurrency(value: number, currency: string = 'BRL'): string {
    const validation = this.validateNumber(value);

    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: this.PRECISION,
        maximumFractionDigits: this.PRECISION,
      }).format(validation.value);
    } catch {
      return `R$ ${validation.value.toFixed(this.PRECISION)}`;
    }
  }

  /**
   * Converte string para número monetário seguro
   */
  public static parseMonetaryString(value: string): FinancialCalculationResult {
    try {
      if (typeof value !== 'string') {
        return {
          value: 0,
          isValid: false,
          error: 'Valor deve ser uma string',
        };
      }

      // Remove caracteres não numéricos exceto vírgula/ponto decimal e sinal negativo
      const cleanValue = value
        .replace(/[^\d.,-]/g, '')
        .replace(',', '.')
        .replace(/\.(?=.*\.)/g, ''); // Remove pontos duplicados

      const numericValue = parseFloat(cleanValue);

      return this.validateNumber(numericValue, 'conversão de string monetária');
    } catch (error) {
      return {
        value: 0,
        isValid: false,
        error: `Erro na conversão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      };
    }
  }
}

// Instância singleton para facilitar uso
export const financialCalculator = FinancialCalculationService;
