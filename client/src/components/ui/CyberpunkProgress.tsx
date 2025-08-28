import React from 'react';

interface CyberpunkProgressProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const CyberpunkProgress = ({
  value,
  max = 100,
  label,
  variant = 'primary',
  showPercentage = true,
  animated = true,
  size = 'md',
}: CyberpunkProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variantClasses = {
    primary: 'from-cyan-400 via-blue-500 to-purple-600',
    secondary: 'from-purple-400 via-pink-500 to-red-500',
    success: 'from-green-400 via-emerald-500 to-teal-600',
    warning: 'from-yellow-400 via-orange-500 to-red-500',
    danger: 'from-red-400 via-red-500 to-red-600',
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const glowColors = {
    primary: 'shadow-cyan-400/50',
    secondary: 'shadow-purple-400/50',
    success: 'shadow-green-400/50',
    warning: 'shadow-orange-400/50',
    danger: 'shadow-red-400/50',
  };

  return (
    <div className="space-y-2">
        {label ? (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-cyan-400 font-mono uppercase tracking-wider">
              {label}
            </span>
            {showPercentage && (
              <span className="text-xs text-cyan-300/80 font-mono" data-testid="progress-percentage">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        ) : (
          showPercentage && (
            <span className="text-xs text-cyan-300/80 font-mono block text-right" data-testid="progress-percentage">
              {Math.round(percentage)}%
            </span>
          )
        )}
      
      <div className={`relative w-full bg-gray-900/50 rounded-full border border-cyan-500/20 ${sizeClasses[size]} overflow-hidden`}>
        {/* Background grid effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse" />
        
        {/* Progress bar */}
        <div
          className={`
            h-full bg-gradient-to-r ${variantClasses[variant]} 
            transition-all duration-700 ease-out relative overflow-hidden
            ${animated ? 'animate-pulse' : ''}
            shadow-lg ${glowColors[variant]}
          `}
          style={{ width: `${percentage}%` }}
        >
          {/* Scanning effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan" />
          )}
          
          {/* Data stream effect */}
          <div className="absolute inset-0 opacity-40">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-current to-transparent animate-data-stream" />
          </div>
        </div>
        
        {/* Border glow */}
        <div className={`absolute inset-0 rounded-full border border-current/50 ${glowColors[variant]}`} />
      </div>
      
      {/* Value display */}
      {showPercentage && size === 'lg' && (
        <div className="text-center">
          <span className="text-lg font-mono font-bold text-cyan-400 drop-shadow-lg">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

// Animation styles - these would typically go in your global CSS
const styles = `
  @keyframes scan {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes data-stream {
    0% { transform: translateX(-100%) scaleY(1); }
    50% { transform: translateX(0%) scaleY(0.8); }
    100% { transform: translateX(100%) scaleY(1); }
  }
  
  .animate-scan {
    animation: scan 2s infinite linear;
  }
  
  .animate-data-stream {
    animation: data-stream 1.5s infinite ease-in-out;
  }
`;

export { CyberpunkProgress, styles as cyberpunkProgressStyles };
export default CyberpunkProgress;
