import React, { useState } from 'react';
import { X, Save, Target, DollarSign, Calendar, Tag } from 'lucide-react';

type BudgetPeriod = 'monthly' | 'weekly' | 'yearly';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budget: BudgetData) => void;
  budget?: BudgetData | null;
}

export interface BudgetData {
  id?: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  description?: string;
}

const budgetCategories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Conta/Utilidades',
  'Investimentos',
  'Viagem',
  'Emergência',
  'Outros',
];

const getProgressBarColor = (percentage: number): string => {
  if (percentage <= 70) return 'bg-green-500';
  if (percentage <= 90) return 'bg-yellow-500';
  return 'bg-red-500';
};

export function BudgetModal({ isOpen, onClose, onSave, budget }: Readonly<BudgetModalProps>) {
  const [formData, setFormData] = useState<BudgetData>({
    name: budget?.name || '',
    amount: budget?.amount || 0,
    spent: budget?.spent || 0,
    category: budget?.category || '',
    period: budget?.period || 'monthly',
    startDate: budget?.startDate || new Date().toISOString().split('T')[0],
    endDate:
      budget?.endDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: budget?.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof BudgetData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Remove error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do orçamento é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero';
    } else if (isNaN(formData.amount)) {
      newErrors.amount = 'Valor deve ser um número válido';
    } else if (formData.amount > 999999999.99) {
      newErrors.amount = 'Valor máximo permitido é R$ 999.999.999,99';
    }

    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Data de início é obrigatória';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Data de fim é obrigatória';
    }

    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (startDate >= endDate) {
        newErrors.endDate = 'Data de fim deve ser posterior à data de início';
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 365) {
        newErrors.endDate = 'Período do orçamento não pode exceder 1 ano';
      }

      if (diffDays < 1) {
        newErrors.endDate = 'Período mínimo é de 1 dia';
      }
    }

    if (formData.spent < 0) {
      newErrors.spent = 'Valor gasto não pode ser negativo';
    } else if (formData.spent > formData.amount) {
      newErrors.spent = 'Valor gasto não pode ser maior que o orçamento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        ...formData,
        id: budget?.id || Date.now().toString(),
      });
      onClose();
      // Reset form
      setFormData({
        name: '',
        amount: 0,
        spent: 0,
        category: '',
        period: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: '',
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  if (!isOpen) return null;

  const remainingAmount = formData.amount - formData.spent;
  const percentageUsed = formData.amount > 0 ? (formData.spent / formData.amount) * 100 : 0;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white">
            {budget ? 'Editar Orçamento' : 'Novo Orçamento'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Budget Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-300">
              <Target size={16} className="mr-1 inline" />
              Nome do Orçamento
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Ex: Alimentação - Agosto 2025"
              className={`w-full rounded-lg border bg-gray-700 px-3 py-2 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none ${
                errors.name ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          {/* Budget Amount */}
          <div>
            <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-300">
              <DollarSign size={16} className="mr-1 inline" />
              Valor do Orçamento
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={e => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              className={`w-full rounded-lg border bg-gray-700 px-3 py-2 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none ${
                errors.amount ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
          </div>

          {/* Spent Amount (only show when editing) */}
          {budget && (
            <div>
              <label htmlFor="spent" className="mb-2 block text-sm font-medium text-gray-300">
                Valor Gasto
              </label>
              <input
                id="spent"
                type="number"
                step="0.01"
                min="0"
                value={formData.spent}
                onChange={e => handleInputChange('spent', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
              />

              {/* Progress Indicator */}
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-sm text-gray-400">
                  <span>Progresso: {percentageUsed.toFixed(1)}%</span>
                  <span>Restante: R$ {remainingAmount.toFixed(2)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-700">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressBarColor(percentageUsed)}`}
                    style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-medium text-gray-300">
              <Tag size={16} className="mr-1 inline" />
              Categoria
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={e => handleInputChange('category', e.target.value)}
              className={`w-full rounded-lg border bg-gray-700 px-3 py-2 text-white transition-colors focus:border-cyan-400 focus:outline-none ${
                errors.category ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Selecione uma categoria</option>
              {budgetCategories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-400">{errors.category}</p>}
          </div>

          {/* Period */}
          <div>
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-gray-300">Período</legend>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    value="weekly"
                    checked={formData.period === 'weekly'}
                    onChange={e => handleInputChange('period', e.target.value as BudgetPeriod)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Semanal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    value="monthly"
                    checked={formData.period === 'monthly'}
                    onChange={e => handleInputChange('period', e.target.value as BudgetPeriod)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Mensal</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    value="yearly"
                    checked={formData.period === 'yearly'}
                    onChange={e => handleInputChange('period', e.target.value as BudgetPeriod)}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Anual</span>
                </label>
              </div>
            </fieldset>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="mb-2 block text-sm font-medium text-gray-300">
                <Calendar size={16} className="mr-1 inline" />
                Data de Início
              </label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={e => handleInputChange('startDate', e.target.value)}
                className={`w-full rounded-lg border bg-gray-700 px-3 py-2 text-white transition-colors focus:border-cyan-400 focus:outline-none ${
                  errors.startDate ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-400">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="mb-2 block text-sm font-medium text-gray-300">
                Data de Fim
              </label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={e => handleInputChange('endDate', e.target.value)}
                className={`w-full rounded-lg border bg-gray-700 px-3 py-2 text-white transition-colors focus:border-cyan-400 focus:outline-none ${
                  errors.endDate ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-400">{errors.endDate}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-300">
              Descrição (Opcional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder="Detalhes sobre este orçamento..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 transition-colors focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex flex-1 items-center justify-center rounded-lg bg-cyan-600 px-4 py-2 text-white transition-colors hover:bg-cyan-700"
            >
              <Save size={18} className="mr-2" />
              {budget ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
