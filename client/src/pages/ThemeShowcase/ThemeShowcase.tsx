import React from 'react';
import { motion } from 'framer-motion';
import { ThemeSelector } from '../../components/theme/ThemeSelector';
import { 
  CreditCard, 
  TrendingUp, 
  PieChart, 
  DollarSign, 
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const stats = [
  { title: 'Total Balance', value: 'R$ 12,450.00', change: '+5.2%', icon: DollarSign, positive: true },
  { title: 'Monthly Income', value: 'R$ 8,200.00', change: '+12.1%', icon: TrendingUp, positive: true },
  { title: 'Monthly Expenses', value: 'R$ 3,750.00', change: '-8.5%', icon: ArrowDownRight, positive: false },
  { title: 'Savings Goal', value: '68%', change: '+15%', icon: Target, positive: true },
];

const transactions = [
  { id: 1, description: 'Salary Payment', amount: 'R$ 8,200.00', type: 'income', date: '2025-07-18' },
  { id: 2, description: 'Grocery Shopping', amount: 'R$ 450.00', type: 'expense', date: '2025-07-17' },
  { id: 3, description: 'Investment Return', amount: 'R$ 320.00', type: 'income', date: '2025-07-16' },
  { id: 4, description: 'Electricity Bill', amount: 'R$ 180.00', type: 'expense', date: '2025-07-15' },
];

export function ThemeShowcase() {
  return (
    <div className="min-h-screen p-6">
      {/* Header with Theme Selector */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'rgb(var(--foreground))' }}>
            Will Finance 5.0
          </h1>
          <p style={{ color: 'rgb(var(--muted-foreground))' }}>
            Advanced Theme System Showcase
          </p>
        </div>
        <ThemeSelector />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-6 hover-glow transition-all duration-300"
              style={{
                backgroundColor: 'rgba(var(--card), 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(var(--border), 0.3)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(var(--primary), 0.1)' }}>
                  <Icon className="w-6 h-6" style={{ color: 'rgb(var(--primary))' }} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1" style={{ color: 'rgb(var(--foreground))' }}>
                {stat.value}
              </h3>
              <p className="text-sm" style={{ color: 'rgb(var(--muted-foreground))' }}>
                {stat.title}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass rounded-xl p-6"
          style={{
            backgroundColor: 'rgba(var(--card), 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(var(--border), 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--foreground))' }}>
              Financial Overview
            </h2>
            <PieChart className="w-6 h-6" style={{ color: 'rgb(var(--primary))' }} />
          </div>
          
          {/* Mock Chart Area */}
          <div className="h-64 rounded-lg flex items-center justify-center"
               style={{ backgroundColor: 'rgba(var(--muted), 0.3)' }}>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 gradient-primary opacity-80 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Chart</span>
              </div>
              <p style={{ color: 'rgb(var(--muted-foreground))' }}>
                Interactive chart would appear here
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transactions Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
          style={{
            backgroundColor: 'rgba(var(--card), 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(var(--border), 0.3)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold" style={{ color: 'rgb(var(--foreground))' }}>
              Recent Transactions
            </h2>
            <CreditCard className="w-6 h-6" style={{ color: 'rgb(var(--primary))' }} />
          </div>
          
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg transition-colors"
                style={{ backgroundColor: 'rgba(var(--muted), 0.2)' }}
              >
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'rgb(var(--foreground))' }}>
                    {transaction.description}
                  </p>
                  <p className="text-sm" style={{ color: 'rgb(var(--muted-foreground))' }}>
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{transaction.amount}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex flex-wrap gap-4 justify-center"
      >
        <button className="px-6 py-3 gradient-primary rounded-lg font-medium transition-all hover-glow"
                style={{ color: 'rgb(var(--primary-foreground))' }}>
          Add Transaction
        </button>
        <button className="px-6 py-3 rounded-lg font-medium transition-all hover-glow"
                style={{ 
                  backgroundColor: 'rgba(var(--secondary), 0.8)',
                  color: 'rgb(var(--secondary-foreground))',
                  border: '1px solid rgb(var(--border))'
                }}>
          View Reports
        </button>
        <button className="px-6 py-3 rounded-lg font-medium transition-all hover-glow"
                style={{ 
                  backgroundColor: 'transparent',
                  color: 'rgb(var(--accent-foreground))',
                  border: '1px solid rgb(var(--border))'
                }}>
          Settings
        </button>
      </motion.div>

      {/* Theme Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center p-6 rounded-xl"
        style={{ backgroundColor: 'rgba(var(--muted), 0.2)' }}
      >
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'rgb(var(--foreground))' }}>
          🎨 Advanced Theme System
        </h3>
        <p style={{ color: 'rgb(var(--muted-foreground))' }}>
          Experience 8 beautiful themes with seamless transitions, CSS variables, and modern design patterns.
          Each theme includes custom gradients, shadows, and color schemes for a unique user experience.
        </p>
      </motion.div>
    </div>
  );
}
