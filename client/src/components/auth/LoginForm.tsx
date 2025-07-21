import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, Chrome } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithGoogle, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Error handled by store and displayed to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch {
      // Error handled by store and displayed to user
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    clearError();
  }, [clearError]);

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mb-4"
          >
            <span className="text-white text-2xl font-bold">WF</span>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgb(var(--foreground))' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'rgb(var(--muted-foreground))' }}>
            Sign in to your Will Finance account
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-8 shadow-xl"
          style={{ 
            backgroundColor: 'rgba(var(--card), 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(var(--border), 0.3)'
          }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-lg border"
              style={{ 
                backgroundColor: 'rgba(var(--destructive), 0.1)',
                borderColor: 'rgb(var(--destructive))',
                color: 'rgb(var(--destructive))'
              }}
            >
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Google Login Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full mb-6 px-4 py-3 rounded-lg flex items-center justify-center gap-3 transition-all hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              border: '1px solid rgb(var(--border))',
              backgroundColor: 'rgba(var(--card), 0.5)',
              color: 'rgb(var(--foreground))'
            }}
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </motion.button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'rgb(var(--border))' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2" 
                    style={{ 
                      backgroundColor: 'rgba(var(--card), 0.8)', 
                      color: 'rgb(var(--muted-foreground))' 
                    }}>
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" 
                     style={{ color: 'rgb(var(--foreground))' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                      style={{ color: 'rgb(var(--muted-foreground))' }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 transition-all"
                  style={{
                    border: '1px solid rgb(var(--border))',
                    backgroundColor: 'rgba(var(--input), 0.5)',
                    color: 'rgb(var(--foreground))',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px rgb(var(--ring))`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2"
                     style={{ color: 'rgb(var(--foreground))' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                      style={{ color: 'rgb(var(--muted-foreground))' }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg focus:ring-2 transition-all"
                  style={{
                    border: '1px solid rgb(var(--border))',
                    backgroundColor: 'rgba(var(--input), 0.5)',
                    color: 'rgb(var(--foreground))',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 2px rgb(var(--ring))`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: 'rgb(var(--muted-foreground))' }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded focus:ring-2"
                  style={{ 
                    accentColor: 'rgb(var(--primary))',
                    borderColor: 'rgb(var(--border))'
                  }}
                />
                <span className="ml-2 text-sm" style={{ color: 'rgb(var(--muted-foreground))' }}>
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm transition-colors hover:underline"
                style={{ color: 'rgb(var(--primary))' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full gradient-primary text-white py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover-glow"
              style={{ 
                color: 'rgb(var(--primary-foreground))'
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Demo Credentials:
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>📧 admin@willfinance.com | 🔑 admin123</p>
              <p>📧 user@willfinance.com | 🔑 user123</p>
              <p>📧 williamkelvem64@gmail.com | 🔑 123456789</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
