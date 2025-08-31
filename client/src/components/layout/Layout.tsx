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
  User,
  ArrowUpDown,
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
    <div className="bg-gradient-cyber font-cyber relative min-h-screen text-white">
      {/* Matrix background effect cyberpunk */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="matrix-rain opacity-10"></div>
        <div className="pointer-events-none fixed inset-0 z-0 opacity-10">
          <div className="border-cyber-primary animate-spin-slow absolute top-1/4 left-1/4 h-32 w-32 rounded border-2"></div>
          <div className="border-cyber-secondary absolute top-3/4 right-1/4 h-24 w-24 animate-pulse rounded-full border-2"></div>
          <div className="border-cyber-accent absolute bottom-1/4 left-1/3 h-16 w-16 animate-bounce rounded border-2"></div>
        </div>
      </div>

      {/* Sidebar Cyberpunk */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-black-secondary/95 border-cyber-primary/30 shadow-cyber fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r-2 backdrop-blur-xl"
      >
        <div>
          {/* Logo Section */}
          <div className="border-cyber-primary/30 from-cyber-primary/10 to-cyber-secondary/10 flex h-20 items-center justify-center border-b bg-gradient-to-r">
            <PhoenixLogo size="lg" />
            <div className="ml-4">
              <h1 className="font-cyber text-cyber-primary text-glow text-2xl">Will Finance</h1>
              <p className="text-cyber-secondary font-mono text-sm">Phoenix System v5.0</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-cyber-primary/20 bg-black-tertiary/60 border-b p-4">
            <div className="flex items-center space-x-3">
              <div className="from-cyber-primary to-cyber-secondary shadow-neon flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br">
                <User className="text-cyber-dark h-5 w-5" />
              </div>
              <div>
                <p className="text-cyber-accent text-glow text-base font-bold">{user?.name}</p>
                <p className="text-cyber-primary font-mono text-xs">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Cyberpunk */}
          <nav className="mt-6 px-3">
            <div className="space-y-2">
              {navigation.map(item => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group relative flex items-center overflow-hidden rounded-lg border-2 px-4 py-3 font-mono text-base transition-all duration-200 ${
                      isActive
                        ? 'from-cyber-primary/20 to-cyber-secondary/10 text-cyber-primary border-cyber-primary shadow-neon bg-gradient-to-r'
                        : 'text-white-muted hover:text-cyber-primary hover:bg-black-tertiary/40 border-transparent'
                    }`}
                  >
                    <Icon
                      className={`mr-3 h-5 w-5 transition-colors ${
                        isActive
                          ? 'text-cyber-primary text-glow'
                          : 'text-white-muted group-hover:text-cyber-primary'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="bg-cyber-primary shadow-neon absolute right-0 h-8 w-1 rounded-l-full"
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
            className="text-cyber-danger from-cyber-danger/10 to-cyber-secondary/10 border-cyber-danger/30 shadow-neon hover:bg-cyber-danger/20 flex w-full items-center rounded-lg border-2 bg-gradient-to-r px-4 py-3 font-mono text-base font-bold transition-all duration-200 hover:text-white"
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
          className="from-black-secondary/80 to-black-tertiary/80 border-cyber-primary/20 shadow-cyber flex h-16 items-center justify-between border-b-2 bg-gradient-to-r px-8 backdrop-blur-xl"
        >
          <div>
            <h2 className="font-cyber text-cyber-primary text-glow text-xl">
              {navigation.find(item => item.href === location.pathname)?.name || 'Sistema'}
            </h2>
            <p className="text-cyber-secondary font-mono text-xs">
              Gerenciamento Financeiro Avançado
            </p>
          </div>
          {/* Status Indicators Cyberpunk */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="bg-cyber-accent animate-pulse-neon shadow-neon h-3 w-3 rounded-full"></div>
              <span className="text-cyber-accent font-mono text-xs">Sistema Online</span>
            </div>
            <div className="bg-cyber-primary/30 h-6 w-px"></div>
            <div className="text-cyber-primary font-mono text-xs">
              {new Date().toLocaleString('pt-BR')}
            </div>
          </div>
        </motion.header>

        {/* Page Content Cyberpunk */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="shadow-cyber min-h-[calc(100vh-4rem)] rounded-xl bg-black/40 p-8"
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
}
