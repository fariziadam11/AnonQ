import React, { useState } from 'react';
import { Clock, CheckCheck, Trash2, CheckSquare, Square, Download, Eye, X, User } from 'lucide-react';
import { Database } from '../../lib/supabase';
import { useMessages } from '../../context/MessagesContext';
import html2canvas from 'html2canvas';
import { toast } from 'react-hot-toast';

type Message = Database['public']['Tables']['messages']['Row'];

export interface MessageCardProps {
  message: Message;
  onMarkAsRead: (messageId: string) => Promise<void>;
  isSelected?: boolean;
  onSelect?: (messageId: string) => void;
  isSelectionMode?: boolean;
}

export const MessageCard: React.FC<MessageCardProps> = ({ 
  message, 
  onMarkAsRead, 
  isSelected = false,
  onSelect,
  isSelectionMode = false
}) => {
  const { deleteMessage } = useMessages();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleMarkAsRead = async () => {
    if (!message.is_read) {
      await onMarkAsRead(message.id);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const cardElement = document.getElementById(`message-card-${message.id}`);
      if (!cardElement) return;

      // Create a clone of the card element
      const clone = cardElement.cloneNode(true) as HTMLElement;
      
      // Hide elements that shouldn't be in the image
      const elementsToHide = clone.querySelectorAll('.hide-in-image');
      elementsToHide.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'none';
        }
      });

      // Add header to the clone
      const header = document.createElement('div');
      header.style.padding = '16px';
      header.style.borderBottom = '2px solid #000';
      header.style.marginBottom = '16px';
      header.style.backgroundColor = '#fff';
      header.style.color = '#000';
      header.style.fontFamily = 'Arial, sans-serif';
      
      const title = document.createElement('h2');
      title.textContent = 'Anonymous Message';
      title.style.margin = '0';
      title.style.fontSize = '20px';
      title.style.fontWeight = 'bold';
      
      const timestamp = document.createElement('p');
      timestamp.textContent = new Date(message.created_at).toLocaleString();
      timestamp.style.margin = '8px 0 0';
      timestamp.style.fontSize = '14px';
      timestamp.style.color = '#666';
      
      header.appendChild(title);
      header.appendChild(timestamp);
      clone.insertBefore(header, clone.firstChild);

      // Set background color for the clone
      clone.style.backgroundColor = '#fff';
      clone.style.padding = '16px';
      clone.style.borderRadius = '8px';
      clone.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      clone.style.width = '600px';
      clone.style.margin = '0 auto';

      // Create a container for the clone
      const container = document.createElement('div');
      container.style.backgroundColor = '#f5f5f5';
      container.style.padding = '20px';
      container.style.width = '640px';
      container.style.height = 'auto';
      container.appendChild(clone);

      // Append container to body temporarily
      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#f5f5f5',
        logging: false,
        useCORS: true
      });

      // Remove the temporary container
      document.body.removeChild(container);

      const link = document.createElement('a');
      link.download = `message-${message.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading message:', error);
      toast.error('Failed to download message');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <div
        id={`message-card-${message.id}`}
        className={`bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-3 sm:p-4 lg:p-8 transition-all duration-200 ${
          isSelected ? 'ring-4 ring-neoAccent2 dark:ring-neoAccent3' : ''
        } ${!message.is_read ? 'border-neoAccent2 dark:border-neoAccent3' : ''} w-full break-words`}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {isSelectionMode && onSelect && (
            <div className="flex justify-end checkbox-container">
              <button
                onClick={() => onSelect(message.id)}
                className={`p-1 rounded-neo transition-colors duration-200 ${
                  isSelected 
                    ? 'text-neoAccent2 dark:text-neoAccent3' 
                    : 'text-neoDark/40 dark:text-white/40 hover:text-neoAccent2 dark:hover:text-neoAccent3'
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="h-5 w-5" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neoAccent2 dark:bg-neoAccent3 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-white dark:text-neoDark" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <span className="font-bold text-neoDark dark:text-white text-sm sm:text-base">
                    {message.message_type === 'anonymous' ? 'Anonymous' : 'User-to-User'}
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-neoDark/70 dark:text-white/70 hide-in-image">
                  {formatDate(message.created_at)}
                </span>
              </div>
            </div>
            
            <div className="bg-neoBg dark:bg-neoDark/50 rounded-neo p-3 sm:p-4 border-2 border-neoDark/10 dark:border-white/10">
              <p className="text-neoDark dark:text-white whitespace-pre-wrap break-words leading-relaxed text-sm sm:text-base">
                {message.content}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 sm:mt-4">
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-neoDark/50 dark:text-white/50 hide-in-image">
                <Clock className="h-4 w-4" />
                <span>{new Date(message.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 action-buttons">
                <button
                  onClick={() => setShowPreview(true)}
                  className="p-2 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                  title="Preview message"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                  title="Download as image"
                >
                  <Download className="h-4 w-4" />
                </button>
                {!message.is_read && (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-2 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-neoDark dark:text-white hover:text-red-500 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                  title="Delete message"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-neoDark dark:text-white">Message Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-neoDark/70 dark:text-white/70 hover:text-neoDark dark:hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-neoBg dark:bg-neoDark/50 rounded-neo p-4 border-2 border-neoDark/10 dark:border-white/10">
                <p className="whitespace-pre-wrap break-words text-neoDark dark:text-white">
                  {message.content}
                </p>
              </div>
              <div className="mt-4 text-sm text-neoDark/70 dark:text-white/70">
                Received: {new Date(message.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neoDark dark:text-white mb-4">Delete Message</h3>
            <p className="text-neoDark/70 dark:text-white/70 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white dark:bg-neoDark text-neoDark dark:text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-red-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};