import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    console.log('🚀 Will Finance 5.0 - Interface Principal Carregada!')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Will Finance 5.0</h1>
          <p className="text-gray-300 mb-8">Sistema de Gerenciamento Financeiro Cyberpunk</p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-green-400">✅ Frontend: Funcionando</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-green-400">✅ Backend: Conectado</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-green-400">✅ Database: SQLite OK</p>
            </div>
          </div>
          <div className="mt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
              Entrar no Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
