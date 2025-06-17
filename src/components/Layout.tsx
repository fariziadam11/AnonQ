import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, User, Home, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useMessages } from '../hooks/useMessages';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-neoBg">
      <nav className="bg-white rounded-b-neo shadow-neo-lg border-b-4 border-neoDark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-extrabold text-neoDark drop-shadow-sm"
            >
              <MessageCircle className="h-8 w-8 text-neoAccent2" />
              <span>AnonQ</span>
            </Link>

            <div className="flex items-center space-x-4">
              {user && profile ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/dashboard'
                        ? 'bg-neoAccent text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent/40'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Messages</span>
                    {unreadCount > 0 && (
                      <span className="bg-neoAccent2 text-white text-xs rounded-neo px-2 py-1 min-w-[20px] h-5 flex items-center justify-center border-2 border-neoDark shadow-neo">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to={`/u/${profile.username}`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === `/u/${profile.username}`
                        ? 'bg-neoAccent3 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent3/40'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>My Page</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-4 py-2 text-neoDark bg-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent2 hover:text-white transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/"
                  className="flex items-center space-x-2 px-4 py-2 bg-neoAccent2 text-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200"
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