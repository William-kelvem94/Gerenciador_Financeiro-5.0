import React from 'react';
import { motion } from 'framer-motion';

interface PhoenixLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
}

export function PhoenixLogo({ className, size = 'md' }: PhoenixLogoProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',     // Aumentado de w-8 h-8
    md: 'w-16 h-16',     // Aumentado de w-12 h-12
    lg: 'w-24 h-24',     // Aumentado de w-16 h-16  
    xl: 'w-32 h-32',     // Aumentado de w-20 h-20
    hero: 'w-40 h-40'    // Novo tamanho para destaque
  };

  const finalSize = className || sizeClasses[size];

  return (
    <motion.div 
      className={`relative ${finalSize} flex-shrink-0`}
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Phoenix Image */}
      <motion.img
        src="/phoenix-logo.png"
        alt="Phoenix Logo"
        className="w-full h-full object-contain drop-shadow-lg"
        style={{ 
          filter: 'drop-shadow(0 0 8px rgba(255, 140, 0, 0.6)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.4))',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      
      {/* Subtle glow ring - proportional */}
      <motion.div
        className={`absolute inset-0 rounded-full ${
          size === 'hero' ? 'border-2 border-orange-500/30' :
          size === 'xl' ? 'border-2 border-orange-500/25' :
          'border border-orange-500/20'
        }`}
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Energy particles - fire themed */}
      {size !== 'sm' && [...Array(6)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute rounded-full bg-gradient-to-t from-red-500 to-yellow-400 ${
            size === 'hero' ? 'w-2 h-2' : 
            size === 'xl' ? 'w-1.5 h-1.5' : 
            'w-1 h-1'
          }`}
          style={{
            top: `${25 + Math.sin(i * 60 * Math.PI / 180) * 25}%`,
            left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
          }}
          animate={{
            opacity: [0, 0.9, 0],
            scale: [0.3, 1.5, 0.3],
            y: [-8, -20, -8],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
}
