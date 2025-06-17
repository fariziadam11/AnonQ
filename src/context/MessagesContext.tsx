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
    let pollInterval: NodeJS.Timeout;

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

    // Set up polling every 30 seconds
    pollInterval = setInterval(fetchMessages, 30000);

    return () => {
      mounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
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