import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

// Hook for sound system
export const useSound = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a ThemeProvider');
  }
  return {
    config: context.soundConfig,
    setConfig: context.setSoundConfig,
    playSound: context.playSound,
  };
};