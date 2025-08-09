import { z } from 'zod';

export const CreateTransactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(255),
  amount: z.number().positive('Valor deve ser positivo').max(999999999.99),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().datetime(),
  accountId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional()
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
