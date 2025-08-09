import { z } from 'zod';

export const UserDto = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'MASTER']),
});

export type UserData = z.infer<typeof UserDto>;
