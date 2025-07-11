import React, { useState } from 'react';
import { 
  User, 
  Bell,
  Shield,
  Palette,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Globe,
  LogOut,
  Trash2,
  Save,
  Calendar,
  Settings as SettingsIcon
} from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useActiveSessions, ActiveSession } from '../../hooks/useActiveSessions';

export function SettingsPage() {
  const { settings, updateSettings, updateProfile, changePassword, loading, error } = useSettings();
  const { sessions, loading: sessionsLoading, terminateSession, terminateAllOtherSessions } = useActiveSessions();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'data'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    try {
      await updateSettings({ theme });
      setSuccessMessage('Tema atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar tema:', err);
    }
  };

  const handleNotificationChange = async (type: keyof typeof settings.notifications, value: boolean) => {
    try {
      await updateSettings({
        notifications: {
          ...settings.notifications,
          [type]: value
        }
      });
      setSuccessMessage('Notificações atualizadas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar notificações:', err);
    }
  };

  const handlePrivacyChange = async (type: keyof typeof settings.privacy, value: boolean) => {
    try {
      await updateSettings({
        privacy: {
          ...settings.privacy,
          [type]: value
        }
      });
      setSuccessMessage('Configurações de privacidade atualizadas!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar privacidade:', err);
    }
  };

  const handleProfileUpdate = async (field: string, value: string) => {
    try {
      await updateProfile({ [field]: value } as any);
      setSuccessMessage('Perfil atualizado!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      alert('As senhas não coincidem');
      return;
    }

    try {
      await changePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      setSuccessMessage('Senha alterada com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao alterar senha:', err);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await terminateSession(sessionId);
      setSuccessMessage('Sessão encerrada!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao encerrar sessão:', err);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'preferences', label: 'Preferências', icon: Palette },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'data', label: 'Dados', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Configurações</h1>
          <p className="text-gray-400">Gerencie suas preferências e configurações</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <p className="text-red-400">Erro: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-cyan-100">Informações do Perfil</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Foto do Perfil
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      {settings.profilePicture ? (
                        <img src={settings.profilePicture} alt="Perfil" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                      Alterar Foto
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Nova Senha
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading || !passwords.current || !passwords.new || !passwords.confirm}
                  className="mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Atualizando...' : 'Alterar Senha'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-cyan-100">Preferências</h2>
              
              {/* Tema */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Tema</h3>
                <div className="flex space-x-4">
                  {[
                    { value: 'light', label: 'Claro', icon: Sun },
                    { value: 'dark', label: 'Escuro', icon: Moon },
                    { value: 'auto', label: 'Automático', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => handleThemeChange(value as any)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        settings.theme === value
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-gray-600/30 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notificações */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Notificações</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email', icon: Bell },
                    { key: 'push', label: 'Push Notifications', icon: Smartphone },
                    { key: 'sms', label: 'SMS', icon: Globe },
                    { key: 'sound', label: 'Som', icon: Volume2 },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-300">{label}</span>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key as any, !settings.notifications[key as keyof typeof settings.notifications])}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.notifications[key as keyof typeof settings.notifications] ? 'bg-cyan-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.notifications[key as keyof typeof settings.notifications] ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Privacidade */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Privacidade</h3>
                <div className="space-y-4">
                  {[
                    { key: 'showBalance', label: 'Mostrar saldos', description: 'Exibir valores na tela inicial' },
                    { key: 'shareData', label: 'Compartilhar dados', description: 'Para melhorar a experiência' },
                    { key: 'twoFactor', label: 'Autenticação de dois fatores', description: 'Maior segurança para sua conta' },
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-300">{label}</div>
                        <div className="text-sm text-gray-400">{description}</div>
                      </div>
                      <button
                        onClick={() => handlePrivacyChange(key as any, !settings.privacy[key as keyof typeof settings.privacy])}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.privacy[key as keyof typeof settings.privacy] ? 'bg-cyan-600' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.privacy[key as keyof typeof settings.privacy] ? 'translate-x-5' : 'translate-x-0'
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
              
              {/* Status de Segurança */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Status de Segurança</h3>
                <div className="text-gray-400">
                  <p>Última alteração de senha: Invalid Date</p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                    Alterar Senha
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Configurar 2FA
                  </button>
                </div>
              </div>

              {/* Sessões Ativas */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-cyan-100">Sessões Ativas</h3>
                  <button
                    onClick={terminateAllOtherSessions}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Encerrar outras sessões
                  </button>
                </div>
                
                {sessionsLoading ? (
                  <div className="text-gray-400">Carregando sessões...</div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-500/30 rounded-lg">
                            {session.deviceType === 'mobile' ? (
                              <Smartphone className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Monitor className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-gray-300 font-medium">
                              {session.deviceName} {session.isCurrent && <span className="text-cyan-400">(Atual)</span>}
                            </div>
                            <div className="text-sm text-gray-400">
                              {session.browser} • {session.location} • {session.ip}
                            </div>
                            <div className="text-xs text-gray-500">
                              Última atividade: {new Date(session.lastActivity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-cyan-100">Gerenciamento de Dados</h2>
              
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Exportar Dados</h3>
                <p className="text-gray-400 mb-4">
                  Baixe uma cópia dos seus dados financeiros em formato JSON ou CSV.
                </p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Exportar JSON
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Exportar CSV
                  </button>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Perigo</h3>
                <p className="text-gray-400 mb-4">
                  Ações irreversíveis que afetarão permanentemente seus dados.
                </p>
                <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Trash2 className="h-4 w-4" />
                  <span>Excluir Conta</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
