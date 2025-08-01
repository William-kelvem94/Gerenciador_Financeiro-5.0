import React from 'react';

interface CyberpunkButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const CyberpunkButton = ({
  children,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: CyberpunkButtonProps) => {
  const variantClasses = {
    primary: 'bg-cyan-500/20 border-cyan-400 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300',
    secondary: 'bg-purple-500/20 border-purple-400 text-purple-400 hover:bg-purple-500/30 hover:text-purple-300',
    danger: 'bg-red-500/20 border-red-400 text-red-400 hover:bg-red-500/30 hover:text-red-300',
  };

  const baseClasses = `
    relative px-6 py-3 font-mono font-medium uppercase tracking-wider
    border-2 rounded-none transition-all duration-300
    hover:shadow-lg hover:scale-105 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-current before:to-transparent
    before:opacity-0 before:translate-x-[-100%] before:transition-all before:duration-700
    hover:before:opacity-20 hover:before:translate-x-[100%]
    active:scale-95
  `;

  if (loading) {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Processing...
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export { CyberpunkButton };
export default CyberpunkButton;
