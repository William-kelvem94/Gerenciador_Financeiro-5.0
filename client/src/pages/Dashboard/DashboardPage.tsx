import React from 'react';

export function DashboardPage() {
  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Balance</h3>
          <p className="text-2xl font-bold text-green-400">$0.00</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold text-blue-400">$0.00</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Monthly Expenses</h3>
          <p className="text-2xl font-bold text-red-400">$0.00</p>
        </div>
      </div>
    </div>
  );
}