/**
 * 📝 Transaction DTOs - Will Finance 5.0
 * 
 * Data Transfer Objects para validação de transações
 */

import { z } from 'zod';

// Schema base para transação
const BaseTransactionSchema = z.object({
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  description: z.string().min(1, 'Descrição é obrigatória').max(255, 'Descrição muito longa'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' })
  }),
  date: z.coerce.date().optional(),
  accountId: z.string().min(1, 'Conta é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  notes: z.string().max(500, 'Notas muito longas').optional(),
  location: z.string().max(255, 'Localização muito longa').optional(),
  reference: z.string().max(100, 'Referência muito longa').optional(),
  isRecurring: z.boolean().optional().default(false),
  recurringRule: z.string().max(100, 'Regra de recorrência muito longa').optional(),
});

// Schema para criação de transação
export const CreateTransactionSchema = BaseTransactionSchema;

// Schema para atualização de transação (todos os campos opcionais exceto validações)
export const UpdateTransactionSchema = BaseTransactionSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Pelo menos um campo deve ser fornecido para atualização' }
);

// Schema para filtros de busca
export const TransactionFiltersSchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().optional(),
  accountId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
});

// Schema para estatísticas
export const TransactionStatsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Tipos inferidos dos schemas
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type TransactionFiltersDto = z.infer<typeof TransactionFiltersSchema>;
export type TransactionStatsDto = z.infer<typeof TransactionStatsSchema>;

// Tipo para resposta de transação
export interface TransactionResponseDto {
  id: string;
  amount: number;
  description: string;
  type: string;
  date: Date;
  notes?: string;
  location?: string;
  reference?: string;
  isRecurring: boolean;
  recurringRule?: string;
  status: string;
  aiAnalyzed: boolean;
  aiConfidence?: number;
  aiTags?: string;
  aiCategories?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  accountId: string;
  categoryId: string;
  account: {
    id: string;
    name: string;
    type: string;
    color: string;
    icon: string;
  };
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
    type: string;
  };
}

// Tipo para resposta paginada
export interface PaginatedTransactionsDto {
  transactions: TransactionResponseDto[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Tipo para estatísticas
export interface TransactionStatsResponseDto {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  averageTransaction: number;
  categoryBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    categoryIcon: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  accountBreakdown: Array<{
    accountId: string;
    accountName: string;
    accountColor: string;
    accountIcon: string;
    amount: number;
    percentage: number;
    transactionCount: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}
