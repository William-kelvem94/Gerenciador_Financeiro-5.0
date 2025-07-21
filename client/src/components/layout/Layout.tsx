import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeSelector } from '../theme/ThemeSelector';
import { useAuthStore } from '../../stores/authStore';
import { LogOut, User, Bell, Settings } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <nav className="backdrop-blur-xl border-b sticky top-0 z-50" 
           style={{ 
             backgroundColor: 'rgba(var(--card), 0.95)', 
             borderColor: 'rgb(var(--border))' 
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="font-bold text-white">W</span>
              </div>
              <h1 className="text-xl font-bold" style={{ color: 'rgb(var(--foreground))' }}>
                Will Finance 5.0
              </h1>
            </motion.div>

            {/* Right side - Theme selector, notifications, user menu */}
            <div className="flex items-center space-x-4">
              {/* Theme Selector */}
              <ThemeSelector />
              
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
              >
                <Bell className="w-5 h-5" style={{ color: 'rgb(var(--foreground))' }} />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center"
                      style={{ backgroundColor: 'rgb(var(--destructive))' }}>
                </span>
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5" style={{ color: 'rgb(var(--foreground))' }} />
              </motion.button>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center"
                         style={{ backgroundColor: 'rgb(var(--secondary))' }}>
                      <User className="w-4 h-4" style={{ color: 'rgb(var(--secondary-foreground))' }} />
                    </div>
                  )}
                  <span className="hidden sm:inline font-medium" style={{ color: 'rgb(var(--foreground))' }}>
                    {user?.name || 'User'}
                  </span>
                </div>
                
                <motion.button
                  onClick={logout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" style={{ color: 'rgb(var(--foreground))' }} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}