import { z } from 'zod';

/**
 * Esquemas de validação reutilizáveis para toda a aplicação
 */

// Esquemas básicos
export const idSchema = z.string().uuid('ID deve ser um UUID válido');
export const emailSchema = z.string().email('Email deve ter um formato válido');
export const passwordSchema = z.string().min(8, 'Senha deve ter pelo menos 8 caracteres');
export const usernameSchema = z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres');

// Esquemas de paginação
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// Esquemas de data
export const dateRangeSchema = z.object({
  startDate: z.string().datetime('Data de início deve ser uma data válida').optional(),
  endDate: z.string().datetime('Data de fim deve ser uma data válida').optional(),
});

// Esquemas de usuário
export const userCreateSchema = z.object({
  body: z.object({
    email: emailSchema,
    username: usernameSchema,
    firstName: z.string().min(1, 'Nome é obrigatório'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório'),
    password: passwordSchema,
  }),
});

export const userUpdateSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    avatar: z.string().url().optional(),
    currency: z.string().length(3).optional(),
    dateFormat: z.string().optional(),
    timeFormat: z.string().optional(),
    timezone: z.string().optional(),
  }),
});

// Esquemas de autenticação
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Senha é obrigatória'),
  }),
});

export const registerSchema = userCreateSchema;

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
    newPassword: passwordSchema,
  }),
});

// Esquemas de conta
export const accountCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome da conta é obrigatório'),
    type: z.enum(['checking', 'savings', 'credit', 'investment', 'cash'], {
      errorMap: () => ({ message: 'Tipo de conta inválido' })
    }),
    balance: z.number().default(0),
    currency: z.string().length(3).default('BRL'),
    description: z.string().optional(),
  }),
});

export const accountUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['checking', 'savings', 'credit', 'investment', 'cash']).optional(),
    balance: z.number().optional(),
    currency: z.string().length(3).optional(),
    description: z.string().optional(),
  }),
});

// Esquemas de categoria
export const categoryCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome da categoria é obrigatório'),
    type: z.enum(['income', 'expense'], {
      errorMap: () => ({ message: 'Tipo deve ser income ou expense' })
    }),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido').optional(),
    icon: z.string().optional(),
    parentCategoryId: idSchema.optional(),
  }),
});

export const categoryUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['income', 'expense']).optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    icon: z.string().optional(),
    parentCategoryId: idSchema.optional(),
  }),
});

// Esquemas de transação
export const transactionCreateSchema = z.object({
  body: z.object({
    accountId: idSchema,
    categoryId: idSchema,
    amount: z.number().positive('Valor deve ser positivo'),
    description: z.string().min(1, 'Descrição é obrigatória').max(500, 'Descrição muito longa'),
    type: z.enum(['income', 'expense', 'transfer'], {
      errorMap: () => ({ message: 'Tipo deve ser income, expense ou transfer' })
    }),
    date: z.string().datetime('Data deve ser válida'),
    transferToAccountId: idSchema.optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    receipt: z.string().url().optional(),
  }),
});

export const transactionUpdateSchema = z.object({
  body: z.object({
    accountId: idSchema.optional(),
    categoryId: idSchema.optional(),
    amount: z.number().positive().optional(),
    description: z.string().min(1).max(500).optional(),
    type: z.enum(['income', 'expense', 'transfer']).optional(),
    date: z.string().datetime().optional(),
    transferToAccountId: idSchema.optional(),
    tags: z.array(z.string()).optional(),
    location: z.string().optional(),
    receipt: z.string().url().optional(),
  }),
});

export const transactionQuerySchema = z.object({
  query: z.object({
    ...paginationSchema.shape,
    ...dateRangeSchema.shape,
    accountId: idSchema.optional(),
    categoryId: idSchema.optional(),
    type: z.enum(['income', 'expense', 'transfer']).optional(),
    search: z.string().optional(),
    minAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number).optional(),
    maxAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number).optional(),
  }),
});

