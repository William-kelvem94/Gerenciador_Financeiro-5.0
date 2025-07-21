import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { ModernCard } from '../../components/ui/ModernCard';
import { ModernButton } from '../../components/ui/ModernButton';
import { ModernInput } from '../../components/ui/ModernInput';
import { ModernModal } from '../../components/ui/ModernModal';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  createdAt: string;
}

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Mock data - em app real viria da API
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          description: 'Salário Mensal',
          amount: 5000.00,
          type: 'income',
          category: 'Salário',
          date: '2025-07-20',
          createdAt: '2025-07-20T10:00:00Z'
        },
        {
          id: '2',
          description: 'Compras no Supermercado',
          amount: 350.75,
          type: 'expense',
          category: 'Alimentação',
          date: '2025-07-19',
          createdAt: '2025-07-19T15:30:00Z'
        },
        {
          id: '3',
          description: 'Freelance Design',
          amount: 800.00,
          type: 'income',
          category: 'Freelance',
          date: '2025-07-18',
          createdAt: '2025-07-18T14:00:00Z'
        },
        {
          id: '4',
          description: 'Conta de Luz',
          amount: 120.50,
          type: 'expense',
          category: 'Utilidades',
          date: '2025-07-17',
          createdAt: '2025-07-17T09:00:00Z'
        },
        {
          id: '5',
          description: 'Aluguel',
          amount: 1200.00,
          type: 'expense',
          category: 'Moradia',
          date: '2025-07-15',
          createdAt: '2025-07-15T08:00:00Z'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setTransactions(mockTransactions);
    } catch {
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const renderTransactionsList = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-300 rounded animate-pulse"></div>
          ))}
        </div>
      );
    }

    if (filteredTransactions.length === 0) {
      return (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-50" />
          <p className="text-text-secondary">No transactions found</p>
          <p className="text-sm text-text-secondary">Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredTransactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {transaction.type === 'income' ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{transaction.description}</p>
                <p className="text-sm text-text-secondary">{transaction.category}</p>
                <p className="text-xs text-text-secondary">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 text-text-secondary hover:text-primary transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-text-secondary hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const balance = totalIncome - totalExpense;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-text-secondary">
            Track and manage your financial transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <ModernButton
            variant="secondary"
            icon={Download}
            onClick={() => toast.success('Export clicked!')}
          >
            Export
          </ModernButton>
          <ModernButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowAddModal(true)}
            glow
          >
            Add Transaction
          </ModernButton>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModernCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={TrendingUp}
          color="green"
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Total Expenses"
          value={formatCurrency(totalExpense)}
          icon={TrendingDown}
          color="red"
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Balance"
          value={formatCurrency(balance)}
          icon={DollarSign}
          color={balance >= 0 ? 'green' : 'red'}
          glassmorphism
          neonBorder
        />
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <ModernInput
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              clearable
              onClear={() => setSearchTerm('')}
              variant="filled"
            />
          </div>
          <div className="flex gap-2">
            <ModernButton
              variant={filterType === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </ModernButton>
            <ModernButton
              variant={filterType === 'income' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('income')}
              className={filterType === 'income' ? '!bg-green-500 !hover:bg-green-600' : ''}
            >
              Income
            </ModernButton>
            <ModernButton
              variant={filterType === 'expense' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilterType('expense')}
              className={filterType === 'expense' ? '!bg-red-500 !hover:bg-red-600' : ''}
            >
              Expenses
            </ModernButton>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-text-secondary opacity-50" />
            <p className="text-text-secondary">No transactions found</p>
            <p className="text-sm text-text-secondary">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-background/30 rounded-lg hover:bg-background/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{transaction.description}</h3>
                    <p className="text-sm text-text-secondary">{transaction.category} • {formatDate(transaction.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-1 text-text-secondary hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-text-secondary hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card border border-primary/20 rounded-xl p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Add Transaction</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                <input
                  id="description"
                  type="text"
                  placeholder="Enter description..."
                  className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-2">Amount</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-2">Type</label>
                <select id="type" className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary">
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-2">Category</label>
                <input
                  id="category"
                  type="text"
                  placeholder="Enter category..."
                  className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-background/50 text-text-secondary rounded-lg hover:bg-background/70 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.success('Transaction added successfully!');
                    setShowAddModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                >
                  Add Transaction
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}