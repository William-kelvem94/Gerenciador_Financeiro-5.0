import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '../services/transactionService';
import { transactionListSchema } from '../schemas/transactionSchemas';
import { z } from 'zod';
import { TransactionTable } from '../components/TransactionTable';
import { TransactionModal } from '../components/TransactionModal';
import { useTransactionStore } from '../stores/transactionStore';

const TransactionsPage: React.FC = () => {
  const { setTransactions, openModal } = useTransactionStore();

  const { data, error, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await getTransactions();
      // Validação Zod
      return transactionListSchema.parse(response);
    },
    staleTime: 1000 * 60, // 1 min
  });

  useEffect(() => {
    if (data) setTransactions(data.transactions);
  }, [data, setTransactions]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary px-4">
      <h2 className="text-2xl font-bold text-cyber-primary mb-4">Transações</h2>
      <p className="text-muted-foreground mb-6">Lista e gestão de transações financeiras</p>
      <button
        className="mb-4 px-4 py-2 bg-cyber-primary text-white rounded hover:bg-cyber-secondary transition"
        onClick={openModal}
      >
        Nova Transação
      </button>
      {isLoading && <span className="text-cyber-primary">Carregando...</span>}
      {error && (
        <span className="text-red-500">
          Erro ao carregar transações: {error instanceof z.ZodError ? error.message : 'Erro inesperado'}
        </span>
      )}
      {data && <TransactionTable transactions={data.transactions} />}
      <TransactionModal />
    </div>
  );
};

export default TransactionsPage;
