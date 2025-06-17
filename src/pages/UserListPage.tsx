import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useProfile } from '../context/ProfileContext';
import { useMessages } from '../context/MessagesContext';
import { MessageCircle, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

const UserListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 9; // 3x3 grid
  const { profile: currentProfile } = useProfile();
  const { sendMessage } = useMessages();

  // Fetch users query
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        user =>
          user.username.toLowerCase().includes(query) ||
          (user.full_name?.toLowerCase().includes(query) ?? false)
      );
    }

    // Sort users
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name-asc':
        result.sort((a, b) => (a.full_name || a.username).localeCompare(b.full_name || b.username));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.full_name || b.username).localeCompare(a.full_name || a.username));
        break;
    }

    return result;
  }, [users, searchQuery, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedUsers.length / usersPerPage);
  const paginatedUsers = filteredAndSortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ profileId, content }: { profileId: string; content: string }) => {
      if (!currentProfile) throw new Error('No profile found');
      return sendMessage(profileId, content);
    },
    onSuccess: () => {
      toast.success('Pesan berhasil dikirim!');
      setMessage('');
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error('Error sending message:', error);
      if (error.message === 'No profile found') {
        toast.error('Anda harus login untuk mengirim pesan');
      } else {
        toast.error('Gagal mengirim pesan. Silakan coba lagi.');
      }
    },
  });

  const handleSend = async () => {
    if (!selectedUser || !message.trim()) return;
    if (!currentProfile) {
      toast.error('Anda harus login untuk mengirim pesan');
      return;
    }
    sendMessageMutation.mutate({ profileId: selectedUser.id, content: message });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">User List</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-neo border-2 border-neoDark dark:border-white bg-white dark:bg-neoDark text-neoDark dark:text-white focus:ring-2 focus:ring-neoAccent focus:border-neoAccent"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="pl-10 pr-4 py-2 rounded-neo border-2 border-neoDark dark:border-white bg-white dark:bg-neoDark text-neoDark dark:text-white focus:ring-2 focus:ring-neoAccent focus:border-neoAccent appearance-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedUsers.map((user) => (
          <div
            key={user.id}
            className={`p-6 rounded-neo border-2 border-neoDark dark:border-white shadow-neo cursor-pointer transition-all duration-200 ${
              selectedUser?.id === user.id
                ? 'bg-neoAccent text-neoDark dark:bg-neoAccent2 dark:text-white'
                : 'bg-white text-neoDark hover:bg-neoAccent/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40'
            }`}
            onClick={() => setSelectedUser(user)}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neoAccent2 flex items-center justify-center text-white font-bold text-xl">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  user.username.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user.full_name || user.username}</h2>
                <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white dark:bg-neoDark rounded-neo border-2 border-neoDark dark:border-white">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-neoDark/70 dark:text-white/70">
            Showing {paginatedUsers.length} of {filteredAndSortedUsers.length} users
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

      {selectedUser && (
        <div className="mt-8 p-6 rounded-neo border-2 border-neoDark dark:border-white shadow-neo bg-white dark:bg-neoDark">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-neoAccent2 flex items-center justify-center text-white font-bold text-xl">
              {selectedUser.avatar_url ? (
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                selectedUser.username.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{selectedUser.full_name || selectedUser.username}</h2>
              <p className="text-gray-600 dark:text-gray-300">@{selectedUser.username}</p>
            </div>
          </div>

          <div className="relative">
            <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full pl-10 p-4 rounded-neo border-2 border-neoDark dark:border-white bg-white dark:bg-neoDark text-neoDark dark:text-white mb-4"
              rows={4}
              placeholder={`Tulis pesan untuk @${selectedUser.username}...`}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSend}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="flex-1 bg-neoAccent2 text-white py-3 px-4 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-extrabold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendMessageMutation.isPending ? 'Mengirim...' : 'Kirim Pesan'}
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="px-6 py-3 rounded-neo border-2 border-red-500 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListPage;
