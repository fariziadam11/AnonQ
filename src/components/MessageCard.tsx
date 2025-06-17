import React from 'react';
import { Clock, Check, CheckCheck } from 'lucide-react';
import { Database } from '../lib/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

export interface MessageCardProps {
  message: {
    id: string;
    profile_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
  };
  onMarkAsRead: (messageId: string) => Promise<void>;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onMarkAsRead }) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = async () => {
    if (!message.is_read) {
      await onMarkAsRead(message.id);
    }
  };

  return (
    <div
      className={`p-4 rounded-neo border-2 ${
        message.is_read
          ? 'border-neoDark/20 dark:border-white/20 bg-white/50 dark:bg-neoDark/50'
          : 'border-neoDark dark:border-white bg-white dark:bg-neoDark'
      } shadow-neo transition-all duration-200`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-neoDark dark:text-white whitespace-pre-wrap break-words">{message.content}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-neoDark/50 dark:text-white/50">
            <Clock className="h-4 w-4" />
            <span>{formatTime(message.created_at)}</span>
            {message.is_read ? (
              <div className="flex items-center gap-1">
                <CheckCheck className="h-4 w-4" />
                <span>Read</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Unread</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {!message.is_read && (
            <button
              onClick={handleMarkAsRead}
              className="p-2 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200"
              title="Mark as read"
            >
              <CheckCheck className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};