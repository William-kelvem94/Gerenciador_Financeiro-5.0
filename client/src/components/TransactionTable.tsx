import React from 'react';
import { Transaction } from '../types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => (
  <table className="min-w-full bg-white rounded shadow">
    <thead>
      <tr>
        <th className="px-4 py-2">Data</th>
        <th className="px-4 py-2">Descrição</th>
        <th className="px-4 py-2">Categoria</th>
        <th className="px-4 py-2">Valor</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map(tx => (
        <tr key={tx.id}>
          <td className="border px-4 py-2">{tx.date}</td>
          <td className="border px-4 py-2">{tx.description}</td>
          <td className="border px-4 py-2">{tx.category}</td>
          <td className="border px-4 py-2">R$ {tx.amount.toFixed(2)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
