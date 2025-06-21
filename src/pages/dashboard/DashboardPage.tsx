import React, { useState, useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { useProfile } from '../../context/ProfileContext';
import { useMessages } from '../../context/MessagesContext';
import { MessageList } from '../../components/messages/MessageList';
import { Spinner } from '../../components/common/Spinner';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { StatsPanel } from '../../components/dashboard/StatsPanel';
import { MessageControls } from '../../components/dashboard/MessageControls';
import { Pagination } from '../../components/common/Pagination';

export const DashboardPage: React.FC = () => {
  const { profile, loading: profileLoading } = useProfile();
  const {
    messages,
    loading: messagesLoading,
    markAsRead,
    unreadCount,
    deleteMessages,
    messageStats,
    markAllAsRead,
    refreshMessages,
  } = useMessages();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'unread' | 'read'>('newest');
  const [showStats, setShowStats] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const sortedMessages = useMemo(() => {
    const filtered = messages.filter((message) => (filter === 'all' ? true : !message.is_read));
    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'unread': return a.is_read === b.is_read ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : a.is_read ? 1 : -1;
        case 'read': return a.is_read === b.is_read ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime() : a.is_read ? -1 : 1;
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [messages, filter, sort]);

  const totalPages = Math.ceil(sortedMessages.length / messagesPerPage);
  const paginatedMessages = sortedMessages.slice((currentPage - 1) * messagesPerPage, currentPage * messagesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (profileLoading) {
    return <div className="flex h-full items-center justify-center"><Spinner message="Loading dashboard..." /></div>;
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile not found</h2>
          <p className="text-gray-600">Please try logging in again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <DashboardHeader profile={profile} onShowStats={() => setShowStats(!showStats)} />

        {showStats && messageStats && <StatsPanel stats={messageStats} />}

        <div className="rounded-neo border-4 border-neoDark bg-white p-3 shadow-neo-lg sm:p-6 lg:p-8 dark:border-white dark:bg-neoDark">
          <MessageControls
            onRefresh={refreshMessages}
            onMarkAllRead={markAllAsRead}
            unreadCount={unreadCount}
            totalMessages={messages.length}
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
          />

          {messagesLoading ? (
            <div className="py-8 text-center sm:py-12"><Spinner size="sm" message="Loading messages..." /></div>
          ) : messages.length === 0 ? (
            <div className="py-8 text-center sm:py-12">
              <MessageCircle className="mx-auto mb-4 h-12 w-12 text-neoDark/20 dark:text-white/20 sm:h-16 sm:w-16" />
              <p className="mb-2 text-base text-neoDark dark:text-white sm:text-xl">
                {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
              </p>
              <p className="text-sm text-neoDark/50 sm:text-base dark:text-white/50">
                {filter === 'unread' ? 'All caught up! Check back later.' : 'Share your link to start!'}
              </p>
            </div>
          ) : (
            <>
              <MessageList messages={paginatedMessages} onMarkAsRead={markAsRead} onDeleteSelected={deleteMessages} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsCount={paginatedMessages.length}
                totalItems={sortedMessages.length}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};