import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  Tag,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw
} from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salário - Empresa XYZ',
      amount: 8500.00,
      type: 'income',
      category: 'Salário',
      date: '2025-08-01',
      status: 'completed'
    },
    {
      id: '2', 
      description: 'Supermercado Central',
      amount: -350.75,
      type: 'expense',
      category: 'Alimentação',
      date: '2025-07-30',
      status: 'completed'
    },
    {
      id: '3',
      description: 'Freelance - Projeto Web',
      amount: 2500.00,
      type: 'income',
      category: 'Freelance',
      date: '2025-07-28',
      status: 'completed'
    },
    {
      id: '4',
      description: 'Conta de Luz',
      amount: -180.45,
      type: 'expense',
      category: 'Utilidades',
      date: '2025-07-25',
      status: 'pending'
    },
    {
      id: '5',
      description: 'Investimento - Ações',
      amount: -1500.00,
      type: 'expense',
      category: 'Investimentos',
      date: '2025-07-22',
      status: 'completed'
    }
  ]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-4xl font-cyber text-cyber-primary mb-2 text-glow">
            Transações
          </h1>
          <p className="text-foreground-muted font-mono">
            Histórico completo de movimentações financeiras
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary mt-4 lg:mt-0 self-start lg:self-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-mono">Nova Transação</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-6 rounded-xl border border-cyber-accent/30 hover:shadow-[0_0_20px_#39FF14] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-accent to-cyber-primary rounded-lg flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-background" />
            </div>
            <TrendingUp className="w-5 h-5 text-cyber-accent" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Total de Receitas</h3>
          <p className="text-2xl font-bold text-cyber-accent">
            R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6 rounded-xl border border-cyber-danger/30 hover:shadow-[0_0_20px_#FF0040] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-danger to-cyber-secondary rounded-lg flex items-center justify-center">
              <ArrowDownCircle className="w-6 h-6 text-background" />
            </div>
            <TrendingDown className="w-5 h-5 text-cyber-danger" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Total de Gastos</h3>
          <p className="text-2xl font-bold text-cyber-danger">
            R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass p-6 rounded-xl border border-cyber-primary/30 hover:shadow-glow transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-cyber rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-background" />
            </div>
            <RefreshCw className="w-5 h-5 text-cyber-primary" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Saldo Líquido</h3>
          <p className="text-2xl font-bold text-cyber-primary">
            R$ {(totalIncome - totalExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass p-6 rounded-xl border border-cyber-primary/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyber-primary w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glow pl-12 pr-4 py-3 w-full bg-background-secondary/50 border border-cyber-primary/30 rounded-lg text-foreground placeholder:text-foreground-muted focus:border-cyber-primary focus:shadow-glow-sm transition-all duration-300"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                filterType === 'all'
                  ? 'bg-cyber-primary text-background'
                  : 'bg-background-secondary text-foreground-secondary hover:text-cyber-primary'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                filterType === 'income'
                  ? 'bg-cyber-accent text-background'
                  : 'bg-background-secondary text-foreground-secondary hover:text-cyber-accent'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                filterType === 'expense'
                  ? 'bg-cyber-danger text-background'
                  : 'bg-background-secondary text-foreground-secondary hover:text-cyber-danger'
              }`}
            >
              Gastos
            </button>
          </div>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.5 }}
        className="glass rounded-xl border border-cyber-primary/20 overflow-hidden"
      >
        <div className="p-6 border-b border-cyber-primary/20">
          <h3 className="text-lg font-cyber text-cyber-primary">Histórico de Transações</h3>
        </div>
        
        <div className="divide-y divide-cyber-primary/10">
          {filteredTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 hover:bg-background-secondary/30 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' 
                      ? 'bg-cyber-accent/20 text-cyber-accent' 
                      : 'bg-cyber-danger/20 text-cyber-danger'
                  }`}>
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle className="w-6 h-6" />
                    ) : (
                      <ArrowDownCircle className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground group-hover:text-cyber-primary transition-colors">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="flex items-center text-sm text-foreground-muted font-mono">
                        <Tag className="w-4 h-4 mr-1" />
                        {transaction.category}
                      </span>
                      <span className="flex items-center text-sm text-foreground-muted font-mono">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'income' ? 'text-cyber-accent' : 'text-cyber-danger'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-mono mt-1 ${
                    transaction.status === 'completed' 
                      ? 'bg-cyber-accent/20 text-cyber-accent'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-cyber-danger/20 text-cyber-danger'
                  }`}>
                    {transaction.status === 'completed' ? 'Concluída' : 
                     transaction.status === 'pending' ? 'Pendente' : 'Cancelada'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}