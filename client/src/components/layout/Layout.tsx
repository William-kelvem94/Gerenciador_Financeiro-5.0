import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import PhoenixLogo from '../ui/PhoenixLogo';
import { 
  LayoutDashboard, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Settings, 
  LogOut,
  User,
  ArrowUpDown
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: CreditCard },
  { name: 'Orçamentos', href: '/budgets', icon: PiggyBank },
  { name: 'Relatórios', href: '/reports', icon: TrendingUp },
  { name: 'Import/Export', href: '/import-export', icon: ArrowUpDown },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-cyber text-white font-cyber relative">
      {/* Matrix background effect cyberpunk */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="matrix-rain opacity-10"></div>
        <div className="fixed inset-0 pointer-events-none opacity-10 z-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-cyber-primary rounded animate-spin-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 border-2 border-cyber-secondary rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border-2 border-cyber-accent rounded animate-bounce"></div>
        </div>
      </div>

      {/* Sidebar Cyberpunk */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-black-secondary/95 backdrop-blur-xl border-r-2 border-cyber-primary/30 shadow-cyber flex flex-col justify-between"
      >
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-center h-20 border-b border-cyber-primary/30 bg-gradient-to-r from-cyber-primary/10 to-cyber-secondary/10">
            <PhoenixLogo size="lg" />
            <div className="ml-4">
              <h1 className="text-2xl font-cyber text-cyber-primary text-glow">Will Finance</h1>
              <p className="text-sm text-cyber-secondary font-mono">Phoenix System v5.0</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-cyber-primary/20 bg-black-tertiary/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyber-primary to-cyber-secondary rounded-full flex items-center justify-center shadow-neon">
                <User className="w-5 h-5 text-cyber-dark" />
              </div>
              <div>
                <p className="text-base font-bold text-cyber-accent text-glow">{user?.name}</p>
                <p className="text-xs text-cyber-primary font-mono">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Cyberpunk */}
          <nav className="mt-6 px-3">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-base font-mono rounded-lg transition-all duration-200 relative overflow-hidden border-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyber-primary/20 to-cyber-secondary/10 text-cyber-primary border-cyber-primary shadow-neon'
                        : 'text-white-muted hover:text-cyber-primary hover:bg-black-tertiary/40 border-transparent'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? 'text-cyber-primary text-glow' : 'text-white-muted group-hover:text-cyber-primary'
                    }`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute right-0 w-1 h-8 bg-cyber-primary rounded-l-full shadow-neon"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Logout Button Cyberpunk */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-base font-mono font-bold text-cyber-danger bg-gradient-to-r from-cyber-danger/10 to-cyber-secondary/10 rounded-lg transition-all duration-200 border-2 border-cyber-danger/30 shadow-neon hover:bg-cyber-danger/20 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Cyberpunk */}
      <div className="pl-72">
        {/* Top Bar Cyberpunk */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-16 bg-gradient-to-r from-black-secondary/80 to-black-tertiary/80 backdrop-blur-xl border-b-2 border-cyber-primary/20 flex items-center justify-between px-8 shadow-cyber"
        >
          <div>
            <h2 className="text-xl font-cyber text-cyber-primary text-glow">
              {navigation.find(item => item.href === location.pathname)?.name || 'Sistema'}
            </h2>
            <p className="text-xs text-cyber-secondary font-mono">Gerenciamento Financeiro Avançado</p>
          </div>
          {/* Status Indicators Cyberpunk */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-accent rounded-full animate-pulse-neon shadow-neon"></div>
              <span className="text-xs text-cyber-accent font-mono">Sistema Online</span>
            </div>
            <div className="w-px h-6 bg-cyber-primary/30"></div>
            <div className="text-xs text-cyber-primary font-mono">
              {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </motion.header>

        {/* Page Content Cyberpunk */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 min-h-[calc(100vh-4rem)] bg-black/40 rounded-xl shadow-cyber"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
