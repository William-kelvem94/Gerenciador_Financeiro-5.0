import React from 'react';

export const MatrixRain: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
      {/* Efeito Matrix Rain - versão simplificada para performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse" />
    </div>
  );
};
