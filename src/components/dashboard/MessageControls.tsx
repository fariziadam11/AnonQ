import React from 'react';
import { RefreshCw, CheckCheck } from 'lucide-react';

type FilterType = 'all' | 'unread';
type SortType = 'newest' | 'oldest' | 'unread' | 'read';

interface MessageControlsProps {
  onRefresh: () => void;
  onMarkAllRead: () => void;
  unreadCount: number;
  totalMessages: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  sort: SortType;
  setSort: (sort: SortType) => void;
}

export const MessageControls: React.FC<MessageControlsProps> = ({
  onRefresh,
  onMarkAllRead,
  unreadCount,
  totalMessages,
  filter,
  setFilter,
  sort,
  setSort,
}) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-extrabold text-neoDark sm:text-2xl dark:text-white">Your Messages</h2>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={onRefresh}
            className="rounded-neo border-2 border-neoDark bg-white p-2 font-bold text-neoDark shadow-neo transition-all duration-200 hover:bg-neoAccent/40 dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
            title="Refresh messages"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex flex-1 items-center justify-center gap-2 rounded-neo border-2 border-neoDark bg-neoAccent2 p-2 font-bold text-white shadow-neo transition-all duration-200 hover:bg-neoAccent3 hover:text-neoDark dark:border-white sm:px-4 sm:py-2"
            >
              <CheckCheck className="h-5 w-5" />
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
          )}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 rounded-neo border-2 border-neoDark px-4 py-2 font-bold shadow-neo transition-all duration-200 dark:border-white ${
              filter === 'all'
                ? 'bg-neoAccent text-neoDark dark:bg-neoAccent2 dark:text-white'
                : 'bg-white text-neoDark hover:bg-neoAccent/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40'
            }`}
          >
            All ({totalMessages})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 rounded-neo border-2 border-neoDark px-4 py-2 font-bold shadow-neo transition-all duration-200 dark:border-white ${
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
          onChange={(e) => setSort(e.target.value as SortType)}
          className="w-full appearance-none rounded-neo border-2 border-neoDark bg-white px-3 py-2 text-sm font-bold text-neoDark shadow-neo focus:outline-none focus:ring-2 focus:ring-neoAccent sm:w-auto dark:border-white dark:bg-neoDark dark:text-white"
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
  );
}; 