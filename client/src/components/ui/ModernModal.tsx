import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ModernButton } from './ModernButton';

interface ModernModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'glass' | 'neon';
  showCloseButton?: boolean;
  preventCloseOnBackdrop?: boolean;
  footer?: React.ReactNode;
  className?: string;
}

export const ModernModal: React.FC<ModernModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  preventCloseOnBackdrop = false,
  footer,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const variantClasses = {
    default: 'bg-gray-900 border border-gray-700',
    glass: 'bg-gray-900/80 backdrop-blur-xl border border-gray-700/50',
    neon: 'bg-gray-900/90 border-2 border-cyan-400/50 shadow-cyan-400/20 shadow-2xl'
  };

  const backdropClasses = {
    default: 'bg-black/50',
    glass: 'bg-black/30 backdrop-blur-sm',
    neon: 'bg-black/60'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventCloseOnBackdrop) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropClasses[variant]}`}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`
              relative w-full ${sizeClasses[size]} ${variantClasses[variant]}
              rounded-xl shadow-2xl overflow-hidden ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background pattern */}
            {variant === 'neon' && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-purple-400/20" />
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="relative px-6 py-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  {title && (
                    <h2 className="text-xl font-semibold text-white">
                      {title}
                    </h2>
                  )}
                  {showCloseButton && (
                    <ModernButton
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      icon={X}
                      className="!p-2"
                    >
                      <span className="sr-only">Close</span>
                    </ModernButton>
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="relative px-6 py-4 max-h-[calc(90vh-8rem)] overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="relative px-6 py-4 border-t border-gray-700/50 bg-gray-800/30">
                {footer}
              </div>
            )}

            {/* Glow effect for neon variant */}
            {variant === 'neon' && (
              <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/30 animate-pulse pointer-events-none" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
