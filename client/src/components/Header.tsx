import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { NotificationCenter } from './NotificationCenter'

// Mapeamento de rotas para títulos
const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Contas',
  '/transactions': 'Transações',
  '/budgets': 'Orçamentos',
  '/goals': 'Metas',
  '/analytics': 'Analytics',
  '/settings': 'Configurações',
}

export function Header() {
  const location = useLocation()
  const { user } = useAuthStore()
  
  const pageTitle = routeTitles[location.pathname] || 'Will Finance'

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-black/10 backdrop-blur-md border-b border-green-500/20 flex items-center justify-between px-6"
    >
      {/* Título da página */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
      </div>

      {/* Barra de pesquisa */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-200"
          />
        </div>
      </div>

      {/* Menu do usuário */}
      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <NotificationCenter />

        {/* Perfil do usuário */}
        <div className="flex items-center space-x-3 px-3 py-2 bg-black/20 rounded-lg border border-green-500/30">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-black" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">
              {user?.firstName ?? user?.username ?? 'Usuário'}
            </p>
            <p className="text-xs text-gray-400">
              {user?.email ?? 'usuario@email.com'}
            </p>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
