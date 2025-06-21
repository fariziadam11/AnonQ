import React from 'react';

interface MessageStats {
  total_messages: number;
  unread_messages: number;
  messages_today: number;
  messages_this_week: number;
}

interface StatsPanelProps {
  stats: MessageStats;
}

const StatCard: React.FC<{ label: string; value: number; colorClass: string }> = ({ label, value, colorClass }) => (
  <div className={`rounded-neo border-2 border-neoDark p-4 text-center ${colorClass} dark:border-white`}>
    <div className="text-2xl font-extrabold text-neoDark dark:text-white">{value}</div>
    <div className="text-sm text-neoDark/70 dark:text-white/70">{label}</div>
  </div>
);

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  return (
    <div className="mb-6 rounded-neo border-4 border-neoDark bg-white p-3 shadow-neo-lg sm:mb-8 sm:p-6 lg:p-8 dark:border-white dark:bg-neoDark">
      <h2 className="mb-4 text-lg font-extrabold text-neoDark sm:mb-6 sm:text-2xl dark:text-white">Message Statistics</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard label="Total Messages" value={stats.total_messages} colorClass="bg-neoAccent/20 dark:bg-neoAccent/30" />
        <StatCard label="Unread" value={stats.unread_messages} colorClass="bg-neoAccent2/20 dark:bg-neoAccent2/30" />
        <StatCard label="Today" value={stats.messages_today} colorClass="bg-neoAccent3/20 dark:bg-neoAccent3/30" />
        <StatCard label="This Week" value={stats.messages_this_week} colorClass="bg-green-400/20 dark:bg-green-400/30" />
      </div>
    </div>
  );
}; 