import { z } from 'zod';

export const ReportSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  data: z.array(z.unknown()),
  createdAt: z.string().datetime(),
  type: z.enum(['SUMMARY', 'CATEGORY', 'TREND']),
});

export type Report = z.infer<typeof ReportSchema>;
