import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Shield,
  Terminal,
  Cpu,
  WifiOff,
  Globe,
} from 'lucide-react';

// Cyber Logo Component
const CyberLogo: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, type: 'spring' }}
    className="relative"
  >
    <div className="font-cyber text-center text-6xl font-black">
      <span className="text-glow animate-pulse-glow">WILL</span>
      <br />
      <span className="text-glow-pink">FINANCE</span>
      <br />
      <span className="text-glow-green font-mono text-2xl">v5.0 CYBER</span>
    </div>

    {/* Circuit Lines */}
    <div className="absolute -top-4 -left-4 h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
    <div className="absolute -top-2 -right-8 h-1 w-1 animate-pulse rounded-full bg-pink-400" />
    <div className="absolute -right-4 -bottom-4 h-3 w-3 animate-pulse rounded-full bg-green-400" />

    {/* Connecting Lines */}
    <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-30">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00FFFF" />
          <stop offset="50%" stopColor="#FF0080" />
          <stop offset="100%" stopColor="#39FF14" />
        </linearGradient>
      </defs>
      <path
        d="M 0,0 Q 50,25 100,0 T 200,0"
        stroke="url(#lineGradient)"
        strokeWidth="1"
        fill="none"
        className="animate-pulse"
      />
    </svg>
  </motion.div>
);

// Input Field Component
interface CyberInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  required?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
}

const CyberInput: React.FC<CyberInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  icon,
  required = false,
  showPasswordToggle = false,
  onTogglePassword,
}) => (
  <div className="group relative">
    <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-cyan-400">
      {React.cloneElement(icon as React.ReactElement, {
        className: 'w-5 h-5',
      })}
    </div>

    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className={`w-full rounded-lg border border-gray-600 bg-gray-900/50 py-4 pr-12 pl-12 font-mono text-white placeholder-gray-400 backdrop-blur-lg transition-all duration-300 ease-in-out group-hover:border-gray-500 focus:border-cyan-400 focus:bg-gray-900/70 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none`}
    />

    {showPasswordToggle && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute top-1/2 right-3 z-10 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-cyan-400"
      >
        {type === 'password' ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    )}

    {/* Input Glow Effect */}
    <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-focus-within:opacity-100">
      <div className="absolute inset-0 animate-pulse rounded-lg border border-cyan-400/50" />
    </div>
  </div>
);

// Demo Credentials Component
const DemoCredentials: React.FC<{ onUseDemo: () => void }> = ({ onUseDemo }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="mt-6 rounded-lg border border-blue-400/30 bg-blue-900/20 p-4"
  >
    <div className="mb-3 flex items-center space-x-2">
      <Terminal className="h-5 w-5 text-blue-400" />
      <h3 className="font-mono font-semibold text-blue-400">Acesso Demo</h3>
    </div>

    <div className="space-y-2 font-mono text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Email:</span>
        <span className="text-blue-400">demo@willfinance.com</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Senha:</span>
        <span className="text-blue-400">demo123</span>
      </div>
    </div>

    <button
      onClick={onUseDemo}
      className="mt-3 w-full rounded-lg border border-blue-400/50 bg-blue-900/30 px-4 py-2 font-mono text-blue-400 transition-all duration-300 hover:border-blue-400 hover:bg-blue-400/10 hover:shadow-lg"
    >
      Usar Credenciais Demo
    </button>
  </motion.div>
);

// System Status Component
const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'maintenance' | 'error'>('online');

  useEffect(() => {
    // Simulate system status check
    const timer = setTimeout(() => setStatus('online'), 1000);
    return () => clearTimeout(timer);
  }, []);

  const statusConfig = {
    online: {
      color: 'text-green-400',
      bg: 'bg-green-900/20 border-green-400/30',
      icon: <Globe className="h-4 w-4" />,
      text: 'Sistemas Online',
    },
    maintenance: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-900/20 border-yellow-400/30',
      icon: <WifiOff className="h-4 w-4" />,
      text: 'Manutenção',
    },
    error: {
      color: 'text-red-400',
      bg: 'bg-red-900/20 border-red-400/30',
      icon: <Shield className="h-4 w-4" />,
      text: 'Sistema Indisponível',
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className={`inline-flex items-center space-x-2 rounded-full px-3 py-1 text-sm ${config.bg}`}
    >
      <div className={`${config.color}`}>{config.icon}</div>
      <span className={`font-mono ${config.color}`}>{config.text}</span>
      <div className={`h-2 w-2 rounded-full ${config.color.replace('text', 'bg')} animate-pulse`} />
    </motion.div>
  );
};

export function CyberLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  // Monitor authentication state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !name)) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
        toast.success('Conta criada com sucesso!');
      } else {
        await login(email, password);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro na autenticação. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@willfinance.com');
    setPassword('demo123');
    toast.success('Credenciais demo aplicadas!');
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-400/10 blur-3xl"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute top-3/4 left-3/4 h-64 w-64 animate-pulse rounded-full bg-green-400/10 blur-3xl"
          style={{ animationDelay: '2s' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                   linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                 `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-md p-6">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <CyberLogo />
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect space-y-6 rounded-2xl p-8"
        >
          {/* Form Header */}
          <div className="space-y-2 text-center">
            <h2 className="font-cyber text-2xl font-bold text-cyan-400">
              {isRegisterMode ? 'CRIAR CONTA' : 'ACESSO SISTEMA'}
            </h2>
            <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <p className="font-mono text-sm text-gray-400">
              {isRegisterMode ? 'Configure sua conta no sistema' : 'Autentique-se para continuar'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <CyberInput
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={setName}
                icon={<UserPlus />}
                required
              />
            )}

            <CyberInput
              type="email"
              placeholder="Email de acesso"
              value={email}
              onChange={setEmail}
              icon={<Mail />}
              required
            />

            <CyberInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha de segurança"
              value={password}
              onChange={setPassword}
              icon={<Lock />}
              required
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full overflow-hidden rounded-lg px-6 py-4 font-mono font-bold tracking-wider uppercase transition-all duration-300 ease-in-out ${
                loading
                  ? 'cursor-not-allowed bg-gray-600 text-gray-400'
                  : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400'
              } `}
              style={{
                boxShadow: loading ? 'none' : '0 0 30px rgba(0, 255, 255, 0.4)',
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
                  <span>Processando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  {isRegisterMode ? (
                    <UserPlus className="h-5 w-5" />
                  ) : (
                    <LogIn className="h-5 w-5" />
                  )}
                  <span>{isRegisterMode ? 'Criar Conta' : 'Acessar Sistema'}</span>
                </div>
              )}
            </motion.button>
          </form>

          {/* Mode Toggle */}
          <div className="text-center">
            <button
              onClick={toggleMode}
              className="font-mono text-sm text-gray-400 transition-colors duration-300 hover:text-cyan-400"
            >
              {isRegisterMode ? 'Já possui conta? Fazer login' : 'Não possui conta? Criar uma'}
            </button>
          </div>

          {/* Demo Credentials */}
          {!isRegisterMode && <DemoCredentials onUseDemo={handleDemoLogin} />}
        </motion.div>

        {/* System Status */}
        <div className="mt-6 text-center">
          <SystemStatus />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-8 space-y-2 text-center"
        >
          <p className="font-mono text-xs text-gray-500">
            WILL FINANCE v5.0 © 2025 - Sistema de Gestão Financeira
          </p>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Cpu className="h-4 w-4" />
            <span className="font-mono text-xs">Powered by React + TypeScript</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Export both components for backward compatibility
export default CyberLoginPage;
export { CyberLoginPage as LoginPage };
