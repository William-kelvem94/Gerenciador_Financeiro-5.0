import { z } from 'zod';

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  limit: z.number().positive(),
  spent: z.number().nonnegative(),
  category: z.string().min(1),
  period: z.string(),
  alerts: z.array(z.string()).optional(),
});

export type Budget = z.infer<typeof BudgetSchema>;
