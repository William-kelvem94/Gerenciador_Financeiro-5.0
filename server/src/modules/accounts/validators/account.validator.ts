import { AccountSchema } from '../dto/account.dto';
import { z } from 'zod';

export function validateAccount(data: unknown) {
  try {
    return { success: true, data: AccountSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
  return { success: false, errors: error.issues.map(e => e.message) };
    }
    return { success: false, errors: ['Erro desconhecido'] };
  }
}
