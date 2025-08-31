import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  // TODO: Integrar com store de relatórios reais
  const isLoading = false;
  const mockReports = {
    overview: {
      totalIncome: 15000,
      totalExpenses: 8500,
      netIncome: 6500,
      transactionCount: 45,
    },
    monthlyTrends: [
      { month: '2024-01', income: 12000, expenses: 7000 },
      { month: '2024-02', income: 14000, expenses: 8000 },
      { month: '2024-03', income: 15000, expenses: 8500 },
    ],
  };
  if (isLoading) {
    return <LoadingScreen message="Generating reports..." />;
  }
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="font-cyber text-cyber-primary mb-2 text-3xl">Financial Reports</h1>
          <p className="text-white-secondary">Analyze your financial data and trends</p>
        </div>
        <div className="mt-4 flex items-center space-x-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="bg-black-secondary border-cyber-border focus:ring-cyber-primary rounded-lg border px-4 py-2 focus:ring-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="bg-cyber-primary text-cyber-dark hover:bg-cyber-secondary flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <div className="bg-black-secondary border-cyber-border rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Total Income</h3>
            <TrendingUp className="text-cyber-accent h-6 w-6" />
          </div>
          <div className="font-cyber text-cyber-accent mb-2 text-3xl">
            {mockReports.overview.totalIncome.toLocaleString()}
          </div>
          <p className="text-white-secondary text-sm">+12% from last period</p>
        </div>
        <div className="bg-black-secondary border-cyber-border rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Total Expenses</h3>
            <BarChart3 className="text-cyber-danger h-6 w-6" />
          </div>
          <div className="font-cyber text-cyber-danger mb-2 text-3xl">
            {mockReports.overview.totalExpenses.toLocaleString()}
          </div>
          <p className="text-white-secondary text-sm">-5% from last period</p>
        </div>
        <div className="bg-black-secondary border-cyber-border rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Net Income</h3>
            <TrendingUp className="text-cyber-primary h-6 w-6" />
          </div>
          <div className="font-cyber text-cyber-primary mb-2 text-3xl">
            {mockReports.overview.netIncome.toLocaleString()}
          </div>
          <p className="text-white-secondary text-sm">+25% from last period</p>
        </div>
        <div className="bg-black-secondary border-cyber-border rounded-xl border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Transactions</h3>
            <Calendar className="text-cyber-warning h-6 w-6" />
          </div>
          <div className="font-cyber text-cyber-warning mb-2 text-3xl">
            {mockReports.overview.transactionCount}
          </div>
          <p className="text-white-secondary text-sm">This period</p>
        </div>
      </motion.div>
      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black-secondary border-cyber-border rounded-xl border p-6"
        >
          <h3 className="mb-6 text-xl font-semibold text-white">Income vs Expenses</h3>
          <div className="border-cyber-border-secondary flex h-64 items-center justify-center rounded-lg border">
            <p className="text-white-muted">Chart will be implemented here</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black-secondary border-cyber-border rounded-xl border p-6"
        >
          <h3 className="mb-6 text-xl font-semibold text-white">Category Breakdown</h3>
          <div className="border-cyber-border-secondary flex h-64 items-center justify-center rounded-lg border">
            <p className="text-white-muted">Pie chart will be implemented here</p>
          </div>
        </motion.div>
      </div>
      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black-secondary border-cyber-border rounded-xl border p-6"
      >
        <h3 className="mb-6 text-xl font-semibold text-white">Monthly Trends</h3>
        <div className="border-cyber-border-secondary flex h-80 items-center justify-center rounded-lg border">
          <p className="text-white-muted">Line chart will be implemented here</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;
