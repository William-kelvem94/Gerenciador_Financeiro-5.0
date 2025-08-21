import { Transaction } from '../types/transaction';

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, tx) => {
    return tx.type === 'INCOME' ? acc + tx.amount : acc - tx.amount;
  }, 0);
}
