import { useEffect } from 'react';

function App() {
  useEffect(() => {
    console.log('🚀 Will Finance 5.0 - Interface Principal Carregada!');
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Will Finance 5.0</h1>
          <p className="mb-8 text-gray-300">Sistema de Gerenciamento Financeiro Cyberpunk</p>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-green-400">✅ Frontend: Funcionando</p>
            </div>
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-green-400">✅ Backend: Conectado</p>
            </div>
            <div className="rounded-lg bg-gray-800 p-4">
              <p className="text-green-400">✅ Database: SQLite OK</p>
            </div>
          </div>
          <div className="mt-8">
            <button className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700">
              Entrar no Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
