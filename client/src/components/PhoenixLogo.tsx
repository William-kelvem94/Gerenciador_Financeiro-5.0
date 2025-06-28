import React from 'react';

interface PhoenixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  animate?: boolean;
  className?: string;
}

export function PhoenixLogo({ size = 'md', animate = false, className = '' }: Readonly<PhoenixLogoProps>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    xxl: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center rounded-full`}>
      {/* Fundo tecnológico */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/20 backdrop-blur-sm" />
      
      {/* Anel externo */}
      <div className="absolute inset-0 rounded-full border-2 border-orange-500/40 animate-pulse" />
      
      {/* Ícone da Fênix */}
      <div className="relative z-10 text-orange-500">
        <svg className="w-3/4 h-3/4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      
      {/* Efeito de glow */}
      <div className="absolute inset-0 rounded-full bg-orange-500/10 blur-md animate-pulse" />
    </div>
  );
}
