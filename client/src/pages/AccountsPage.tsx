import { useState } from 'react';
import { 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  Plus, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  isVisible: boolean;
  lastUpdated: string;
}

// Dados reais serão carregados da API
const emptyAccounts: Account[] = [];

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(emptyAccounts);
  const [showAddModal, setShowAddModal] = useState(false);

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return <Wallet className="h-6 w-6" />;
      case 'savings':
        return <PiggyBank className="h-6 w-6" />;
      case 'credit':
        return <CreditCard className="h-6 w-6" />;
      case 'investment':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const getAccountTypeLabel = (type: Account['type']) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança';
      case 'credit':
        return 'Cartão de Crédito';
      case 'investment':
        return 'Investimentos';
      default:
        return 'Desconhecido';
    }
  };

  const toggleVisibility = (accountId: string) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isVisible: !account.isVisible }
        : account
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const totalBalance = accounts
    .filter(account => account.type !== 'credit')
    .reduce((sum, account) => sum + account.balance, 0);

  const totalDebt = accounts
    .filter(account => account.type === 'credit' && account.balance < 0)
    .reduce((sum, account) => sum + Math.abs(account.balance), 0);

  const getAccountClass = (accountType: Account['type']) => {
    switch (accountType) {
      case 'checking':
        return 'bg-blue-500/20 text-blue-400';
      case 'savings':
        return 'bg-green-500/20 text-green-400';
      case 'credit':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Contas</h1>
          <p className="text-gray-400">Gerencie suas contas e saldos</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Conta</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Patrimônio Total</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Dívidas Totais</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalDebt)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Wallet className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Patrimônio Líquido</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalBalance - totalDebt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-100">Suas Contas</h2>
          <p className="text-gray-400">Total de {accounts.length} contas</p>
        </div>

        <div className="divide-y divide-gray-700">
          {accounts.map((account) => (
            <div key={account.id} className="p-6 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${getAccountClass(account.type)}`}>
                    {getAccountIcon(account.type)}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">{account.name}</h3>
                    <p className="text-gray-400 text-sm">{getAccountTypeLabel(account.type)}</p>
                    <p className="text-gray-500 text-xs">
                      Atualizado em {new Date(account.lastUpdated).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      account.balance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {account.isVisible ? formatCurrency(account.balance) : '••••••'}
                    </p>
                    <p className="text-gray-400 text-sm">{account.currency}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleVisibility(account.id)}
                      className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {account.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
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
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-cyan-100 mb-4">Nova Conta</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="account-name" className="block text-gray-300 text-sm font-medium mb-2">Nome da Conta</label>
                <input
                  id="account-name"
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Conta Corrente"
                />
              </div>
              <div>
                <label htmlFor="account-type" className="block text-gray-300 text-sm font-medium mb-2">Tipo de Conta</label>
                <select id="account-type" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="checking">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="investment">Investimentos</option>
                </select>
              </div>
              <div>
                <label htmlFor="initial-balance" className="block text-gray-300 text-sm font-medium mb-2">Saldo Inicial</label>
                <input
                  id="initial-balance"
                  type="number"
                  step="0.01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="0.00"
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
                Criar Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
