import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useProfile } from './ProfileContext';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  profile_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  user_id?: string;
}

export interface MessageStats {
  total_messages: number;
  unread_messages: number;
  messages_today: number;
  messages_this_week: number;
}

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  unreadCount: number;
  messageStats: MessageStats | null;
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendMessage: (profileId: string, content: string) => Promise<any>;
  deleteMessage: (messageId: string) => Promise<void>;
  deleteMessages: (messageIds: string[]) => Promise<void>;
  refreshMessages: () => void;
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
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch message statistics
  const { data: messageStats } = useQuery({
    queryKey: ['message-stats', profile?.id],
    queryFn: async () => {
      if (!profile) return null;
      const { data, error } = await supabase
        .rpc('get_message_stats', { profile_uuid: profile.id });

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!profile,
    refetchInterval: 60000, // Refetch every minute
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
      queryClient.invalidateQueries({ queryKey: ['message-stats', profile?.id] });
    },
    onError: (error) => {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error('No profile found');
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('profile_id', profile.id)
        .eq('is_read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
      queryClient.invalidateQueries({ queryKey: ['message-stats', profile?.id] });
      toast.success('All messages marked as read');
    },
    onError: (error) => {
      console.error('Error marking all messages as read:', error);
      toast.error('Failed to mark all messages as read');
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ profileId, content }: { profileId: string; content: string }) => {
      try {
        // If user is logged in, include user_id for tracking
        const messageData: any = {
          profile_id: profileId,
          content,
          is_read: false
        };

        if (user) {
          messageData.user_id = user.id;
        }

        const { data, error } = await supabase
          .from('messages')
          .insert(messageData)
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        return data;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['message-stats'] });
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
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
      queryClient.invalidateQueries({ queryKey: ['message-stats', profile?.id] });
      toast.success('Message deleted');
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
    onSuccess: (_, messageIds) => {
      queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
      queryClient.invalidateQueries({ queryKey: ['message-stats', profile?.id] });
      toast.success(`${messageIds.length} messages deleted`);
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
        (payload) => {
          console.log('Real-time message update:', payload);
          queryClient.invalidateQueries({ queryKey: ['messages', profile.id] });
          queryClient.invalidateQueries({ queryKey: ['message-stats', profile.id] });
          
          // Show notification for new messages
          if (payload.eventType === 'INSERT') {
            toast.success('New anonymous message received!', {
              duration: 5000,
              icon: '💬',
            });
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [profile, queryClient]);

  const refreshMessages = () => {
    queryClient.invalidateQueries({ queryKey: ['messages', profile?.id] });
    queryClient.invalidateQueries({ queryKey: ['message-stats', profile?.id] });
  };

  const value = {
    messages,
    loading: isLoading,
    unreadCount,
    messageStats,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    sendMessage: (profileId: string, content: string) => sendMessageMutation.mutateAsync({ profileId, content }),
    deleteMessage: deleteMessageMutation.mutateAsync,
    deleteMessages: deleteMessagesMutation.mutateAsync,
    refreshMessages,
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