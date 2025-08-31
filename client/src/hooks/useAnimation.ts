import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// Hook for animations (sincronizado com contexto)
export const useAnimation = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within a ThemeProvider');
  }
  return {
    config: context.animationConfig,
    setConfig: context.setAnimationConfig,
  };
};