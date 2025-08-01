// Tipos base para o sistema de temas
export interface CyberpunkTheme {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: {
      primary: string;
      secondary: string;
      card: string;
      overlay: string;
    };
    text: {
      primary: string;
      secondary: string;
      accent: string;
      muted: string;
    };
    neon: {
      glow: string;
      shadow: string;
      pulse: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    chart: string[];
  };
  animations: {
    enabled: boolean;
    speed: 'slow' | 'normal' | 'fast';
    intensity: 'subtle' | 'normal' | 'intense';
  };
  sounds: {
    enabled: boolean;
    volume: number;
    theme: 'minimal' | 'cyberpunk' | 'matrix' | 'blade-runner';
  };
  effects: {
    glitch: boolean;
    scanlines: boolean;
    glow: boolean;
    particles: boolean;
  };
}

export interface ThemeContextType {
  currentTheme: CyberpunkTheme;
  availableThemes: CyberpunkTheme[];
  setTheme: (themeId: string) => void;
  customizeTheme: (customizations: Partial<CyberpunkTheme>) => void;
  resetTheme: () => void;
  previewTheme: (themeId: string) => void;
  exportTheme: () => string;
  importTheme: (themeData: string) => void;
}

export interface SoundConfig {
  keyboardClicks: boolean;
  ambientSounds: boolean;
  notifications: boolean;
  transactions: boolean;
  volume: number;
  theme: string;
}

export interface AnimationConfig {
  dataVisualization: boolean;
  pageTransitions: boolean;
  hoverEffects: boolean;
  loadingAnimations: boolean;
  chartAnimations: boolean;
  speed: number;
  intensity: number;
}
