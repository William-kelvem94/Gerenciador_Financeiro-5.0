import React from 'react';
import { motion } from 'framer-motion';
import PhoenixLogo from './PhoenixLogo';

export interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Carregando sistema...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black-secondary/90 via-cyber-primary/10 to-black-tertiary/90 backdrop-blur-xl"
    >
      <div className="flex flex-col items-center space-y-8">
        <PhoenixLogo size="xl" className="animate-spin-slow text-cyber-primary text-glow drop-shadow-neon" />
        <span className="text-cyber-primary text-2xl font-cyber animate-pulse-neon text-glow">{message}</span>
        <div className="w-32 h-2 bg-gradient-to-r from-cyber-primary to-cyber-secondary rounded-full animate-pulse-neon shadow-neon"></div>
      </div>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="matrix-rain opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-cyber-accent rounded-full animate-spin-slow opacity-30"></div>
        {/* Matrix rain effect cyberpunk */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-cyber-primary"
              style={{
                left: `${Math.random() * 100}%`,
                height: '100px',
              } as React.CSSProperties}
              animate={{
                y: [-100, window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: 'linear',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
