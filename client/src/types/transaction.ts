import { z } from 'zod';

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1).max(255),
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().datetime({ message: 'Data inválida' }),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
