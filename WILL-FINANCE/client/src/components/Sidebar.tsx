import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Wallet,
  ArrowUpDown,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Contas', href: '/accounts', icon: Wallet },
  { name: 'Transações', href: '/transactions', icon: ArrowUpDown },
  { name: 'Orçamentos', href: '/budgets', icon: Target },
  { name: 'Metas', href: '/goals', icon: TrendingUp },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-black/20 backdrop-blur-md border-r border-green-500/20 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-green-500/20">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-lg">₣</span>
          </div>
          <h1 className="text-xl font-bold text-white">Will Finance</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* User Section & Logout */}
      <div className="p-4 border-t border-green-500/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </button>
      </div>
    </motion.div>
  )
}
