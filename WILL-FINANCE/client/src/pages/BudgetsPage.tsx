import { useState } from 'react';
import { 
  Target, 
  Plus, 
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  PieChart
} from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  status: 'on-track' | 'warning' | 'over-budget';
}

const mockBudgets: Budget[] = [
  {
    id: '1',
    name: 'Alimentação',
    category: 'food',
    limit: 800.00,
    spent: 450.30,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'on-track'
  },
  {
    id: '2',
    name: 'Transporte',
    category: 'transport',
    limit: 300.00,
    spent: 280.50,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'warning'
  },
  {
    id: '3',
    name: 'Entretenimento',
    category: 'entertainment',
    limit: 200.00,
    spent: 250.75,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'over-budget'
  },
  {
    id: '4',
    name: 'Compras Online',
    category: 'shopping',
    limit: 400.00,
    spent: 125.90,
    period: 'monthly',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'on-track'
  }
];

export function BudgetsPage() {
  const [budgets] = useState<Budget[]>(mockBudgets);
  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getStatusColor = (status: Budget['status']) => {
    switch (status) {
      case 'on-track':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'over-budget':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: Budget['status']) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'over-budget':
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Budget['status']) => {
    switch (status) {
      case 'on-track':
        return 'No Controle';
      case 'warning':
        return 'Atenção';
      case 'over-budget':
        return 'Estourado';
      default:
        return 'Desconhecido';
    }
  };

  const getPeriodLabel = (period: Budget['period']) => {
    switch (period) {
      case 'monthly':
        return 'Mensal';
      case 'weekly':
        return 'Semanal';
      case 'yearly':
        return 'Anual';
      default:
        return 'Desconhecido';
    }
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  const overBudgetCount = budgets.filter(b => b.status === 'over-budget').length;
  const warningCount = budgets.filter(b => b.status === 'warning').length;

  const getProgressColor = (progress: number) => {
    if (progress < 75) return 'text-green-400';
    if (progress < 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBarColor = (progress: number) => {
    if (progress < 75) return 'bg-gradient-to-r from-green-500 to-green-400';
    if (progress < 90) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Orçamentos</h1>
          <p className="text-gray-400">Controle seus gastos por categoria</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Target className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Orçamento Total</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalBudget)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Gasto</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Restante</p>
              <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(remainingBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Alertas</p>
              <p className="text-2xl font-bold text-yellow-400">{overBudgetCount + warningCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cyan-100">Progresso Geral</h2>
          <span className={`text-lg font-semibold ${
            totalSpent <= totalBudget ? 'text-green-400' : 'text-red-400'
          }`}>
            {((totalSpent / totalBudget) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              totalSpent <= totalBudget ? 'bg-gradient-to-r from-green-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Gasto: {formatCurrency(totalSpent)}</span>
          <span>Orçamento: {formatCurrency(totalBudget)}</span>
        </div>
      </div>

      {/* Budgets List */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-100">Seus Orçamentos</h2>
          <p className="text-gray-400">Total de {budgets.length} orçamentos ativos</p>
        </div>

        <div className="divide-y divide-gray-700">
          {budgets.map((budget) => {
            const progress = getProgressPercentage(budget.spent, budget.limit);
            const isOverBudget = budget.spent > budget.limit;
            
            return (
              <div key={budget.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <PieChart className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">{budget.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span>{getPeriodLabel(budget.period)}</span>
                        <span>•</span>
                        <span>{new Date(budget.startDate).toLocaleDateString('pt-BR')} - {new Date(budget.endDate).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(budget.status)}
                      <span className={`text-sm font-medium ${getStatusColor(budget.status)}`}>
                        {getStatusLabel(budget.status)}
                      </span>
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

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-300">
                        {formatCurrency(budget.spent)} de {formatCurrency(budget.limit)}
                      </span>
                      {isOverBudget && (
                        <span className="text-red-400 text-sm">
                          (Excesso: {formatCurrency(budget.spent - budget.limit)})
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${getProgressColor(progress)}`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(progress)}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Budget Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-cyan-100 mb-4">Novo Orçamento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Nome do Orçamento</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Alimentação"
                />
              </div>
              <div>
                <label htmlFor="budget-category" className="block text-gray-300 text-sm font-medium mb-2">Categoria</label>
                <select id="budget-category" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="food">Alimentação</option>
                  <option value="transport">Transporte</option>
                  <option value="entertainment">Entretenimento</option>
                  <option value="shopping">Compras</option>
                  <option value="bills">Contas</option>
                  <option value="health">Saúde</option>
                  <option value="education">Educação</option>
                  <option value="other">Outros</option>
                </select>
              </div>
              <div>
                <label htmlFor="budget-limit" className="block text-gray-300 text-sm font-medium mb-2">Limite</label>
                <input
                  id="budget-limit"
                  type="number"
                  step="0.01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="budget-period" className="block text-gray-300 text-sm font-medium mb-2">Período</label>
                <select id="budget-period" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  <option value="monthly">Mensal</option>
                  <option value="weekly">Semanal</option>
                  <option value="yearly">Anual</option>
                </select>
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
                Criar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
