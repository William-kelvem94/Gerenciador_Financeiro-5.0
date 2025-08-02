import React from 'react';

interface CyberpunkCardProps {
  children: React.ReactNode;
  className?: string;
}

export const CyberpunkCard: React.FC<CyberpunkCardProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`
      relative 
      bg-gradient-to-br from-slate-900/90 to-slate-800/90 
      border border-cyan-500/30 
      rounded-lg 
      backdrop-blur-sm 
      shadow-lg 
      shadow-cyan-500/10
      before:absolute 
      before:inset-0 
      before:rounded-lg 
      before:bg-gradient-to-r 
      before:from-cyan-500/5 
      before:to-purple-500/5 
      before:opacity-0 
      hover:before:opacity-100 
      before:transition-opacity 
      before:duration-300
      overflow-hidden
      ${className}
    `}>
      <div className="relative z-10 p-6">
        {children}
      </div>
      
      {/* Efeito de brilho canto superior */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-bl-full opacity-60" />
      
      {/* Linhas decorativas */}
      <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
      <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-purple-400 to-transparent" />
    </div>
  );
};
