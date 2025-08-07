import React from 'react';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3

interface LoadingScreenProps {
  message?: string;
}

<<<<<<< HEAD
const LoadingScreen = ({ message = 'Loading...' }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Cyberpunk loading animation */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-cyan-400 rounded-full animate-spin"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-cyan-400/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-cyan-400 text-lg font-mono tracking-wider animate-pulse">
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        
        {/* Cyberpunk grid effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full opacity-10">
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              return (
                <div
                  key={`grid-cell-${row}-${col}`}
                  className="border border-cyan-400/20"
                  style={{
                    animationDelay: `${(i * 0.1) % 2}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export { LoadingScreen };
export default LoadingScreen;
=======
export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative mb-8">
          <Loader2 className="w-16 h-16 text-cyber-primary animate-spin mx-auto" />
          <div className="absolute inset-0 w-16 h-16 border-2 border-cyber-primary rounded-full animate-pulse mx-auto" />
        </div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-cyber text-cyber-primary mb-4"
        >
          Will Finance 6.0
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-foreground-secondary"
        >
          {message}
        </motion.p>

        {/* Matrix rain effect */}
        <div className="fixed inset-0 pointer-events-none opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-cyber-primary"
              style={{
                left: `${Math.random() * 100}%`,
                height: '100px',
              }}
              animate={{
                y: ['-100px', '100vh'],
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
      </motion.div>
    </div>
  );
};
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
