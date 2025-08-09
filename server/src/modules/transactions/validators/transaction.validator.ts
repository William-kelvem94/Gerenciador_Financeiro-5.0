import { CreateTransactionSchema } from '../dto/create-transaction.dto';
import { UpdateTransactionSchema } from '../dto/update-transaction.dto';
import { TransactionSchema } from '../dto/transaction.dto';
import { z } from 'zod';

/**
 * Valida dados para criação de transação
 * @param data Dados recebidos
 * @returns Resultado da validação Zod
 */
export function validateCreateTransaction(data: unknown) {
  return CreateTransactionSchema.safeParse(data);
}

/**
 * Valida dados para atualização de transação
 * @param data Dados recebidos
 * @returns Resultado da validação Zod
 */
export function validateUpdateTransaction(data: unknown) {
  return UpdateTransactionSchema.safeParse(data);
}

/**
 * Valida dados de uma transação completa
 * @param data Dados recebidos
 * @returns Resultado da validação Zod
 */
export function validateTransaction(data: unknown) {
  return TransactionSchema.safeParse(data);
}
