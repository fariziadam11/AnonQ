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
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8">
      <div className="text-center mb-8">
        <MessageCircle className="h-12 w-12 mx-auto text-purple-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">
          Send an anonymous message to @{username}
        </h2>
        <p className="text-gray-600 mt-2">
          Your identity will remain completely anonymous
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your anonymous message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
            rows={6}
            placeholder="Type your message here... Be kind and respectful!"
            maxLength={1000}
            required
          />
          <div className="text-right text-sm text-gray-500 mt-2">
            {message.length}/1000 characters
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Send className="h-5 w-5" />
          <span>{loading ? 'Sending...' : 'Send Anonymous Message'}</span>
        </button>
      </form>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Privacy Notice:</strong> Your message will be sent completely
          anonymously. The recipient will not be able to see your identity or any
          information about you.
        </p>
      </div>
    </div>
  );
};