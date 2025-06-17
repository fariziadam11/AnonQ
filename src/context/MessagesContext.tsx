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
  deleteMessage: (messageId: string) => Promise<void>;
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

    // Initial fetch
    fetchMessages();

    // Set up real-time subscription
    const subscription = supabase
      .channel('messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          if (mounted) {
            if (payload.eventType === 'INSERT') {
              setMessages((prev) => [payload.new as Message, ...prev]);
              if (!(payload.new as Message).is_read) {
                setUnreadCount((prev) => prev + 1);
              }
            } else if (payload.eventType === 'DELETE') {
              setMessages((prev) => prev.filter((msg) => msg.id !== payload.old.id));
              if (!(payload.old as Message).is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
              }
            } else if (payload.eventType === 'UPDATE') {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === payload.new.id ? (payload.new as Message) : msg
                )
              );
              if (!(payload.old as Message).is_read && (payload.new as Message).is_read) {
                setUnreadCount((prev) => Math.max(0, prev - 1));
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
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

  const deleteMessage = async (messageId: string) => {
    try {
      if (!profile) throw new Error('No profile found');

      console.log('Attempting to delete message:', { messageId, profileId: profile.id });

      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId)
        .eq('profile_id', profile.id)
        .select();

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Delete response:', data);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
      throw error;
    }
  };

  const value = {
    messages,
    loading,
    unreadCount,
    markAsRead,
    sendMessage,
    deleteMessage,
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