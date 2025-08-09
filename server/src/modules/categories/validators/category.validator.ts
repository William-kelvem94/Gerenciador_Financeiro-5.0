import { CategorySchema } from '../dto/category.dto';
import { z } from 'zod';

export function validateCategory(data: unknown) {
  try {
    return { success: true, data: CategorySchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map(e => e.message) };
    }
    return { success: false, errors: ['Erro desconhecido'] };
  }
}
