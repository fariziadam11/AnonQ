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
      className={`bg-white/80 backdrop-blur-md rounded-xl p-6 border transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-[1.02] ${
        message.is_read
          ? 'border-gray-200/50 hover:border-gray-300/50'
          : 'border-purple-200/50 hover:border-purple-300/50 shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              message.is_read ? 'bg-gray-300' : 'bg-purple-500'
            }`}
          />
          <span className="text-sm text-gray-500">Anonymous</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{formatTime(message.created_at)}</span>
          {message.is_read ? (
            <CheckCheck className="h-4 w-4 text-green-500" />
          ) : (
            <Check className="h-4 w-4" />
          )}
        </div>
      </div>

      <div
        className={`text-gray-800 leading-relaxed ${
          !message.is_read ? 'font-medium' : ''
        }`}
      >
        {message.content}
      </div>

      {!message.is_read && (
        <div className="mt-4 text-sm text-purple-600 font-medium">
          Click to mark as read
        </div>
      )}
    </div>
  );
};