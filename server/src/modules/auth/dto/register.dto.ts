import { z } from 'zod';

export const RegisterDto = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterData = z.infer<typeof RegisterDto>;
