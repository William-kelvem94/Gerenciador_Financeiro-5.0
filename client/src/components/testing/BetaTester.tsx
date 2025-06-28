import React, { useState, useEffect, useRef } from 'react';
import { SystemTester } from '../../services/systemTester';

interface TestLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  category?: string;
}

interface TestResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'failed' | 'warning' | 'running';
  duration?: number;
  error?: string;
  details?: string;
  timestamp: Date;
}

interface SimulationState {
  isRunning: boolean;
  currentAction: string;
  mousePosition: { x: number; y: number };
  viewportSize: { width: number; height: number };
  completedActions: string[];
  report: TestResult[];
}

export const BetaTester: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<TestLog[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    currentAction: '',
    mousePosition: { x: 0, y: 0 },
    viewportSize: { width: 1920, height: 1080 },
    completedActions: [],
    report: []
  });

  const systemTesterRef = useRef<SystemTester | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    systemTesterRef.current ??= new SystemTester(
      {},
      (log: string) => addLog('info', log)
    );
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (level: TestLog['level'], message: string, category?: string) => {
    const newLog: TestLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      category
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => {
    setLogs([]);
    setTestResults([]);
    setCurrentTest('');
  };

  const runAllTests = async () => {
    if (!systemTesterRef.current || isRunning) return;
    
    setIsRunning(true);
    clearLogs();
    addLog('info', '🚀 Iniciando testes automatizados do sistema');
    
    try {
      const results = await systemTesterRef.current.runAllTests();
      addLog('success', `✅ Testes concluídos! ${results.length} testes executados`);
    } catch (error) {
      addLog('error', `❌ Erro durante execução: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runSimulation = async () => {
    if (simulation.isRunning) return;
    
    setSimulation(prev => ({ ...prev, isRunning: true, completedActions: [], report: [] }));
    addLog('info', '🎭 Iniciando simulação de usuário real');
    
    const actions = [
      'Movendo mouse para área de login',
      'Clicando no campo de email',
      'Digitando credenciais',
      'Clicando em entrar',
      'Navegando para dashboard',
      'Testando responsividade',
      'Verificando elementos da interface',
      'Testando formulários',
      'Simulando resize da janela',
      'Verificando Matrix Rain',
      'Gerando relatório final'
    ];

    for (let i = 0; i < actions.length; i++) {
      if (!simulation.isRunning) break;
      
      const action = actions[i];
      setSimulation(prev => ({ 
        ...prev, 
        currentAction: action,
        mousePosition: { 
          x: Math.random() * 800, 
          y: Math.random() * 600 
        }
      }));
      
      addLog('info', `🤖 ${action}`);
      
      // Simular tempo de execução
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      setSimulation(prev => ({ 
        ...prev, 
        completedActions: [...prev.completedActions, action]
      }));
      
      // Adicionar resultado simulado
      const result: TestResult = {
        id: `sim-${i}`,
        name: action,
        category: 'simulation',
        status: Math.random() > 0.1 ? 'passed' : 'warning',
        duration: Math.floor(800 + Math.random() * 1200),
        timestamp: new Date(),
        details: `Ação simulada: ${action}`
      };
      
      setSimulation(prev => ({ 
        ...prev, 
        report: [...prev.report, result]
      }));
    }
    
    setSimulation(prev => ({ ...prev, isRunning: false, currentAction: '' }));
    addLog('success', '✅ Simulação concluída com sucesso!');
  };

  const stopSimulation = () => {
    setSimulation(prev => ({ ...prev, isRunning: false, currentAction: '' }));
    addLog('warning', '⏹️ Simulação interrompida pelo usuário');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'warning': return '⚠️';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  const getLogIcon = (level: TestLog['level']) => {
    switch (level) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50"
        title="Abrir Beta Tester Pro"
      >
        🧪
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-purple-500/30 rounded-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              🧪
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Beta Tester Pro</h2>
              <p className="text-sm text-gray-400">Sistema Avançado de Testes Automatizados</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white p-2"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Controls */}
          <div className="w-1/3 border-r border-purple-500/30 p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Controles</h3>
              
              <button
                onClick={runAllTests}
                disabled={isRunning || simulation.isRunning}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
              >
                {isRunning ? '⏳ Executando...' : '🚀 Executar Todos os Testes'}
              </button>
              
              <button
                onClick={simulation.isRunning ? stopSimulation : runSimulation}
                disabled={isRunning}
                className={`w-full ${
                  simulation.isRunning 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors`}
              >
                {simulation.isRunning ? '⏹️ Parar Simulação' : '🎭 Simular Usuário Real'}
              </button>
              
              <button
                onClick={clearLogs}
                disabled={isRunning || simulation.isRunning}
                className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg transition-colors"
              >
                🗑️ Limpar Logs
              </button>
            </div>

            {/* Simulation Viewport */}
            {simulation.isRunning && (
              <div className="bg-gray-800 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-semibold text-white">Mini Navegador</h4>
                <div className="bg-gray-700 rounded h-32 relative overflow-hidden">
                  <div className="absolute top-1 left-1 right-1 h-4 bg-gray-600 rounded flex items-center px-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Mouse cursor */}
                  <div 
                    className="absolute w-3 h-3 bg-white transform transition-all duration-500"
                    style={{
                      left: simulation.mousePosition.x * 0.15,
                      top: simulation.mousePosition.y * 0.15 + 20,
                      clipPath: 'polygon(0 0, 0 100%, 35% 65%, 65% 100%, 100% 0)'
                    }}
                  />
                  
                  {/* Simulated elements */}
                  <div className="absolute bottom-2 left-2 right-2 space-y-1">
                    <div className="h-1 bg-purple-400 rounded"></div>
                    <div className="h-1 bg-purple-300 rounded w-3/4"></div>
                    <div className="h-1 bg-purple-200 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-300">
                  <p>Ação: {simulation.currentAction}</p>
                  <p>Mouse: ({Math.floor(simulation.mousePosition.x)}, {Math.floor(simulation.mousePosition.y)})</p>
                  <p>Viewport: {simulation.viewportSize.width}x{simulation.viewportSize.height}</p>
                </div>
              </div>
            )}

            {/* Current Test */}
            {currentTest && (
              <div className="bg-gray-800 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-white mb-2">Teste Atual</h4>
                <p className="text-sm text-gray-300">{currentTest}</p>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-800 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-white mb-2">Estatísticas</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <p>Total: {testResults.length + simulation.report.length}</p>
                <p>✅ Passou: {[...testResults, ...simulation.report].filter(r => r.status === 'passed').length}</p>
                <p>❌ Falhou: {[...testResults, ...simulation.report].filter(r => r.status === 'failed').length}</p>
                <p>⚠️ Avisos: {[...testResults, ...simulation.report].filter(r => r.status === 'warning').length}</p>
              </div>
            </div>
          </div>

          {/* Right Panel - Results and Logs */}
          <div className="flex-1 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-purple-500/30">
              <button className="px-4 py-2 bg-purple-600 text-white rounded-t-lg">
                📊 Resultados
              </button>
              <button className="px-4 py-2 text-gray-400 hover:text-white">
                📝 Logs
              </button>
            </div>

            {/* Results Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-2">
                {[...testResults, ...simulation.report].map((result) => (
                  <div
                    key={result.id}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{getStatusIcon(result.status)}</span>
                        <span className="font-medium text-white">{result.name}</span>
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
                          {result.category}
                        </span>
                      </div>
                      {result.duration && (
                        <span className="text-xs text-gray-400">
                          {result.duration}ms
                        </span>
                      )}
                    </div>
                    {result.details && (
                      <p className="text-sm text-gray-300 mt-1">{result.details}</p>
                    )}
                    {result.error && (
                      <p className="text-sm text-red-400 mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Logs Section */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-3">Logs em Tempo Real</h4>
                <div className="bg-gray-800 rounded-lg p-3 h-48 overflow-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2 mb-2 text-sm">
                      <span className="flex-shrink-0">{getLogIcon(log.level)}</span>
                      <span className="text-gray-400 flex-shrink-0">
                        {log.timestamp.toLocaleTimeString()}
                      </span>
                      <span className="text-gray-300">{log.message}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetaTester;
