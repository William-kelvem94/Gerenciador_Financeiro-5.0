import React from 'react';

interface PhoenixLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  animate?: boolean;
  className?: string;
}

export function PhoenixLogo({ size = 'md', animate = false, className = '' }: PhoenixLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    xxl: 'w-32 h-32'
  };

  const animationClass = animate ? 'animate-phoenix-glow' : '';

  return (
    <div className={`${sizeClasses[size]} ${animationClass} ${className} relative`}>
      {/* Múltiplas camadas de glow espetaculares */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-400 opacity-60 blur-3xl animate-pulse-slow"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300 opacity-40 blur-2xl animate-ping-slow"></div>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-30 blur-xl animate-bounce-slow"></div>
      
      {/* Partículas de fogo flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-orange-400 rounded-full animate-float-1"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-red-400 rounded-full animate-float-2"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-float-3"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-orange-300 rounded-full animate-float-4"></div>
        <div className="absolute top-1/2 left-1/6 w-0.5 h-0.5 bg-red-300 rounded-full animate-float-5"></div>
        <div className="absolute top-1/6 right-1/2 w-0.5 h-0.5 bg-yellow-300 rounded-full animate-float-6"></div>
      </div>

      {/* Imagem da Fênix real */}
      <div className="relative z-10 w-full h-full">
        <img 
          src="/imagem_gerada.svg" 
          alt="Fênix Will Finance" 
          className="w-full h-full object-contain drop-shadow-2xl filter brightness-110 contrast-125 saturate-110"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(255, 140, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 69, 0, 0.6)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))'
          }}
        />
      </div>

      {/* Overlay de efeitos especiais */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Reflexos dinâmicos */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-60 animate-shimmer"></div>
        
        {/* Círculos de energia */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 border border-orange-400/30 rounded-full animate-spin-slow"></div>
          <div className="absolute top-2 left-2 w-12 h-12 border border-red-400/20 rounded-full animate-spin-reverse"></div>
          <div className="absolute top-4 left-4 w-8 h-8 border border-yellow-400/40 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
