import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { CyberpunkTheme, ThemeContextType, SoundConfig, AnimationConfig } from '../types/theme';
import { availableThemes, defaultTheme } from '../themes/cyberpunk/index';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    if (typeof window === 'undefined') return;
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
    if (typeof window === 'undefined') return;
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
    if (typeof window === 'undefined') return;
    localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(soundConfig));
  }, [soundConfig]);

  // Save animation config when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
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

  // Preview theme (aplica temporariamente, retorna função para restaurar)
  const previewTheme = useCallback((themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      // ... outras propriedades

      return () => {
        const current = currentTheme;
        root.style.setProperty('--color-primary', current.colors.primary);
        root.style.setProperty('--color-secondary', current.colors.secondary);
        root.style.setProperty('--color-accent', current.colors.accent);
        // ... restaurar outras propriedades
      };
    }
    return undefined;
  }, [currentTheme]);

  const exportTheme = useCallback((): string => {
    return JSON.stringify(
      {
        theme: currentTheme,
        sound: soundConfig,
        animation: animationConfig,
      },
      null,
      2
    );
  }, [currentTheme, soundConfig, animationConfig]);

  const importTheme = (themeData: string) => {
    try {
      const data = JSON.parse(themeData);

      // Validação básica da estrutura
      if (!data.theme?.id || !data.theme?.colors) {
        throw new Error('Invalid theme structure');
      }
      if (typeof data.sound?.volume !== 'number') {
        throw new Error('Invalid sound config structure');
      }
      if (typeof data.animation?.speed !== 'number') {
        throw new Error('Invalid animation config structure');
      }

      setCurrentTheme(data.theme);
      setSoundConfig(data.sound);
      setAnimationConfig(data.animation);
    } catch (error) {
      console.error('Error importing theme:', error);
      // Opcional: notificar o usuário sobre o erro
    }
  };

  const playSound = useCallback((soundType: string) => {
    if (!soundConfig.keyboardClicks && soundType === 'click') return;
    if (!soundConfig.notifications && soundType.includes('notification')) return;
    if (!soundConfig.transactions && soundType.includes('transaction')) return;

    // Implementação real de áudio aqui
    console.log(`Playing sound: ${soundType} at volume ${soundConfig.volume}`);
  }, [soundConfig]);

  const setTheme = useCallback((themeId: string) => {
    const theme = availableThemes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      if (soundConfig.notifications) {
        playSound('theme-change');
      }
    }
  }, [soundConfig.notifications, playSound]);

  const value: ThemeContextType = useMemo(
    () => ({
      currentTheme,
      availableThemes,
      setTheme,
      customizeTheme,
      resetTheme,
      previewTheme,
      exportTheme,
      importTheme,
      soundConfig,
      animationConfig,
      setSoundConfig,
      setAnimationConfig,
      playSound,
    }),
    [
      currentTheme,
      exportTheme,
      setTheme,
      soundConfig,
      animationConfig,
      setSoundConfig,
      setAnimationConfig,
      playSound,
      previewTheme,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


