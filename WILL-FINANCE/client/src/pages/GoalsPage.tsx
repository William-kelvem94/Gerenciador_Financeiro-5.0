import { useState } from 'react';
import { 
  Target, 
  Plus, 
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Edit3,
  Trash2,
  Award
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Viagem para Europa',
    description: 'Juntar dinheiro para uma viagem de 15 dias pela Europa',
    targetAmount: 15000.00,
    currentAmount: 8750.50,
    category: 'travel',
    targetDate: '2024-12-15',
    priority: 'high',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Reserva de Emergência',
    description: 'Criar uma reserva de emergência equivalente a 6 meses de gastos',
    targetAmount: 25000.00,
    currentAmount: 12300.00,
    category: 'emergency',
    targetDate: '2024-08-01',
    priority: 'high',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '3',
    title: 'Novo Carro',
    description: 'Economizar para dar entrada em um carro novo',
    targetAmount: 20000.00,
    currentAmount: 5600.80,
    category: 'vehicle',
    targetDate: '2024-10-01',
    priority: 'medium',
    status: 'active',
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    title: 'Curso de Programação',
    description: 'Investir em um curso avançado de desenvolvimento',
    targetAmount: 2500.00,
    currentAmount: 2500.00,
    category: 'education',
    targetDate: '2024-03-01',
    priority: 'medium',
    status: 'completed',
    createdAt: '2024-01-01'
  }
];

export function GoalsPage() {
  const [goals] = useState<Goal[]>(mockGoals);
  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getPriorityLabel = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Desconhecida';
    }
  };

  const getStatusLabel = (status: Goal['status']) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'completed':
        return 'Concluída';
      case 'paused':
        return 'Pausada';
      default:
        return 'Desconhecida';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'travel':
        return 'Viagem';
      case 'emergency':
        return 'Emergência';
      case 'vehicle':
        return 'Veículo';
      case 'education':
        return 'Educação';
      case 'home':
        return 'Casa';
      case 'investment':
        return 'Investimento';
      default:
        return 'Outros';
    }
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');
  const totalTargetAmount = activeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Metas Financeiras</h1>
          <p className="text-gray-400">Defina e acompanhe seus objetivos financeiros</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Metas Ativas</p>
              <p className="text-2xl font-bold text-blue-400">{activeGoals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Concluídas</p>
              <p className="text-2xl font-bold text-green-400">{completedGoals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Valor Poupado</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalCurrentAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Meta Total</p>
              <p className="text-2xl font-bold text-purple-400">{formatCurrency(totalTargetAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-cyan-100">Progresso Geral</h2>
          <span className="text-lg font-semibold text-cyan-400">
            {totalTargetAmount > 0 ? ((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1) : 0}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all duration-300"
            style={{ width: `${totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span>Poupado: {formatCurrency(totalCurrentAmount)}</span>
          <span>Meta Total: {formatCurrency(totalTargetAmount)}</span>
        </div>
      </div>

      {/* Goals List */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-cyan-100">Suas Metas</h2>
          <p className="text-gray-400">Total de {goals.length} metas</p>
        </div>

        <div className="divide-y divide-gray-700">
          {goals.map((goal) => {
            const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysUntilTarget = getDaysUntilTarget(goal.targetDate);
            const isCompleted = goal.status === 'completed';
            
            return (
              <div key={goal.id} className="p-6 hover:bg-gray-700/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-500/20' : 'bg-cyan-500/20'
                    }`}>
                      {isCompleted ? (
                        <Award className="h-5 w-5 text-green-400" />
                      ) : (
                        <Target className="h-5 w-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-100">{goal.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          goal.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          goal.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {getPriorityLabel(goal.priority)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          goal.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                          goal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {getStatusLabel(goal.status)}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{goal.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{getCategoryLabel(goal.category)}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(goal.targetDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                        {!isCompleted && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span className={daysUntilTarget < 0 ? 'text-red-400' : daysUntilTarget < 30 ? 'text-yellow-400' : 'text-gray-400'}>
                                {daysUntilTarget < 0 ? `${Math.abs(daysUntilTarget)} dias atrasado` : `${daysUntilTarget} dias restantes`}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-cyan-400">
                        {formatCurrency(goal.currentAmount)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        de {formatCurrency(goal.targetAmount)}
                      </p>
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
                    <span className="text-gray-300">Progresso</span>
                    <span className={`text-sm font-semibold ${
                      isCompleted ? 'text-green-400' : 'text-cyan-400'
                    }`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        progress < 50 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        progress < 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-cyan-500 to-blue-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-cyan-100 mb-4">Nova Meta</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="goal-title" className="block text-gray-300 text-sm font-medium mb-2">
                  Título da Meta
                </label>
                <input
                  id="goal-title"
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Ex: Viagem para Europa"
                />
              </div>
              <div>
                <label htmlFor="goal-description" className="block text-gray-300 text-sm font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  id="goal-description"
                  rows={3}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Descreva sua meta..."
                />
              </div>
              <div>
                <label htmlFor="goal-amount" className="block text-gray-300 text-sm font-medium mb-2">
                  Valor da Meta
                </label>
                <input
                  id="goal-amount"
                  type="number"
                  step="0.01"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="goal-category" className="block text-gray-300 text-sm font-medium mb-2">
                  Categoria
                </label>
                <select
                  id="goal-category"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="travel">Viagem</option>
                  <option value="emergency">Emergência</option>
                  <option value="vehicle">Veículo</option>
                  <option value="education">Educação</option>
                  <option value="home">Casa</option>
                  <option value="investment">Investimento</option>
                  <option value="other">Outros</option>
                </select>
              </div>
              <div>
                <label htmlFor="goal-date" className="block text-gray-300 text-sm font-medium mb-2">
                  Data Limite
                </label>
                <input
                  id="goal-date"
                  type="date"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label htmlFor="goal-priority" className="block text-gray-300 text-sm font-medium mb-2">
                  Prioridade
                </label>
                <select
                  id="goal-priority"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
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
                Criar Meta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
