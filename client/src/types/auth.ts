import { z } from 'zod';

export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(['USER', 'ADMIN', 'MASTER']),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type AuthUser = z.infer<typeof AuthUserSchema>;
