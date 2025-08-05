import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import { TransactionModal, TransactionData } from '../../components/Modal/TransactionModal';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

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
  const { user, token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados para funcionar enquanto o backend não está conectado
  const mockTransactions: Transaction[] = [
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
      amount: 350.75,
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
      amount: 180.45,
      type: 'expense',
      category: 'Utilidades',
      date: '2025-07-25',
      status: 'pending'
    },
    {
      id: '5',
      description: 'Investimento - Ações',
      amount: 1500.00,
      type: 'expense',
      category: 'Investimentos',
      date: '2025-07-22',
      status: 'completed'
    }
  ];

  // Buscar transações
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar se usuário está autenticado
        if (!user) {
          setError('Usuário não autenticado');
          setTransactions([]);
          return;
        }

        // Tentar buscar do servidor, caso falhe usar dados mockados
        if (token) {
          try {
            const response = await fetch('http://localhost:8080/api/transactions', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              setTransactions(data.data || data);
            } else {
              throw new Error('Erro ao carregar do servidor');
            }
          } catch (serverError) {
            console.warn('Servidor não disponível, usando dados mockados:', serverError);
            setTransactions(mockTransactions);
            toast.success('Carregando dados de exemplo');
          }
        } else {
          // Sem token, usar dados mockados
          setTransactions(mockTransactions);
          toast('Modo demonstração - dados de exemplo', {
            icon: 'ℹ️',
            duration: 4000,
          });
        }
      } catch (err) {
        console.error('Erro ao carregar transações:', err);
        setError('Erro ao carregar transações');
        setTransactions(mockTransactions);
        toast.error('Erro ao carregar dados, usando exemplos');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user, token]);
  
  // Handler para abrir modal de nova transação
  const handleNewTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Handler para editar transação
  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Handler para deletar transação
  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      // Remover localmente
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      toast.success('Transação excluída com sucesso');
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      toast.error('Erro ao excluir transação');
    }
  };

  // Handler para salvar transação
  const handleSaveTransaction = async (transactionData: TransactionData) => {
    try {
      if (editingTransaction) {
        // Atualizar transação existente
        setTransactions(prev => prev.map(t => 
          t.id === editingTransaction.id 
            ? { ...transactionData, id: editingTransaction.id } as Transaction
            : t
        ));
        toast.success('Transação atualizada com sucesso');
      } else {
        // Criar nova transação
        const newTransaction: Transaction = {
          ...transactionData,
          id: Date.now().toString(),
          status: 'completed'
        } as Transaction;
        setTransactions(prev => [newTransaction, ...prev]);
        toast.success('Nova transação criada com sucesso');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      toast.error('Erro ao salvar transação');
    }
  };

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Calcular totais
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-cyber-primary mx-auto mb-4" />
          <p className="text-foreground-muted">Carregando transações...</p>
        </div>
      </div>
    );
  }

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
            Controle total de suas movimentações financeiras
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewTransaction}
          className="btn-primary mt-4 lg:mt-0 self-start lg:self-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="font-mono">Nova Transação</span>
        </motion.button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 rounded-xl border border-cyber-danger/30 bg-cyber-danger/10"
        >
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-cyber-danger mr-3" />
            <p className="text-cyber-danger font-mono">{error}</p>
          </div>
        </motion.div>
      )}

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
          className={`glass p-6 rounded-xl border transition-all duration-300 ${
            netBalance >= 0 
              ? 'border-cyber-primary/30 hover:shadow-glow' 
              : 'border-cyber-danger/30 hover:shadow-[0_0_20px_#FF0040]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              netBalance >= 0 
                ? 'bg-gradient-cyber' 
                : 'bg-gradient-to-br from-cyber-danger to-cyber-secondary'
            }`}>
              <DollarSign className="w-6 h-6 text-background" />
            </div>
            <RefreshCw className={`w-5 h-5 ${netBalance >= 0 ? 'text-cyber-primary' : 'text-cyber-danger'}`} />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Saldo Líquido</h3>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-cyber-primary' : 'text-cyber-danger'}`}>
            R$ {netBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                  : 'bg-background-secondary text-foreground-muted hover:text-cyber-primary'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                filterType === 'income'
                  ? 'bg-cyber-accent text-background'
                  : 'bg-background-secondary text-foreground-muted hover:text-cyber-accent'
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200 ${
                filterType === 'expense'
                  ? 'bg-cyber-danger text-background'
                  : 'bg-background-secondary text-foreground-muted hover:text-cyber-danger'
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
          <h3 className="text-lg font-cyber text-cyber-primary">
            Histórico de Transações ({filteredTransactions.length})
          </h3>
        </div>
        
        {filteredTransactions.length > 0 ? (
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        transaction.type === 'income' ? 'text-cyber-accent' : 'text-cyber-danger'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTransaction(transaction)}
                        className="p-2 text-cyber-primary hover:bg-cyber-primary/20 rounded-lg transition-colors"
                        title="Editar transação"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="p-2 text-cyber-danger hover:bg-cyber-danger/20 rounded-lg transition-colors"
                        title="Excluir transação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma transação encontrada</h3>
            <p className="text-foreground-muted mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Comece criando sua primeira transação'}
            </p>
            <button
              onClick={handleNewTransaction}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </button>
          </div>
        )}
      </motion.div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
        transaction={editingTransaction}
      />
    </div>
  );
}
