import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Shield, 
  Palette, 
  Database, 
  Bell, 
  Smartphone, 
  Globe, 
  Lock, 
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Monitor,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: 'Phoenix User',
      email: 'user@phoenix.finance',
      phone: '+55 11 99999-9999',
      avatar: '',
    },
    security: {
      twoFactorEnabled: true,
      biometricEnabled: false,
      sessionTimeout: 30,
    },
    appearance: {
      theme: 'cyberpunk',
      animations: true,
      compactMode: false,
      language: 'pt-BR',
    },
    notifications: {
      pushNotifications: true,
      emailAlerts: true,
      budgetAlerts: true,
      transactionAlerts: false,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'weekly',
      lastBackup: '2024-01-15',
    }
  });

  const sections = [
    { id: 'profile', label: 'PROFILE', icon: User },
    { id: 'security', label: 'SECURITY', icon: Shield },
    { id: 'appearance', label: 'APPEARANCE', icon: Palette },
    { id: 'notifications', label: 'NOTIFICATIONS', icon: Bell },
    { id: 'backup', label: 'BACKUP', icon: Database },
  ];

  const updateSetting = (section: string, key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8"
        >
          {/* Circuit Pattern Background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <defs>
                <pattern id="circuit-settings" patternUnits="userSpaceOnUse" width="100" height="100">
                  <path d="M10,10 L90,10 L90,90 L50,90 L50,50" 
                        stroke="#00FFFF" strokeWidth="1" fill="none" opacity="0.3"/>
                  <circle cx="10" cy="10" r="2" fill="#FF00FF"/>
                  <circle cx="90" cy="90" r="2" fill="#39FF14"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit-settings)"/>
            </svg>
          </div>

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <Settings className="w-10 h-10 text-cyan-400" />
                <motion.div
                  className="absolute -inset-2 rounded-full border border-cyan-400/30"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                />
              </div>
              <div>
                <h1 className="text-4xl font-cyber bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SYSTEM CONTROL
                </h1>
                <p className="text-gray-300 text-lg">Advanced Configuration Panel</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-6 py-4 rounded-xl border transition-all duration-300 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/25'
                    : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-semibold">{section.label}</span>
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8"
            >
              {/* Profile Settings */}
              {activeSection === 'profile' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <User className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-cyber text-cyan-400">USER PROFILE</h2>
                  </div>

                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                      <motion.div
                        className="absolute -inset-1 rounded-2xl border border-cyan-400/50"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Profile Photo</h3>
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
                          <Upload className="w-4 h-4 inline mr-2" />
                          Upload
                        </button>
                        <button className="px-4 py-2 bg-red-500/20 border border-red-400 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-300 mb-2">FULL NAME</label>
                      <input
                        id="fullName"
                        type="text"
                        value={settings.profile.name}
                        onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">EMAIL ADDRESS</label>
                      <input
                        id="email"
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">PHONE NUMBER</label>
                      <input
                        id="phone"
                        type="tel"
                        value={settings.profile.phone}
                        onChange={(e) => updateSetting('profile', 'phone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">NEW PASSWORD</label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 pr-12"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeSection === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <Shield className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-cyber text-cyan-400">SECURITY CONTROL</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4">
                        <Lock className="w-6 h-6 text-purple-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                          <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('security', 'twoFactorEnabled', !settings.security.twoFactorEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.security.twoFactorEnabled ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ x: settings.security.twoFactorEnabled ? 24 : 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4">
                        <Smartphone className="w-6 h-6 text-green-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Biometric Authentication</h3>
                          <p className="text-gray-400 text-sm">Use fingerprint or face recognition</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('security', 'biometricEnabled', !settings.security.biometricEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.security.biometricEnabled ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ x: settings.security.biometricEnabled ? 24 : 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4 mb-4">
                        <RefreshCw className="w-6 h-6 text-yellow-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Session Timeout</h3>
                          <p className="text-gray-400 text-sm">Automatically log out after inactivity</p>
                        </div>
                      </div>
                      <select
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeSection === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <Palette className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-cyber text-cyan-400">VISUAL INTERFACE</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4 mb-4">
                        <Monitor className="w-6 h-6 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Theme Selection</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['cyberpunk', 'dark', 'light'].map((theme) => (
                          <button
                            key={theme}
                            onClick={() => updateSetting('appearance', 'theme', theme)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              settings.appearance.theme === theme
                                ? 'border-cyan-400 bg-cyan-500/20'
                                : 'border-gray-600 hover:border-cyan-500/50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {theme === 'cyberpunk' && <Zap className="w-6 h-6 text-cyan-400" />}
                              {theme === 'dark' && <Moon className="w-6 h-6 text-gray-400" />}
                              {theme === 'light' && <Sun className="w-6 h-6 text-yellow-400" />}
                              <span className="text-white font-semibold capitalize">{theme}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4">
                        <Zap className="w-6 h-6 text-cyan-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Enhanced Animations</h3>
                          <p className="text-gray-400 text-sm">Enable smooth transitions and effects</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('appearance', 'animations', !settings.appearance.animations)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.appearance.animations ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ x: settings.appearance.animations ? 24 : 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4 mb-4">
                        <Globe className="w-6 h-6 text-green-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Language</h3>
                          <p className="text-gray-400 text-sm">Select your preferred language</p>
                        </div>
                      </div>
                      <select
                        value={settings.appearance.language}
                        onChange={(e) => updateSetting('appearance', 'language', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="pt-BR">Português (Brasil)</option>
                        <option value="en-US">English (US)</option>
                        <option value="es-ES">Español</option>
                        <option value="fr-FR">Français</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <Bell className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-cyber text-cyan-400">ALERT SYSTEM</h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive notifications on your device', icon: Smartphone },
                      { key: 'emailAlerts', label: 'Email Alerts', desc: 'Get important updates via email', icon: Globe },
                      { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Warning when approaching budget limits', icon: Bell },
                      { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Notification for every transaction', icon: Zap },
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                        <div className="flex items-center space-x-4">
                          <notification.icon className="w-6 h-6 text-cyan-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">{notification.label}</h3>
                            <p className="text-gray-400 text-sm">{notification.desc}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => updateSetting('notifications', notification.key, !settings.notifications[notification.key as keyof typeof settings.notifications])}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.notifications[notification.key as keyof typeof settings.notifications] ? 'bg-cyan-500' : 'bg-gray-600'
                          }`}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            animate={{ x: settings.notifications[notification.key as keyof typeof settings.notifications] ? 24 : 4 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeSection === 'backup' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-8">
                    <Database className="w-8 h-8 text-cyan-400" />
                    <h2 className="text-2xl font-cyber text-cyan-400">DATA MANAGEMENT</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4">
                        <RefreshCw className="w-6 h-6 text-green-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Automatic Backup</h3>
                          <p className="text-gray-400 text-sm">Automatically backup your data</p>
                        </div>
                      </div>
                      <button
                        onClick={() => updateSetting('backup', 'autoBackup', !settings.backup.autoBackup)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.backup.autoBackup ? 'bg-cyan-500' : 'bg-gray-600'
                        }`}
                      >
                        <motion.div
                          className="absolute top-1 w-4 h-4 bg-white rounded-full"
                          animate={{ x: settings.backup.autoBackup ? 24 : 4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      </button>
                    </div>

                    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-600">
                      <div className="flex items-center space-x-4 mb-4">
                        <Database className="w-6 h-6 text-purple-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Backup Frequency</h3>
                          <p className="text-gray-400 text-sm">How often to create backups</p>
                        </div>
                      </div>
                      <select
                        value={settings.backup.backupFrequency}
                        onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-500 rounded-xl text-white focus:ring-2 focus:ring-cyan-400"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-purple-500/30 transition-all">
                        <Download className="w-5 h-5" />
                        <span className="font-semibold">EXPORT DATA</span>
                      </button>
                      <button className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400 text-green-400 rounded-xl hover:from-green-500/30 hover:to-cyan-500/30 transition-all">
                        <Upload className="w-5 h-5" />
                        <span className="font-semibold">IMPORT DATA</span>
                      </button>
                    </div>

                    <div className="p-6 bg-gray-800/50 rounded-xl border border-yellow-500/30">
                      <div className="flex items-center space-x-4 mb-4">
                        <Database className="w-6 h-6 text-yellow-400" />
                        <div>
                          <h3 className="text-lg font-semibold text-white">Last Backup</h3>
                          <p className="text-gray-400 text-sm">Your last data backup was created on</p>
                        </div>
                      </div>
                      <p className="text-yellow-400 font-semibold">{settings.backup.lastBackup}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-gray-900 rounded-xl font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                >
                  <Save className="w-5 h-5" />
                  <span>SAVE CHANGES</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}