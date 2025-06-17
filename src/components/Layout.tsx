import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, User, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useMessages } from '../hooks/useMessages';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { unreadCount } = useMessages();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-emerald-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
            >
              <MessageCircle className="h-8 w-8 text-purple-600" />
              <span>AnonQ</span>
            </Link>

            <div className="flex items-center space-x-4">
              {user && profile ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === '/dashboard'
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={`/u/${profile.username}`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      location.pathname === `/u/${profile.username}`
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>My Page</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <Home className="h-5 w-5" />
                  <span>Get Started</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};