// Esquemas de orçamento
export const budgetCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome do orçamento é obrigatório'),
    categoryId: idSchema,
    amount: z.number().positive('Valor deve ser positivo'),
    period: z.enum(['monthly', 'yearly'], {
      errorMap: () => ({ message: 'Período deve ser monthly ou yearly' })
    }),
    startDate: z.string().datetime('Data de início deve ser válida'),
    endDate: z.string().datetime('Data de fim deve ser válida'),
    alertThreshold: z.number().min(0).max(100).default(80),
  }),
});

export const budgetUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    categoryId: idSchema.optional(),
    amount: z.number().positive().optional(),
    period: z.enum(['monthly', 'yearly']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    alertThreshold: z.number().min(0).max(100).optional(),
  }),
});

// Esquemas de meta financeira
export const goalCreateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Nome da meta é obrigatório'),
    description: z.string().optional(),
    targetAmount: z.number().positive('Valor alvo deve ser positivo'),
    currentAmount: z.number().min(0).default(0),
    targetDate: z.string().datetime('Data alvo deve ser válida'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
  }),
});

export const goalUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().min(0).optional(),
    targetDate: z.string().datetime().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

// Esquemas de importação/exportação
export const importDataSchema = z.object({
  body: z.object({
    format: z.enum(['csv', 'xlsx', 'json'], {
      errorMap: () => ({ message: 'Formato deve ser csv, xlsx ou json' })
    }),
    accountId: idSchema,
    categoryMapping: z.record(z.string()).optional(),
  }),
});

export const exportDataSchema = z.object({
  query: z.object({
    format: z.enum(['csv', 'xlsx', 'json', 'pdf']).default('csv'),
    ...dateRangeSchema.shape,
    accountIds: z.string().optional(), // comma-separated UUIDs
    categoryIds: z.string().optional(), // comma-separated UUIDs
  }),
});

// Esquemas de filtros e consultas
export const analyticsQuerySchema = z.object({
  query: z.object({
    ...dateRangeSchema.shape,
    groupBy: z.enum(['day', 'week', 'month', 'year']).default('month'),
    accountIds: z.string().optional(),
    categoryIds: z.string().optional(),
    type: z.enum(['income', 'expense', 'both']).default('both'),
  }),
});

// Validação de parâmetros de rota
export const paramIdSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});

export const paramUserIdSchema = z.object({
  params: z.object({
    userId: idSchema,
  }),
});

export const paramAccountIdSchema = z.object({
  params: z.object({
    accountId: idSchema,
  }),
});

export const paramTransactionIdSchema = z.object({
  params: z.object({
    transactionId: idSchema,
  }),
});

export const paramCategoryIdSchema = z.object({
  params: z.object({
    categoryId: idSchema,
  }),
});

export const paramBudgetIdSchema = z.object({
  params: z.object({
    budgetId: idSchema,
  }),
});

export const paramGoalIdSchema = z.object({
  params: z.object({
    goalId: idSchema,
  }),
});

// Esquema para upload de arquivo
export const fileUploadSchema = z.object({
  file: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine(
      (type) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(type),
      'Tipo de arquivo não suportado'
    ),
    size: z.number().max(10 * 1024 * 1024, 'Arquivo muito grande (máximo 10MB)'),
  }),
});

// Tipos TypeScript derivados dos esquemas
export type UserCreateInput = z.infer<typeof userCreateSchema>['body'];
export type UserUpdateInput = z.infer<typeof userUpdateSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type AccountCreateInput = z.infer<typeof accountCreateSchema>['body'];
export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>['body'];
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>['body'];
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>['body'];
export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>['body'];
export type TransactionUpdateInput = z.infer<typeof transactionUpdateSchema>['body'];
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>['query'];
export type BudgetCreateInput = z.infer<typeof budgetCreateSchema>['body'];
export type BudgetUpdateInput = z.infer<typeof budgetUpdateSchema>['body'];
export type GoalCreateInput = z.infer<typeof goalCreateSchema>['body'];
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>['body'];
export type PaginationInput = z.infer<typeof paginationSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
