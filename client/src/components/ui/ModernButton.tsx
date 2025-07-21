import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  glow?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const getIconSize = (size: string): string => {
  const sizeMap: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  return sizeMap[size] || 'w-5 h-5';
};

const getSizeClasses = (size: string): string => {
  const sizeMap: Record<string, string> = {
    sm: 'px-3 py-2 text-sm gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3'
  };
  return sizeMap[size] || sizeMap.md;
};

const getVariantClasses = (variant: string, glow: boolean): string => {
  const variants: Record<string, string> = {
    primary: `bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg focus:ring-blue-500 ${glow ? 'shadow-blue-500/25 hover:shadow-blue-500/40' : ''}`,
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600 focus:ring-gray-500',
    danger: `bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg focus:ring-red-500 ${glow ? 'shadow-red-500/25 hover:shadow-red-500/40' : ''}`,
    ghost: 'text-gray-300 hover:text-white hover:bg-white/10 border border-gray-700 hover:border-gray-600 focus:ring-gray-500',
    neon: 'bg-transparent border-2 border-cyan-400 text-cyan-400 hover:text-black hover:bg-cyan-400 hover:shadow-cyan-400/50 shadow-lg hover:shadow-xl focus:ring-cyan-400'
  };
  return variants[variant] || variants.primary;
};

export const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  glow = false,
  type = 'button'
}) => {
  const baseClasses = [
    'relative inline-flex items-center justify-center',
    'font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'overflow-hidden group',
    fullWidth ? 'w-full' : '',
  ].filter(Boolean).join(' ');

  const iconSizeClass = getIconSize(size);
  const sizeClass = getSizeClasses(size);
  const variantClass = getVariantClasses(variant, glow);

  const finalClasses = [baseClasses, sizeClass, variantClass, className].join(' ');

  const renderIcon = (position: 'left' | 'right') => {
    if (!Icon || iconPosition !== position || loading) return null;
    return <Icon className={iconSizeClass} />;
  };

  const renderLoadingContent = () => (
    <div className="flex items-center gap-2">
      <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      <span>Loading...</span>
    </div>
  );

  return (
    <motion.button
      type={type}
      className={finalClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        {renderIcon('left')}
        {loading ? renderLoadingContent() : children}
        {renderIcon('right')}
      </div>
    </motion.button>
  );
};
