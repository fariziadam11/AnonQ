import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { User, BarChart3 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetchPopularProfiles = async (period: 'total' | 'weekly' | 'monthly') => {
  let query = supabase.from('popular_profiles').select('*');
  if (period === 'weekly') {
    query = query.order('recent_message_count', { ascending: false });
  } else if (period === 'monthly') {
    // Untuk demo, pakai recent_message_count juga, bisa diubah jika ada view khusus
    query = query.order('recent_message_count', { ascending: false });
  } else {
    query = query.order('message_count', { ascending: false });
  }
  const { data, error } = await query;
  if (error) throw error;
  return data as Array<{
    id: string;
    username: string;
    created_at: string;
    message_count: number;
    recent_message_count: number;
  }>;
};

const fetchStats = async () => {
  // Total user dan total pesan
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_deleted', false);
  const { count: messageCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
  return { userCount: userCount || 0, messageCount: messageCount || 0 };
};

const fetchAnalytics = async () => {
  const { data, error } = await supabase.from('message_analytics').select('*').order('hour', { ascending: true });
  if (error) throw error;
  return data as Array<{ hour: string; message_count: number; unique_recipients: number }>;
};

const TABS = [
  { key: 'total', label: 'Total' },
  { key: 'weekly', label: '7 Hari' },
  { key: 'monthly', label: '30 Hari' },
];

const PopularProfilesPage: React.FC = () => {
  const [tab, setTab] = useState<'total' | 'weekly' | 'monthly'>('total');
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const { data: analytics } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
  const { data, isLoading, isError } = useQuery({
    queryKey: ['popular_profiles', tab],
    queryFn: () => fetchPopularProfiles(tab),
  });

  // Chart data
  const chartData = analytics ? {
    labels: analytics.map(a => new Date(a.hour).toLocaleString()),
    datasets: [
      {
        label: 'Messages',
        data: analytics.map(a => a.message_count),
        backgroundColor: '#a78bfa',
        borderColor: '#000',
        borderWidth: 2,
      },
      {
        label: 'Unique Recipients',
        data: analytics.map(a => a.unique_recipients),
        backgroundColor: '#facc15',
        borderColor: '#000',
        borderWidth: 2,
      },
    ],
  } : undefined;

  return (
    <div className="min-h-screen bg-yellow-300 dark:bg-gray-900 py-10 px-2">
      <div className="max-w-3xl mx-auto border-8 border-black rounded-3xl bg-white dark:bg-gray-800 shadow-[12px_12px_0px_0px_#000] p-2 sm:p-4 md:p-6">
        <h1 className="text-3xl font-black text-center mb-8 text-purple-700 dark:text-yellow-300 drop-shadow-[2px_2px_0px_#000]">Popular Profiles</h1>
        {/* Statistik summary */}
        {stats && (
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-8">
            <div className="flex flex-col items-center border-4 border-black rounded-2xl bg-yellow-100 dark:bg-purple-200 px-4 py-3 sm:px-6 sm:py-4 shadow-[4px_4px_0px_0px_#000] w-full sm:w-auto">
              <User className="h-8 w-8 text-purple-700 dark:text-yellow-400 mb-1" />
              <span className="font-black text-2xl">{stats.userCount}</span>
              <span className="font-bold text-xs">Total Users</span>
            </div>
            <div className="flex flex-col items-center border-4 border-black rounded-2xl bg-yellow-100 dark:bg-purple-200 px-4 py-3 sm:px-6 sm:py-4 shadow-[4px_4px_0px_0px_#000] w-full sm:w-auto">
              <BarChart3 className="h-8 w-8 text-purple-700 dark:text-yellow-400 mb-1" />
              <span className="font-black text-2xl">{stats.messageCount}</span>
              <span className="font-bold text-xs">Total Messages</span>
            </div>
          </div>
        )}
        {/* Analytics Chart */}
        {chartData && (
          <div className="mb-8 border-4 border-black rounded-2xl bg-purple-100 dark:bg-yellow-200 p-2 sm:p-4 shadow-[4px_4px_0px_0px_#000]">
            <h3 className="font-black text-lg mb-2 flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Message Analytics (7 Hari)</h3>
            <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
              <div className="min-w-[400px] max-w-full" style={{ minWidth: 320, width: '100%' }}>
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'top' as const } },
                  }}
                  height={260}
                />
              </div>
            </div>
          </div>
        )}
        {/* Tabs Leaderboard */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`px-4 py-2 sm:px-6 sm:py-2 font-black rounded-2xl border-4 border-black shadow-[2px_2px_0px_0px_#000] text-base sm:text-lg transition-all duration-150 ${tab === t.key ? 'bg-purple-400 dark:bg-yellow-300 text-black' : 'bg-yellow-100 dark:bg-purple-200 text-black hover:bg-purple-200 dark:hover:bg-yellow-200'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Leaderboard Table */}
        {isLoading && <div className="text-center font-bold text-lg">Loading...</div>}
        {isError && <div className="text-center text-red-600 font-bold">Failed to load data.</div>}
        {data && (
          <div className="w-full overflow-x-auto">
            <table className="min-w-[600px] w-full border-4 border-black rounded-xl bg-yellow-100 dark:bg-purple-200 shadow-[4px_4px_0px_0px_#000]">
              <thead>
                <tr className="bg-purple-200 dark:bg-yellow-200 border-b-4 border-black">
                  <th className="py-2 px-2 font-black text-lg border-r-4 border-black">#</th>
                  <th className="py-2 px-2 font-black text-lg border-r-4 border-black">User</th>
                  <th className="py-2 px-2 font-black text-lg border-r-4 border-black">Total</th>
                  <th className="py-2 px-2 font-black text-lg border-r-4 border-black">7d</th>
                  <th className="py-2 px-2 font-black text-lg">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.map((profile, idx) => (
                  <tr key={profile.id} className="border-b-2 border-black hover:bg-purple-100 dark:hover:bg-yellow-100 transition-all">
                    <td className="py-2 px-2 font-black text-center">{idx + 1}</td>
                    <td className="py-2 px-2 font-bold flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-700 dark:text-yellow-400" />
                      <span>@{profile.username}</span>
                    </td>
                    <td className="py-2 px-2 text-center font-bold">{profile.message_count}</td>
                    <td className="py-2 px-2 text-center font-bold">{profile.recent_message_count}</td>
                    <td className="py-2 px-2 text-center">{new Date(profile.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularProfilesPage; 