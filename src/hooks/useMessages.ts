import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../context/ProfileContext';
import toast from 'react-hot-toast';

export interface Message {
  id: string;
  profile_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  reply_to?: string;
  reply_content?: string;
}

export const useMessages = () => {
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

      channel = supabase
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
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Successfully subscribed to messages channel');
          }
        });
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

  const sendReply = async (messageId: string, replyContent: string) => {
    try {
      if (!profile) throw new Error('No profile found');

      const { error } = await supabase
        .from('messages')
        .update({
          reply_content: replyContent,
          reply_to: messageId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('profile_id', profile.id);

      if (error) throw error;

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, reply_content: replyContent, reply_to: messageId }
            : msg
        )
      );

      return true;
    } catch (error) {
      console.error('Error sending reply:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    unreadCount,
    markAsRead,
    sendReply,
  };
};