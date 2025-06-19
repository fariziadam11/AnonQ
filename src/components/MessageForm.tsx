import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useMessages } from '../context/MessagesContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface MessageFormProps {
  profileId: string;
  username: string;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  profileId,
  username,
}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendMessage } = useMessages();
  const { user } = useAuth();
  const [messageType, setMessageType] = useState<'anonymous' | 'user_to_user'>('anonymous');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      await sendMessage(profileId, message.trim(), messageType);
      setMessage('');
      toast.success(
        messageType === 'anonymous'
          ? 'Message sent anonymously!'
          : 'Message sent as user!'
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-8">
      <div className="text-center mb-8">
        <MessageCircle className="h-12 w-12 mx-auto text-neoAccent2 dark:text-neoAccent3 mb-4" />
        <h2 className="text-2xl font-extrabold text-neoDark dark:text-white">
          Send an anonymous message to <span className="text-neoAccent2 dark:text-neoAccent3">@{username}</span>
        </h2>
        <p className="text-neoDark/70 dark:text-white/70 mt-2">
          Your identity will remain completely anonymous
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {user && (
          <div className="mb-4 flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="messageType"
                value="anonymous"
                checked={messageType === 'anonymous'}
                onChange={() => setMessageType('anonymous')}
                className="accent-neoAccent2 dark:accent-neoAccent3"
              />
              <span>Anonymous</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="messageType"
                value="user_to_user"
                checked={messageType === 'user_to_user'}
                onChange={() => setMessageType('user_to_user')}
                className="accent-neoAccent2 dark:accent-neoAccent3"
              />
              <span>User-to-User</span>
            </label>
          </div>
        )}
        <div>
          <label className="block text-sm font-bold text-neoDark dark:text-white mb-2">
            Your anonymous message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-neoDark dark:border-white rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 resize-none bg-neoBg dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo"
            rows={6}
            placeholder="Type your message here... Be kind and respectful!"
            maxLength={1000}
            required
          />
          <div className="text-right text-sm text-neoDark/50 dark:text-white/50 mt-2">
            {message.length}/1000 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full bg-neoAccent2 dark:bg-neoAccent3 text-white dark:text-neoDark py-3 px-4 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-extrabold hover:bg-neoAccent3 hover:text-neoDark dark:hover:bg-neoAccent2 dark:hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Send className="h-5 w-5" />
          <span>{loading ? 'Sending...' : 'Send Anonymous Message'}</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-neoAccent/20 dark:bg-neoAccent/40 border-2 border-neoDark dark:border-white rounded-neo shadow-neo">
        <p className="text-sm text-neoDark dark:text-white font-bold">
          <strong>Privacy Notice:</strong> Your message will be sent completely
          anonymously. The recipient will not be able to see your identity or any
          information about you.
        </p>
      </div>
    </div>
  );
};