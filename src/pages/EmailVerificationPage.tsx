import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Mail } from 'lucide-react';

const EmailVerificationPage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCheckVerification = async () => {
    setChecking(true);
    setError(null);
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setError('Gagal memeriksa status email. Silakan coba lagi.');
      setChecking(false);
      return;
    }
    const user = data.user;
    // Supabase v2: email_confirmed_at, v1: confirmed_at
    const isVerified = user?.email_confirmed_at || user?.confirmed_at;
    if (isVerified) {
      // Redirect ke login/dashboard
      navigate('/login');
    } else {
      setError('Email kamu belum terverifikasi. Silakan cek email dan klik link verifikasi.');
    }
    setChecking(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neoBg dark:bg-neoDark">
      <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-8 max-w-md w-full text-center">
        <Mail className="h-12 w-12 mx-auto text-neoAccent2 dark:text-neoAccent3 mb-4" />
        <h2 className="text-2xl font-extrabold text-neoDark dark:text-white mb-2">Verifikasi Email</h2>
        <p className="text-neoDark/70 dark:text-white/70 mb-6">
          Kami telah mengirimkan email verifikasi ke alamat email kamu.<br />
          Silakan cek inbox (atau folder spam) dan klik link verifikasi.
        </p>
        <button
          onClick={handleCheckVerification}
          disabled={checking}
          className="w-full bg-neoAccent2 dark:bg-neoAccent3 text-white dark:text-neoDark py-3 px-4 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-extrabold hover:bg-neoAccent3 hover:text-neoDark dark:hover:bg-neoAccent2 dark:hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {checking ? 'Memeriksa...' : 'Saya sudah verifikasi email'}
        </button>
        {error && <div className="text-red-500 font-bold mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default EmailVerificationPage; 