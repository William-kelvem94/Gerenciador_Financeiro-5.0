import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Database,
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface PreviewData {
  bankDetected: string;
  totalTransactions: number;
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
  sampleTransactions?: Array<{
    date: string;
    description: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
  }>;
  filename: string;
}

interface ImportStats {
  importedCount: number;
  duplicateCount: number;
  totalProcessed: number;
  accountName: string;
  bankDetected: string;
}

const ImportExportPage: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [accountName, setAccountName] = useState('');
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    const allowedTypes = ['.csv', '.txt', '.pdf', '.xlsx', '.ofx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension) && file.name.includes('.')) {
      toast.error(`Tipo de arquivo não suportado. Use: ${allowedTypes.join(', ')}`);
      return;
    }

    handlePreview(file);
  };

  const handlePreview = async (file: File) => {
    setIsProcessing(true);
    setPreviewData(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import-export/preview', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar arquivo');
      }

      if (result.success) {
        setPreviewData(result.preview);
        setAccountName(result.preview.bankDetected || '');
        toast.success('Preview gerado com sucesso!');
      } else {
        throw new Error(result.error || 'Erro no preview');
      }

    } catch (error) {
      console.error('Erro no preview:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar arquivo');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!previewData || !accountName.trim()) {
      toast.error('Nome da conta é obrigatório');
      return;
    }

    setIsProcessing(true);

    try {
      // Recriar o arquivo para importação
      const fileInput = fileInputRef.current;
      if (!fileInput?.files?.[0]) {
        throw new Error('Arquivo não encontrado');
      }

      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('accountName', accountName.trim());

      const response = await fetch('/api/import-export/process', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro na importação');
      }

      if (result.success) {
        setImportStats(result.stats);
        setPreviewData(null);
        toast.success(`✅ ${result.stats.importedCount} transações importadas com sucesso!`);
        
        if (result.stats.duplicateCount > 0) {
          toast(`ℹ️ ${result.stats.duplicateCount} transações duplicadas foram ignoradas`, {
            duration: 4000,
            icon: '📋'
          });
        }
      } else {
        throw new Error(result.error || 'Erro na importação');
      }

    } catch (error) {
      console.error('Erro na importação:', error);
      toast.error(error instanceof Error ? error.message : 'Erro na importação');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = async () => {
    setIsProcessing(true);

    try {
      const params = new URLSearchParams({
        format: exportFormat,
        ...(dateRange.startDate && { startDate: dateRange.startDate }),
        ...(dateRange.endDate && { endDate: dateRange.endDate })
      });

      const response = await fetch(`/api/import-export/export?${params}`, {
        method: 'GET'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro na exportação');
      }

      // Download do arquivo
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `will-finance-export-${Date.now()}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Dados exportados com sucesso!');

    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error(error instanceof Error ? error.message : 'Erro na exportação');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-cyber text-cyan-400 mb-2">
            IMPORT/EXPORT DATA
          </h1>
          <p className="text-gray-400">
            Importe extratos bancários ou exporte seus dados financeiros
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('import')}
            className={`flex-1 px-4 py-2 rounded-md font-cyber transition-all ${
              activeTab === 'import'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📥 IMPORTAR
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex-1 px-4 py-2 rounded-md font-cyber transition-all ${
              activeTab === 'export'
                ? 'bg-cyan-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📤 EXPORTAR
          </button>
        </div>

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div
              className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragOver
                  ? 'border-cyan-400 bg-cyan-400/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt,.pdf,.xlsx,.ofx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file);
                    // Reset input to allow selecting the same file again if needed
                    e.target.value = '';
                  }
                }}
                className="hidden"
                aria-label="Selecionar arquivo para importação"
              />
              
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">
                Arraste seu extrato bancário aqui
              </h3>
              <p className="text-gray-400 mb-4">
                Ou clique para selecionar arquivo
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Formatos suportados: CSV, TXT, PDF, XLSX, OFX
              </p>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processando...' : 'Selecionar Arquivo'}
              </button>
            </div>

            {/* Bancos Suportados */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                🏦 BANCOS SUPORTADOS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  'Bradesco', 'Nubank', 'Banco do Brasil', 'Itaú', 'Santander',
                  'Caixa', 'Inter', 'C6 Bank', 'Next', 'BTG Pactual'
                ].map((bank) => (
                  <div key={bank} className="bg-gray-700 px-3 py-2 rounded text-center text-sm">
                    {bank}
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            {previewData && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  PREVIEW DO ARQUIVO
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-cyan-400 text-sm">BANCO DETECTADO</div>
                    <div className="text-xl font-bold">{previewData.bankDetected}</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-cyan-400 text-sm">TRANSAÇÕES</div>
                    <div className="text-xl font-bold">{previewData.totalTransactions}</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded">
                    <div className="text-cyan-400 text-sm">SALDO LÍQUIDO</div>
                    <div className={`text-xl font-bold ${
                      previewData.summary.balance >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(previewData.summary.balance)}
                    </div>
                  </div>
                </div>

                {/* Sample Transactions */}
                <div className="mb-6">
                  <h4 className="text-md font-semibold mb-3">Primeiras 5 Transações:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {previewData.sampleTransactions && previewData.sampleTransactions.length > 0 ? (
                      previewData.sampleTransactions.map((transaction, index) => (
                        <div key={`transaction-${transaction.date}-${index}`} className="bg-gray-700 p-3 rounded flex justify-between">
                          <div>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-gray-400">{formatDate(transaction.date)}</div>
                          </div>
                          <div className={`font-bold ${
                            transaction.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">Nenhuma transação de exemplo disponível.</div>
                    )}
                  </div>
                </div>

                {/* Account Name Input */}
                <div className="mb-4">
                  <label htmlFor="account-name" className="block text-sm font-medium mb-2">
                    Nome da Conta:
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Ex: Conta Corrente Bradesco"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                              text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Import Button */}
                <button
                  onClick={handleImport}
                  disabled={isProcessing || !accountName.trim()}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg 
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isProcessing ? 'Importando...' : 'CONFIRMAR IMPORTAÇÃO'}
                </button>
              </div>
            )}

            {/* Import Success */}
            {importStats && (
              <div className="bg-green-900/50 border border-green-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  IMPORTAÇÃO CONCLUÍDA
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{importStats.importedCount}</div>
                    <div className="text-sm text-gray-400">Importadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{importStats.duplicateCount}</div>
                    <div className="text-sm text-gray-400">Duplicatas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">{importStats.totalProcessed}</div>
                    <div className="text-sm text-gray-400">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{importStats.accountName}</div>
                    <div className="text-sm text-gray-400">Conta</div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setImportStats(null);
                    setPreviewData(null);
                    setAccountName('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Nova Importação
                </button>
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                📤 EXPORTAR DADOS
              </h3>
              
              {/* Format Selection */}
              <div className="mb-6">
                <fieldset>
                  <legend className="block text-sm font-medium mb-2">
                    Formato de Exportação:
                  </legend>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="export-format"
                        value="json"
                        checked={exportFormat === 'json'}
                        onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                        className="mr-2"
                      />
                      <span>JSON (Dados Completos)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="export-format"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                        className="mr-2"
                      />
                      <span>CSV (Apenas Transações)</span>
                    </label>
                  </div>
                </fieldset>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <fieldset>
                  <legend className="block text-sm font-medium mb-2">
                    Período (Opcional):
                  </legend>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="start-date" className="block text-xs text-gray-400 mb-1">Data Inicial:</label>
                      <input
                        id="start-date"
                        type="date"
                        value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="end-date" className="block text-xs text-gray-400 mb-1">Data Final:</label>
                    <input
                      id="end-date"
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                                text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  </div>
                </fieldset>
              </div>

              {/* Export Button */}
              <button
                onClick={handleExport}
                disabled={isProcessing}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold
                          flex items-center justify-center"
              >
                <Download className="w-5 h-5 mr-2" />
                {isProcessing ? 'Exportando...' : `EXPORTAR DADOS (${exportFormat.toUpperCase()})`}
              </button>
            </div>

            {/* Export Info */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-cyan-400">
                ℹ️ INFORMAÇÕES DA EXPORTAÇÃO
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-400" />
                  <span><strong>JSON:</strong> Inclui transações, contas, categorias e orçamentos</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2 text-green-400" />
                  <span><strong>CSV:</strong> Apenas transações em formato de planilha</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                  <span><strong>Período:</strong> Deixe vazio para exportar todos os dados</span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
                  <span><strong>Segurança:</strong> Apenas seus dados pessoais são incluídos</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportExportPage;
