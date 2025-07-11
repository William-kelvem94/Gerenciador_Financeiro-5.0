import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpDown,
  Calendar,
  DollarSign,
  Tag,
  Edit3,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet
} from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  account: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

// Dados reais serão carregados da API
const emptyTransactions: Transaction[] = [];

export function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(emptyTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense' | 'transfer'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'description'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'expense':
        return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      case 'transfer':
        return <ArrowUpDown className="h-4 w-4 text-blue-400" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'Receita';
      case 'expense':
        return 'Despesa';
      case 'transfer':
        return 'Transferência';
      default:
        return 'Desconhecido';
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconhecida';
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    })
    .sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'date':
          compareValue = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          compareValue = a.amount - b.amount;
          break;
        case 'description':
          compareValue = a.description.localeCompare(b.description);
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  const categories = Array.from(new Set(transactions.map(t => t.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Transações</h1>
          <p className="text-gray-400">Gerencie todas as suas transações financeiras</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Transação</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Receitas</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <ArrowDownRight className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Despesas</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Saldo</p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
            <option value="transfer">Transferências</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">Todas as categorias</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="date">Data</option>
              <option value="amount">Valor</option>
              <option value="description">Descrição</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 hover:text-gray-200 transition-colors"
            >
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-cyan-100">
              Transações ({filteredTransactions.length})
            </h2>
            <div className="flex items-center space-x-2 text-gray-400">
              <Filter className="h-4 w-4" />
              <span className="text-sm">
                {filteredTransactions.length} de {transactions.length} transações
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-700">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'bg-green-500/20' :
                    transaction.type === 'expense' ? 'bg-red-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {getTypeIcon(transaction.type)}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">{transaction.description}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{transaction.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {transaction.account.includes('Cartão') ? 
                          <CreditCard className="h-3 w-3" /> : 
                          <Wallet className="h-3 w-3" />
                        }
                        <span>{transaction.account}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {getStatusLabel(transaction.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-green-400' :
                      transaction.type === 'expense' ? 'text-red-400' :
                      'text-blue-400'
                    }`}>
                      {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-gray-400 text-sm">{getTypeLabel(transaction.type)}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Nenhuma transação encontrada</h3>
              <p className="text-gray-400">
                Tente ajustar os filtros ou adicionar uma nova transação.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-cyan-100 mb-4">Nova Transação</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="transaction-description" className="block text-gray-300 text-sm font-medium mb-2">
                  Descrição
                </label>
                <input
                  id="transaction-description"
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Supermercado"
                />
              </div>
              <div>
                <label htmlFor="transaction-amount" className="block text-gray-300 text-sm font-medium mb-2">
                  Valor
                </label>
                <input
                  id="transaction-amount"
                  type="number"
                  step="0.01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="transaction-type" className="block text-gray-300 text-sm font-medium mb-2">
                  Tipo
                </label>
                <select
                  id="transaction-type"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                  <option value="transfer">Transferência</option>
                </select>
              </div>
              <div>
                <label htmlFor="transaction-category" className="block text-gray-300 text-sm font-medium mb-2">
                  Categoria
                </label>
                <select
                  id="transaction-category"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="food">Alimentação</option>
                  <option value="transport">Transporte</option>
                  <option value="entertainment">Entretenimento</option>
                  <option value="shopping">Compras</option>
                  <option value="bills">Contas</option>
                  <option value="salary">Salário</option>
                  <option value="freelance">Freelance</option>
                  <option value="other">Outros</option>
                </select>
              </div>
              <div>
                <label htmlFor="transaction-account" className="block text-gray-300 text-sm font-medium mb-2">
                  Conta
                </label>
                <select
                  id="transaction-account"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>
              <div>
                <label htmlFor="transaction-date" className="block text-gray-300 text-sm font-medium mb-2">
                  Data
                </label>
                <input
                  id="transaction-date"
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all duration-200"
              >
                Criar Transação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
