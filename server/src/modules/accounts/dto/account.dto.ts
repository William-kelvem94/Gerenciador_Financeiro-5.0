import { z } from 'zod';

export const AccountSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome obrigatório').max(100),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT', 'INVESTMENT']),
  balance: z.number().min(0, 'Saldo não pode ser negativo').default(0),
  currency: z.string().min(1).default('BRL'),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type AccountDTO = z.infer<typeof AccountSchema>;
