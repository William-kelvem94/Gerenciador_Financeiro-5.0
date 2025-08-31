import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useMasterUser } from '../../hooks/useMasterUser';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
} from 'lucide-react';

// Types para melhor type safety
interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
  account?: string;
}

interface TransactionFilters {
  search: string;
  type: 'ALL' | 'INCOME' | 'EXPENSE';
  category: string;
  dateFrom: string;
  dateTo: string;
}

// Mock transactions removido - apenas para referência de tipos

export function TransactionsPage() {
  const { isMaster, databases } = useMasterUser();

  // Estados otimizados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    type: 'ALL',
    category: '',
    dateFrom: '',
    dateTo: '',
  });

  // Fetch transactions com dados reais do banco
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/transactions', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTransactions(data.transactions || []);

      // Mostrar toast apenas na primeira carga
      if (transactions.length === 0) {
        const welcomeMessage = isMaster
          ? `Bem-vindo! Acesso Master ativado.`
          : `${data.transactions?.length || 0} transações carregadas.`;

        toast.success(welcomeMessage, {
          duration: 2000,
          position: 'top-right',
        });
      }
    } catch (err) {
      console.error('Erro ao carregar transações:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar transações';
      setError(errorMessage);
      setTransactions([]);

      // Mostrar toast de erro apenas se não for problema de rede comum
      if (!errorMessage.includes('Failed to fetch')) {
        toast.error(errorMessage, {
          duration: 4000,
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaster, databases, transactions.length]);

  // Effect otimizado para evitar loops - carrega apenas uma vez
  useEffect(() => {
    let isMounted = true;
    let hasLoaded = false;

    const loadTransactions = async () => {
      if (isMounted && !hasLoaded) {
        hasLoaded = true;
        await fetchTransactions();
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, [fetchTransactions]); // Dependências removidas para evitar loops

  // Transações filtradas
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch =
        !filters.search ||
        transaction.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = filters.type === 'ALL' || transaction.type === filters.type;

      const matchesCategory = !filters.category || transaction.category === filters.category;

      const transactionDate = new Date(transaction.date);
      const matchesDateFrom = !filters.dateFrom || transactionDate >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || transactionDate <= new Date(filters.dateTo);

      return matchesSearch && matchesType && matchesCategory && matchesDateFrom && matchesDateTo;
    });
  }, [transactions, filters]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      total: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Formatação de moeda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(Math.abs(amount));
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="transactions-page p-6"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-cyber-primary flex items-center gap-3 text-3xl font-bold">
            <CreditCard className="h-8 w-8" />
            Transações
          </h1>
          <p className="text-white-muted mt-2">Gerenciamento Financeiro Avançado</p>
        </header>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <motion.div className="glass rounded-lg p-6" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white-muted text-sm">Receitas</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.income)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div className="glass rounded-lg p-6" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white-muted text-sm">Despesas</p>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.expenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div className="glass rounded-lg p-6" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white-muted text-sm">Saldo</p>
                <p
                  className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-cyber-primary' : 'text-red-400'}`}
                >
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <DollarSign className="text-cyber-primary h-8 w-8" />
            </div>
          </motion.div>

          <motion.div className="glass rounded-lg p-6" whileHover={{ scale: 1.02 }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white-muted text-sm">Total</p>
                <p className="text-cyber-primary text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="text-cyber-primary h-8 w-8" />
            </div>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="text-white-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Buscar transações..."
                value={filters.search}
                onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="input w-full pl-10"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Importar
            </button>
            <button className="btn btn-secondary flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="glass overflow-hidden rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="border-cyber-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              <span className="text-white-muted ml-3">Carregando transações...</span>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="mb-4 text-red-400">⚠️ {error}</div>
              <button onClick={fetchTransactions} className="btn btn-primary">
                Tentar Novamente
              </button>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className="text-white-muted mx-auto mb-4 h-16 w-16" />
              <h3 className="text-white-primary mb-2 text-lg font-medium">
                Nenhuma Transação Encontrada
              </h3>
              <p className="text-white-muted mb-6">Comece adicionando sua primeira transação</p>
              <button className="btn btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Transação
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black-secondary/50">
                  <tr>
                    <th className="text-white-secondary p-4 text-left font-medium">Data</th>
                    <th className="text-white-secondary p-4 text-left font-medium">Descrição</th>
                    <th className="text-white-secondary p-4 text-left font-medium">Categoria</th>
                    <th className="text-white-secondary p-4 text-left font-medium">Conta</th>
                    <th className="text-white-secondary p-4 text-right font-medium">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-cyber-border-muted hover:bg-black-secondary/30 border-t transition-colors"
                    >
                      <td className="text-white-muted p-4 text-sm">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="p-4">
                        <div className="text-white-primary font-medium">
                          {transaction.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-cyber-primary/10 text-cyber-primary inline-flex items-center rounded-full px-2 py-1 text-xs font-medium">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="text-white-muted p-4 text-sm">
                        {transaction.account || 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`font-bold ${
                            transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {transaction.type === 'INCOME' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="text-white-muted mt-6 flex items-center justify-between text-sm">
          <div>Sistema Online • {formatDate(new Date().toISOString())}</div>
          <div>
            {isMaster && (
              <span className="text-cyber-primary font-medium">
                Modo Master Ativo • Bancos: {databases.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
