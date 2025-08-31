import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  PiggyBank,
  Wallet,
  ShoppingCart,
} from 'lucide-react';
import { BudgetModal, BudgetData } from '../../components/Modal/BudgetModal';

interface Budget {
  id: string;
  name: string;
  category: string;
  allocated: number;
  spent: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  status: 'healthy' | 'warning' | 'danger';
}

export function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetData | null>(null);

  const handleNewBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget({
      id: budget.id,
      name: budget.name,
      amount: budget.allocated,
      spent: budget.spent,
      category: budget.category,
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const handleSaveBudget = (budgetData: BudgetData) => {
    if (editingBudget) {
      // Atualizar orçamento existente
      setBudgets(prev =>
        prev.map(b =>
          b.id === editingBudget.id
            ? {
                ...b,
                name: budgetData.name,
                allocated: budgetData.amount,
                spent: budgetData.spent,
                category: budgetData.category,
              }
            : b
        )
      );
    } else {
      // Criar novo orçamento
      const newBudget: Budget = {
        id: Date.now().toString(),
        name: budgetData.name,
        category: budgetData.category,
        allocated: budgetData.amount,
        spent: budgetData.spent,
        icon: ShoppingCart, // Default icon
        color: 'cyber-primary',
        status:
          budgetData.spent > budgetData.amount * 0.9
            ? 'danger'
            : budgetData.spent > budgetData.amount * 0.7
              ? 'warning'
              : 'healthy',
      };
      setBudgets(prev => [...prev, newBudget]);
    }
    setIsModalOpen(false);
  };

  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Busca dados reais do backend
  React.useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await fetch('/api/budgets', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Erro ao buscar orçamentos');
        const data = await response.json();
        setBudgets(data.budgets || []);
      } catch {
        setBudgets([]);
      }
    };
    fetchBudgets();
  }, []);

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'from-cyber-accent to-cyber-primary';
      case 'warning':
        return 'from-yellow-400 to-cyber-secondary';
      case 'danger':
        return 'from-cyber-danger to-red-500';
      default:
        return 'from-cyber-primary to-cyber-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-cyber-accent h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'danger':
        return <AlertTriangle className="text-cyber-danger h-5 w-5" />;
      default:
        return <Target className="text-cyber-primary h-5 w-5" />;
    }
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
          <h1 className="font-cyber text-cyber-primary text-glow mb-2 text-4xl">Orçamentos</h1>
          <p className="text-white-muted font-mono">Controle inteligente de gastos por categoria</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewBudget}
          className="btn-primary mt-4 self-start lg:mt-0 lg:self-auto"
        >
          <Plus className="mr-2 h-5 w-5" />
          <span className="font-mono">Novo Orçamento</span>
        </motion.button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass border-cyber-primary/30 hover:shadow-glow rounded-xl border p-6 transition-all duration-300"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="bg-gradient-cyber flex h-12 w-12 items-center justify-center rounded-lg">
              <Wallet className="text-background h-6 w-6" />
            </div>
            <Target className="text-cyber-primary h-5 w-5" />
          </div>
          <h3 className="text-white-muted mb-1 font-mono text-sm">Orçamento Total</h3>
          <p className="text-cyber-primary text-2xl font-bold">
            R$ {totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass border-cyber-danger/30 rounded-xl border p-6 transition-all duration-300 hover:shadow-[0_0_20px_#FF0040]"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="from-cyber-danger to-cyber-secondary flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br">
              <TrendingUp className="text-background h-6 w-6" />
            </div>
            <AlertTriangle className="text-cyber-danger h-5 w-5" />
          </div>
          <h3 className="text-white-muted mb-1 font-mono text-sm">Total Gasto</h3>
          <p className="text-cyber-danger text-2xl font-bold">
            R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`glass rounded-xl border p-6 transition-all duration-300 ${
            remainingBudget >= 0
              ? 'border-cyber-accent/30 hover:shadow-[0_0_20px_#39FF14]'
              : 'border-cyber-danger/30 hover:shadow-[0_0_20px_#FF0040]'
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${
                remainingBudget >= 0
                  ? 'from-cyber-accent to-cyber-primary'
                  : 'from-cyber-danger to-cyber-secondary'
              }`}
            >
              <PiggyBank className="text-background h-6 w-6" />
            </div>
            {remainingBudget >= 0 ? (
              <CheckCircle className="text-cyber-accent h-5 w-5" />
            ) : (
              <AlertTriangle className="text-cyber-danger h-5 w-5" />
            )}
          </div>
          <h3 className="text-white-muted mb-1 font-mono text-sm">Saldo Restante</h3>
          <p
            className={`text-2xl font-bold ${
              remainingBudget >= 0 ? 'text-cyber-accent' : 'text-cyber-danger'
            }`}
          >
            R$ {Math.abs(remainingBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </motion.div>
      </div>

      {/* Budget Progress Overview */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass border-cyber-primary/20 rounded-xl border p-6"
      >
        <h3 className="font-cyber text-cyber-primary mb-6 text-lg">Progresso Geral</h3>

        <div className="space-y-4">
          <div className="flex justify-between font-mono text-sm">
            <span className="text-white-muted">Utilização do Orçamento</span>
            <span className="text-cyber-primary">
              {((totalSpent / totalAllocated) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="bg-black-tertiary h-4 w-full overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%` }}
              transition={{ duration: 1.5, delay: 1 }}
              className={`relative h-full bg-gradient-to-r ${
                totalSpent <= totalAllocated * 0.8
                  ? 'from-cyber-accent to-cyber-primary'
                  : totalSpent <= totalAllocated
                    ? 'to-cyber-secondary from-yellow-400'
                    : 'from-cyber-danger to-red-500'
              }`}
            >
              <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </motion.div>
          </div>

          <div className="flex justify-between font-mono text-sm">
            <span className="text-white-secondary">
              R$ {totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-cyber-primary">
              R$ {totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {budgets.map((budget, index) => {
          const percentage = (budget.spent / budget.allocated) * 100;
          const Icon = budget.icon;

          return (
            <motion.div
              key={budget.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="glass border-cyber-primary/20 hover:border-cyber-primary/40 group cursor-pointer rounded-xl border p-6 transition-all duration-300"
              onClick={() => handleEditBudget(budget)}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-12 w-12 bg-gradient-to-br from-${budget.color} to-cyber-primary flex items-center justify-center rounded-lg`}
                  >
                    <Icon className="text-background h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="group-hover:text-cyber-primary font-medium text-white transition-colors">
                      {budget.name}
                    </h4>
                    <p className="text-white-muted font-mono text-sm">{budget.category}</p>
                  </div>
                </div>
                {getStatusIcon(budget.status)}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-mono text-sm">
                  <span className="text-white-muted">Progresso</span>
                  <span
                    className={`${percentage > 100 ? 'text-cyber-danger' : 'text-cyber-primary'}`}
                  >
                    {percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="bg-black-tertiary h-2 w-full overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 1, delay: 1 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${getProgressColor(budget.status)} relative`}
                  >
                    <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  </motion.div>
                </div>

                <div className="flex justify-between font-mono text-sm">
                  <span className="text-white-secondary">
                    R$ {budget.spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-white-muted">
                    de R$ {budget.allocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {percentage > 80 && (
                  <div
                    className={`flex items-center space-x-2 rounded p-2 font-mono text-xs ${
                      percentage > 100
                        ? 'bg-cyber-danger/20 text-cyber-danger'
                        : 'bg-yellow-400/20 text-yellow-400'
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      {percentage > 100
                        ? `Orçamento excedido em R$ ${(budget.spent - budget.allocated).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                        : 'Próximo do limite do orçamento'}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBudget}
        budget={editingBudget}
      />
    </div>
  );
}
