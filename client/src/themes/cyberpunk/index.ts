import { CyberpunkTheme } from '../../types/theme';

export const bladeRunnerTheme: CyberpunkTheme = {
  id: 'blade-runner',
  name: 'Blade Runner',
  description: 'Inspirado no clássico cyberpunk com tons azuis e vermelhos neon',
  preview: '/themes/previews/blade-runner.jpg',
  colors: {
    primary: '#00d4ff',
    secondary: '#ff0080',
    accent: '#ffff00',
    background: {
      primary: '#0a0a0f',
      secondary: '#1a1a2e',
      card: '#16213e',
      overlay: 'rgba(0, 212, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      accent: '#00d4ff',
      muted: '#666666',
    },
    neon: {
      glow: '#00d4ff',
      shadow: 'rgba(0, 212, 255, 0.5)',
      pulse: '#ff0080',
    },
    status: {
      success: '#00ff88',
      warning: '#ffaa00',
      error: '#ff0080',
      info: '#00d4ff',
    },
    chart: [
      '#00d4ff',
      '#ff0080',
      '#ffff00',
      '#00ff88',
      '#ff6600',
      '#8000ff',
      '#ff0040',
      '#00ffff',
    ],
  },
  animations: {
    enabled: true,
    speed: 'normal',
    intensity: 'intense',
  },
  sounds: {
    enabled: true,
    volume: 0.7,
    theme: 'blade-runner',
  },
  effects: {
    glitch: true,
    scanlines: true,
    glow: true,
    particles: true,
  },
};

export const cyberpunk2077Theme: CyberpunkTheme = {
  id: 'cyberpunk-2077',
  name: 'Cyberpunk 2077',
  description: 'Estilo Night City com amarelo e cyan vibrantes',
  preview: '/themes/previews/cyberpunk-2077.jpg',
  colors: {
    primary: '#fcee09',
    secondary: '#00f5ff',
    accent: '#ff003c',
    background: {
      primary: '#0f0f0f',
      secondary: '#1e1e1e',
      card: '#2a2a2a',
      overlay: 'rgba(252, 238, 9, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      accent: '#fcee09',
      muted: '#808080',
    },
    neon: {
      glow: '#fcee09',
      shadow: 'rgba(252, 238, 9, 0.6)',
      pulse: '#00f5ff',
    },
    status: {
      success: '#39ff14',
      warning: '#ff8c00',
      error: '#ff003c',
      info: '#00f5ff',
    },
    chart: [
      '#fcee09',
      '#00f5ff',
      '#ff003c',
      '#39ff14',
      '#ff8c00',
      '#9d00ff',
      '#ff1493',
      '#00ffff',
    ],
  },
  animations: {
    enabled: true,
    speed: 'fast',
    intensity: 'intense',
  },
  sounds: {
    enabled: true,
    volume: 0.8,
    theme: 'cyberpunk',
  },
  effects: {
    glitch: true,
    scanlines: true,
    glow: true,
    particles: true,
  },
};

export const matrixTheme: CyberpunkTheme = {
  id: 'matrix',
  name: 'Matrix',
  description: 'O clássico verde matrix com efeitos de código',
  preview: '/themes/previews/matrix.jpg',
  colors: {
    primary: '#00ff41',
    secondary: '#008f11',
    accent: '#00ff88',
    background: {
      primary: '#000000',
      secondary: '#001100',
      card: '#002200',
      overlay: 'rgba(0, 255, 65, 0.1)',
    },
    text: {
      primary: '#00ff41',
      secondary: '#00cc33',
      accent: '#00ff88',
      muted: '#006600',
    },
    neon: {
      glow: '#00ff41',
      shadow: 'rgba(0, 255, 65, 0.8)',
      pulse: '#00ff88',
    },
    status: {
      success: '#00ff41',
      warning: '#ffff00',
      error: '#ff0000',
      info: '#00ffff',
    },
    chart: [
      '#00ff41',
      '#00cc33',
      '#00ff88',
      '#66ff66',
      '#33ff33',
      '#99ff99',
      '#00aa22',
      '#44ff44',
    ],
  },
  animations: {
    enabled: true,
    speed: 'normal',
    intensity: 'intense',
  },
  sounds: {
    enabled: true,
    volume: 0.6,
    theme: 'matrix',
  },
  effects: {
    glitch: false,
    scanlines: true,
    glow: true,
    particles: true,
  },
};

export const ghostShellTheme: CyberpunkTheme = {
  id: 'ghost-shell',
  name: 'Ghost in the Shell',
  description: 'Tons roxos e rosas com estética japonesa futurista',
  preview: '/themes/previews/ghost-shell.jpg',
  colors: {
    primary: '#ff00ff',
    secondary: '#8000ff',
    accent: '#ff69b4',
    background: {
      primary: '#0d0d0d',
      secondary: '#1a0d1a',
      card: '#2d1a2d',
      overlay: 'rgba(255, 0, 255, 0.1)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e6b3e6',
      accent: '#ff00ff',
      muted: '#9966cc',
    },
    neon: {
      glow: '#ff00ff',
      shadow: 'rgba(255, 0, 255, 0.7)',
      pulse: '#ff69b4',
    },
    status: {
      success: '#00ff80',
      warning: '#ffaa00',
      error: '#ff0060',
      info: '#8000ff',
    },
    chart: [
      '#ff00ff',
      '#8000ff',
      '#ff69b4',
      '#da70d6',
      '#9932cc',
      '#ba55d3',
      '#dda0dd',
      '#ee82ee',
    ],
  },
  animations: {
    enabled: true,
    speed: 'normal',
    intensity: 'normal',
  },
  sounds: {
    enabled: true,
    volume: 0.5,
    theme: 'minimal',
  },
  effects: {
    glitch: false,
    scanlines: true,
    glow: true,
    particles: true,
  },
};

export const defaultTheme: CyberpunkTheme = bladeRunnerTheme;

export const availableThemes: CyberpunkTheme[] = [
  bladeRunnerTheme,
  cyberpunk2077Theme,
  matrixTheme,
  ghostShellTheme,
];
