import React, { useState, useRef } from 'react';
import { Clock, CheckCheck, Trash2, CheckSquare, Square, Share2, Download } from 'lucide-react';
import { Database } from '../lib/supabase';
import { useMessages } from '../context/MessagesContext';
import html2canvas from 'html2canvas';

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
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleDelete = async () => {
    try {
      await deleteMessage(message.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Create a temporary container for the image
      const container = document.createElement('div') as HTMLDivElement;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '600px'; // Fixed width for consistency
      container.style.padding = '20px';
      container.style.backgroundColor = 'white';
      document.body.appendChild(container);

      // Create header
      const header = document.createElement('div') as HTMLDivElement;
      header.style.padding = '16px';
      header.style.borderBottom = '2px solid #e5e7eb';
      header.style.marginBottom = '16px';
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'space-between';
      
      const title = document.createElement('h2') as HTMLHeadingElement;
      title.textContent = 'NGL Message';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.color = '#1f2937';
      
      const timestamp = document.createElement('span') as HTMLSpanElement;
      timestamp.textContent = formatTime(message.created_at);
      timestamp.style.color = '#6b7280';
      timestamp.style.fontSize = '14px';
      
      header.appendChild(title);
      header.appendChild(timestamp);
      container.appendChild(header);

      // Clone the card content
      const cardClone = cardRef.current.cloneNode(true) as HTMLElement;
      
      // Remove action buttons and checkbox
      const actionButtons = cardClone.querySelector('.action-buttons');
      if (actionButtons) {
        actionButtons.remove();
      }
      const checkbox = cardClone.querySelector('.checkbox-container');
      if (checkbox) {
        checkbox.remove();
      }
      
      // Remove any max-height or overflow constraints
      const contentElement = cardClone.querySelector('p');
      if (contentElement) {
        contentElement.style.maxHeight = 'none';
        contentElement.style.overflow = 'visible';
        contentElement.style.whiteSpace = 'pre-wrap';
        contentElement.style.wordBreak = 'break-word';
      }

      container.appendChild(cardClone);

      // Create canvas from the container
      const canvas = await html2canvas(container, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        width: 600,
        height: container.offsetHeight,
      });

      // Clean up
      document.body.removeChild(container);

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ngl-message-${message.id}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 'image/png');
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      alert('Message copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className={`p-4 rounded-neo border-2 ${
          message.is_read
            ? 'border-neoDark/20 dark:border-white/20 bg-white/50 dark:bg-neoDark/50'
            : 'border-neoDark dark:border-white bg-white dark:bg-neoDark'
        } shadow-neo transition-all duration-200`}
      >
        <div className="flex flex-col gap-4">
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
            <p className="text-neoDark dark:text-white whitespace-pre-wrap break-words">{message.content}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-sm text-neoDark/50 dark:text-white/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="flex-shrink-0">{formatTime(message.created_at)}</span>
                {message.is_read ? (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <CheckCheck className="h-4 w-4" />
                    <span>Read</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                    <span>Unread</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 action-buttons">
                <button
                  onClick={() => setShowPreview(true)}
                  className="p-1.5 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                  title="Preview message"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-1.5 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                  title="Download as image"
                >
                  <Download className="h-4 w-4" />
                </button>
                {!message.is_read && (
                  <button
                    onClick={handleMarkAsRead}
                    className="p-1.5 text-neoDark dark:text-white hover:text-neoAccent2 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1.5 text-neoDark dark:text-white hover:text-red-500 transition-colors duration-200 rounded-neo hover:bg-neoDark/5 dark:hover:bg-white/5"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neoDark dark:text-white mb-4">Message Preview</h3>
            <div className="bg-neoDark/5 dark:bg-white/5 p-4 rounded-neo mb-4">
              <p className="text-neoDark dark:text-white whitespace-pre-wrap break-words">{message.content}</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCopyToClipboard}
                className="px-4 py-2 bg-white dark:bg-neoDark text-neoDark dark:text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-neoAccent dark:bg-neoAccent2 text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/80 dark:hover:bg-neoAccent2/80 transition-all duration-200"
              >
                Close
              </button>
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