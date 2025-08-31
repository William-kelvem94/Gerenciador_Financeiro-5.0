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
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-medium tracking-wider text-cyan-400 uppercase">
            {label}
          </span>
          {showPercentage && (
            <span className="font-mono text-xs text-cyan-300/80" data-testid="progress-percentage">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      ) : (
        showPercentage && (
          <span
            className="block text-right font-mono text-xs text-cyan-300/80"
            data-testid="progress-percentage"
          >
            {Math.round(percentage)}%
          </span>
        )
      )}

      <div
        className={`relative w-full rounded-full border border-cyan-500/20 bg-gray-900/50 ${sizeClasses[size]} overflow-hidden`}
      >
        {/* Background grid effect */}
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />

        {/* Progress bar */}
        <div
          className={`h-full bg-gradient-to-r ${variantClasses[variant]} relative overflow-hidden transition-all duration-700 ease-out ${animated ? 'animate-pulse' : ''} shadow-lg ${glowColors[variant]} `}
          style={{ width: `${percentage}%` }}
        >
          {/* Scanning effect */}
          {animated && (
            <div className="animate-scan absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          )}

          {/* Data stream effect */}
          <div className="absolute inset-0 opacity-40">
            <div className="animate-data-stream h-full w-full bg-gradient-to-r from-transparent via-current to-transparent" />
          </div>
        </div>

        {/* Border glow */}
        <div
          className={`absolute inset-0 rounded-full border border-current/50 ${glowColors[variant]}`}
        />
      </div>

      {/* Value display */}
      {showPercentage && size === 'lg' && (
        <div className="text-center">
          <span className="font-mono text-lg font-bold text-cyan-400 drop-shadow-lg">
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export { CyberpunkProgress };
export default CyberpunkProgress;
