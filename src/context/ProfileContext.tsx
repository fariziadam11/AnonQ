import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './AuthContext';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  getProfileByUsername: (username: string) => Promise<Profile | null>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch profile query
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Get profile by username query
  const getProfileByUsername = async (username: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    // Gracefully handle profile not found (PGRST116) by returning null
    // For other errors, re-throw them to be handled by the caller
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile by username:', error);
      throw error;
    }

    return data;
  };

  // Set up real-time subscription for profile updates
  React.useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('profile')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, queryClient]);

  const value = {
    profile,
    loading: isLoading,
    getProfileByUsername,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};