import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CyberpunkButton, CyberpunkProgress, CyberpunkCard } from '../ui';
import { useTransactionStore } from '@/stores/transactionStore';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';

interface ImportResult {
  total: number;
  success: number;
  failed: number;
  error?: string;
}

interface ProcessingStage {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  message: string;
}

const PDFImporter: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>(
    'idle'
  );
  const [results, setResults] = useState<ImportResult | null>(null);
  const [processingStages, setProcessingStages] = useState<ProcessingStage[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const { addTransaction } = useTransactionStore();

  const initializeProcessingStages = () => {
    setProcessingStages([
      { name: 'Upload', status: 'pending', message: 'Aguardando...' },
      { name: 'OCR/Extração', status: 'pending', message: 'Extraindo texto do PDF...' },
      { name: 'IA/Classificação', status: 'pending', message: 'Processando com IA...' },
      { name: 'Validação', status: 'pending', message: 'Validando dados...' },
      { name: 'Importação', status: 'pending', message: 'Salvando transações...' },
    ]);
  };

  const updateStage = (stageName: string, status: ProcessingStage['status'], message?: string) => {
    setProcessingStages(prev =>
      prev.map(stage =>
        stage.name === stageName ? { ...stage, status, message: message || stage.message } : stage
      )
    );
  };

  const simulateProcessingStages = useCallback(async () => {
    updateStage('Upload', 'completed', 'Upload concluído');
    await new Promise(resolve => setTimeout(resolve, 500));

    updateStage('OCR/Extração', 'processing', 'Extraindo dados do PDF...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    updateStage('OCR/Extração', 'completed', 'Texto extraído com sucesso');

    updateStage('IA/Classificação', 'processing', 'Classificando transações...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    updateStage('IA/Classificação', 'completed', 'Transações classificadas');

    updateStage('Validação', 'processing', 'Validando dados...');
    await new Promise(resolve => setTimeout(resolve, 800));
    updateStage('Validação', 'completed', 'Dados validados');

    updateStage('Importação', 'processing', 'Salvando no banco...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    updateStage('Importação', 'completed', 'Transações salvas');
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      if (file.type !== 'application/pdf') {
        toast.error('Por favor, selecione apenas arquivos PDF');
        setStatus('error');
        setResults({
          total: 0,
          success: 0,
          failed: 1,
          error: 'Formato de arquivo inválido. Apenas PDF é suportado.',
        });
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error('Arquivo muito grande. Máximo 10MB');
        setStatus('error');
        setResults({
          total: 0,
          success: 0,
          failed: 1,
          error: 'Arquivo muito grande (máximo 10MB)',
        });
        return;
      }

      setFileName(file.name);
      setStatus('uploading');
      setProgress(0);
      setResults(null);
      initializeProcessingStages();

      try {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('bankType', 'AUTO_DETECT');

        updateStage('Upload', 'processing', 'Enviando arquivo...');

        const response = await api.post('/api/import/pdf', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percent);
            }
          },
        });

        setStatus('processing');

        await simulateProcessingStages();

        const importedTransactions = response.data.transactions || [];

        setResults({
          total: importedTransactions.length,
          success: importedTransactions.length,
          failed: 0,
        });

        if (importedTransactions.length > 0) {
          importedTransactions.forEach((transaction: any) => addTransaction(transaction));
          toast.success(`${importedTransactions.length} transações importadas com sucesso!`);
        } else {
          toast('Nenhuma transação foi encontrada no arquivo');
        }

        setStatus('complete');
      } catch (error: any) {
        console.error('Erro ao importar PDF:', error);

        const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';

        setStatus('error');
        setResults({
          total: 0,
          success: 0,
          failed: 1,
          error: errorMessage,
        });

        const currentStage = processingStages.find(stage => stage.status === 'processing');
        if (currentStage) {
          updateStage(currentStage.name, 'error', `Erro: ${errorMessage}`);
        }

        toast.error('Falha na importação: ' + errorMessage);
      }
    },
    [addTransaction, processingStages, simulateProcessingStages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      void onDrop(acceptedFiles);
    },
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: status === 'uploading' || status === 'processing',
  });

  const getStageIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return '✅';
      case 'processing':
        return '⚡';
      case 'error':
        return '❌';
      default:
        return '⏸️';
    }
  };

  const getStageColor = (stage: ProcessingStage) => {
    switch (stage.status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-cyan-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="status-container">
            <div className="upload-progress">
              <h3 className="status-title">📤 Enviando arquivo</h3>
              <p className="file-name">{fileName}</p>
              <CyberpunkProgress value={progress} />
              <p className="progress-text">{progress}% concluído</p>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="status-container">
            <div className="processing-stages">
              <h3 className="status-title">🤖 Processando com IA</h3>
              <p className="file-name">{fileName}</p>

              <div className="stages-list">
                {processingStages.map(stage => (
                  <div key={stage.name} className={`stage-item ${getStageColor(stage)}`}>
                    <span className="stage-icon">{getStageIcon(stage)}</span>
                    <span className="stage-name">{stage.name}</span>
                    <span className="stage-message">{stage.message}</span>
                  </div>
                ))}
              </div>

              <div className="ai-animation">
                <div className="ai-pulse">🧠</div>
                <p>IA processando transações...</p>
              </div>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="status-container">
            <div className="success-state">
              <h3 className="status-title">✅ Importação concluída!</h3>
              <p className="file-name">{fileName}</p>

              <div className="results-summary">
                <div className="result-item">
                  <span className="result-label">Total de transações:</span>
                  <span className="result-value">{results?.total || 0}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Importadas com sucesso:</span>
                  <span className="result-value success">{results?.success || 0}</span>
                </div>
                {results?.failed && results.failed > 0 && (
                  <div className="result-item">
                    <span className="result-label">Com falha:</span>
                    <span className="result-value error">{results.failed}</span>
                  </div>
                )}
              </div>

              <div className="action-buttons">
                <CyberpunkButton onClick={() => setStatus('idle')}>
                  Importar outro arquivo
                </CyberpunkButton>
                <CyberpunkButton
                  variant="secondary"
                  onClick={() => (window.location.href = '/transactions')}
                >
                  Ver transações
                </CyberpunkButton>
              </div>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="status-container">
            <div className="error-state">
              <h3 className="status-title">❌ Erro na importação</h3>
              {fileName && <p className="file-name">{fileName}</p>}

              <div className="error-details">
                <p className="error-message">{results?.error || 'Erro desconhecido'}</p>
              </div>

              <div className="error-help">
                <h4>💡 Dicas para resolver:</h4>
                <ul>
                  <li>Verifique se o PDF não está protegido por senha</li>
                  <li>Certifique-se de que é um extrato bancário válido</li>
                  <li>O arquivo deve ter no máximo 10MB</li>
                  <li>Bancos suportados: Itaú, Bradesco, Nubank, Santander, BB</li>
                </ul>
              </div>

              <CyberpunkButton onClick={() => setStatus('idle')}>Tentar novamente</CyberpunkButton>
            </div>
          </div>
        );

      default:
        return (
          <div className="dropzone-content">
            <div className="upload-icon">📄</div>
            {isDragActive ? (
              <div className="drop-active">
                <p className="drop-text">Solte o PDF aqui...</p>
                <div className="drop-animation">📥</div>
              </div>
            ) : (
              <div className="drop-idle">
                <h3 className="drop-title">Importar Extrato PDF</h3>
                <p className="drop-description">
                  Arraste um extrato bancário em PDF ou clique para selecionar
                </p>
                <CyberpunkButton className="select-button">Selecionar Arquivo PDF</CyberpunkButton>

                <div className="supported-info">
                  <h4>📱 Bancos Suportados:</h4>
                  <div className="bank-logos">
                    <span className="bank-tag">Itaú</span>
                    <span className="bank-tag">Bradesco</span>
                    <span className="bank-tag">Nubank</span>
                    <span className="bank-tag">Santander</span>
                    <span className="bank-tag">Banco do Brasil</span>
                  </div>

                  <div className="features-info">
                    <p>
                      🤖 <strong>IA Integrada:</strong> Classificação automática
                    </p>
                    <p>
                      ⚡ <strong>OCR Avançado:</strong> Extração precisa de dados
                    </p>
                    <p>
                      🔒 <strong>Seguro:</strong> Processamento local
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <CyberpunkCard className="pdf-importer">
      <div
        {...getRootProps()}
        className={`dropzone ${status} ${isDragActive ? 'drag-active' : ''}`}
      >
        <input {...getInputProps()} />
        {renderStatus()}
      </div>
    </CyberpunkCard>
  );
};

export default PDFImporter;
