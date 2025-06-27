import { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell,
  Shield,
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Code,
  Database,
  Server,
  Globe,
  ExternalLink
} from 'lucide-react';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
  };
  preferences: {
    currency: string;
    language: string;
    theme: 'dark' | 'light' | 'auto';
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
  };
  security: {
    lastPasswordChange: string;
    sessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  };
}

const mockSettings: UserSettings = {
  profile: {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    avatar: '',
    phone: '+55 11 99999-9999'
  },
  preferences: {
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      sms: false,
      sound: true
    },
    privacy: {
      showBalance: true,
      shareData: false,
      twoFactor: false
    }
  },
  security: {
    lastPasswordChange: '2024-01-01',
    sessions: [
      {
        id: '1',
        device: 'Chrome no Windows',
        location: 'São Paulo, SP',
        lastActive: '2024-01-15T10:30:00Z',
        current: true
      },
      {
        id: '2',
        device: 'Firefox no Windows',
        location: 'São Paulo, SP',
        lastActive: '2024-01-14T15:20:00Z',
        current: false
      }
    ]
  }
};

export function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(mockSettings);
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'data' | 'dev-tools'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateSettings = (section: keyof UserSettings, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Aqui seria feita a chamada para a API para salvar as configurações
    console.log('Salvando configurações:', settings);
    setHasUnsavedChanges(false);
  };

  const exportData = () => {
    // Simular exportação de dados
    const data = {
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'will-finance-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getNotificationIcon = (key: string, icon: any) => {
    if (key === 'sound') {
      return settings.preferences.notifications.sound ? Volume2 : VolumeX;
    }
    return icon;
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'preferences', label: 'Preferências', icon: Settings },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'data', label: 'Dados', icon: Download },
    { id: 'dev-tools', label: 'Dev Tools', icon: Code }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Configurações</h1>
          <p className="text-gray-400">Gerencie suas preferências e configurações</p>
        </div>
        {hasUnsavedChanges && (
          <button
            onClick={saveSettings}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            <Save className="h-5 w-5" />
            <span>Salvar Alterações</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-cyan-100">Informações do Perfil</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
                      Nome Completo
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSettings('profile', { name: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSettings('profile', { email: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 text-sm font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={settings.profile.phone}
                      onChange={(e) => updateSettings('profile', { phone: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="profile-photo" className="block text-gray-300 text-sm font-medium mb-2">
                      Foto do Perfil
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                      <button id="profile-photo" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                        Alterar Foto
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Alterar Senha</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="current-password" className="block text-gray-300 text-sm font-medium mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          id="current-password"
                          type={showPassword ? 'text' : 'password'}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-gray-300 text-sm font-medium mb-2">
                        Nova Senha
                      </label>
                      <input
                        id="new-password"
                        type={showPassword ? 'text' : 'password'}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-cyan-100">Preferências</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currency" className="block text-gray-300 text-sm font-medium mb-2">
                      Moeda
                    </label>
                    <select
                      id="currency"
                      value={settings.preferences.currency}
                      onChange={(e) => updateSettings('preferences', { currency: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="BRL">Real Brasileiro (BRL)</option>
                      <option value="USD">Dólar Americano (USD)</option>
                      <option value="EUR">Euro (EUR)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="language" className="block text-gray-300 text-sm font-medium mb-2">
                      Idioma
                    </label>
                    <select
                      id="language"
                      value={settings.preferences.language}
                      onChange={(e) => updateSettings('preferences', { language: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">Inglês (EUA)</option>
                      <option value="es-ES">Espanhol</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Tema</h3>
                  <div className="flex space-x-4">
                    {[
                      { value: 'dark', label: 'Escuro', icon: Moon },
                      { value: 'light', label: 'Claro', icon: Sun },
                      { value: 'auto', label: 'Automático', icon: Palette }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => updateSettings('preferences', { theme: theme.value })}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            settings.preferences.theme === theme.value
                              ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                              : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Notificações</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email', icon: Bell },
                      { key: 'push', label: 'Push Notifications', icon: Bell },
                      { key: 'sms', label: 'SMS', icon: Bell },
                      { key: 'sound', label: 'Som', icon: Volume2 }
                    ].map((notification) => {
                      const Icon = getNotificationIcon(notification.key, notification.icon);
                      return (
                        <div key={notification.key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-300">{notification.label}</span>
                          </div>
                          <button
                            onClick={() => updateSettings('preferences', {
                              notifications: {
                                ...settings.preferences.notifications,
                                [notification.key]: !settings.preferences.notifications[notification.key as keyof typeof settings.preferences.notifications]
                              }
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              settings.preferences.notifications[notification.key as keyof typeof settings.preferences.notifications]
                                ? 'bg-cyan-500'
                                : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.preferences.notifications[notification.key as keyof typeof settings.preferences.notifications]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Privacidade</h3>
                  <div className="space-y-4">
                    {[
                      { key: 'showBalance', label: 'Mostrar saldos', description: 'Exibir valores na tela inicial' },
                      { key: 'shareData', label: 'Compartilhar dados', description: 'Para melhorar a experiência' },
                      { key: 'twoFactor', label: 'Autenticação de dois fatores', description: 'Maior segurança para sua conta' }
                    ].map((privacy) => (
                      <div key={privacy.key} className="flex items-center justify-between">
                        <div>
                          <div className="text-gray-300">{privacy.label}</div>
                          <div className="text-sm text-gray-500">{privacy.description}</div>
                        </div>
                        <button
                          onClick={() => updateSettings('preferences', {
                            privacy: {
                              ...settings.preferences.privacy,
                              [privacy.key]: !settings.preferences.privacy[privacy.key as keyof typeof settings.preferences.privacy]
                            }
                          })}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.preferences.privacy[privacy.key as keyof typeof settings.preferences.privacy]
                              ? 'bg-cyan-500'
                              : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.preferences.privacy[privacy.key as keyof typeof settings.preferences.privacy]
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-cyan-100">Segurança</h2>
                
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-cyan-100 mb-2">Status de Segurança</h3>
                  <p className="text-gray-400 mb-4">
                    Última alteração de senha: {new Date(settings.security.lastPasswordChange).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                      Alterar Senha
                    </button>
                    <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors">
                      Configurar 2FA
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Sessões Ativas</h3>
                  <div className="space-y-3">
                    {settings.security.sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-300">{session.device}</span>
                            {session.current && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Atual
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.location} • {new Date(session.lastActive).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        {!session.current && (
                          <button className="text-red-400 hover:text-red-300 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-cyan-100">Gerenciamento de Dados</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Download className="h-6 w-6 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-cyan-100">Exportar Dados</h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Baixe uma cópia de todos os seus dados em formato JSON.
                    </p>
                    <button
                      onClick={exportData}
                      className="w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                    >
                      Exportar Dados
                    </button>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Upload className="h-6 w-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-cyan-100">Importar Dados</h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Importe dados de um backup anterior ou de outra aplicação.
                    </p>
                    <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                      Importar Dados
                    </button>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Trash2 className="h-6 w-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-red-400">Zona de Perigo</h3>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Ações irreversíveis que afetarão permanentemente sua conta.
                  </p>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Apagar Todos os Dados
                    </button>
                    <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                      Excluir Conta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'dev-tools' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Code className="h-8 w-8 text-cyan-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-cyan-100">Ferramentas de Desenvolvimento</h2>
                    <p className="text-gray-400">Acesse ferramentas e APIs para desenvolvimento</p>
                  </div>
                </div>
                
                {/* Status do Sistema */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center">
                    <Server className="h-5 w-5 mr-2" />
                    Status do Sistema
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-gray-300">Frontend (React)</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">● OnLine</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-gray-300">Backend (API)</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">● OnLine</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <span className="text-gray-300">Firebase</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">● OnLine</span>
                    </div>
                  </div>
                </div>

                {/* Links de Desenvolvimento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Database className="h-6 w-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-cyan-100">Banco de Dados</h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Gerencie dados, visualize tabelas e execute queries no Prisma Studio.
                    </p>
                    <button
                      onClick={() => window.open('http://localhost:5555', '_blank')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Database className="h-4 w-4" />
                      <span>Abrir Prisma Studio</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Server className="h-6 w-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-cyan-100">API Backend</h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Teste endpoints, visualize documentação e monitore logs da API.
                    </p>
                    <button
                      onClick={() => window.open('http://localhost:8080/api', '_blank')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <Server className="h-4 w-4" />
                      <span>Acessar API</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Ferramentas de Teste */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4 flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Ferramentas de Teste e Desenvolvimento
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => window.open('http://localhost:5173/login', '_blank')}
                      className="flex flex-col items-center p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
                    >
                      <User className="h-8 w-8 text-purple-400 mb-2" />
                      <span className="text-sm text-gray-300">Login Page</span>
                    </button>
                    
                    <button
                      onClick={() => window.open('http://localhost:5173/dashboard', '_blank')}
                      className="flex flex-col items-center p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors"
                    >
                      <Settings className="h-8 w-8 text-cyan-400 mb-2" />
                      <span className="text-sm text-gray-300">Dashboard</span>
                    </button>
                    
                    <button
                      onClick={() => window.open('http://localhost:8080/api/health', '_blank')}
                      className="flex flex-col items-center p-4 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                    >
                      <Shield className="h-8 w-8 text-green-400 mb-2" />
                      <span className="text-sm text-gray-300">Health Check</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        const token = localStorage.getItem('will-finance-token');
                        if (token) {
                          navigator.clipboard.writeText(token);
                          alert('Token copiado para área de transferência!');
                        } else {
                          alert('Nenhum token encontrado. Faça login primeiro.');
                        }
                      }}
                      className="flex flex-col items-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors"
                    >
                      <Code className="h-8 w-8 text-yellow-400 mb-2" />
                      <span className="text-sm text-gray-300">Copy Token</span>
                    </button>
                  </div>
                </div>

                {/* Informações Técnicas */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Informações Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-2">Frontend</h4>
                      <ul className="space-y-1 text-gray-400">
                        <li>• React 18 + TypeScript</li>
                        <li>• Vite 5.4.19</li>
                        <li>• Tailwind CSS</li>
                        <li>• Zustand (State)</li>
                        <li>• React Router</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-cyan-400 font-medium mb-2">Backend</h4>
                      <ul className="space-y-1 text-gray-400">
                        <li>• Node.js + Express</li>
                        <li>• TypeScript</li>
                        <li>• Prisma ORM</li>
                        <li>• SQLite Database</li>
                        <li>• Firebase Admin SDK</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="bg-gray-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-cyan-100 mb-4">Ações Rápidas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        console.log('Executando seed do banco...');
                        // Aqui você pode adicionar uma chamada para executar o seed
                        alert('Seed executado! Verifique o console para detalhes.');
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Database className="h-4 w-4" />
                      <span>Executar Seed</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        localStorage.clear();
                        sessionStorage.clear();
                        alert('Cache limpo! Recarregue a página.');
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Limpar Cache</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        window.open('https://console.firebase.google.com/project/gerenciador-financeiro-707c4', '_blank');
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Firebase Console</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
