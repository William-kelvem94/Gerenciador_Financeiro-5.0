import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Database,
  FileSpreadsheet,
  Eye,
  BarChart3
} from 'lucide-react';

interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
}

interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    bankDetected: string;
    totalFound: number;
    totalImported: number;
    duplicatesSkipped: number;
    summary: {
      income: number;
      expenses: number;
      balance: number;
    };
    transactions: any[];
  };
  errors?: string[];
}

interface PreviewResult {
  success: boolean;
  preview?: {
    bankDetected: string;
    totalTransactions: number;
    summary: {
      income: number;
      expenses: number;
      balance: number;
    };
    sampleTransactions: Transaction[];
  };
  errors?: string[];
}

export function ImportExportPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'preview' | 'success' | 'error'>('idle');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewResult, setPreviewResult] = useState<PreviewResult | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview do arquivo antes da importação
  const handleFilePreview = async (file: File) => {
    setIsUploading(true);
    setUploadStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import-export/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      setPreviewResult(result);
      
      if (result.success) {
        setUploadStatus('preview');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      setPreviewResult({
        success: false,
        errors: ['Erro ao processar o arquivo. Tente novamente.']
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  // Confirmar importação
  const handleConfirmImport = async () => {
    if (!fileInputRef.current?.files?.[0]) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    
    const formData = new FormData();
    formData.append('file', fileInputRef.current.files[0]);

    try {
      const response = await fetch('/api/import-export/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      setImportResult(result);
      
      if (result.success) {
        setUploadStatus('success');
        // Limpar preview
        setPreviewResult(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Erro ao importar o arquivo. Tente novamente.',
        errors: ['Erro de conexão com o servidor']
      });
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  // Exportar dados
  const handleExport = async (format: 'json' | 'csv') => {
    setIsExporting(true);

    try {
      const response = await fetch(`/api/import-export/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `will-finance-export.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Erro ao exportar dados');
      }
    } catch (error) {
      alert('Erro ao exportar dados. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Reset do estado
  const handleReset = () => {
    setUploadStatus('idle');
    setImportResult(null);
    setPreviewResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyan-100">Importar & Exportar Dados</h1>
        <p className="text-gray-400 mt-2">
          Importe extratos bancários de múltiplos bancos ou exporte seus dados financeiros
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Seção de Importação */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Upload className="h-8 w-8 text-cyan-400" />
            <div>
              <h2 className="text-xl font-semibold text-cyan-100">Importar Extrato Bancário</h2>
              <p className="text-gray-400 text-sm">
                Suporte para: Nubank, Banco do Brasil, Bradesco, Itaú, Santander, Inter, C6 Bank e mais
              </p>
            </div>
          </div>

          {/* Upload Area */}
          {uploadStatus === 'idle' && (
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-4">
                Arraste e solte seu extrato aqui ou clique para selecionar
              </p>
              <p className="text-gray-500 text-sm mb-4">
                Formatos aceitos: CSV, TXT, PDF, XLSX, XLS, OFX
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.pdf,.xlsx,.xls,.ofx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFilePreview(file);
                  }
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Selecionar Arquivo
              </button>
            </div>
          )}

          {/* Loading */}
          {isUploading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-cyan-400">Processando arquivo...</p>
            </div>
          )}

          {/* Preview */}
          {uploadStatus === 'preview' && previewResult?.success && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Eye className="h-5 w-5 text-blue-400" />
                  <h3 className="text-blue-400 font-semibold">Preview da Importação</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Banco Detectado</p>
                    <p className="text-white font-semibold">{previewResult.preview?.bankDetected}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Total de Transações</p>
                    <p className="text-white font-semibold">{previewResult.preview?.totalTransactions}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                    <p className="text-green-400 font-semibold">
                      {formatCurrency(previewResult.preview?.summary.income || 0)}
                    </p>
                    <p className="text-gray-400 text-xs">Receitas</p>
                  </div>
                  <div className="text-center">
                    <TrendingDown className="h-6 w-6 text-red-400 mx-auto mb-1" />
                    <p className="text-red-400 font-semibold">
                      {formatCurrency(previewResult.preview?.summary.expenses || 0)}
                    </p>
                    <p className="text-gray-400 text-xs">Despesas</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="h-6 w-6 text-cyan-400 mx-auto mb-1" />
                    <p className="text-cyan-400 font-semibold">
                      {formatCurrency(previewResult.preview?.summary.balance || 0)}
                    </p>
                    <p className="text-gray-400 text-xs">Saldo</p>
                  </div>
                </div>
              </div>

              {/* Amostra de transações */}
              <div>
                <h4 className="text-gray-300 font-semibold mb-3">Amostra de Transações</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {previewResult.preview?.sampleTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{transaction.description}</p>
                        <p className="text-gray-400 text-xs">{formatDate(transaction.date)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        {transaction.category && (
                          <p className="text-gray-400 text-xs">{transaction.category}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmImport}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-semibold"
                >
                  Confirmar Importação
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Resultado da Importação */}
          {uploadStatus === 'success' && importResult?.success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-green-400 font-semibold">Importação Concluída!</h3>
              </div>
              <p className="text-gray-300 mb-4">{importResult.message}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Banco:</p>
                  <p className="text-white">{importResult.data?.bankDetected}</p>
                </div>
                <div>
                  <p className="text-gray-400">Transações:</p>
                  <p className="text-white">{importResult.data?.totalImported} importadas</p>
                </div>
                {importResult.data?.duplicatesSkipped && importResult.data.duplicatesSkipped > 0 && (
                  <div className="col-span-2">
                    <p className="text-yellow-400">
                      {importResult.data.duplicatesSkipped} transações duplicadas foram ignoradas
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={handleReset}
                className="mt-4 w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
              >
                Importar Outro Arquivo
              </button>
            </div>
          )}

          {/* Erro */}
          {uploadStatus === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <XCircle className="h-6 w-6 text-red-400" />
                <h3 className="text-red-400 font-semibold">Erro na Importação</h3>
              </div>
              <p className="text-gray-300 mb-3">
                {importResult?.message || previewResult?.errors?.[0] || 'Erro desconhecido'}
              </p>
              {(importResult?.errors || previewResult?.errors) && (
                <div className="space-y-1 mb-4">
                  {(importResult?.errors || previewResult?.errors || []).map((error, index) => (
                    <p key={index} className="text-red-400 text-sm">• {error}</p>
                  ))}
                </div>
              )}
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          )}
        </div>

        {/* Seção de Exportação */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Download className="h-8 w-8 text-green-400" />
            <div>
              <h2 className="text-xl font-semibold text-cyan-100">Exportar Dados</h2>
              <p className="text-gray-400 text-sm">
                Faça backup de todos os seus dados financeiros
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Exportar JSON */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="h-6 w-6 text-cyan-400" />
                <div>
                  <h3 className="text-cyan-100 font-semibold">Backup Completo (JSON)</h3>
                  <p className="text-gray-400 text-sm">
                    Todos os dados: transações, categorias, contas, metas e orçamentos
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExport('json')}
                disabled={isExporting}
                className="w-full px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {isExporting ? 'Exportando...' : 'Exportar JSON'}
              </button>
            </div>

            {/* Exportar CSV */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <FileSpreadsheet className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="text-cyan-100 font-semibold">Extrato CSV</h3>
                  <p className="text-gray-400 text-sm">
                    Apenas transações em formato planilha (Excel/Google Sheets)
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleExport('csv')}
                disabled={isExporting}
                className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                {isExporting ? 'Exportando...' : 'Exportar CSV'}
              </button>
            </div>
          </div>

          {/* Informações sobre formatos */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-semibold mb-2">Sobre os Formatos</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• <strong>JSON:</strong> Backup completo para restaurar no Will Finance</li>
                  <li>• <strong>CSV:</strong> Planilha para análise externa ou outros sistemas</li>
                  <li>• Seus dados ficam sempre seguros e acessíveis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bancos Suportados */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-cyan-100 mb-4">Bancos e Formatos Suportados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            'Nubank', 'Banco do Brasil', 'Bradesco', 'Itaú', 'Santander', 'Caixa',
            'Inter', 'C6 Bank', 'Original', 'Mercado Pago', 'PicPay', 'CSV Genérico'
          ].map((bank) => (
            <div key={bank} className="text-center p-3 bg-gray-700/30 rounded-lg">
              <p className="text-gray-300 text-sm font-medium">{bank}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>Dica:</strong> Para melhores resultados, use extratos em formato CSV ou TXT diretamente do site/app do seu banco.
            PDFs podem ter menor precisão na leitura.
          </p>
        </div>
      </div>
    </div>
  );
}
