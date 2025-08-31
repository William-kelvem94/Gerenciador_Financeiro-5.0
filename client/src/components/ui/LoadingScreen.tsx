import React from 'react';
import { motion } from 'framer-motion';
import { PhoenixLogo } from './PhoenixLogo';

export interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Carregando sistema...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="from-black-secondary/90 via-cyber-primary/10 to-black-tertiary/90 fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br backdrop-blur-xl"
    >
      <div className="flex flex-col items-center space-y-8">
        <PhoenixLogo
          size="xl"
          className="animate-spin-slow text-cyber-primary text-glow drop-shadow-neon"
        />
        <span className="text-cyber-primary font-cyber animate-pulse-neon text-glow text-2xl">
          {message}
        </span>
        <div className="from-cyber-primary to-cyber-secondary animate-pulse-neon shadow-neon h-2 w-32 rounded-full bg-gradient-to-r"></div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="matrix-rain opacity-10"></div>
        <div className="border-cyber-accent animate-spin-slow absolute top-1/2 left-1/2 h-16 w-16 rounded-full border-2 opacity-30"></div>
        {/* Matrix rain effect cyberpunk */}
        <div className="pointer-events-none fixed inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-cyber-primary absolute w-px"
              style={
                {
                  left: `${Math.random() * 100}%`,
                  height: '100px',
                } as React.CSSProperties
              }
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

export { LoadingScreen };
