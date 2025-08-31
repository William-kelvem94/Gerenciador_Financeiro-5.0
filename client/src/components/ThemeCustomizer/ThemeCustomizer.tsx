import React, { useState, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Palette, Volume2, Zap, Download, Upload, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'themes' | 'colors' | 'effects' | 'sounds' | 'preview';

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({ isOpen, onClose }) => {
  const { currentTheme, availableThemes, setTheme, customizeTheme, resetTheme, exportTheme, importTheme } = useTheme();
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
      reader.onload = (e) => {
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
        <div className="w-80 bg-bg-card border-r border-primary/20">
          <div className="p-6 border-b border-primary/20">
            <h2 className="text-2xl font-bold text-primary neon-glow">
              Customização Cyberpunk
            </h2>
            <p className="text-text-secondary mt-2">
              Personalize sua experiência financeira
            </p>
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
                className={`flex items-center space-x-3 px-6 py-4 text-left transition-all relative overflow-hidden group ${
                  activeTab === id
                    ? 'bg-primary/20 text-primary border-r-2 border-primary'
                    : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {/* Cyberpunk hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-full group-hover:translate-x-full transform" />
                <Icon size={20} className="relative z-10" />
                <span className="relative z-10">{label}</span>
                {activeTab === id && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-lg animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex space-x-2">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
              >
                <Download size={16} />
                <span>Exportar</span>
              </button>
              <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary/20 text-secondary rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                <Upload size={16} />
                <span>Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={resetTheme}
                className="flex items-center justify-center px-4 py-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'themes' && (
            <div>
              <h3 className="text-xl font-bold text-primary mb-6">Temas Pré-definidos</h3>
              <div className="grid grid-cols-2 gap-6">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all text-left w-full ${
                      currentTheme.id === theme.id
                        ? 'border-primary bg-primary/10'
                        : 'border-primary/20 hover:border-primary/40'
                    }`}
                    onClick={() => setTheme(theme.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setTheme(theme.id);
                      }
                    }}
                    aria-label={`Selecionar tema ${theme.name}`}
                  >
                    <div className="aspect-video rounded-lg mb-4 overflow-hidden">
                      <div
                        className="w-full h-full"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                        }}
                      >
                        <div className="p-4 h-full flex items-end">
                          <div className="space-y-1">
                            <div
                              className="w-12 h-2 rounded"
                              style={{ backgroundColor: theme.colors.text.primary }}
                            />
                            <div
                              className="w-8 h-2 rounded"
                              style={{ backgroundColor: theme.colors.text.secondary }}
                            />
                            <div
                              className="w-6 h-2 rounded"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-primary">{theme.name}</h4>
                    <p className="text-text-secondary text-sm mt-1">{theme.description}</p>
                    {currentTheme.id === theme.id && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full neon-glow" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div>
              <h3 className="text-xl font-bold text-primary mb-6">Personalizar Cores</h3>
              <div className="space-y-6">
                {/* Primary Colors */}
                <div>
                  <h4 className="font-semibold text-primary mb-3">Cores Principais</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="color-primary" className="block text-text-secondary text-sm mb-2">Primária</label>
                      <input
                        id="color-primary"
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="color-secondary" className="block text-text-secondary text-sm mb-2">Secundária</label>
                      <input
                        id="color-secondary"
                        type="color"
                        value={customColors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="color-accent" className="block text-text-secondary text-sm mb-2">Destaque</label>
                      <input
                        id="color-accent"
                        type="color"
                        value={customColors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Background Colors */}
                <div>
                  <h4 className="font-semibold text-primary mb-3">Cores de Fundo</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="color-bg-primary" className="block text-text-secondary text-sm mb-2">Fundo Principal</label>
                      <input
                        id="color-bg-primary"
                        type="color"
                        value={customColors.background.primary}
                        onChange={(e) => handleColorChange('background.primary', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="color-bg-card" className="block text-text-secondary text-sm mb-2">Fundo Cartão</label>
                      <input
                        id="color-bg-card"
                        type="color"
                        value={customColors.background.card}
                        onChange={(e) => handleColorChange('background.card', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Neon Effects */}
                <div>
                  <h4 className="font-semibold text-primary mb-3">Efeitos Neon</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="color-neon-glow" className="block text-text-secondary text-sm mb-2">Brilho</label>
                      <input
                        id="color-neon-glow"
                        type="color"
                        value={customColors.neon.glow}
                        onChange={(e) => handleColorChange('neon.glow', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="color-neon-pulse" className="block text-text-secondary text-sm mb-2">Pulso</label>
                      <input
                        id="color-neon-pulse"
                        type="color"
                        value={customColors.neon.pulse}
                        onChange={(e) => handleColorChange('neon.pulse', e.target.value)}
                        className="w-full h-10 rounded-lg border border-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div>
              <h3 className="text-xl font-bold text-primary mb-6">Efeitos Visuais</h3>
              <div className="space-y-6">
                {[
                  { key: 'glitch', label: 'Efeito Glitch', description: 'Distorções visuais cyberpunk' },
                  { key: 'scanlines', label: 'Scanlines', description: 'Linhas de varredura retrô' },
                  { key: 'glow', label: 'Brilho Neon', description: 'Efeitos de brilho nos elementos' },
                  { key: 'particles', label: 'Partículas', description: 'Animações de partículas flutuantes' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-bg-card rounded-lg border border-primary/20">
                    <div>
                      <h4 className="font-semibold text-primary">{label}</h4>
                      <p className="text-text-secondary text-sm">{description}</p>
                    </div>
                    <button
                      onClick={() => customizeTheme({
                        effects: {
                          ...currentTheme.effects,
                          [key]: !currentTheme.effects[key as keyof typeof currentTheme.effects]
                        }
                      })}
                      className={`w-12 h-6 rounded-full transition-all ${
                        currentTheme.effects[key as keyof typeof currentTheme.effects]
                          ? 'bg-primary'
                          : 'bg-primary/20'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
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
              <h3 className="text-xl font-bold text-primary mb-6">Configurações de Som</h3>
              <div className="space-y-6">
                <div className="p-4 bg-bg-card rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Volume Geral</h4>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={currentTheme.sounds.volume}
                    onChange={(e) => customizeTheme({
                      sounds: {
                        ...currentTheme.sounds,
                        volume: parseFloat(e.target.value)
                      }
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-text-secondary text-sm mt-1">
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
                    <div key={key} className="flex items-center justify-between p-4 bg-bg-card rounded-lg border border-primary/20">
                      <span className="text-primary font-medium">{label}</span>
                      <button
                        onClick={() => customizeTheme({
                          sounds: {
                            ...currentTheme.sounds,
                            enabled: !currentTheme.sounds.enabled
                          }
                        })}
                        className={`w-12 h-6 rounded-full transition-all ${
                          currentTheme.sounds.enabled ? 'bg-primary' : 'bg-primary/20'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
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
              <h3 className="text-xl font-bold text-primary mb-6">Preview do Sistema</h3>
              <div className="space-y-6">
                {/* Preview mode toggle */}
                <div className="flex items-center justify-between p-4 bg-bg-card rounded-lg border border-primary/20">
                  <div>
                    <h4 className="font-semibold text-primary">Modo Preview</h4>
                    <p className="text-text-secondary text-sm">Veja as mudanças em tempo real</p>
                  </div>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`w-12 h-6 rounded-full transition-all ${
                      previewMode ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        previewMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Component previews */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Button preview */}
                  <div className="p-4 bg-bg-card rounded-lg border border-primary/20">
                    <h5 className="text-primary font-medium mb-3">Botões</h5>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-primary/20 text-primary border border-primary/40 rounded-lg hover:bg-primary/30 transition-all">
                        Primário
                      </button>
                      <button className="w-full px-4 py-2 bg-secondary/20 text-secondary border border-secondary/40 rounded-lg hover:bg-secondary/30 transition-all">
                        Secundário
                      </button>
                    </div>
                  </div>

                  {/* Card preview */}
                  <div className="p-4 bg-bg-card rounded-lg border border-primary/20">
                    <h5 className="text-primary font-medium mb-3">Cards</h5>
                    <div className="p-3 bg-bg-primary rounded-lg border border-primary/20">
                      <div className="flex items-center justify-between">
                        <span className="text-text-primary">Saldo</span>
                        <span className="text-success font-bold">R$ 1.234,56</span>
                      </div>
                    </div>
                  </div>

                  {/* Neon effects preview */}
                  <div className="p-4 bg-bg-card rounded-lg border border-primary/20">
                    <h5 className="text-primary font-medium mb-3">Efeitos Neon</h5>
                    <div className="space-y-2">
                      <div className="text-primary neon-glow">Texto com brilho</div>
                      <div className="w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Loading preview */}
                  <div className="p-4 bg-bg-card rounded-lg border border-primary/20">
                    <h5 className="text-primary font-medium mb-3">Loading</h5>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-text-secondary">Carregando...</span>
                    </div>
                  </div>
                </div>

                {/* Live theme data */}
                <div className="p-4 bg-bg-card rounded-lg border border-primary/20">
                  <h5 className="text-primary font-medium mb-3 flex items-center">
                    <Sparkles size={16} className="mr-2" />
                    Dados do Tema Atual
                  </h5>
                  <div className="text-xs font-mono text-text-secondary bg-bg-primary p-3 rounded overflow-auto max-h-32">
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
          className="absolute top-6 right-6 p-2 bg-bg-card border border-primary/20 rounded-lg text-text-secondary hover:text-primary hover:border-primary/40 transition-all"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
