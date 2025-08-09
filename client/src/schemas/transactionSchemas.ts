import { z } from 'zod';
import { Transaction } from '../types/transaction';

export const transactionSchema = z.object({
  id: z.string(),
  amount: z.number(),
  date: z.string(),
  description: z.string(),
  category: z.string(),
});

export const transactionListSchema = z.object({
  transactions: z.array(transactionSchema),
});

export type TransactionList = z.infer<typeof transactionListSchema>;
