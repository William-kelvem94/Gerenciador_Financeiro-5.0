import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface UserSettings {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    sound: boolean;
  };
  privacy: {
    showBalance: boolean;
    shareData: boolean;
    twoFactor: boolean;
  };
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
}

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  updateProfile: (profile: Partial<Pick<UserSettings, 'name' | 'email' | 'phone' | 'profilePicture'>>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const defaultSettings: UserSettings = {
  theme: 'dark',
  notifications: {
    email: true,
    push: true,
    sms: false,
    sound: true,
  },
  privacy: {
    showBalance: true,
    shareData: false,
    twoFactor: false,
  },
  name: '',
  email: '',
  phone: '',
  profilePicture: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const html = document.documentElement;
      let themeToApply = settings.theme;

      if (settings.theme === 'auto') {
        themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      // Remove todas as classes de tema
      html.classList.remove('light', 'dark');
      html.classList.add(themeToApply);
      
      // Aplicar também no body para garantia
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(themeToApply);
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themeToApply === 'dark' ? '#0A0A0A' : '#FFFFFF');
      }

      // Aplicar CSS custom properties
      if (themeToApply === 'dark') {
        html.style.setProperty('--background', '#0A0A0A');
        html.style.setProperty('--foreground', '#FFFFFF');
        html.style.setProperty('--card', '#1A1A1A');
        html.style.setProperty('--card-foreground', '#FFFFFF');
        html.style.setProperty('--primary', '#00FFFF');
        html.style.setProperty('--secondary', '#1A1A1A');
      } else {
        html.style.setProperty('--background', '#FFFFFF');
        html.style.setProperty('--foreground', '#0A0A0A');
        html.style.setProperty('--card', '#F8F9FA');
        html.style.setProperty('--card-foreground', '#0A0A0A');
        html.style.setProperty('--primary', '#0066CC');
        html.style.setProperty('--secondary', '#F8F9FA');
      }
    };

    applyTheme();

    // Listen for system theme changes when using auto
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [settings.theme]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  // Carregar configurações do usuário
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Carregar configurações locais primeiro
        const localSettings = localStorage.getItem('userSettings');
        if (localSettings) {
          try {
            const parsed = JSON.parse(localSettings);
            setSettings({ ...defaultSettings, ...parsed });
          } catch (e) {
            console.warn('Erro ao carregar configurações locais:', e);
          }
        }

        if (!token) return;

        // Carregar do servidor e sincronizar
        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const serverSettings = { ...defaultSettings, ...data.data };
          
          // Detectar se veio do Google Auth e preencher automaticamente
          if (data.data.googleAuth && !data.data.name && data.data.googleProfile) {
            serverSettings.name = data.data.googleProfile.name || '';
            serverSettings.email = data.data.googleProfile.email || '';
            serverSettings.profilePicture = data.data.googleProfile.picture || '';
            // Auto-salvar dados do Google
            updateProfile({
              name: serverSettings.name,
              email: serverSettings.email,
              profilePicture: serverSettings.profilePicture
            }).catch(console.error);
          }
          
          setSettings(serverSettings);
          // Persistir localmente
          localStorage.setItem('userSettings', JSON.stringify(serverSettings));
        }
      } catch (err) {
        console.error('Erro ao carregar configurações:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Aplicar tema
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (settings.theme === 'auto') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', isDark);
      } else {
        root.classList.toggle('dark', settings.theme === 'dark');
      }
    };

    applyTheme();

    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [settings.theme]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      // Primeiro aplicar localmente para feedback imediato
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      
      // Persistir localmente
      localStorage.setItem('userSettings', JSON.stringify(newSettings));

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // Reverter mudanças locais se falhar
        setSettings(settings);
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar configurações');
      }

      const data = await response.json();
      console.log('✅ Configurações salvas:', data);
      
      // Atualizar com dados do servidor
      const finalSettings = { ...newSettings, ...data.data };
      setSettings(finalSettings);
      localStorage.setItem('userSettings', JSON.stringify(finalSettings));
      
    } catch (err) {
      console.error('❌ Erro ao salvar configurações:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile: Partial<Pick<UserSettings, 'name' | 'email' | 'phone' | 'profilePicture'>>) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      // Aplicar localmente primeiro
      const newSettings = { ...settings, ...profile };
      setSettings(newSettings);
      localStorage.setItem('userSettings', JSON.stringify(newSettings));

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        // Reverter se falhar
        setSettings(settings);
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar perfil');
      }

      const data = await response.json();
      console.log('✅ Perfil atualizado:', data);
      
      // Confirmar com dados do servidor
      if (data.data) {
        const finalSettings = { ...newSettings, ...data.data };
        setSettings(finalSettings);
        localStorage.setItem('userSettings', JSON.stringify(finalSettings));
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao alterar senha');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = useMemo(() => ({
    settings,
    updateSettings,
    updateProfile,
    changePassword,
    loading,
    error,
  }), [settings, loading, error]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
