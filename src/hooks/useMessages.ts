import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useProfile } from '../context/ProfileContext';

type Message = Database['public']['Tables']['messages']['Row'];

export const useMessages = () => {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchMessages();
      setupRealtimeSubscription();
    }
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
    if (!profile) return;

    const subscription = supabase
      .channel('messages')
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

    return () => subscription.unsubscribe();
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

  return {
    messages,
    loading,
    sendMessage,
    markAsRead,
    unreadCount,
  };
};