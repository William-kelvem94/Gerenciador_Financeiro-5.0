import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  PiggyBank, 
  TrendingUp, 
  AlertTriangle,
  Target,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { ModernCard } from '../../components/ui/ModernCard';
import { ModernButton } from '../../components/ui/ModernButton';
import { ModernModal } from '../../components/ui/ModernModal';
import { ModernInput } from '../../components/ui/ModernInput';
import toast from 'react-hot-toast';

interface Budget {
  id: string;
  name: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: string;
  endDate: string;
  color: string;
}

export function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      // Mock data - em app real viria da API
      const mockBudgets: Budget[] = [
        {
          id: '1',
          name: 'Groceries Budget',
          category: 'Food & Dining',
          limit: 600.00,
          spent: 420.75,
          period: 'monthly',
          startDate: '2025-07-01',
          endDate: '2025-07-31',
          color: '#10B981'
        },
        {
          id: '2',
          name: 'Entertainment',
          category: 'Entertainment',
          limit: 200.00,
          spent: 180.50,
          period: 'monthly',
          startDate: '2025-07-01',
          endDate: '2025-07-31',
          color: '#F59E0B'
        },
        {
          id: '3',
          name: 'Transportation',
          category: 'Transport',
          limit: 300.00,
          spent: 315.80,
          period: 'monthly',
          startDate: '2025-07-01',
          endDate: '2025-07-31',
          color: '#EF4444'
        },
        {
          id: '4',
          name: 'Shopping',
          category: 'Shopping',
          limit: 400.00,
          spent: 125.30,
          period: 'monthly',
          startDate: '2025-07-01',
          endDate: '2025-07-31',
          color: '#8B5CF6'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 1000));
      setBudgets(mockBudgets);
    } catch (error) {
      console.error('Error loading budgets:', error);
      toast.error('Erro ao carregar orçamentos');
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

  const getProgressPercentage = (spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'over';
    if (percentage >= 80) return 'warning';
    return 'good';
  };

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
            <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budget Management</h1>
          <p className="text-text-secondary">
            Track your spending and stay within your limits
          </p>
        </div>
        <ModernButton
          onClick={() => setShowAddModal(true)}
          variant="primary"
          icon={Plus}
          glow
        >
          Create Budget
        </ModernButton>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ModernCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={Target}
          color="blue"
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={TrendingUp}
          color="orange"
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Remaining"
          value={formatCurrency(remainingBudget)}
          icon={PiggyBank}
          color={remainingBudget >= 0 ? "green" : "red"}
          glassmorphism
          neonBorder
        />
      </div>

      {/* Budget List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6">Your Budgets</h2>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          budgets.length === 0 ? (
            <div className="text-center py-12">
              <PiggyBank className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">No budgets yet</h3>
              <p className="text-text-secondary mb-4">Create your first budget to start tracking your spending</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
              >
                Create Budget
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
            {budgets.map((budget, index) => {
              const progress = getProgressPercentage(budget.spent, budget.limit);
              const status = getBudgetStatus(budget.spent, budget.limit);
              
              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-background/30 rounded-lg p-6 hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.color }}
                      ></div>
                      <div>
                        <h3 className="font-semibold text-white">{budget.name}</h3>
                        <p className="text-sm text-text-secondary">{budget.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {status === 'over' && (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                      {status === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      )}
                      {status === 'good' && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                      <div className="flex space-x-1">
                        <button className="p-1 text-text-secondary hover:text-primary transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-text-secondary hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}
                      </span>
                      <span className={`font-medium ${
                        status === 'over' ? 'text-red-400' : 
                        status === 'warning' ? 'text-yellow-400' : 
                        'text-green-400'
                      }`}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'over' ? 'bg-red-500' : 
                          status === 'warning' ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center text-xs text-text-secondary">
                      <Calendar className="w-3 h-3 mr-1" />
                      {budget.period === 'monthly' ? 'Monthly' : 
                       budget.period === 'weekly' ? 'Weekly' : 'Yearly'} budget
                    </div>
                  </div>
                </motion.div>
              );
            })}
            </div>
          )
        )}
      </motion.div>

      <ModernModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Budget"
        variant="glass"
        size="md"
      >
        <div className="space-y-6">
          <ModernInput
            label="Budget Name"
            placeholder="Enter budget name..."
            type="text"
          />
          <div>
            <label htmlFor="budget-category" className="block text-sm font-medium text-text-secondary mb-2">
              Category
            </label>
            <select id="budget-category" className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary">
              <option value="">Select category...</option>
              <option value="food">Food & Dining</option>
              <option value="transport">Transportation</option>
              <option value="entertainment">Entertainment</option>
              <option value="shopping">Shopping</option>
              <option value="utilities">Utilities</option>
              <option value="other">Other</option>
            </select>
          </div>
          <ModernInput
            label="Budget Limit"
            placeholder="0.00"
            type="number"
          />
          <div>
            <label htmlFor="budget-period" className="block text-sm font-medium text-text-secondary mb-2">
              Period
            </label>
            <select id="budget-period" className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <ModernButton
              onClick={() => setShowAddModal(false)}
              variant="ghost"
              className="flex-1"
            >
              Cancel
            </ModernButton>
            <ModernButton
              onClick={() => {
                toast.success('Budget created successfully!');
                setShowAddModal(false);
              }}
              variant="primary"
              className="flex-1"
            >
              Create Budget
            </ModernButton>
          </div>
        </div>
      </ModernModal>
    </div>
  );
}