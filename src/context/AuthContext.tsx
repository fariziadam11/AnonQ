import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updatePassword: (params: { oldPassword: string; newPassword: string }) => Promise<void>;
  deleteUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) throw error;
    // Setelah sign up berhasil, langsung insert ke profiles
    const user = data.user;
    if (user) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, username });
      if (insertError) throw insertError;
    }
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // After successful login, check if profile exists, if not, create it
    const user = data.user;
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (profileError) throw profileError;
      if (!profile) {
        // Try to get username from localStorage (set during sign up)
        let username = localStorage.getItem('pending_username') || '';
        if (!username) username = user.email?.split('@')[0] || '';
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ user_id: user.id, username });
        if (insertError) throw insertError;
        localStorage.removeItem('pending_username');
      }
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updatePassword = async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
    if (!user) throw new Error('Not authenticated');
    const email = user.email;
    if (!email) throw new Error('No email found');
    // Re-authenticate user
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: oldPassword });
    if (signInError) throw new Error('Current password is incorrect.');
    // Update password
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const deleteUser = async () => {
    if (!user) throw new Error('Not authenticated');
    // Soft delete: update is_deleted = true
    const { error } = await supabase.from('profiles').update({ is_deleted: true }).eq('user_id', user.id);
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updatePassword,
    deleteUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};