import React, { useState } from 'react';
import { Copy, MessageCircle, Share2, MessageSquare, Facebook, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { useMessages } from '../context/MessagesContext';
import { MessageList } from '../components/MessageList';
import toast from 'react-hot-toast';

export const DashboardPage: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { messages, loading: messagesLoading, markAsRead, unreadCount, deleteMessages } = useMessages();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'unread' | 'read'>('newest');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

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

  const totalPages = Math.ceil(sortedMessages.length / messagesPerPage);
  const paginatedMessages = sortedMessages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyLink = () => {
    if (profile) {
      const link = `${window.location.origin}/u/${profile.username}`;
      navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    }
  };

  const getShareLink = () => {
    if (profile) {
      return `${window.location.origin}/u/${profile.username}`;
    }
    return '';
  };

  const shareToWhatsApp = () => {
    const link = getShareLink();
    const text = `Send me anonymous messages on AnonQ: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    const link = getShareLink();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, '_blank');
  };

  const shareToInstagram = () => {
    const link = getShareLink();
    // Instagram Stories sharing requires a sticker image
    // For now, we'll just copy the link to clipboard
    navigator.clipboard.writeText(link);
    toast.success('Link copied! Paste it in your Instagram Story');
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neoDark dark:text-white">
                Welcome, <span className="text-neoAccent2 dark:text-neoAccent3">@{profile.username}</span>
              </h1>
              <p className="text-neoDark/70 dark:text-white/70 mt-1">
                Share your link to receive anonymous messages
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neoDark text-neoDark dark:text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
              >
                <Copy className="h-5 w-5" />
                <span>Copy Link</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neoDark text-neoDark dark:text-white rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-2 border-neoDark dark:border-white py-2 z-10">
                    <button
                      onClick={() => {
                        shareToWhatsApp();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-neoDark dark:text-white hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={() => {
                        shareToFacebook();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-neoDark dark:text-white hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
                    >
                      <Facebook className="h-5 w-5" />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => {
                        shareToInstagram();
                        setShowShareMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-neoDark dark:text-white hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neoDark rounded-neo shadow-neo-lg border-4 border-neoDark dark:border-white p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
            <h2 className="text-2xl font-extrabold text-neoDark dark:text-white">Your Messages</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold transition-all duration-200 ${
                    filter === 'all'
                      ? 'bg-neoAccent text-neoDark dark:bg-neoAccent2 dark:text-white'
                      : 'bg-white text-neoDark hover:bg-neoAccent/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold transition-all duration-200 ${
                    filter === 'unread'
                      ? 'bg-neoAccent2 text-white'
                      : 'bg-white text-neoDark hover:bg-neoAccent2/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2 rounded-neo border-2 border-neoDark dark:border-white bg-white dark:bg-neoDark text-neoDark dark:text-white font-bold shadow-neo focus:outline-none focus:ring-2 focus:ring-neoAccent"
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-neoAccent dark:border-neoAccent2 mx-auto mb-4"></div>
              <p className="text-neoDark/70 dark:text-white/70">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-neoDark/20 dark:text-white/20 mx-auto mb-4" />
              <p className="text-xl text-neoDark dark:text-white mb-2">
                {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
              </p>
              <p className="text-neoDark/50 dark:text-white/50">
                {filter === 'unread'
                  ? 'All caught up! Check back later for new messages.'
                  : 'Share your link to start receiving anonymous messages!'}
              </p>
            </div>
          ) : (
            <>
              <MessageList
                messages={paginatedMessages}
                onMarkAsRead={markAsRead}
                onDeleteSelected={deleteMessages}
              />
              
              <div className="mt-6 p-4 bg-white dark:bg-neoDark rounded-neo border-2 border-neoDark dark:border-white">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-neoDark/70 dark:text-white/70">
                    Showing {paginatedMessages.length} of {sortedMessages.length} messages
                  </p>
                  <p className="text-sm text-neoDark/70 dark:text-white/70">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
                
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-neo border-2 border-neoDark dark:border-white bg-white dark:bg-neoDark text-neoDark dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-neo border-2 border-neoDark dark:border-white font-bold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-neoAccent2 text-white dark:bg-neoAccent3 dark:text-neoDark'
                          : 'bg-white text-neoDark hover:bg-neoAccent/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-neo border-2 border-neoDark dark:border-white bg-white dark:bg-neoDark text-neoDark dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neoAccent/40 dark:hover:bg-neoAccent2/40 transition-all duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};