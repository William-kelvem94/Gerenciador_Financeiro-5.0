import { Transaction, TransactionType } from './transaction.entity';

export class CreateTransactionDto implements Partial<Transaction> {
  descricao!: string;
  valor!: number;
  data!: string;
  categoria!: string;
  tipo!: TransactionType;
  conta?: string;
  observacao?: string;
}
