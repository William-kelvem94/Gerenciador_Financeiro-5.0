/**
 * DTO enterprise para transações financeiras
 * - Validação rigorosa com Zod
 * @author Will Finance Team
 */
import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(1).max(255),
  amount: z.number().positive().max(999999999.99),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().datetime(),
  userId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TransactionDTO = z.infer<typeof TransactionSchema>;
