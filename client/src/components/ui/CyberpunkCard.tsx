import React, { ReactNode } from 'react';

export interface CyberpunkCardProps {
  children: ReactNode;
  className?: string;
}

const CyberpunkCard: React.FC<CyberpunkCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`card from-cyber-primary/20 via-black-secondary/80 to-cyber-secondary/10 border-cyber-primary/40 shadow-neon hover:shadow-neon animate-float relative rounded-2xl border-2 bg-gradient-to-br p-8 transition-all duration-300 hover:scale-[1.03] ${className}`}
    >
      <div className="border-cyber-accent animate-pulse-neon absolute -top-4 -right-4 h-8 w-8 rounded-full border-2 opacity-40"></div>
      <div className="border-cyber-secondary animate-spin-slow absolute -bottom-4 -left-4 h-6 w-6 rounded border-2 opacity-30"></div>
      <div className="bg-cyber-primary shadow-neon animate-glow absolute top-1/2 left-1/2 h-2 w-2 rounded-full"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export { CyberpunkCard };
