import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { PhoenixLogo } from '../../components/ui/PhoenixLogo';
import { Lock, Mail, Eye, EyeOff, Zap, Sparkles } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, user } = useAuthStore();
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
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos!');
      return;
    }

    console.log('🔑 Tentando fazer login com:', { email, password });
    setLoading(true);
    try {
      await login(email, password);
      console.log('✅ Login realizado com sucesso');
      toast.success('Login realizado com sucesso!');
      // Não chamar navigate aqui - o useEffect vai cuidar disso
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@willfinance.com');
    setPassword('demo123');
    toast.success('Credenciais demo carregadas!');
  };

  const testDirectLogin = async () => {
    console.log('🧪 Teste direto de login');
    try {
      await login('demo@willfinance.com', 'demo123');
      console.log('✅ Login direto funcionou');
    } catch (error) {
      console.error('❌ Login direto falhou:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Main Login Card - BLOCO UNIFICADO COMO SOLICITADO */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        {/* Bloco Principal Suspenso */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-400/40 rounded-2xl p-10 shadow-2xl">
          {/* Efeito de Brilho do Bloco */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl" />
          <div className="absolute inset-0 shadow-[0_0_50px_rgba(0,255,255,0.3)] rounded-2xl" />
          
          {/* Conteúdo do Bloco */}
          <div className="relative z-10 space-y-8">
            
            {/* LOGO DESTACADA NO CENTRO */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <PhoenixLogo size="hero" />
              </div>
              <h1 className="text-3xl font-cyber bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                WILL FINANCE
              </h1>
              <p className="text-gray-400 text-base font-mono">
                Sistema Phoenix v5.0
              </p>
            </div>

            {/* Formulário de Login - Organizado no bloco */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                  📧 Email de Acesso
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-gray-600 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">
                  🔒 Senha Segura
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-gray-800/60 border border-gray-600 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botão Demo */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs text-yellow-400 hover:text-yellow-300 font-mono bg-gray-800/40 px-3 py-1 rounded border border-yellow-400/30 hover:border-yellow-400/60 transition-all"
                >
                  ⚡ Usar dados demo
                </button>
              </div>

              {/* Botão de Login */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-70 text-sm shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>AUTENTICANDO...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>INICIAR SESSÃO</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Info Demo - Compacta dentro do bloco */}
            <div className="bg-gray-800/40 rounded-lg p-4 border border-yellow-400/20">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Demo</span>
              </div>
              <div className="text-center space-y-1 text-xs text-gray-400 font-mono">
                <div>📧 demo@willfinance.com</div>
                <div>🔑 demo123</div>
              </div>
            </div>

            {/* Debug Panel - Temporário */}
            <div className="bg-red-900/20 rounded-lg p-3 border border-red-500/30">
              <div className="text-xs text-red-400 font-mono space-y-1">
                <div>🔍 Debug Info:</div>
                <div>isAuthenticated: {isAuthenticated ? '✅ true' : '❌ false'}</div>
                <div>user: {user ? `✅ ${user.name}` : '❌ null'}</div>
                <div>loading: {loading ? '⏳ true' : '✅ false'}</div>
                <button
                  onClick={testDirectLogin}
                  className="mt-2 px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs"
                >
                  🧪 Teste Login Direto
                </button>
              </div>
            </div>

            {/* Footer do Bloco */}
            <div className="text-center">
              <p className="text-xs text-gray-500 font-mono">
                Phoenix Financial System v5.0
              </p>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}