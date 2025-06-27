import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

export function NotFoundPage() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="relative">
            <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl animate-pulse"></div>
          </div>
        </div>
        
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-cyan-100 mb-4">Página Não Encontrada</h2>
          <p className="text-gray-400 mb-6">
            Ops! A página que você está procurando não existe ou foi movida para outro local.
          </p>
          <div className="text-sm text-gray-500">
            Possíveis causas:
            <ul className="mt-2 space-y-1">
              <li>• URL digitada incorretamente</li>
              <li>• Link expirado ou quebrado</li>
              <li>• Página removida ou renomeada</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={goHome}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
          >
            <Home className="h-5 w-5" />
            <span>Ir para o Dashboard</span>
          </button>
          
          <button
            onClick={goBack}
            className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-3 rounded-lg transition-all duration-200 font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center space-x-2 mb-2">
            <Search className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-400">Precisa de ajuda?</span>
          </div>
          <p className="text-xs text-gray-400">
            Se você chegou aqui através de um link interno, por favor nos informe para que possamos corrigi-lo.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-5 w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
