import React, { useState } from 'react';
import { X, Save, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: TransactionData) => void;
  transaction?: TransactionData | null;
}

export interface TransactionData {
  id?: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

const categories = {
  income: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Vendas',
    'Aluguéis',
    'Prêmios',
    'Outros'
  ],
  expense: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Compras',
    'Conta/Utilidades',
    'Investimentos',
    'Outros'
  ]
};

export function TransactionModal({ isOpen, onClose, onSave, transaction }: Readonly<TransactionModalProps>) {
  const [formData, setFormData] = useState<TransactionData>({
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    type: transaction?.type || 'expense',
    category: transaction?.category || '',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    status: transaction?.status || 'completed'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TransactionData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
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

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 1);
      
      if (selectedDate > maxDate) {
        newErrors.date = 'Data não pode ser superior a 1 ano no futuro';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        ...formData,
        id: transaction?.id || Date.now().toString()
      });
      onClose();
      // Reset form
      setFormData({
        description: '',
        amount: 0,
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    onClose();
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type */}
          <fieldset>
            <legend className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Transação
            </legend>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={(e) => handleInputChange('type', e.target.value as 'income' | 'expense')}
                  className="mr-2 text-green-500"
                />
                <span className="text-green-400">Receita</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={(e) => handleInputChange('type', e.target.value as 'income' | 'expense')}
                  className="mr-2 text-red-500"
                />
                <span className="text-red-400">Despesa</span>
              </label>
            </div>
          </fieldset>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              <FileText size={16} className="inline mr-1" />
              Descrição
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Ex: Compra no supermercado"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 
                         focus:outline-none focus:border-cyan-400 transition-colors ${
                           errors.description ? 'border-red-500' : 'border-gray-600'
                         }`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              <DollarSign size={16} className="inline mr-1" />
              Valor
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max="999999999.99"
              value={formData.amount || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = parseFloat(value);
                handleInputChange('amount', isNaN(numValue) ? 0 : numValue);
              }}
              placeholder="0,00"
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 
                         focus:outline-none focus:border-cyan-400 transition-colors ${
                           errors.amount ? 'border-red-500' : 'border-gray-600'
                         }`}
            />
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              <Tag size={16} className="inline mr-1" />
              Categoria
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white 
                         focus:outline-none focus:border-cyan-400 transition-colors ${
                           errors.category ? 'border-red-500' : 'border-gray-600'
                         }`}
            >
              <option value="">Selecione uma categoria</option>
              {categories[formData.type].map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Data
            </label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white 
                         focus:outline-none focus:border-cyan-400 transition-colors ${
                           errors.date ? 'border-red-500' : 'border-gray-600'
                         }`}
            />
            {errors.date && (
              <p className="text-red-400 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg 
                         transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg 
                         transition-colors flex items-center justify-center"
            >
              <Save size={18} className="mr-2" />
              {transaction ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
