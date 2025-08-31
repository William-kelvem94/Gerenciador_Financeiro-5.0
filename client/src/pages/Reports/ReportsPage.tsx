import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import LoadingScreen from '../../components/ui/LoadingScreen';

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-cyber text-cyber-primary mb-2">
            Financial Reports
          </h1>
          <p className="text-white-secondary">
            Analyze your financial data and trends
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-black-secondary border border-cyber-border rounded-lg focus:ring-2 focus:ring-cyber-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-cyber-secondary transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>
      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
  <div className="bg-black-secondary border border-cyber-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Income</h3>
            <TrendingUp className="w-6 h-6 text-cyber-accent" />
          </div>
          <div className="text-3xl font-cyber text-cyber-accent mb-2">
            {mockReports.overview.totalIncome.toLocaleString()}
          </div>
          <p className="text-sm text-white-secondary">+12% from last period</p>
        </div>
  <div className="bg-black-secondary border border-cyber-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Total Expenses</h3>
            <BarChart3 className="w-6 h-6 text-cyber-danger" />
          </div>
          <div className="text-3xl font-cyber text-cyber-danger mb-2">
            {mockReports.overview.totalExpenses.toLocaleString()}
          </div>
          <p className="text-sm text-white-secondary">-5% from last period</p>
        </div>
  <div className="bg-black-secondary border border-cyber-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Net Income</h3>
            <TrendingUp className="w-6 h-6 text-cyber-primary" />
          </div>
          <div className="text-3xl font-cyber text-cyber-primary mb-2">
            {mockReports.overview.netIncome.toLocaleString()}
          </div>
          <p className="text-sm text-white-secondary">+25% from last period</p>
        </div>
  <div className="bg-black-secondary border border-cyber-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Transactions</h3>
            <Calendar className="w-6 h-6 text-cyber-warning" />
          </div>
          <div className="text-3xl font-cyber text-cyber-warning mb-2">
            {mockReports.overview.transactionCount}
          </div>
          <p className="text-sm text-white-secondary">This period</p>
        </div>
      </motion.div>
      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black-secondary border border-cyber-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Income vs Expenses</h3>
          <div className="h-64 flex items-center justify-center border border-cyber-border-secondary rounded-lg">
            <p className="text-white-muted">Chart will be implemented here</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black-secondary border border-cyber-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-6">Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center border border-cyber-border-secondary rounded-lg">
            <p className="text-white-muted">Pie chart will be implemented here</p>
          </div>
        </motion.div>
      </div>
      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
  className="bg-black-secondary border border-cyber-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6">Monthly Trends</h3>
  <div className="h-80 flex items-center justify-center border border-cyber-border-secondary rounded-lg">
          <p className="text-white-muted">Line chart will be implemented here</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsPage;