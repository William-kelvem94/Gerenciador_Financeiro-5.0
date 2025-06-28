import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Teste simples de login
function SimpleLogin() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-purple-400 mb-6">
          Will Finance - Login
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <input 
              type="password" 
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="123456"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Use: test@example.com / 123456
        </p>
      </div>
    </div>
  )
}

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={<SimpleLogin />} 
        />
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App
