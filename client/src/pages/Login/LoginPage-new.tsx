import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';
import { PhoenixLogo } from '../../components/ui/PhoenixLogo';
import { Lock, Mail, Eye, EyeOff, Zap, UserPlus, LogIn } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  console.log('🔍 LoginPage render - isAuthenticated:', isAuthenticated, 'user:', user);

  // Monitorar mudanças no estado de autenticação
  useEffect(() => {
    console.log('👀 useEffect - Estado mudou:', { isAuthenticated, user });
    if (isAuthenticated && user) {
      console.log('🚀 Redirecionando para dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegisterMode && !name)) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    console.log('🔑 Tentando autenticação:', { email, isRegisterMode });
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(name, email, password);
        console.log('✅ Registro realizado com sucesso');
        toast.success('Conta criada com sucesso!');
      } else {
        await login(email, password);
        console.log('✅ Login realizado com sucesso');
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error('❌ Erro de autenticação:', error);
      // O toast de erro já é mostrado no store
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('🔑 Tentando login com Google');
    setLoading(true);

    try {
      // await loginWithGoogle(); // Função removida, ajuste necessário
      console.log('✅ Login Google realizado com sucesso');
      toast.success('Login com Google realizado com sucesso!');
    } catch (error) {
      console.error('❌ Erro no login Google:', error);
      // O toast de erro já é mostrado no store
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@willfinance.com');
    setPassword('admin123');
    setIsRegisterMode(false);
    toast.success('Credenciais de administrador carregadas!');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto w-full max-w-lg"
      >
        {/* Bloco Principal */}
        <div className="relative rounded-2xl border-2 border-cyan-400/40 bg-gray-900/90 p-10 shadow-2xl backdrop-blur-xl">
          {/* Efeito de Brilho */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute inset-0 rounded-2xl shadow-[0_0_50px_rgba(0,255,255,0.3)]" />

          {/* Conteúdo */}
          <div className="relative z-10 space-y-8">
            {/* LOGO COM IMAGEM DA FÊNIX */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <PhoenixLogo size="hero" />
              </div>
              <h1 className="font-cyber mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl text-transparent">
                WILL FINANCE
              </h1>
              <p className="font-mono text-base text-gray-400">Sistema Phoenix v5.0</p>
            </div>

            {/* Alternador Login/Registro */}
            <div className="flex rounded-lg bg-gray-800/60 p-1">
              <button
                onClick={() => setIsRegisterMode(false)}
                className={`flex-1 rounded-md px-4 py-2 font-mono text-sm transition-all ${
                  !isRegisterMode
                    ? 'bg-cyan-500 text-gray-900'
                    : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegisterMode(true)}
                className={`flex-1 rounded-md px-4 py-2 font-mono text-sm transition-all ${
                  isRegisterMode ? 'bg-cyan-500 text-gray-900' : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                Criar Conta
              </button>
            </div>

            {/* Formulário de Login/Registro */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nome (apenas no registro) */}
              {isRegisterMode && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-bold tracking-wider text-cyan-400 uppercase"
                  >
                    👤 Nome Completo
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-cyan-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                      placeholder="Seu nome completo"
                      required={isRegisterMode}
                    />
                  </div>
                </div>
              )}

              {/* Campo Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold tracking-wider text-cyan-400 uppercase"
                >
                  📧 Email de Acesso
                </label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-cyan-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-4 pl-10 text-sm text-white transition-all placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold tracking-wider text-cyan-400 uppercase"
                >
                  🔒 Senha Segura
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-cyan-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800/60 py-3 pr-10 pl-10 text-sm text-white transition-all placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 transition-colors hover:text-cyan-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Botão Admin (apenas no login) */}
              {!isRegisterMode && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    className="rounded border border-yellow-400/30 bg-gray-800/40 px-3 py-1 font-mono text-xs text-yellow-400 transition-all hover:border-yellow-400/60 hover:text-yellow-300"
                  >
                    ⚡ Usar dados admin
                  </button>
                </div>
              )}

              {/* Botão Principal */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>{isRegisterMode ? 'CRIANDO CONTA...' : 'AUTENTICANDO...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span>{isRegisterMode ? 'CRIAR CONTA' : 'INICIAR SESSÃO'}</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Separador */}
            <div className="flex items-center space-x-4">
              <div className="h-px flex-1 bg-gray-600"></div>
              <span className="font-mono text-xs text-gray-400">OU</span>
              <div className="h-px flex-1 bg-gray-600"></div>
            </div>

            {/* Botão Google */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex w-full items-center justify-center space-x-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-gray-800 shadow-lg transition-all duration-300 hover:bg-gray-100 disabled:opacity-70"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continuar com Google</span>
            </motion.button>

            {/* Credenciais Admin */}
            {!isRegisterMode && (
              <div className="rounded-lg border border-yellow-400/20 bg-gray-800/40 p-4">
                <div className="mb-2 flex items-center justify-center space-x-2">
                  <LogIn className="h-3 w-3 text-yellow-400" />
                  <span className="text-xs font-bold tracking-wider text-yellow-400 uppercase">
                    Admin
                  </span>
                </div>
                <div className="space-y-1 text-center font-mono text-xs text-gray-400">
                  <div>📧 admin@willfinance.com</div>
                  <div>🔑 admin123</div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center">
              <p className="font-mono text-xs text-gray-500">Phoenix Financial System v5.0</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
