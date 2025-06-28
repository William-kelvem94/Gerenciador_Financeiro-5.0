import React, { useState, useEffect } from 'react';
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
  Smartphone,
  Monitor,
  Globe,
  LogOut,
  Trash2,
  Save,
  Settings as SettingsIcon,
  Terminal,
  ExternalLink,
  Database,
  Cloud,
  Bug,
  Activity,
  Play
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useActiveSessions } from '../hooks/useActiveSessions';
import { BetaTester } from '../components/testing/BetaTester';
import { OAuthFixer } from '../components/testing/OAuthFixer';

export function SettingsPage() {
  const { settings, updateSettings, updateProfile, changePassword, loading, error } = useSettings();
  const { sessions, loading: sessionsLoading, terminateSession, terminateAllOtherSessions } = useActiveSessions();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'data' | 'devtools'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [savingField, setSavingField] = useState<string | null>(null);
  const [showBetaTester, setShowBetaTester] = useState(false);
  const [showOAuthFixer, setShowOAuthFixer] = useState(false);

  // Atualizar formulário quando as configurações mudarem
  useEffect(() => {
    setProfileForm({
      name: settings.name || '',
      email: settings.email || '',
      phone: settings.phone || ''
    });
  }, [settings]);

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
      setSavingField(field);
      setSuccessMessage('');
      
      await updateProfile({ [field]: value } as any);
      
      let fieldName = 'Campo';
      if (field === 'name') {
        fieldName = 'Nome';
      } else if (field === 'email') {
        fieldName = 'Email';
      } else if (field === 'phone') {
        fieldName = 'Telefone';
      }
      
      setSuccessMessage(`${fieldName} atualizado com sucesso!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setSuccessMessage('');
    } finally {
      setSavingField(null);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFormBlur = (field: string) => {
    const currentValue = settings[field as keyof typeof settings] as string;
    const newValue = profileForm[field as keyof typeof profileForm];
    
    if (currentValue !== newValue && newValue.trim()) {
      handleProfileUpdate(field, newValue);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    try {
      setSavingField('profilePicture');
      
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da foto');
      }

      const data = await response.json();
      await updateProfile({ profilePicture: data.data.photoUrl });
      setSuccessMessage('Foto de perfil atualizada!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erro ao fazer upload da foto:', err);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setSavingField(null);
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
    { id: 'devtools', label: 'Dev Tools', icon: Terminal },
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
                  <label htmlFor="profile-name" className="block text-gray-400 text-sm font-medium mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <input
                      id="profile-name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      onBlur={() => handleFormBlur('name')}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Seu nome completo"
                    />
                    {savingField === 'name' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="profile-email" className="block text-gray-400 text-sm font-medium mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="profile-email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      onBlur={() => handleFormBlur('email')}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="seu@email.com"
                    />
                    {savingField === 'email' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="profile-phone" className="block text-gray-400 text-sm font-medium mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <input
                      id="profile-phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      onBlur={() => handleFormBlur('phone')}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="(11) 99999-9999"
                    />
                    {savingField === 'phone' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="photo-upload" className="block text-gray-400 text-sm font-medium mb-2">
                    Foto do Perfil
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                      {settings.profilePicture ? (
                        <img src={settings.profilePicture} alt="Perfil" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                      {savingField === 'profilePicture' && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer inline-block"
                      >
                        {savingField === 'profilePicture' ? 'Enviando...' : 'Alterar Foto'}
                      </label>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG até 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Alterar Senha</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="current-password" className="block text-gray-400 text-sm font-medium mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <input
                        id="current-password"
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
                    <label htmlFor="new-password" className="block text-gray-400 text-sm font-medium mb-2">
                      Nova Senha
                    </label>
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirm-password" className="block text-gray-400 text-sm font-medium mb-2">
                      Confirmar Nova Senha
                    </label>
                    <input
                      id="confirm-password"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className="h-5 w-5 text-green-400" />
                      <span className="text-gray-300">Senha</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      Última alteração: {(settings as any).lastPasswordChange ?? 'Nunca alterada'}
                    </p>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="mt-2 px-3 py-1 bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700 transition-colors"
                    >
                      Alterar Senha
                    </button>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className={`h-5 w-5 ${settings.privacy.twoFactor ? 'text-green-400' : 'text-yellow-400'}`} />
                      <span className="text-gray-300">Autenticação 2FA</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {settings.privacy.twoFactor ? 'Ativada' : 'Desativada'}
                    </p>
                    <button 
                      onClick={() => handlePrivacyChange('twoFactor', !settings.privacy.twoFactor)}
                      className={`mt-2 px-3 py-1 text-white text-sm rounded transition-colors ${
                        settings.privacy.twoFactor 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {settings.privacy.twoFactor ? 'Desativar 2FA' : 'Ativar 2FA'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sessões Ativas */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-cyan-100">Sessões Ativas</h3>
                  <button
                    onClick={terminateAllOtherSessions}
                    disabled={sessionsLoading || sessions.length <= 1}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Encerrar outras sessões
                  </button>
                </div>
                
                {(() => {
                  if (sessionsLoading) {
                    return (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                        <span className="ml-2 text-gray-400">Carregando sessões...</span>
                      </div>
                    );
                  }
                  
                  if (sessions.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-400">
                        <Monitor className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma sessão ativa encontrada</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-600/50">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg ${session.isCurrent ? 'bg-cyan-500/20' : 'bg-gray-500/30'}`}>
                              {session.deviceType === 'mobile' ? (
                                <Smartphone className={`h-5 w-5 ${session.isCurrent ? 'text-cyan-400' : 'text-gray-400'}`} />
                              ) : (
                                <Monitor className={`h-5 w-5 ${session.isCurrent ? 'text-cyan-400' : 'text-gray-400'}`} />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-300 font-medium">{session.deviceName || 'Dispositivo desconhecido'}</span>
                                {session.isCurrent && (
                                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                                  Sessão atual
                                </span>
                              )}
                              <span className={`w-2 h-2 rounded-full ${session.isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
                            </div>
                            <div className="text-sm text-gray-400">
                              {session.browser} • {session.location || 'Localização desconhecida'}
                            </div>
                            <div className="text-xs text-gray-500">
                              IP: {session.ip} • Última atividade: {new Date(session.lastActivity).toLocaleString('pt-BR')}
                            </div>
                          </div>
                        </div>
                        {!session.isCurrent && (
                          <button
                            onClick={() => handleTerminateSession(session.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Encerrar sessão"
                          >
                            <LogOut className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  );
                })()}
              </div>

              {/* Atividade de Login */}
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-cyan-100 mb-4">Atividade Recente</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  <div className="flex items-center justify-between text-sm py-2 border-b border-gray-700/50">
                    <div>
                      <span className="text-gray-300">Login bem-sucedido</span>
                      <span className="text-gray-500 ml-2">• Windows • Chrome</span>
                    </div>
                    <span className="text-gray-400">Há 2 horas</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-2 border-b border-gray-700/50">
                    <div>
                      <span className="text-red-400">Tentativa de login falhada</span>
                      <span className="text-gray-500 ml-2">• IP: 192.168.1.100</span>
                    </div>
                    <span className="text-gray-400">Há 1 dia</span>
                  </div>
                </div>
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

          {/* Dev Tools Tab */}
          {activeTab === 'devtools' && (
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-cyan-100 mb-4">🛠️ Dev Tools & Complementos</h2>
                <p className="text-gray-400 mb-6">
                  Gerencie e acesse todas as ferramentas de desenvolvimento e complementos do Will Finance
                </p>
              </div>

              {/* Serviços Principais */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Serviços Principais</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prisma Studio */}
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Database className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Prisma Studio</h4>
                          <p className="text-sm text-gray-400">Gerenciador de banco de dados</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open('http://localhost:5555', '_blank')}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Abrir (5555)</span>
                      </button>
                    </div>
                  </div>

                  {/* Backend API */}
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Globe className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">Backend API</h4>
                          <p className="text-sm text-gray-400">API REST do servidor</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => window.open('http://localhost:8080/api/health', '_blank')}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Testar (8080)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Complementos e Integrações */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center space-x-2">
                  <Cloud className="h-5 w-5" />
                  <span>Complementos & Integrações</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Google Cloud Console */}
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <Cloud className="h-4 w-4 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Google Cloud</h4>
                        <p className="text-xs text-gray-400">Console de autenticação</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open('https://console.cloud.google.com', '_blank')}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Abrir Console</span>
                    </button>
                  </div>

                  {/* GitHub Repository */}
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
                        <Globe className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">GitHub</h4>
                        <p className="text-xs text-gray-400">Repositório do projeto</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open('https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0', '_blank')}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Repositório</span>
                    </button>
                  </div>

                  {/* Vite Dev Server */}
                  <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                        <Terminal className="h-4 w-4 text-yellow-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">Vite Dev</h4>
                        <p className="text-xs text-gray-400">Frontend principal</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => window.open('http://localhost:5173', '_blank')}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>App (5173)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Comandos Rápidos */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center space-x-2">
                  <Terminal className="h-5 w-5" />
                  <span>Comandos Rápidos</span>
                </h3>
                
                <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Terminal className="h-4 w-4" />
                      <span>Reiniciar Servidor</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Database className="h-4 w-4" />
                      <span>Reset Database</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <Save className="h-4 w-4" />
                      <span>Backup Dados</span>
                    </button>
                    
                    <button 
                      onClick={() => setShowOAuthFixer(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Corrigir OAuth</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                      <SettingsIcon className="h-4 w-4" />
                      <span>Logs Sistema</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Sistema de Testes Beta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400 flex items-center space-x-2">
                  <Bug className="h-5 w-5" />
                  <span>Sistema de Testes Beta</span>
                </h3>
                
                <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                  <div className="mb-4">
                    <h4 className="font-semibold text-white mb-2">🧪 Beta Tester Pro</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      Sistema completo de testes automatizados que atua como um beta tester avançado.
                      Testa autenticação, API, interface, performance, segurança e integrações.
                    </p>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setShowBetaTester(!showBetaTester)}
                        className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        <Bug className="h-4 w-4" />
                        <span>{showBetaTester ? 'Fechar' : 'Abrir'} Beta Tester</span>
                      </button>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3 text-green-400" />
                          <span>8 Suítes de Teste</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Play className="h-3 w-3 text-blue-400" />
                          <span>55+ Testes Automatizados</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lista de recursos do Beta Tester */}
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-300">
                      <div>✅ Autenticação</div>
                      <div>✅ API Backend</div>
                      <div>✅ Interface UI</div>
                      <div>✅ Performance</div>
                      <div>✅ Segurança</div>
                      <div>✅ Integrações</div>
                      <div>✅ Database</div>
                      <div>✅ WebSocket</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status do Sistema */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-400">📊 Status do Sistema</h3>
                
                <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">✅ Online</div>
                      <div className="text-sm text-gray-400">Frontend</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">✅ Online</div>
                      <div className="text-sm text-gray-400">Backend</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">✅ Online</div>
                      <div className="text-sm text-gray-400">Database</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Úteis */}
              <div className="bg-cyan-900/20 border border-cyan-700 rounded-lg p-4">
                <h4 className="text-cyan-400 font-semibold mb-2">💡 Informações Úteis</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>• <strong>Porta Principal:</strong> http://localhost:5173 (Frontend)</p>
                  <p>• <strong>API Backend:</strong> http://localhost:8080 (Servidor)</p>
                  <p>• <strong>Prisma Studio:</strong> http://localhost:5555 (Database)</p>
                  <p>• <strong>Scripts:</strong> Use start.ps1 para iniciar tudo automaticamente</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal do OAuth Fixer */}
      {showOAuthFixer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-red-500" />
                <h2 className="text-xl font-bold text-white">OAuth Fix Assistant</h2>
              </div>
              <button
                onClick={() => setShowOAuthFixer(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="h-full overflow-auto">
              <OAuthFixer />
            </div>
          </div>
        </div>
      )}
      
      {/* Modal do Beta Tester */}
      {showBetaTester && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="fixed inset-4 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <Bug className="h-6 w-6 text-orange-500" />
                <h2 className="text-xl font-bold text-white">Beta Tester Pro</h2>
              </div>
              <button
                onClick={() => setShowBetaTester(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="h-full overflow-auto">
              <BetaTester />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
