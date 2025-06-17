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
  const [sort, setSort] = useState<'newest' | 'oldest' | 'unread' | 'read'>('newest');

  const filteredMessages = messages.filter((message) =>
    filter === 'all' ? true : !message.is_read
  );

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (sort === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sort === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else if (sort === 'unread') {
      // Unread first, then by newest
      if (a.is_read === b.is_read) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.is_read ? 1 : -1;
    } else if (sort === 'read') {
      // Read first, then by newest
      if (a.is_read === b.is_read) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return a.is_read ? -1 : 1;
    }
    return 0;
  });

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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-neoBg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-neo shadow-neo-lg border-4 border-neoDark p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-neoAccent rounded-neo flex items-center justify-center mx-auto mb-4 border-4 border-neoDark shadow-neo">
              <span className="text-2xl font-extrabold text-neoDark">
                {profile.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-neoDark mb-2 drop-shadow-sm">
              Welcome back, <span className="text-neoAccent2">@{profile.username}</span>
            </h1>
            <p className="text-neoDark/70">
              Your anonymous message dashboard
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-neoAccent/20 rounded-neo p-4 text-center border-2 border-neoDark shadow-neo">
              <MessageCircle className="h-8 w-8 text-neoAccent mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-neoDark">
                {messages.length}
              </div>
              <div className="text-sm text-neoDark">Total Messages</div>
            </div>
            <div className="bg-neoAccent2/20 rounded-neo p-4 text-center border-2 border-neoDark shadow-neo">
              <Clock className="h-8 w-8 text-neoAccent2 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-neoDark">{unreadCount}</div>
              <div className="text-sm text-neoDark">Unread</div>
            </div>
            <div className="bg-neoAccent3/20 rounded-neo p-4 text-center border-2 border-neoDark shadow-neo">
              <CheckCheck className="h-8 w-8 text-neoAccent3 mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-neoDark">
                {messages.length - unreadCount}
              </div>
              <div className="text-sm text-neoDark">Read</div>
            </div>
            <div className="bg-neoBg rounded-neo p-4 text-center border-2 border-neoDark shadow-neo">
              <Users className="h-8 w-8 text-neoDark mx-auto mb-2" />
              <div className="text-2xl font-extrabold text-neoDark">
                {new Set(messages.map(m => m.created_at.split('T')[0])).size}
              </div>
              <div className="text-sm text-neoDark">Active Days</div>
            </div>
          </div>

          {/* Share section */}
          <div className="bg-neoBg rounded-neo p-6 border-2 border-neoDark shadow-neo">
            <h3 className="text-lg font-bold text-neoDark mb-4">
              Share your anonymous message link
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-white rounded-neo p-3 border-2 border-neoDark shadow-neo">
                <code className="text-sm text-neoDark break-all">
                  {window.location.origin}/u/{profile.username}
                </code>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="flex items-center space-x-2 bg-neoAccent text-neoDark px-4 py-3 rounded-neo border-2 border-neoDark shadow-neo hover:bg-neoAccent2 hover:text-white transition-all duration-200 font-bold"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={shareLink}
                  className="flex items-center space-x-2 bg-neoAccent3 text-neoDark px-4 py-3 rounded-neo border-2 border-neoDark shadow-neo hover:bg-neoAccent2 hover:text-white transition-all duration-200 font-bold"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages section */}
        <div className="bg-white rounded-neo shadow-neo-lg border-4 border-neoDark p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-neoDark">Your Messages</h2>
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                  filter === 'all'
                    ? 'bg-neoAccent text-neoDark'
                    : 'bg-white text-neoDark hover:bg-neoAccent/40'
                }`}
              >
                All ({messages.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                  filter === 'unread'
                    ? 'bg-neoAccent2 text-white'
                    : 'bg-white text-neoDark hover:bg-neoAccent2/40'
                }`}
              >
                Unread ({unreadCount})
              </button>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                className="ml-4 px-3 py-2 rounded-neo border-2 border-neoDark bg-white text-neoDark font-bold shadow-neo focus:outline-none focus:ring-2 focus:ring-neoAccent"
                style={{ minWidth: 120 }}
                aria-label="Sort messages"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="unread">Unread First</option>
                <option value="read">Read First</option>
              </select>
            </div>
          </div>

          {messagesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-neoAccent mx-auto mb-4"></div>
              <p className="text-neoDark/70">Loading messages...</p>
            </div>
          ) : sortedMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-neoDark/20 mx-auto mb-4" />
              <p className="text-xl text-neoDark mb-2">
                {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
              </p>
              <p className="text-neoDark/50">
                {filter === 'unread'
                  ? 'All caught up! Check back later for new messages.'
                  : 'Share your link to start receiving anonymous messages!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedMessages.map((message) => (
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