import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Palette, Volume2, Zap, Download, Upload, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'themes' | 'colors' | 'effects' | 'sounds' | 'preview';

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const {
    currentTheme,
    availableThemes,
    setTheme,
    customizeTheme,
    resetTheme,
    exportTheme,
    importTheme,
  } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('themes');
  const [customColors, setCustomColors] = useState(currentTheme.colors);
  const [previewMode, setPreviewMode] = useState(false);

  // Sync colors when theme changes
  useEffect(() => {
    setCustomColors(currentTheme.colors);
  }, [currentTheme.colors]);

  if (!isOpen) return null;

  const handleColorChange = (path: string, value: string) => {
    const keys = path.split('.');
    const newColors = { ...customColors };
    let current: Record<string, unknown> = newColors;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]] as Record<string, unknown>;
    }
    current[keys[keys.length - 1]] = value;

    setCustomColors(newColors);
    customizeTheme({ colors: newColors });
  };

  const handleExport = () => {
    const themeData = exportTheme();
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        importTheme(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="bg-bg-card border-primary/20 w-80 border-r">
          <div className="border-primary/20 border-b p-6">
            <h2 className="text-primary neon-glow text-2xl font-bold">Customização Cyberpunk</h2>
            <p className="text-text-secondary mt-2">Personalize sua experiência financeira</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-col">
            {[
              { id: 'themes', label: 'Temas', icon: Palette },
              { id: 'colors', label: 'Cores', icon: Palette },
              { id: 'effects', label: 'Efeitos', icon: Zap },
              { id: 'sounds', label: 'Sons', icon: Volume2 },
              { id: 'preview', label: 'Preview', icon: Eye },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`group relative flex items-center space-x-3 overflow-hidden px-6 py-4 text-left transition-all ${
                  activeTab === id
                    ? 'bg-primary/20 text-primary border-primary border-r-2'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {/* Cyberpunk hover effect */}
                <div className="via-primary/10 absolute inset-0 -translate-x-full transform bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:translate-x-full group-hover:opacity-100" />
                <Icon size={20} className="relative z-10" />
                <span className="relative z-10">{label}</span>
                {activeTab === id && (
                  <div className="bg-primary absolute top-1/2 right-0 h-8 w-1 -translate-y-1/2 animate-pulse rounded-l-lg" />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="absolute right-6 bottom-6 left-6">
            <div className="flex space-x-2">
              <button
                onClick={handleExport}
                className="bg-primary/20 text-primary hover:bg-primary/30 flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-2 transition-colors"
              >
                <Download size={16} />
                <span>Exportar</span>
              </button>
              <label className="bg-secondary/20 text-secondary hover:bg-secondary/30 flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg px-4 py-2 transition-colors">
                <Upload size={16} />
                <span>Importar</span>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button
                onClick={resetTheme}
                className="bg-error/20 text-error hover:bg-error/30 flex items-center justify-center rounded-lg px-4 py-2 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'themes' && (
            <div>
              <h3 className="text-primary mb-6 text-xl font-bold">Temas Pré-definidos</h3>
              <div className="grid grid-cols-2 gap-6">
                {availableThemes.map(theme => (
                  <button
                    key={theme.id}
                    className={`relative w-full cursor-pointer rounded-lg border-2 p-4 text-left transition-all ${
                      currentTheme.id === theme.id
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                    onClick={() => setTheme(theme.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setTheme(theme.id);
                      }
                    }}
                    aria-label={`Selecionar tema ${theme.name}`}
                  >
                    <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                      <div
                        className="h-full w-full"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                        }}
                      >
                        <div className="flex h-full items-end p-4">
                          <div className="space-y-1">
                            <div
                              className="h-2 w-12 rounded"
                              style={{ backgroundColor: theme.colors.text.primary }}
                            />
                            <div
                              className="h-2 w-8 rounded"
                              style={{ backgroundColor: theme.colors.text.secondary }}
                            />
                            <div
                              className="h-2 w-6 rounded"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-primary font-bold">{theme.name}</h4>
                    <p className="text-text-secondary mt-1 text-sm">{theme.description}</p>
                    {currentTheme.id === theme.id && (
                      <div className="bg-primary neon-glow absolute top-2 right-2 h-3 w-3 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div>
              <h3 className="text-primary mb-6 text-xl font-bold">Personalizar Cores</h3>
              <div className="space-y-6">
                {/* Primary Colors */}
                <div>
                  <h4 className="text-primary mb-3 font-semibold">Cores Principais</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="color-primary"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Primária
                      </label>
                      <input
                        id="color-primary"
                        type="color"
                        value={customColors.primary}
                        onChange={e => handleColorChange('primary', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="color-secondary"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Secundária
                      </label>
                      <input
                        id="color-secondary"
                        type="color"
                        value={customColors.secondary}
                        onChange={e => handleColorChange('secondary', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="color-accent"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Destaque
                      </label>
                      <input
                        id="color-accent"
                        type="color"
                        value={customColors.accent}
                        onChange={e => handleColorChange('accent', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Colors */}
                <div>
                  <h4 className="text-primary mb-3 font-semibold">Cores de Fundo</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="color-bg-primary"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Fundo Principal
                      </label>
                      <input
                        id="color-bg-primary"
                        type="color"
                        value={customColors.background.primary}
                        onChange={e => handleColorChange('background.primary', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="color-bg-card"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Fundo Cartão
                      </label>
                      <input
                        id="color-bg-card"
                        type="color"
                        value={customColors.background.card}
                        onChange={e => handleColorChange('background.card', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                  </div>
                </div>

                {/* Neon Effects */}
                <div>
                  <h4 className="text-primary mb-3 font-semibold">Efeitos Neon</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="color-neon-glow"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Brilho
                      </label>
                      <input
                        id="color-neon-glow"
                        type="color"
                        value={customColors.neon.glow}
                        onChange={e => handleColorChange('neon.glow', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="color-neon-pulse"
                        className="text-text-secondary mb-2 block text-sm"
                      >
                        Pulso
                      </label>
                      <input
                        id="color-neon-pulse"
                        type="color"
                        value={customColors.neon.pulse}
                        onChange={e => handleColorChange('neon.pulse', e.target.value)}
                        className="border-primary/20 h-10 w-full rounded-lg border"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div>
              <h3 className="text-primary mb-6 text-xl font-bold">Efeitos Visuais</h3>
              <div className="space-y-6">
                {[
                  {
                    key: 'glitch',
                    label: 'Efeito Glitch',
                    description: 'Distorções visuais cyberpunk',
                  },
                  {
                    key: 'scanlines',
                    label: 'Scanlines',
                    description: 'Linhas de varredura retrô',
                  },
                  {
                    key: 'glow',
                    label: 'Brilho Neon',
                    description: 'Efeitos de brilho nos elementos',
                  },
                  {
                    key: 'particles',
                    label: 'Partículas',
                    description: 'Animações de partículas flutuantes',
                  },
                ].map(({ key, label, description }) => (
                  <div
                    key={key}
                    className="bg-bg-card border-primary/20 flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <h4 className="text-primary font-semibold">{label}</h4>
                      <p className="text-text-secondary text-sm">{description}</p>
                    </div>
                    <button
                      onClick={() =>
                        customizeTheme({
                          effects: {
                            ...currentTheme.effects,
                            [key]: !currentTheme.effects[key as keyof typeof currentTheme.effects],
                          },
                        })
                      }
                      className={`h-6 w-12 rounded-full transition-all ${
                        currentTheme.effects[key as keyof typeof currentTheme.effects]
                          ? 'bg-primary'
                          : 'bg-primary/20'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white transition-transform ${
                          currentTheme.effects[key as keyof typeof currentTheme.effects]
                            ? 'translate-x-6'
                            : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sounds' && (
            <div>
              <h3 className="text-primary mb-6 text-xl font-bold">Configurações de Som</h3>
              <div className="space-y-6">
                <div className="bg-bg-card border-primary/20 rounded-lg border p-4">
                  <h4 className="text-primary mb-2 font-semibold">Volume Geral</h4>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={currentTheme.sounds.volume}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      customizeTheme({
                        sounds: {
                          ...currentTheme.sounds,
                          volume: parseFloat(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                  <div className="text-text-secondary mt-1 flex justify-between text-sm">
                    <span>Silencioso</span>
                    <span>Máximo</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'keyboardClicks', label: 'Cliques do Teclado' },
                    { key: 'ambientSounds', label: 'Sons Ambiente' },
                    { key: 'notifications', label: 'Notificações' },
                    { key: 'transactions', label: 'Transações' },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="bg-bg-card border-primary/20 flex items-center justify-between rounded-lg border p-4"
                    >
                      <span className="text-primary font-medium">{label}</span>
                      <button
                        onClick={() =>
                          customizeTheme({
                            sounds: {
                              ...currentTheme.sounds,
                              enabled: !currentTheme.sounds.enabled,
                            },
                          })
                        }
                        className={`h-6 w-12 rounded-full transition-all ${
                          currentTheme.sounds.enabled ? 'bg-primary' : 'bg-primary/20'
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white transition-transform ${
                            currentTheme.sounds.enabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div>
              <h3 className="text-primary mb-6 text-xl font-bold">Preview do Sistema</h3>
              <div className="space-y-6">
                {/* Preview mode toggle */}
                <div className="bg-bg-card border-primary/20 flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="text-primary font-semibold">Modo Preview</h4>
                    <p className="text-text-secondary text-sm">Veja as mudanças em tempo real</p>
                  </div>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`h-6 w-12 rounded-full transition-all ${
                      previewMode ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white transition-transform ${
                        previewMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Component previews */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Button preview */}
                  <div className="bg-bg-card border-primary/20 rounded-lg border p-4">
                    <h5 className="text-primary mb-3 font-medium">Botões</h5>
                    <div className="space-y-2">
                      <button className="bg-primary/20 text-primary border-primary/40 hover:bg-primary/30 w-full rounded-lg border px-4 py-2 transition-all">
                        Primário
                      </button>
                      <button className="bg-secondary/20 text-secondary border-secondary/40 hover:bg-secondary/30 w-full rounded-lg border px-4 py-2 transition-all">
                        Secundário
                      </button>
                    </div>
                  </div>

                  {/* Card preview */}
                  <div className="bg-bg-card border-primary/20 rounded-lg border p-4">
                    <h5 className="text-primary mb-3 font-medium">Cards</h5>
                    <div className="bg-bg-primary border-primary/20 rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-primary">Saldo</span>
                        <span className="text-success font-bold">R$ 1.234,56</span>
                      </div>
                    </div>
                  </div>

                  {/* Neon effects preview */}
                  <div className="bg-bg-card border-primary/20 rounded-lg border p-4">
                    <h5 className="text-primary mb-3 font-medium">Efeitos Neon</h5>
                    <div className="space-y-2">
                      <div className="text-primary neon-glow">Texto com brilho</div>
                      <div className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
                        <div className="from-primary to-accent h-full w-3/4 animate-pulse bg-gradient-to-r"></div>
                      </div>
                    </div>
                  </div>

                  {/* Loading preview */}
                  <div className="bg-bg-card border-primary/20 rounded-lg border p-4">
                    <h5 className="text-primary mb-3 font-medium">Loading</h5>
                    <div className="flex items-center space-x-2">
                      <div className="border-primary/30 border-t-primary h-4 w-4 animate-spin rounded-full border-2"></div>
                      <span className="text-text-secondary">Carregando...</span>
                    </div>
                  </div>
                </div>

                {/* Live theme data */}
                <div className="bg-bg-card border-primary/20 rounded-lg border p-4">
                  <h5 className="text-primary mb-3 flex items-center font-medium">
                    <Sparkles size={16} className="mr-2" />
                    Dados do Tema Atual
                  </h5>
                  <div className="text-text-secondary bg-bg-primary max-h-32 overflow-auto rounded p-3 font-mono text-xs">
                    <pre>{JSON.stringify(currentTheme, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="bg-bg-card border-primary/20 text-text-secondary hover:text-primary hover:border-primary/40 absolute top-6 right-6 rounded-lg border p-2 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
