import React, { ReactNode } from 'react';

export interface CyberpunkCardProps {
  children: ReactNode;
  className?: string;
}

const CyberpunkCard: React.FC<CyberpunkCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`card bg-gradient-to-br from-cyber-primary/20 via-black-secondary/80 to-cyber-secondary/10 border-2 border-cyber-primary/40 rounded-2xl shadow-neon p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-neon animate-float relative ${className}`}
    >
      <div className="absolute -top-4 -right-4 w-8 h-8 border-2 border-cyber-accent rounded-full animate-pulse-neon opacity-40"></div>
      <div className="absolute -bottom-4 -left-4 w-6 h-6 border-2 border-cyber-secondary rounded animate-spin-slow opacity-30"></div>
      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyber-primary rounded-full shadow-neon animate-glow"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default CyberpunkCard;
