import React, { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';

interface ModernInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'underlined' | 'neon';
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

export const ModernInput = forwardRef<HTMLInputElement, ModernInputProps>(({
  label,
  error,
  success,
  hint,
  icon: Icon,
  iconPosition = 'left',
  size = 'md',
  variant = 'default',
  loading = false,
  clearable = false,
  onClear,
  type = 'text',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const variantClasses = {
    default: 'bg-gray-900/50 border border-gray-700 hover:border-gray-600 focus:border-blue-500',
    filled: 'bg-gray-800 border-0 hover:bg-gray-700 focus:bg-gray-700',
    underlined: 'bg-transparent border-0 border-b-2 border-gray-700 hover:border-gray-600 focus:border-blue-500 rounded-none',
    neon: 'bg-transparent border-2 border-cyan-400/50 hover:border-cyan-400 focus:border-cyan-400 shadow-cyan-400/20 focus:shadow-cyan-400/40'
  };

  const baseClasses = [
    'w-full rounded-lg transition-all duration-200',
    'text-white placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    Icon && iconPosition === 'left' ? 'pl-10' : '',
    (Icon && iconPosition === 'right') || isPassword || clearable ? 'pr-10' : '',
    sizeClasses[size],
    variantClasses[variant],
    error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
    success ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20' : '',
    className
  ].filter(Boolean).join(' ');

  const iconClasses = 'w-5 h-5 text-gray-400 absolute top-1/2 transform -translate-y-1/2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <Icon className={`${iconClasses} left-3`} />
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={baseClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          
          {clearable && props.value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {Icon && iconPosition === 'right' && !isPassword && !clearable && (
            <Icon className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Focus ring animation */}
        {variant === 'neon' && isFocused && (
          <div className="absolute inset-0 rounded-lg border-2 border-cyan-400 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Messages */}
      <div className="space-y-1">
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-red-400 flex items-center gap-1"
          >
            <span className="w-1 h-1 bg-red-400 rounded-full" />
            {error}
          </motion.p>
        )}
        
        {success && !error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-green-400 flex items-center gap-1"
          >
            <span className="w-1 h-1 bg-green-400 rounded-full" />
            {success}
          </motion.p>
        )}
        
        {hint && !error && !success && (
          <p className="text-sm text-gray-500">{hint}</p>
        )}
      </div>
    </motion.div>
  );
});

ModernInput.displayName = 'ModernInput';
