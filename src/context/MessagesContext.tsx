import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useProfile } from './ProfileContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  profile_id: string;
  sender_id: string | null;
  sender_profile_id: string | null;
  content: string;
  is_read: boolean;
  message_type: 'anonymous' | 'user_to_user';
  created_at: string;
}

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (messageId: string) => Promise<void>;
  sendMessage: (profileId: string, content: string, messageType?: 'anonymous' | 'user_to_user') => Promise<any>;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteMessages: (messageIds: string[]) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useProfile();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages query
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', profile?.id],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!profile,
  });

  // Calculate unread count
  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('profile_id', profile?.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
    },
    onError: (error) => {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ profileId, content, messageType }: { profileId: string; content: string; messageType?: 'anonymous' | 'user_to_user' }) => {
      try {
        if (messageType === 'user_to_user') {
          if (!profile || !user) throw new Error('No profile found');
          let insertData: any = {
            profile_id: profileId,
            content,
            is_read: false,
            message_type: 'user_to_user',
            sender_id: user.id,
            sender_profile_id: profile.id,
          };
          console.log('Insert user-to-user:', { insertData, user, profile });
          const { data, error } = await supabase
            .from('messages')
            .insert(insertData)
            .select()
            .single();
          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          return data;
        } else {
          // Anonymous message, allow guest (no profile/user required)
          let insertData: any = {
            profile_id: profileId,
            content,
            is_read: false,
            message_type: 'anonymous',
            sender_id: null,
            sender_profile_id: null,
          };
          console.log('Insert anonymous:', { insertData });
          const { data, error } = await supabase
            .from('messages')
            .insert(insertData)
            .select()
            .single();
          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          return data;
        }
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
      if (error.message === 'No profile found') {
        toast.error('Profile tidak ditemukan');
      } else if (error.message === 'You must be logged in to send user-to-user messages') {
        toast.error('Anda harus login untuk mengirim pesan user-to-user');
      } else {
        toast.error('Gagal mengirim pesan. Silakan coba lagi.');
      }
    },
  });
  
  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      if (!profile) throw new Error('No profile found');

      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('profile_id', profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    },
  });

  // Delete messages mutation
  const deleteMessagesMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      if (!profile) throw new Error('No profile found');

      const { error } = await supabase
        .from('messages')
        .delete()
        .in('id', messageIds)
        .eq('profile_id', profile.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
    },
    onError: (error) => {
      console.error('Error deleting messages:', error);
      toast.error('Failed to delete messages');
    },
  });

  // Set up real-time subscription
  React.useEffect(() => {
    if (!profile) return;

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `profile_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['messages', profile.id] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [profile, queryClient]);

  const value = {
    messages,
    loading: isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutateAsync,
    sendMessage: (profileId: string, content: string, messageType?: 'anonymous' | 'user_to_user') => sendMessageMutation.mutateAsync({ profileId, content, messageType }),
    deleteMessage: deleteMessageMutation.mutateAsync,
    deleteMessages: deleteMessagesMutation.mutateAsync,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};