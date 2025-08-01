import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { PhoenixLogo } from '../ui/PhoenixLogo';
import { 
  LayoutDashboard, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Settings, 
  LogOut,
  User
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transações', href: '/transactions', icon: CreditCard },
  { name: 'Orçamentos', href: '/budgets', icon: PiggyBank },
  { name: 'Relatórios', href: '/reports', icon: TrendingUp },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Matrix background effect */}
      <div className="matrix-rain"></div>
      
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-y-0 left-0 z-50 w-72 bg-background-secondary/95 backdrop-blur-xl border-r border-cyber-primary/20"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b border-cyber-primary/20">
          <PhoenixLogo size="lg" />
          <div className="ml-4">
            <h1 className="text-2xl font-cyber text-cyber-primary">Will Finance</h1>
            <p className="text-sm text-foreground-muted font-mono">Phoenix System v5.0</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-cyber-primary/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-cyber rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-cyber-dark" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-foreground-muted font-mono">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-cyber-primary/10 text-cyber-primary border border-cyber-primary/30 shadow-glow-sm'
                      : 'text-foreground-secondary hover:text-cyber-primary hover:bg-background-tertiary/50'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-cyber-primary' : 'text-foreground-muted group-hover:text-cyber-primary'
                  }`} />
                  <span className="font-mono">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-0 w-1 h-8 bg-cyber-primary rounded-l-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-cyber-danger hover:bg-cyber-danger/10 rounded-lg transition-all duration-200 group border border-transparent hover:border-cyber-danger/30"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-mono">Sair do Sistema</span>
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pl-72">
        {/* Top Bar */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-16 bg-background-secondary/80 backdrop-blur-xl border-b border-cyber-primary/10 flex items-center justify-between px-6"
        >
          <div>
            <h2 className="text-lg font-cyber text-cyber-primary">
              {navigation.find(item => item.href === location.pathname)?.name || 'Sistema'}
            </h2>
            <p className="text-xs text-foreground-muted font-mono">
              Gerenciamento Financeiro Avançado
            </p>
          </div>
          
          {/* Status Indicators */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse"></div>
              <span className="text-xs text-foreground-muted font-mono">Sistema Online</span>
            </div>
            <div className="w-px h-6 bg-cyber-primary/20"></div>
            <div className="text-xs text-foreground-muted font-mono">
              {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-6 min-h-[calc(100vh-4rem)]"
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </motion.main>
      </div>

      {/* Circuit patterns overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-cyber-primary rounded animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-cyber-secondary rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 border border-cyber-accent rounded animate-bounce"></div>
      </div>
    </div>
  );
}