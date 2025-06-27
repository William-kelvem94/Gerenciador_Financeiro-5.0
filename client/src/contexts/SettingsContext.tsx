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
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações do usuário
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/api/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSettings({ ...defaultSettings, ...data.data });
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

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar configurações');
      }

      setSettings(prev => ({ ...prev, ...updates }));
    } catch (err) {
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

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      setSettings(prev => ({ ...prev, ...profile }));
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
