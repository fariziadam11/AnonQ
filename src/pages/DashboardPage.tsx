import React, { useState } from 'react';
import { Copy, MessageCircle, Share2, Users, CheckCheck, Clock } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useMessages } from '../hooks/useMessages';
import { MessageCard } from '../components/MessageCard';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { messages, loading: messagesLoading, markAsRead, unreadCount } = useMessages();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredMessages = messages.filter((message) =>
    filter === 'all' ? true : !message.is_read
  );

  const copyLink = () => {
    if (profile) {
      const link = `${window.location.origin}/u/${profile.username}`;
      navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    }
  };

  const shareLink = async () => {
    if (profile) {
      const link = `${window.location.origin}/u/${profile.username}`;
      if (navigator.share) {
        try {
          await navigator.share({
            title: `Send me anonymous messages`,
            text: `Send me anonymous messages on AnonQ`,
            url: link,
          });
        } catch (error) {
          // User cancelled sharing
        }
      } else {
        copyLink();
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile not found</h2>
          <p className="text-gray-600">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, @{profile.username}
            </h1>
            <p className="text-gray-600">
              Your anonymous message dashboard
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {messages.length}
              </div>
              <div className="text-sm text-purple-600">Total Messages</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
              <div className="text-sm text-red-600">Unread</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCheck className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {messages.length - unreadCount}
              </div>
              <div className="text-sm text-green-600">Read</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">
                {new Set(messages.map(m => m.created_at.split('T')[0])).size}
              </div>
              <div className="text-sm text-indigo-600">Active Days</div>
            </div>
          </div>

          {/* Share section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Share your anonymous message link
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-white rounded-lg p-3 border border-gray-200">
                <code className="text-sm text-gray-600 break-all">
                  {window.location.origin}/u/{profile.username}
                </code>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-3 rounded-lg border border-purple-200 hover:bg-purple-50 transition-all duration-200"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={shareLink}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages section */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Messages</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  filter === 'unread'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {messagesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">
                {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
              </p>
              <p className="text-gray-500">
                {filter === 'unread'
                  ? 'All caught up! Check back later for new messages.'
                  : 'Share your link to start receiving anonymous messages!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onMarkAsRead={markAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};