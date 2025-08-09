import { create } from 'zustand';
import { Transaction } from '../types/transaction';

interface TransactionStore {
  transactions: Transaction[];
  setTransactions: (txs: Transaction[]) => void;
  openModal: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  setTransactions: (txs) => set({ transactions: txs }),
  openModal: () => {
    // Aqui você pode implementar lógica para abrir o modal
    // Exemplo: set({ modalOpen: true })
    alert('Abrir modal de transação (implementar lógica real)');
  },
}));
