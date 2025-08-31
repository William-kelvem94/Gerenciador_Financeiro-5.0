import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { Settings, User, Shield, Bell, Palette, Database, Save } from 'lucide-react';

interface SettingsData {
  // Profile Settings
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar: string;
    timezone: string;
    language: string;
  };

  // Security Settings
  security: {
    twoFactorEnabled: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
  };

  // Notification Settings
  notifications: {
    pushNotifications: boolean;
    emailAlerts: boolean;
    budgetAlerts: boolean;
    transactionAlerts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };

  // UI/UX Settings
  preferences: {
    theme: 'dark' | 'light' | 'cyberpunk';
    enhancedAnimations: boolean;
    currency: string;
    dateFormat: string;
    compactMode: boolean;
    sidebarCollapsed: boolean;
  };

  // Backup Settings
  backup: {
    automaticBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    cloudStorage: boolean;
    lastBackup: string;
  };
}

export function SettingsPage() {
  const { user, token } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  // Carregar configurações do usuário
  useEffect(() => {
    const loadUserSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/user/settings', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          setSettingsData(data);
        } else {
          // Handle non-ok responses if necessary
          setSettingsData(null);
        }
      } catch (error) {
        console.error('Failed to load user settings:', error);
        setSettingsData(null);
        toast.error('Falha ao carregar as configurações do usuário.');
      } finally {
        setIsLoading(false);
      }
    };
    loadUserSettings();
  }, []);

  // Tabs de configuração
  const settingsTabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'preferences', label: 'Preferências', icon: Palette },
    { id: 'backup', label: 'Backup & Dados', icon: Database },
  ];

  // Atualizar configuração específica
  const updateSetting = (section: keyof SettingsData, key: string, value: any) => {
    setSettingsData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      };
    });
    setHasChanges(true);
  };

  // Salvar configurações
  const handleSaveSettings = async () => {
    if (!settingsData) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsData }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar configurações');
      }

      setHasChanges(false);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar dados
  const handleExportData = async () => {
    if (!user || !token) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const response = await fetch('/api/user/export', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao exportar dados');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `will-finance-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast.error('Erro ao exportar dados');
    }
  };

  if (isLoading && !settingsData) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-white-muted">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="settings-page p-6"
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-cyber-primary flex items-center gap-3 text-3xl font-bold">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-white-muted mt-2">Personalize sua experiência no Will Finance 5.0</p>
        </header>

        {/* Settings Tabs */}
        <div className="bg-black-secondary/30 mb-8 flex space-x-1 rounded-lg p-1">
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-4 py-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-cyber-primary text-background-primary font-medium'
                  : 'text-white-muted hover:text-cyber-primary'
              } `}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="glass rounded-lg p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-cyber-primary text-xl font-semibold">Configurações do Perfil</h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-white-secondary mb-2 block text-sm font-medium">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={settingsData?.profile.firstName ?? ''}
                    onChange={e => updateSetting('profile', 'firstName', e.target.value)}
                    className="input w-full"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="text-white-secondary mb-2 block text-sm font-medium">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    value={settingsData?.profile.lastName ?? ''}
                    onChange={e => updateSetting('profile', 'lastName', e.target.value)}
                    className="input w-full"
                    placeholder="Seu sobrenome"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-cyber-primary text-xl font-semibold">
                Configurações de Segurança
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white-primary font-medium">Autenticação de Dois Fatores</h3>
                    <p className="text-white-muted text-sm">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      settingsData &&
                      updateSetting(
                        'security',
                        'twoFactorEnabled',
                        !settingsData.security.twoFactorEnabled
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settingsData?.security.twoFactorEnabled ? 'bg-cyber-primary' : 'bg-gray-600'} `}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settingsData?.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'} `}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-cyber-primary text-xl font-semibold">
                Configurações de Notificações
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white-primary font-medium">Notificações Push</h3>
                    <p className="text-white-muted text-sm">Receba notificações em tempo real</p>
                  </div>
                  <button
                    onClick={() =>
                      settingsData &&
                      updateSetting(
                        'notifications',
                        'pushNotifications',
                        !settingsData.notifications.pushNotifications
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settingsData?.notifications.pushNotifications ? 'bg-cyber-primary' : 'bg-gray-600'} `}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settingsData?.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'} `}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Preferences Settings */}
          {activeTab === 'preferences' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-cyber-primary text-xl font-semibold">
                Preferências de Interface
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-white-secondary mb-2 block text-sm font-medium">
                    Tema
                  </label>
                  <select
                    value={settingsData?.preferences.theme ?? ''}
                    onChange={e => updateSetting('preferences', 'theme', e.target.value)}
                    className="input w-full"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="cyberpunk">Cyberpunk</option>
                  </select>
                </div>

                <div>
                  <label className="text-white-secondary mb-2 block text-sm font-medium">
                    Moeda
                  </label>
                  <select
                    value={settingsData?.preferences.currency ?? ''}
                    onChange={e => updateSetting('preferences', 'currency', e.target.value)}
                    className="input w-full"
                  >
                    <option value="BRL">Real (BRL)</option>
                    <option value="USD">Dólar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Backup Settings */}
          {activeTab === 'backup' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-cyber-primary text-xl font-semibold">Backup & Dados</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white-primary font-medium">Backup Automático</h3>
                    <p className="text-white-muted text-sm">Backup automático dos seus dados</p>
                  </div>
                  <button
                    onClick={() =>
                      settingsData &&
                      updateSetting(
                        'backup',
                        'automaticBackup',
                        !settingsData.backup.automaticBackup
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settingsData?.backup.automaticBackup ? 'bg-cyber-primary' : 'bg-gray-600'} `}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settingsData?.backup.automaticBackup ? 'translate-x-6' : 'translate-x-1'} `}
                    />
                  </button>
                </div>

                <div className="mt-6">
                  <button onClick={handleExportData} className="btn btn-secondary">
                    Exportar Dados
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <div className="border-cyber-border-muted mt-8 flex justify-end gap-4 border-t pt-6">
            <button
              onClick={handleSaveSettings}
              disabled={!hasChanges || isLoading}
              className="btn btn-primary flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
