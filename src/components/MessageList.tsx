import React, { useState } from 'react';
import { MessageCard } from './MessageCard';
import { Database } from '../lib/supabase';
import { CheckSquare, X } from 'lucide-react';

type Message = Database['public']['Tables']['messages']['Row'];

interface MessageListProps {
  messages: Message[];
  onMarkAsRead: (messageId: string) => Promise<void>;
  onDeleteSelected?: (messageIds: string[]) => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMarkAsRead,
  onDeleteSelected
}) => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => {
      if (prev.includes(messageId)) {
        return prev.filter(id => id !== messageId);
      }
      return [...prev, messageId];
    });
  };

  const handleSelectAll = () => {
    if (selectedMessages.length === messages.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(messages.map(msg => msg.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (onDeleteSelected && selectedMessages.length > 0) {
      await onDeleteSelected(selectedMessages);
      setSelectedMessages([]);
      setIsSelectionMode(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-3 sm:mb-4 gap-2 sm:gap-0">
        {isSelectionMode ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white dark:bg-neoDark text-neoDark dark:text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              <CheckSquare className="h-5 w-5" />
              {selectedMessages.length === messages.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedMessages.length > 0 && onDeleteSelected && (
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-red-600 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
              >
                Delete Selected ({selectedMessages.length})
              </button>
            )}
            <button
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedMessages([]);
              }}
              className="p-2 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5 w-full sm:w-auto"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSelectionMode(true)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white dark:bg-neoDark text-neoDark dark:text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto"
          >
            <CheckSquare className="h-5 w-5" />
            Select Multiple
          </button>
        )}
      </div>

      <div className="space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            onMarkAsRead={onMarkAsRead}
            isSelected={selectedMessages.includes(message.id)}
            onSelect={isSelectionMode ? handleSelectMessage : undefined}
            isSelectionMode={isSelectionMode}
          />
        ))}
      </div>
    </div>
  );
}; 