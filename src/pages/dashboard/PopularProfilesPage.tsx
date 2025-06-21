import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { User, BarChart3 } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Spinner } from '../../components/common/Spinner';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const fetchStats = async () => {
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: messageCount } = await supabase.from('messages').select('*', { count: 'exact', head: true });
  return { userCount: userCount || 0, messageCount: messageCount || 0 };
};

const fetchAnalytics = async () => {
  const { data, error } = await supabase.from('message_analytics').select('*').order('hour', { ascending: true });
  if (error) throw error;
  return data as Array<{ hour: string; message_count: number; unique_recipients: number }>;
};

const PopularProfilesPage: React.FC = () => {

  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });

  const chartData = analytics
    ? {
        labels: analytics.map(a => new Date(a.hour).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' })),
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
      }
    : { labels: [], datasets: [] };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          title: context => {
            if (!analytics) return '';
            const date = new Date(analytics[context[0].dataIndex].hour);
            return date.toLocaleString(undefined, { weekday: 'long', hour: '2-digit', minute: '2-digit' });
          },
          label: context => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { maxRotation: 45, minRotation: 45 },
      },
    },
  };

  return (
    <div className="py-10 px-2">
      <div className="max-w-4xl mx-auto border-8 border-black rounded-3xl bg-white dark:bg-gray-800 shadow-[12px_12px_0px_0px_#000] p-2 sm:p-4 md:p-6">
        <h1 className="text-3xl font-black text-center mb-8 text-purple-700 dark:text-yellow-300 drop-shadow-[2px_2px_0px_#000]">
          Analytics
        </h1>

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
        <div className="mb-8 border-4 border-black rounded-2xl bg-purple-100 dark:bg-yellow-200 p-2 sm:p-4 shadow-[4px_4px_0px_0px_#000]">
          <h3 className="font-black text-lg mb-2 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Message Analytics (Last 7 Days)
          </h3>
          <div className="w-full overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="min-w-[400px]" style={{ height: '260px' }}>
              {isLoadingAnalytics ? <Spinner /> : <Bar data={chartData} options={chartOptions} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularProfilesPage; 