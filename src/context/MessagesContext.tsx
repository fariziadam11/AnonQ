import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProfile } from './ProfileContext';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  profile_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (messageId: string) => Promise<void>;
  sendMessage: (profileId: string, content: string) => Promise<any>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile) return;

    let mounted = true;
    let channel: any = null;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('profile_id', profile.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted) {
          setMessages(data || []);
          setUnreadCount(data?.filter((msg) => !msg.is_read).length || 0);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        if (mounted) {
          toast.error('Failed to load messages');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const setupSubscription = () => {
      // Remove any existing channel first
      if (channel) {
        supabase.removeChannel(channel);
      }

      let retryCount = 0;
      const maxRetries = 3; // Reduce max retries
      const baseDelay = 2000; // Start with 2 seconds
      let isConnecting = false;

      const attemptConnection = () => {
        if (!mounted || isConnecting) return;
        isConnecting = true;

        try {
          channel = supabase
            .channel('messages', {
              config: {
                broadcast: { self: true },
                presence: { key: profile?.id },
              },
            })
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'messages',
                filter: `profile_id=eq.${profile.id}`,
              },
              (payload) => {
                if (!mounted) return;

                if (payload.eventType === 'INSERT') {
                  setMessages((prev) => [payload.new as Message, ...prev]);
                  setUnreadCount((prev) => prev + 1);
                } else if (payload.eventType === 'UPDATE') {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === payload.new.id ? (payload.new as Message) : msg
                    )
                  );
                  if (!(payload.new as Message).is_read) {
                    setUnreadCount((prev) => prev + 1);
                  }
                }
              }
            )
            .subscribe((status, err) => {
              isConnecting = false;
              
              if (status === 'SUBSCRIBED') {
                console.log('Successfully subscribed to messages channel');
                retryCount = 0; // Reset retry count on successful connection
              } else if (status === 'CHANNEL_ERROR') {
                console.error('Channel error:', err);
                handleReconnection();
              } else if (status === 'CLOSED') {
                console.log('Channel closed, attempting to reconnect...');
                handleReconnection();
              }
            });
        } catch (error) {
          console.error('Error setting up subscription:', error);
          isConnecting = false;
          handleReconnection();
        }
      };

      const handleReconnection = () => {
        if (!mounted || retryCount >= maxRetries) {
          console.log('Max retries reached, stopping reconnection attempts');
          return;
        }

        const delay = Math.min(baseDelay * Math.pow(2, retryCount), 10000); // Max 10 seconds
        retryCount++;

        console.log(`Attempting to reconnect in ${delay}ms (attempt ${retryCount}/${maxRetries})`);
        
        setTimeout(() => {
          if (mounted) {
            attemptConnection();
          }
        }, delay);
      };

      attemptConnection();
    };

    fetchMessages();
    setupSubscription();

    return () => {
      mounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [profile]);

  const markAsRead = async (messageId: string) => {
    try {
      if (!profile) throw new Error('No profile found');

      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId)
        .eq('profile_id', profile.id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const sendMessage = async (profileId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          profile_id: profileId,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const value = {
    messages,
    loading,
    unreadCount,
    markAsRead,
    sendMessage,
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