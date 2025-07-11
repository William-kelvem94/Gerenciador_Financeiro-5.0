import React from 'react';

export function TransactionsPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-gray-400">No transactions yet. Create your first transaction!</p>
      </div>
    </div>
  );
}