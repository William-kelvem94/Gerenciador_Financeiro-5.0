import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo, useCallback } from 'react';
import { CyberpunkTheme, ThemeContextType, SoundConfig, AnimationConfig } from '../types/theme';
import { availableThemes, defaultTheme } from '../themes/cyberpunk';

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Local Storage Keys
const THEME_STORAGE_KEY = 'will-finance-theme';
const SOUND_STORAGE_KEY = 'will-finance-sound-config';
const ANIMATION_STORAGE_KEY = 'will-finance-animation-config';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<CyberpunkTheme>(defaultTheme);
  const [soundConfig, setSoundConfig] = useState<SoundConfig>({
    keyboardClicks: true,
    ambientSounds: true,
    notifications: true,
    transactions: true,
    volume: 0.7,
    theme: 'cyberpunk',
  });
  const [animationConfig, setAnimationConfig] = useState<AnimationConfig>({
    dataVisualization: true,
    pageTransitions: true,
    hoverEffects: true,
    loadingAnimations: true,
    chartAnimations: true,
    speed: 1,
    intensity: 1,
  });

  // Load saved theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const savedSound = localStorage.getItem(SOUND_STORAGE_KEY);
      const savedAnimation = localStorage.getItem(ANIMATION_STORAGE_KEY);

      if (savedTheme) {
        const themeData = JSON.parse(savedTheme);
        const theme = availableThemes.find(t => t.id === themeData.id) || defaultTheme;
        setCurrentTheme({ ...theme, ...themeData });
      }

      if (savedSound) {
        setSoundConfig(JSON.parse(savedSound));
      }

      if (savedAnimation) {
        setAnimationConfig(JSON.parse(savedAnimation));
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
      setCurrentTheme(defaultTheme);
    }
  }, []);

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const theme = currentTheme;

    // Primary colors
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);

    // Background colors
    root.style.setProperty('--color-bg-primary', theme.colors.background.primary);
    root.style.setProperty('--color-bg-secondary', theme.colors.background.secondary);
    root.style.setProperty('--color-bg-card', theme.colors.background.card);
    root.style.setProperty('--color-bg-overlay', theme.colors.background.overlay);

    // Text colors
    root.style.setProperty('--color-text-primary', theme.colors.text.primary);
    root.style.setProperty('--color-text-secondary', theme.colors.text.secondary);
    root.style.setProperty('--color-text-accent', theme.colors.text.accent);
    root.style.setProperty('--color-text-muted', theme.colors.text.muted);

    // Neon effects
    root.style.setProperty('--color-neon-glow', theme.colors.neon.glow);
    root.style.setProperty('--color-neon-shadow', theme.colors.neon.shadow);
    root.style.setProperty('--color-neon-pulse', theme.colors.neon.pulse);

    // Status colors
    root.style.setProperty('--color-success', theme.colors.status.success);
    root.style.setProperty('--color-warning', theme.colors.status.warning);
    root.style.setProperty('--color-error', theme.colors.status.error);
    root.style.setProperty('--color-info', theme.colors.status.info);

    // Animation settings
    const speedMultiplier = animationConfig.speed;
    const intensityMultiplier = animationConfig.intensity;
    
    root.style.setProperty('--animation-speed', `${speedMultiplier}s`);
    root.style.setProperty('--animation-intensity', intensityMultiplier.toString());

    // Effects settings
    root.style.setProperty('--effects-glitch', theme.effects.glitch ? '1' : '0');
    root.style.setProperty('--effects-scanlines', theme.effects.scanlines ? '1' : '0');
    root.style.setProperty('--effects-glow', theme.effects.glow ? '1' : '0');
    root.style.setProperty('--effects-particles', theme.effects.particles ? '1' : '0');

    // Add theme class to body
    document.body.className = document.body.className.replace(/theme-\S+/g, '');
    document.body.classList.add(`theme-${theme.id}`);

    // Save to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  }, [currentTheme, animationConfig]);

  // Save sound config when it changes
  useEffect(() => {
    localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundConfig));
  }, [soundConfig]);

  // Save animation config when it changes
  useEffect(() => {
    localStorage.setItem(ANIMATION_STORAGE_KEY, JSON.stringify(animationConfig));
  }, [animationConfig]);

  const customizeTheme = (customizations: Partial<CyberpunkTheme>) => {
    setCurrentTheme(prev => ({
      ...prev,
      ...customizations,
    }));
  };

  const resetTheme = () => {
    setCurrentTheme(defaultTheme);
    setAnimationConfig({
      dataVisualization: true,
      pageTransitions: true,
      hoverEffects: true,
      loadingAnimations: true,
      chartAnimations: true,
      speed: 1,
      intensity: 1,
    });
    setSoundConfig({
      keyboardClicks: true,
      ambientSounds: true,
      notifications: true,
      transactions: true,
      volume: 0.7,
      theme: 'cyberpunk',
    });
  };

  const previewTheme = (themeId: string) => {
    // Temporarily apply theme for preview
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      // This could trigger a preview mode without saving
      console.log('Preview theme:', theme.name);
    }
  };

  const exportTheme = useCallback((): string => {
    return JSON.stringify({
      theme: currentTheme,
      sound: soundConfig,
      animation: animationConfig,
    }, null, 2);
  }, [currentTheme, soundConfig, animationConfig]);

  const importTheme = (themeData: string) => {
    try {
      const data = JSON.parse(themeData);
      if (data.theme) setCurrentTheme(data.theme);
      if (data.sound) setSoundConfig(data.sound);
      if (data.animation) setAnimationConfig(data.animation);
    } catch (error) {
      console.error('Error importing theme:', error);
    }
  };

  // Sound system
  const playSound = useCallback((soundType: string) => {
    if (!soundConfig.keyboardClicks && soundType === 'click') return;
    if (!soundConfig.notifications && soundType.includes('notification')) return;
    if (!soundConfig.transactions && soundType.includes('transaction')) return;

    // This would be implemented with actual audio files
    console.log(`Playing sound: ${soundType} at volume ${soundConfig.volume}`);
  }, [soundConfig]);

  const setTheme = useCallback((themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      // Play theme change sound
      if (soundConfig.notifications) {
        playSound('theme-change');
      }
    }
  }, [soundConfig.notifications, playSound]);

  const value: ThemeContextType = useMemo(() => ({
    currentTheme,
    availableThemes,
    setTheme,
    customizeTheme,
    resetTheme,
    previewTheme,
    exportTheme,
    importTheme,
  }), [currentTheme, exportTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for sound system
export const useSound = () => {
  const playSound = (soundType: string) => {
    // Implementation would go here
    console.log(`Playing sound: ${soundType}`);
  };

  return { playSound };
};

// Hook for animations
export const useAnimation = () => {
  const [animationConfig] = useState<AnimationConfig>({
    dataVisualization: true,
    pageTransitions: true,
    hoverEffects: true,
    loadingAnimations: true,
    chartAnimations: true,
    speed: 1,
    intensity: 1,
  });

  return animationConfig;
};
