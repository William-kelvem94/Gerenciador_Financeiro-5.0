import { CreateTransactionSchema, UpdateTransactionSchema } from '../dto/create-transaction.dto';
import { z } from 'zod';

export function validateCreateTransaction(data: unknown) {
  return CreateTransactionSchema.safeParse(data);
}

export function validateUpdateTransaction(data: unknown) {
  return UpdateTransactionSchema.safeParse(data);
}
