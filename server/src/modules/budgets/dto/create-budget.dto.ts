import { z } from 'zod';

export const CreateBudgetSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  amount: z.number().positive('Valor deve ser positivo').max(999999999.99),
  period: z.enum(['MONTHLY', 'YEARLY', 'CUSTOM']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  categories: z.array(z.string().min(1)).optional(),
  userId: z.string().uuid(),
  alerts: z.array(z.object({
    type: z.enum(['LIMIT', 'GOAL']),
    value: z.number().positive(),
    enabled: z.boolean().default(true)
  })).optional()
});

export type CreateBudgetDto = z.infer<typeof CreateBudgetSchema>;
