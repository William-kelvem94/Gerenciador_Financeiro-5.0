import { z } from 'zod';

export const UpdateBudgetSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  name: z.string().min(1).max(100).optional(),
  amount: z.number().positive().max(999999999.99).optional(),
  period: z.enum(['MONTHLY', 'YEARLY', 'CUSTOM']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categories: z.array(z.string().min(1)).optional(),
  alerts: z.array(z.object({
    type: z.enum(['LIMIT', 'GOAL']),
    value: z.number().positive(),
    enabled: z.boolean().default(true)
  })).optional()
});

export type UpdateBudgetDto = z.infer<typeof UpdateBudgetSchema>;
