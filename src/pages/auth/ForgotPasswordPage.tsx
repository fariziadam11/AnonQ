import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();

  // Cek jika ada access_token di URL (hash fragment)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      setHasToken(true);
    }
  }, []);

  // Step 1: Send reset link
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/forgot-password',
      });
      if (error) throw error;
      toast.success('Reset link sent to your email!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Set new password (if access_token in URL)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neoBg dark:bg-neoDark">
      <div className="w-full max-w-md bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-8">
        <h2 className="text-2xl font-extrabold text-neoDark dark:text-white mb-6 text-center">Forgot Password</h2>
        {!hasToken ? (
          <form onSubmit={handleSendLink} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neoDark dark:text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border-2 border-neoDark dark:border-white rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neoAccent2 text-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-neoDark dark:text-white mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neoAccent2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 border-2 border-neoDark dark:border-white rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-neoAccent2 text-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 