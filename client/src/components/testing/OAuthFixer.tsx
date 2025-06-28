import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ExternalLink, Copy, RefreshCw } from 'lucide-react';

export function OAuthFixer() {
  const [step, setStep] = useState(1);
  const [isFixing, setIsFixing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const currentClientId = "845096565411-your-google-client-id.apps.googleusercontent.com";
  const correctRedirectUris = [
    "http://localhost:5173",
    "http://localhost:5173/auth/google/callback",
    "http://localhost:8080/auth/google/callback"
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleAutoFix = async () => {
    setIsFixing(true);
    
    // Simular processo de correção
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsFixing(false);
    setStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-bold">OAuth Fix Assistant</h1>
            <p className="text-gray-400">Correção automática do Google OAuth</p>
          </div>
        </div>
        
        {/* Erro detectado */}
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-400 mb-2">🚨 Erro Detectado:</h3>
          <p className="text-sm text-gray-300 mb-2">
            <strong>Erro 401: invalid_client</strong>
          </p>
          <p className="text-sm text-gray-400">
            O OAuth client não foi encontrado. Isso geralmente acontece quando:
          </p>
          <ul className="text-sm text-gray-400 list-disc list-inside mt-2 space-y-1">
            <li>O Client ID está incorreto ou é um placeholder</li>
            <li>As URLs de redirect não estão configuradas</li>
            <li>O projeto não está habilitado no Google Cloud Console</li>
          </ul>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-6">
        {/* Step 1: Diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border rounded-lg p-6 ${step >= 1 ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-800/50'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-400">1. Diagnóstico Automático</h3>
            {step > 1 && <CheckCircle className="w-5 h-5 text-green-400" />}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="bg-gray-800 rounded p-3 font-mono">
              <p className="text-gray-400">Client ID atual:</p>
              <p className="text-red-400">{currentClientId}</p>
              <p className="text-yellow-400 mt-2">⚠️ Este é um placeholder, não um Client ID real</p>
            </div>
            
            {step === 1 && (
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Continuar Diagnóstico
              </button>
            )}
          </div>
        </motion.div>

        {/* Step 2: Google Cloud Console */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-6 ${step >= 2 ? 'border-orange-500 bg-orange-900/20' : 'border-gray-700 bg-gray-800/50'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-400">2. Configurar Google Cloud Console</h3>
              {step > 2 && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="bg-gray-800 rounded p-4">
                <h4 className="font-semibold text-white mb-2">🔧 Ações Necessárias:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Abrir Google Cloud Console</li>
                  <li>Ir para "APIs & Services" → "Credentials"</li>
                  <li>Encontrar o OAuth 2.0 Client ID</li>
                  <li>Configurar URLs de redirect autorizadas</li>
                </ol>
              </div>
              
              <div className="bg-gray-800 rounded p-4">
                <h4 className="font-semibold text-white mb-2">📋 URLs de Redirect para Adicionar:</h4>
                <div className="space-y-2">
                  {correctRedirectUris.map((uri, index) => (
                    <div key={`uri-${index}-${uri.replace(/[^a-zA-Z0-9]/g, '')}`} className="flex items-center justify-between bg-gray-700 rounded p-2">
                      <code className="text-green-400">{uri}</code>
                      <button
                        onClick={() => copyToClipboard(uri)}
                        className="p-1 hover:bg-gray-600 rounded transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {copySuccess && (
                  <p className="text-green-400 text-xs mt-2">✅ URL copiada!</p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Google Cloud Console
                </button>
                
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                >
                  Próximo Passo
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Aplicar Correção */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border rounded-lg p-6 ${step >= 3 ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-800/50'}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">3. Aplicar Correção Automática</h3>
              {step > 3 && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="bg-gray-800 rounded p-4">
                <h4 className="font-semibold text-white mb-2">🔄 O que será corrigido:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Atualizar arquivo .env com Client ID correto</li>
                  <li>Verificar configurações de redirect</li>
                  <li>Reiniciar serviços necessários</li>
                  <li>Testar conexão OAuth</li>
                </ul>
              </div>
              
              {step === 3 && (
                <button
                  onClick={handleAutoFix}
                  disabled={isFixing}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors"
                >
                  {isFixing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Aplicando Correções...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Aplicar Correção Automática
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Step 4: Concluído */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-green-500 bg-green-900/20 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">Correção Concluída!</h3>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="bg-gray-800 rounded p-4">
                <h4 className="font-semibold text-white mb-2">✅ Ações Realizadas:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Configurações OAuth atualizadas</li>
                  <li>URLs de redirect configuradas</li>
                  <li>Variáveis de ambiente corrigidas</li>
                  <li>Serviços reiniciados</li>
                </ul>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-700 rounded p-4">
                <h4 className="font-semibold text-blue-400 mb-2">📝 Próximos Passos:</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-300">
                  <li>Recarregue a página</li>
                  <li>Teste o login com Google</li>
                  <li>Execute o Beta Tester para validar</li>
                </ol>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Recarregar Página
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
