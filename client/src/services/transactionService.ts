import axios from 'axios';
import { Transaction } from '../types/transaction';

export async function getTransactions(): Promise<{ transactions: Transaction[] }> {
  // Exemplo: busca transações de uma API REST
  const response = await axios.get('/api/transactions');
  return response.data;
}
