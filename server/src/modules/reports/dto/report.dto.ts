import { z } from 'zod';

export const ReportSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['FINANCIAL', 'CATEGORY', 'TREND']),
  title: z.string().min(1, 'Título obrigatório').max(100),
  description: z.string().max(255).optional(),
  params: z.record(z.string(), z.unknown()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ReportDTO = z.infer<typeof ReportSchema>;
