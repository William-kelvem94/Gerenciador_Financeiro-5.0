import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Sun, Moon, Zap, Sunset, Waves, TreePine, Heart, Crown } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

const themes = [
  { 
    id: 'light', 
    name: 'Light', 
    icon: Sun, 
    description: 'Clean and bright',
    preview: 'linear-gradient(135deg, #ffffff, #f1f5f9)',
    colors: ['#ffffff', '#3b82f6', '#f1f5f9']
  },
  { 
    id: 'dark', 
    name: 'Dark', 
    icon: Moon, 
    description: 'Elegant and modern',
    preview: 'linear-gradient(135deg, #020617, #0f172a)',
    colors: ['#020617', '#3b82f6', '#1e293b']
  },
  { 
    id: 'cyberpunk', 
    name: 'Cyberpunk', 
    icon: Zap, 
    description: 'Neon futuristic',
    preview: 'linear-gradient(135deg, #000000, #ff00ff)',
    colors: ['#000000', '#ff00ff', '#00ffff']
  },
  { 
    id: 'sunset', 
    name: 'Sunset', 
    icon: Sunset, 
    description: 'Warm and cozy',
    preview: 'linear-gradient(135deg, #fff7ed, #fb923c)',
    colors: ['#fff7ed', '#fb923c', '#f97171']
  },
  { 
    id: 'ocean', 
    name: 'Ocean', 
    icon: Waves, 
    description: 'Fresh and calm',
    preview: 'linear-gradient(135deg, #f0f9ff, #0ea5e9)',
    colors: ['#f0f9ff', '#0ea5e9', '#06b6d4']
  },
  { 
    id: 'forest', 
    name: 'Forest', 
    icon: TreePine, 
    description: 'Natural and peaceful',
    preview: 'linear-gradient(135deg, #f0fdf4, #22c55e)',
    colors: ['#f0fdf4', '#22c55e', '#10b981']
  },
  { 
    id: 'rose', 
    name: 'Rose', 
    icon: Heart, 
    description: 'Romantic and elegant',
    preview: 'linear-gradient(135deg, #fff1f2, #f43f5e)',
    colors: ['#fff1f2', '#f43f5e', '#ec4899']
  },
  { 
    id: 'purple', 
    name: 'Purple', 
    icon: Crown, 
    description: 'Royal and mysterious',
    preview: 'linear-gradient(135deg, #faf5ff, #9333ea)',
    colors: ['#faf5ff', '#9333ea', '#a855f7']
  }
];

export function ThemeSelector() {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CurrentIcon className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">{currentTheme.name}</span>
        <Palette className="w-4 h-4 opacity-70" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4">
                <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">
                  Choose Theme
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon;
                    const isSelected = theme === themeOption.id;
                    
                    return (
                      <motion.button
                        key={themeOption.id}
                        onClick={() => {
                          setTheme(themeOption.id as 'light' | 'dark' | 'cyberpunk' | 'sunset' | 'ocean' | 'forest' | 'rose' | 'purple');
                          setIsOpen(false);
                        }}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-300 group
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Theme preview */}
                        <div 
                          className="w-full h-16 rounded-lg mb-3 relative overflow-hidden"
                          style={{ background: themeOption.preview }}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          
                          {/* Color dots */}
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            {themeOption.colors.map((color, idx) => (
                              <div
                                key={`color-${themeOption.id}-${idx}`}
                                className="w-3 h-3 rounded-full border border-white/30"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {themeOption.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {themeOption.description}
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Will Finance 5.0 • Advanced Theme System
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
