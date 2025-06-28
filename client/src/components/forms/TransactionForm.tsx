import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useFinance } from '../../contexts/FinanceContext';
import { toast } from 'react-hot-toast';
import { CalendarIcon, DollarSignIcon, FileTextIcon, TagIcon } from 'lucide-react';

interface TransactionFormProps {
  initialData?: Partial<TransactionFormData> & { id?: string };
  onSubmit?: () => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit';
}

interface TransactionFormData {
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  date: string;
}

// Validation schema
const validationSchema = Yup.object({
  accountId: Yup.string()
    .required('Conta é obrigatória'),
  categoryId: Yup.string()
    .required('Categoria é obrigatória'),
  amount: Yup.number()
    .positive('Valor deve ser positivo')
    .required('Valor é obrigatório'),
  description: Yup.string()
    .min(3, 'Descrição deve ter pelo menos 3 caracteres')
    .max(200, 'Descrição deve ter no máximo 200 caracteres')
    .required('Descrição é obrigatória'),
  type: Yup.string()
    .oneOf(['income', 'expense', 'transfer'], 'Tipo inválido')
    .required('Tipo é obrigatório'),
  date: Yup.date()
    .max(new Date(), 'Data não pode ser futura')
    .required('Data é obrigatória'),
});

export const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  mode = 'create'
}) => {
  const { accounts, categories, createTransaction, updateTransaction, loading } = useFinance();
  const [submitting, setSubmitting] = useState(false);

  const formik = useFormik<TransactionFormData>({
    initialValues: {
      accountId: initialData?.accountId ?? '',
      categoryId: initialData?.categoryId ?? '',
      amount: initialData?.amount ?? 0,
      description: initialData?.description ?? '',
      type: initialData?.type ?? 'expense',
      date: initialData?.date ?? new Date().toISOString().split('T')[0],
    },
    validationSchema,
    onSubmit: async (values: TransactionFormData) => {
      try {
        setSubmitting(true);

        const transactionData = {
          ...values,
          date: new Date(values.date),
        };

        if (mode === 'create') {
          await createTransaction(transactionData);
          toast.success('Transação criada com sucesso!');
        } else if (initialData?.id) {
          await updateTransaction(initialData.id, transactionData);
          toast.success('Transação atualizada com sucesso!');
        }

        formik.resetForm();
        onSubmit?.();
      } catch (error) {
        console.error('Erro ao salvar transação:', error);
        toast.error('Erro ao salvar transação. Tente novamente.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    category => category.type === formik.values.type && category.isActive
  );

  const activeAccounts = accounts.filter(account => account.isActive);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded-lg border border-green-500/30">
      <h2 className="text-2xl font-bold text-green-400 mb-6">
        {mode === 'create' ? 'Nova Transação' : 'Editar Transação'}
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-green-300 mb-2">
            Tipo de Transação
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'income', label: 'Receita', color: 'bg-green-600' },
              { value: 'expense', label: 'Despesa', color: 'bg-red-600' },
              { value: 'transfer', label: 'Transferência', color: 'bg-blue-600' },
            ].map(({ value, label, color }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  formik.setFieldValue('type', value);
                  formik.setFieldValue('categoryId', ''); // Reset category when type changes
                }}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  formik.values.type === value
                    ? `${color} border-green-400 text-white`
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-green-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {formik.touched.type && formik.errors.type && (
            <p className="mt-1 text-sm text-red-400">{formik.errors.type}</p>
          )}
        </div>

        {/* Account Selection */}
        <div>
          <label htmlFor="accountId" className="block text-sm font-medium text-green-300 mb-2">
            <TagIcon className="inline w-4 h-4 mr-1" />
            Conta
          </label>
          <select
            id="accountId"
            {...formik.getFieldProps('accountId')}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none transition-colors"
          >
            <option value="">Selecione uma conta</option>
            {activeAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.type}) - {account.currency} {account.balance.toFixed(2)}
              </option>
            ))}
          </select>
          {formik.touched.accountId && formik.errors.accountId && (
            <p className="mt-1 text-sm text-red-400">{formik.errors.accountId}</p>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-green-300 mb-2">
            <TagIcon className="inline w-4 h-4 mr-1" />
            Categoria
          </label>
          <select
            id="categoryId"
            {...formik.getFieldProps('categoryId')}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none transition-colors"
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {formik.touched.categoryId && formik.errors.categoryId && (
            <p className="mt-1 text-sm text-red-400">{formik.errors.categoryId}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-green-300 mb-2">
            <DollarSignIcon className="inline w-4 h-4 mr-1" />
            Valor
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...formik.getFieldProps('amount')}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none transition-colors"
            placeholder="0.00"
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="mt-1 text-sm text-red-400">{formik.errors.amount}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-green-300 mb-2">
            <FileTextIcon className="inline w-4 h-4 mr-1" />
            Descrição
          </label>
          <textarea
            id="description"
            {...formik.getFieldProps('description')}
            rows={3}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none transition-colors resize-none"
            placeholder="Digite uma descrição para a transação..."
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-400">{formik.errors.description}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-green-300 mb-2">
            <CalendarIcon className="inline w-4 h-4 mr-1" />
            Data
          </label>
          <input
            id="date"
            type="date"
            {...formik.getFieldProps('date')}
            max={new Date().toISOString().split('T')[0]}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-green-400 focus:outline-none transition-colors"
          />
          {formik.touched.date && formik.errors.date && (
            <p className="mt-1 text-sm text-red-400">{formik.errors.date}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting || loading || !formik.isValid}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitting ? 'Salvando...' : mode === 'create' ? 'Criar Transação' : 'Atualizar Transação'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 p-3 bg-blue-900/50 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300 text-sm">Carregando dados...</p>
        </div>
      )}

      {/* Form validation summary */}
      {formik.submitCount > 0 && !formik.isValid && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-sm">
            Por favor, corrija os erros no formulário antes de prosseguir.
          </p>
        </div>
      )}
    </div>
  );
};
