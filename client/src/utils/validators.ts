import { TransactionSchema } from '../types/transaction';
import { BudgetSchema } from '../types/budget';
import { ReportSchema } from '../types/report';

export function validateTransaction(data: unknown) {
  return TransactionSchema.safeParse(data);
}

export function validateBudget(data: unknown) {
  return BudgetSchema.safeParse(data);
}

export function validateReport(data: unknown) {
  return ReportSchema.safeParse(data);
}
