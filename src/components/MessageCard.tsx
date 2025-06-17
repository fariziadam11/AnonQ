import React from 'react';
import { Clock, Check, CheckCheck } from 'lucide-react';
import { Database } from '../lib/supabase';

type Message = Database['public']['Tables']['messages']['Row'];

interface MessageCardProps {
  message: Message;
  onMarkAsRead?: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onMarkAsRead,
}) => {
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

  const handleClick = () => {
    if (!message.is_read && onMarkAsRead) {
      onMarkAsRead(message.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white dark:bg-neoDark rounded-neo p-6 border-2 border-neoDark dark:border-white shadow-neo cursor-pointer hover:scale-[1.02] transition-all duration-200 ${
        message.is_read
          ? 'opacity-80'
          : 'bg-neoAccent/10 dark:bg-neoAccent2/20 border-neoAccent2 dark:border-neoAccent2 shadow-neo-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full border-2 border-neoDark dark:border-white ${
              message.is_read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-neoAccent2 dark:bg-neoAccent3'
            }`}
          />
          <span className="text-sm text-neoDark dark:text-white font-bold">Anonymous</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-neoDark dark:text-white font-bold">
          <Clock className="h-4 w-4" />
          <span>{formatTime(message.created_at)}</span>
          {message.is_read ? (
            <CheckCheck className="h-4 w-4 text-neoAccent3 dark:text-neoAccent" />
          ) : (
            <Check className="h-4 w-4 text-neoAccent2 dark:text-neoAccent3" />
          )}
        </div>
      </div>

      <div
        className={`text-neoDark dark:text-white leading-relaxed text-lg ${
          !message.is_read ? 'font-extrabold' : 'font-medium'
        }`}
      >
        {message.content}
      </div>

      {!message.is_read && (
        <div className="mt-4 text-sm text-neoAccent2 dark:text-neoAccent3 font-bold">
          Click to mark as read
        </div>
      )}
    </div>
  );
};