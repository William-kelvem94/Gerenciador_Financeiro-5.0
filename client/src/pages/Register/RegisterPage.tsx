import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData.name, formData.email, formData.password);
    } catch {
      // Error is handled by the store
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Creating your account..." />;
  }

  return (
    <div className="bg-gradient-dark relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="bg-cyber-primary absolute h-1 w-1 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="bg-black-secondary border-cyber-border shadow-glow-lg rounded-xl border p-8">
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-cyber mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            >
              <UserPlus className="text-cyber-dark h-8 w-8" />
            </motion.div>

            <h1 className="font-cyber text-cyber-primary mb-2 text-3xl">Join Will Finance</h1>
            <p className="text-white-secondary">Create your cyberpunk financial account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Full Name</label>
              <div className="relative">
                <User className="text-white-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`focus:ring-cyber-primary w-full rounded-lg border bg-black py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 ${
                    errors.name ? 'border-cyber-danger' : 'border-cyber-border'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="text-cyber-danger mt-1 text-sm">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Email Address</label>
              <div className="relative">
                <Mail className="text-white-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`focus:ring-cyber-primary w-full rounded-lg border bg-black py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 ${
                    errors.email ? 'border-cyber-danger' : 'border-cyber-border'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="text-cyber-danger mt-1 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Password</label>
              <div className="relative">
                <Lock className="text-white-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`focus:ring-cyber-primary w-full rounded-lg border bg-black py-3 pr-12 pl-10 transition-all focus:border-transparent focus:ring-2 ${
                    errors.password ? 'border-cyber-danger' : 'border-cyber-border'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white-muted absolute top-1/2 right-3 -translate-y-1/2 transform hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-cyber-danger mt-1 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">Confirm Password</label>
              <div className="relative">
                <Lock className="text-white-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`focus:ring-cyber-primary w-full rounded-lg border bg-black py-3 pr-12 pl-10 transition-all focus:border-transparent focus:ring-2 ${
                    errors.confirmPassword ? 'border-cyber-danger' : 'border-cyber-border'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-white-muted absolute top-1/2 right-3 -translate-y-1/2 transform hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-cyber-danger mt-1 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="bg-gradient-cyber text-cyber-dark hover:shadow-glow w-full rounded-lg px-4 py-3 font-semibold transition-all duration-200"
            >
              Create Account
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-cyber-primary hover:text-cyber-secondary transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
