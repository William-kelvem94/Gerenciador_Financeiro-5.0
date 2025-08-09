import { z } from 'zod';

export const UpdateTransactionSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  description: z.string().min(1).max(255).optional(),
  amount: z.number().positive().max(999999999.99).optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  category: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  accountId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional()
});

export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
