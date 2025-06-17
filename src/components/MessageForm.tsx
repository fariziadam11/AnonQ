import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { useMessages } from '../hooks/useMessages';
import toast from 'react-hot-toast';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      await sendMessage(profileId, message.trim());
      setMessage('');
      toast.success('Message sent anonymously!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-neo shadow-neo-lg border-4 border-neoDark p-8">
      <div className="text-center mb-8">
        <MessageCircle className="h-12 w-12 mx-auto text-neoAccent2 mb-4" />
        <h2 className="text-2xl font-extrabold text-neoDark">
          Send an anonymous message to <span className="text-neoAccent2">@{username}</span>
        </h2>
        <p className="text-neoDark/70 mt-2">
          Your identity will remain completely anonymous
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-neoDark mb-2">
            Your anonymous message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border-2 border-neoDark rounded-neo focus:ring-2 focus:ring-neoAccent focus:border-neoAccent transition-all duration-200 resize-none bg-neoBg text-neoDark font-bold shadow-neo"
            rows={6}
            placeholder="Type your message here... Be kind and respectful!"
            maxLength={1000}
            required
          />
          <div className="text-right text-sm text-neoDark/50 mt-2">
            {message.length}/1000 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full bg-neoAccent2 text-white py-3 px-4 rounded-neo border-2 border-neoDark shadow-neo font-extrabold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Send className="h-5 w-5" />
          <span>{loading ? 'Sending...' : 'Send Anonymous Message'}</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-neoAccent/20 border-2 border-neoDark rounded-neo shadow-neo">
        <p className="text-sm text-neoDark font-bold">
          <strong>Privacy Notice:</strong> Your message will be sent completely
          anonymously. The recipient will not be able to see your identity or any
          information about you.
        </p>
      </div>
    </div>
  );
};