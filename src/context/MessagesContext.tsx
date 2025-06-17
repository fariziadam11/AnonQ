import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useProfile } from './ProfileContext';

// Message type
export type Message = Database['public']['Tables']['messages']['Row'];

interface MessagesContextType {
  messages: Message[];
  loading: boolean;
  sendMessage: (profileId: string, content: string) => Promise<any>;
  markAsRead: (messageId: string) => Promise<void>;
  unreadCount: number;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    fetchMessages();
    const cleanup = setupRealtimeSubscription();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const fetchMessages = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('profile_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!profile) return undefined;

    const subscription = supabase
      .channel(`messages-${profile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `profile_id=eq.${profile.id}`,
        },
        (payload) => {
          setMessages((current) => [payload.new as Message, ...current]);
        }
      )
      .subscribe();

    // Return cleanup function
    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (profileId: string, content: string) => {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        profile_id: profileId,
        content,
      });

    if (error) throw error;
    return data;
  };

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;

    setMessages((current) =>
      current.map((msg) =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      )
    );
  };

  const unreadCount = messages.filter((msg) => !msg.is_read).length;

  const value: MessagesContextType = {
    messages,
    loading,
    sendMessage,
    markAsRead,
    unreadCount,
  };

  return (
    <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
}; 