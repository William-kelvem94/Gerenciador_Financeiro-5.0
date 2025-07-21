import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Download,
  Upload,
  Settings,
  Eye,
  EyeOff,
  Check,
  X,
  Save
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      displayName: user?.name || '',
      email: user?.email || '',
      phone: '',
      timezone: 'America/Sao_Paulo'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      weeklyReports: true,
      budgetAlerts: true,
      transactionAlerts: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      dataEncryption: true
    },
    preferences: {
      currency: 'BRL',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'cyberpunk'
    },
    privacy: {
      shareAnalytics: false,
      publicProfile: false,
      dataRetention: '12'
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Eye }
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleExportData = () => {
    toast.success('Data export initiated. You will receive an email shortly.');
  };

  const handleImportData = () => {
    toast.success('Import feature will be available soon.');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-text-secondary mb-2">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={settings.profile.displayName}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, displayName: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={settings.profile.email}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, email: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={settings.profile.phone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, phone: e.target.value }
              }))}
              placeholder="+55 (11) 99999-9999"
              className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-text-secondary mb-2">
              Timezone
            </label>
            <select 
              id="timezone"
              value={settings.profile.timezone}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                profile: { ...prev.profile, timezone: e.target.value }
              }))}
              className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
            >
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
              <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-text-secondary mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
                className="w-full px-3 py-2 pr-10 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-text-secondary hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-secondary mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
      <div className="space-y-4">
        {Object.entries(settings.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-background/30 rounded-lg">
            <div>
              <h4 className="font-medium text-white capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-sm text-text-secondary">
                {key === 'emailNotifications' && 'Receive important updates via email'}
                {key === 'pushNotifications' && 'Get real-time push notifications'}
                {key === 'weeklyReports' && 'Receive weekly financial reports'}
                {key === 'budgetAlerts' && 'Get notified when approaching budget limits'}
                {key === 'transactionAlerts' && 'Instant alerts for new transactions'}
              </p>
            </div>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                notifications: {
                  ...prev.notifications,
                  [key]: !value
                }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="p-4 bg-background/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white">Two-Factor Authentication</h4>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                security: {
                  ...prev.security,
                  twoFactorAuth: !prev.security.twoFactorAuth
                }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.security.twoFactorAuth ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-text-secondary">
            Add an extra layer of security to your account
          </p>
        </div>

        <div className="p-4 bg-background/30 rounded-lg">
          <h4 className="font-medium text-white mb-2">Session Timeout</h4>
          <select 
            value={settings.security.sessionTimeout}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              security: { ...prev.security, sessionTimeout: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="never">Never</option>
          </select>
        </div>

        <div className="p-4 bg-background/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white">Data Encryption</h4>
            <span className="flex items-center text-green-400">
              <Check className="w-4 h-4 mr-1" />
              Enabled
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            All your data is encrypted using industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Application Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-text-secondary mb-2">
            Default Currency
          </label>
          <select 
            id="currency"
            value={settings.preferences.currency}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              preferences: { ...prev.preferences, currency: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="BRL">Brazilian Real (R$)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
            <option value="GBP">British Pound (£)</option>
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-text-secondary mb-2">
            Language
          </label>
          <select 
            id="language"
            value={settings.preferences.language}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              preferences: { ...prev.preferences, language: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
            <option value="es-ES">Español</option>
            <option value="fr-FR">Français</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateFormat" className="block text-sm font-medium text-text-secondary mb-2">
            Date Format
          </label>
          <select 
            id="dateFormat"
            value={settings.preferences.dateFormat}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              preferences: { ...prev.preferences, dateFormat: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-text-secondary mb-2">
            Theme
          </label>
          <select 
            id="theme"
            value={settings.preferences.theme}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              preferences: { ...prev.preferences, theme: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="cyberpunk">Cyberpunk</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Privacy & Data</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-background/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-white">Share Analytics</h4>
            <button
              onClick={() => setSettings(prev => ({
                ...prev,
                privacy: {
                  ...prev.privacy,
                  shareAnalytics: !prev.privacy.shareAnalytics
                }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.privacy.shareAnalytics ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.privacy.shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-text-secondary">
            Help us improve by sharing anonymous usage analytics
          </p>
        </div>

        <div className="p-4 bg-background/30 rounded-lg">
          <h4 className="font-medium text-white mb-2">Data Retention</h4>
          <select 
            value={settings.privacy.dataRetention}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              privacy: { ...prev.privacy, dataRetention: e.target.value }
            }))}
            className="w-full px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
            <option value="36">36 months</option>
            <option value="indefinite">Indefinite</option>
          </select>
        </div>

        <div className="p-4 bg-background/30 rounded-lg">
          <h4 className="font-medium text-white mb-4">Data Management</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </button>
            <button
              onClick={handleImportData}
              className="flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </button>
            <button
              onClick={() => toast.error('Account deletion requires email confirmation')}
              className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'privacy':
        return renderPrivacyTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-text-secondary">
            Manage your account and application preferences
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
          <button
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Settings Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:bg-background/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6">
            {renderTabContent()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}