import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { apiService } from '@/services/api'
import { firebaseAuthService } from '@/services/firebaseAuth'
import { PhoenixLogo } from '@/components/PhoenixLogo'

// Schema de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const response = await apiService.login(data.email, data.password)
      
      // Extrair dados do usuário e tokens da resposta
      const user = {
        id: response.data.user.id,
        email: response.data.user.email,
        username: response.data.user.username ?? response.data.user.email.split('@')[0],
        firstName: response.data.user.firstName ?? response.data.user.name?.split(' ')[0] ?? 'Usuário',
        lastName: response.data.user.lastName ?? response.data.user.name?.split(' ').slice(1).join(' ') ?? '',
        avatar: response.data.user.avatar,
      }
      
      // Login bem-sucedido - usar tokens reais da API
      login(user, response.data.token, response.data.token) // usando mesmo token para access e refresh por enquanto
      toast.success('Login realizado com sucesso!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Tentar primeiro com Firebase
      try {
        const result = await firebaseAuthService.signInWithGoogle()
        
        if (result.user) {
          // Get Firebase ID token
          const idToken = await result.user.getIdToken()
          
          // Send Firebase token to our backend
          const response = await apiService.loginWithFirebase(idToken)
          
          // Login successful
          login(response.data.user, response.data.accessToken, response.data.refreshToken)
          toast.success('Login com Google realizado com sucesso!')
          navigate('/dashboard')
          return
        }
      } catch (firebaseError: any) {
        console.warn('🔥 Firebase login falhou, tentando OAuth direto:', firebaseError)
        
        // Fallback para OAuth direto
        const { googleOAuthService } = await import('@/services/googleOAuth')
        const result = await googleOAuthService.signIn()
        
        if (result) {
          // Enviar dados do usuário para backend
          const response = await fetch('/api/auth/google/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: result,
              source: 'oauth'
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            login(data.user, data.tokens.accessToken, data.tokens.refreshToken)
            toast.success('Login com Google realizado com sucesso!')
            navigate('/dashboard')
            return
          }
        }
      }
      
    } catch (error: any) {
      console.error('Google login error:', error)
      toast.error('Erro ao fazer login com Google. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <PhoenixLogo size="xl" animate={true} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Will Finance</h1>
            <p className="text-gray-400">Powered by Fênix IA</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="w-full pl-10 pr-12 py-3 bg-black/30 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black" />
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-green-500/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/20 text-gray-400">ou</span>
              </div>
            </div>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-800" />
            ) : (
              <>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </>
            )}
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
