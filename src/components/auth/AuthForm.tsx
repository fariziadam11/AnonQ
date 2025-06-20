import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { validateUsername } from '../../lib/supabase';

interface AuthFormProps {
  onSuccess?: () => void;
  mode?: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, mode }) => {
  const [isLogin, setIsLogin] = useState(mode ? mode === 'login' : true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        if (!formData.username.trim()) {
          toast.error('Username is required');
          return;
        }
        
        // Check if username contains only valid characters
        if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
          toast.error('Username can only contain letters, numbers, hyphens, and underscores');
          return;
        }

        // Backend validation (Supabase RPC)
        const isValid = await validateUsername(formData.username);
        if (!isValid) {
          toast.error('Username is not valid (must be 3-50 chars, only a-z, A-Z, 0-9, _ )');
          return;
        }

        await signUp(formData.email, formData.password, formData.username);
        toast.success('Account created successfully!');
        localStorage.setItem('pending_username', formData.username);
        navigate('/verify-email');
        return;
      }
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-neoDark dark:text-white drop-shadow-sm">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-neoDark/70 dark:text-white/70 mt-2">
            {isLogin
              ? 'Sign in to access your anonymous messages'
              : 'Join AnonQ to start receiving anonymous messages'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-neoDark dark:text-white mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-neoDark dark:border-white rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo"
                  placeholder="Choose a unique username"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-neoDark dark:text-white mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border-2 border-neoDark dark:border-white rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo"
                placeholder="Enter your real email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neoDark dark:text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border-2 border-neoDark dark:border-white rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neoAccent2 hover:text-neoAccent3"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neoAccent2 text-white py-3 px-4 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-extrabold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
          {isLogin && (
            <div className="mt-4 text-center">
              <a href="/forgot-password" className="text-neoAccent2 hover:underline font-bold">Forgot Password?</a>
            </div>
          )}
        </form>

        {!mode && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin((prev) => !prev)}
              className="text-neoAccent2 hover:text-neoAccent3 font-bold transition-colors duration-200"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};