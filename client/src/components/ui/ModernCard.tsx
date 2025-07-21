import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernCardProps {
  title: string;
  subtitle?: string;
  value?: string | number;
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'cyan' | 'pink' | 'orange';
  gradient?: boolean;
  glassmorphism?: boolean;
  neonBorder?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  isLoading?: boolean;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

const colorMap = {
  blue: {
    bg: 'from-blue-500/20 to-blue-600/10',
    icon: 'text-blue-400',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20'
  },
  green: {
    bg: 'from-green-500/20 to-green-600/10',
    icon: 'text-green-400',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/20'
  },
  red: {
    bg: 'from-red-500/20 to-red-600/10',
    icon: 'text-red-400',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/20'
  },
  purple: {
    bg: 'from-purple-500/20 to-purple-600/10',
    icon: 'text-purple-400',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20'
  },
  yellow: {
    bg: 'from-yellow-500/20 to-yellow-600/10',
    icon: 'text-yellow-400',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20'
  },
  cyan: {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    icon: 'text-cyan-400',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/20'
  },
  pink: {
    bg: 'from-pink-500/20 to-pink-600/10',
    icon: 'text-pink-400',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20'
  },
  orange: {
    bg: 'from-orange-500/20 to-orange-600/10',
    icon: 'text-orange-400',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/20'
  }
};

export const ModernCard: React.FC<ModernCardProps> = ({
  title,
  subtitle,
  value,
  icon: Icon,
  color = 'blue',
  gradient = true,
  glassmorphism = true,
  neonBorder = false,
  children,
  onClick,
  className = '',
  isLoading = false,
  trend
}) => {
  const colors = colorMap[color];
  
  const cardClasses = [
    'relative p-6 rounded-xl transition-all duration-300',
    glassmorphism ? 'backdrop-blur-sm bg-white/5' : 'bg-gray-900/50',
    gradient ? `bg-gradient-to-br ${colors.bg}` : '',
    neonBorder ? `border ${colors.border} ${colors.glow} shadow-xl` : 'border border-gray-800/50',
    onClick ? 'cursor-pointer hover:scale-105 hover:shadow-2xl' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={cardClasses}
      onClick={onClick}
    >
      {/* Gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`p-2 rounded-lg ${gradient ? colors.bg : 'bg-gray-800/50'}`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white text-lg">{title}</h3>
              {subtitle && (
                <p className="text-gray-400 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Value and trend */}
        {value && (
          <div className="mb-4">
            {isLoading ? (
              <div className="h-8 bg-gray-700/50 rounded animate-pulse" />
            ) : (
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                {trend && (
                  <span className={`text-sm font-medium ${
                    trend.direction === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {trend.direction === 'up' ? '+' : '-'}{trend.percentage}%
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom content */}
        {children}
      </div>

      {/* Neon effect */}
      {neonBorder && (
        <div className={`absolute inset-0 rounded-xl ${colors.border} animate-pulse pointer-events-none`} />
      )}
    </motion.div>
  );
};
