import { ReportSchema } from '../dto/report.dto';
import { z } from 'zod';

export function validateReport(data: unknown) {
  try {
    return { success: true, data: ReportSchema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues.map(e => e.message) };
    }
    return { success: false, errors: ['Erro desconhecido'] };
  }
}
