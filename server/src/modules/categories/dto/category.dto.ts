import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Nome obrigatório').max(50),
  icon: z.string().min(1).max(50).optional(),
  color: z.string().min(3).max(7).optional(),
  type: z.enum(['INCOME', 'EXPENSE']),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CategoryDTO = z.infer<typeof CategorySchema>;
