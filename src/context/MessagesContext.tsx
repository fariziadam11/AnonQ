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

// Tambahkan perhitungan statistik pesan
type MessageStats = {
  total_messages: number;
  unread_messages: number;
  messages_today: number;
  messages_this_week: number;
};

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (messageId: string) => Promise<void>;
  sendMessage: (profileId: string, content: string, messageType?: 'anonymous' | 'user_to_user') => Promise<any>;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteMessages: (messageIds: string[]) => Promise<void>;
  refreshMessages: () => void;
  messageStats: MessageStats;
  markAllAsRead: () => Promise<void>;
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
    mutationKey: ['messages-mark-as-read'],
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
    mutationKey: ['messages-send'],
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
          // For anonymous messages, we don't use .select() because the anon role
          // does not have SELECT permissions, which would cause the entire query to fail.
          const { error } = await supabase
            .from('messages')
            .insert(insertData);
            
          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          return null; // Return null as we are not selecting the data
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
    mutationKey: ['messages-delete'],
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
    mutationKey: ['messages-delete-multiple'],
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

  // Tambahkan fungsi refreshMessages
  const refreshMessages = () => {
    queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
    toast.success('Pesan berhasil diperbarui!');
  };

  // Tambahkan perhitungan statistik pesan
  const messageStats: MessageStats = React.useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    // Cari hari pertama minggu ini (Minggu)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const weekString = startOfWeek.toISOString().slice(0, 10);

    return {
      total_messages: messages.length,
      unread_messages: messages.filter((msg) => !msg.is_read).length,
      messages_today: messages.filter((msg) => msg.created_at.slice(0, 10) === today).length,
      messages_this_week: messages.filter((msg) => msg.created_at.slice(0, 10) >= weekString).length,
    };
  }, [messages]);

  // Tambahkan fungsi markAllAsRead
  const markAllAsRead = async () => {
    if (!profile) return;
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('profile_id', profile.id)
      .eq('is_read', false);
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['messages', profile.id] });
  };

  const value = {
    messages,
    loading: isLoading,
    unreadCount,
    markAsRead: markAsReadMutation.mutateAsync,
    sendMessage: (profileId: string, content: string, messageType?: 'anonymous' | 'user_to_user') => sendMessageMutation.mutateAsync({ profileId, content, messageType }),
    deleteMessage: deleteMessageMutation.mutateAsync,
    deleteMessages: deleteMessagesMutation.mutateAsync,
    refreshMessages,
    messageStats,
    markAllAsRead,
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