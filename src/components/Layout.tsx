import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, User, Home, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useMessages } from '../context/MessagesContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { unreadCount } = useMessages();
  const location = useLocation();

  const [isDark, setIsDark] = React.useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neoBg dark:bg-neoDark">
      <nav className="bg-white dark:bg-neoDark rounded-b-neo shadow-neo-lg border-b-4 border-neoDark dark:border-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-lg sm:text-xl font-extrabold text-neoDark drop-shadow-sm"
            >
              <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-neoAccent2" />
              <span>AnonQ</span>
            </Link>
            {/* Hamburger menu for mobile */}
            <button
              className="sm:hidden flex items-center px-2 py-2 border-2 border-neoDark rounded-neo bg-white dark:bg-neoDark dark:border-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <svg className="h-6 w-6 text-neoDark dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Main menu */}
            <div className={`hidden sm:flex items-center space-x-2 md:space-x-4`}>
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-neo border-2 border-neoDark shadow-neo bg-white dark:bg-neoDark dark:border-white transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5 text-neoAccent" /> : <Moon className="h-5 w-5 text-neoAccent2" />}
              </button>
              {user && profile ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
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
                    to="/users"
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/users'
                        ? 'bg-neoAccent3 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent3/40'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>User List</span>
                  </Link>
                  <Link
                    to="/popular"
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/popular'
                        ? 'bg-yellow-300 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-yellow-200'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Popular</span>
                  </Link>
                  <Link
                    to={`/u/${profile.username}`}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === `/u/${profile.username}`
                        ? 'bg-neoAccent3 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent3/40'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings/profile"
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/settings/profile'
                        ? 'bg-neoAccent2 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent2/40'
                    }`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-neoDark bg-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent2 hover:text-white transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-neoAccent2 text-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent3 hover:text-neoDark transition-all duration-200"
                  >
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => window.location.href = '/register'}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-neoAccent3 text-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent2 hover:text-neoDark transition-all duration-200"
                  >
                    <span>Register</span>
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Mobile menu dropdown, now outside flex baris utama */}
          {menuOpen && (
            <div className="sm:hidden flex flex-col space-y-2 py-3 px-2 bg-white dark:bg-neoDark border-b-2 border-neoDark dark:border-white shadow-neo animate-fade-in">
              <button
                onClick={toggleDarkMode}
                className="flex items-center justify-center w-9 h-9 rounded-neo border-2 border-neoDark shadow-neo bg-white dark:bg-neoDark dark:border-white transition-colors duration-200 mb-1"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="h-5 w-5 text-neoAccent" /> : <Moon className="h-5 w-5 text-neoAccent2" />}
              </button>
              {user && profile ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/dashboard'
                        ? 'bg-neoAccent text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent/40'
                    }`}
                    onClick={() => setMenuOpen(false)}
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
                    to="/users"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/users'
                        ? 'bg-neoAccent3 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent3/40'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>User List</span>
                  </Link>
                  <Link
                    to="/popular"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/popular'
                        ? 'bg-yellow-300 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-yellow-200'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Popular</span>
                  </Link>
                  <Link
                    to={`/u/${profile.username}`}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === `/u/${profile.username}`
                        ? 'bg-neoAccent3 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent3/40'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings/profile"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-neo border-2 border-neoDark shadow-neo font-bold transition-all duration-200 ${
                      location.pathname === '/settings/profile'
                        ? 'bg-neoAccent2 text-neoDark'
                        : 'bg-white text-neoDark hover:bg-neoAccent2/40'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile Settings</span>
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleSignOut(); }}
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
                  onClick={() => setMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Get Started</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};