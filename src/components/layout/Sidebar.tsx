import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  X,
  Home,
  Settings,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { useMessages } from '../../context/MessagesContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { unreadCount } = useMessages();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (sidebar && toggleButton && 
          !sidebar.contains(event.target as Node) && 
          !toggleButton.contains(event.target as Node) &&
          window.innerWidth < 768) {
        onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onToggle]);

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

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = user && profile ? [
    {
      to: "/",
      label: "Home",
      icon: Home,
      active: location.pathname === "/",
      activeClass: "bg-neoAccent text-neoDark",
    },
    {
      to: "/dashboard",
      label: "Messages",
      icon: MessageCircle,
      active: location.pathname === "/dashboard",
      activeClass: "bg-neoAccent2 text-white",
      showUnread: true,
    },
    {
      to: "/popular",
      label: "Popular",
      icon: TrendingUp,
      active: location.pathname === "/popular",
      activeClass: "bg-neoAccent3 text-neoDark",
    },
    {
      to: "/settings/profile",
      label: "Profile Settings",
      icon: Settings,
      active: location.pathname === "/settings/profile",
      activeClass: "bg-neoAccent text-neoDark",
    },
    ...(profile?.role === 'admin' ? [{
      to: "/users",
      label: "User List",
      icon: Users,
      active: location.pathname === "/users",
      activeClass: "bg-neoAccent3 text-neoDark",
    }] : []),
  ] : [
    {
      to: "/",
      label: "Home",
      icon: Home,
      active: location.pathname === "/",
      activeClass: "bg-neoAccent text-neoDark",
    },
    {
      to: "/login",
      label: "Login",
      icon: User,
      active: location.pathname === "/login",
      activeClass: "bg-neoAccent2 text-white",
    },
    {
      to: "/register",
      label: "Register",
      icon: User,
      active: location.pathname === "/register",
      activeClass: "bg-neoAccent3 text-neoDark",
    },
    {
      to: "/sidebar-demo",
      label: "Sidebar Demo",
      icon: Star,
      active: location.pathname === "/sidebar-demo",
      activeClass: "bg-neoAccent2 text-white",
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          fixed top-0 left-0 h-screen bg-white dark:bg-neoDark border-r-4 border-neoDark dark:border-white shadow-neo-lg z-50 sidebar-transition flex-shrink-0 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-16' : 'w-64'}
          md:sticky md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-neoDark dark:border-white flex-shrink-0">
          {!isCollapsed && (
            <Link
              to="/"
              className="flex items-center space-x-2 text-lg font-extrabold text-neoDark dark:text-white"
            >
              <MessageCircle className="h-6 w-6 text-neoAccent2" />
              <span>AnonQ</span>
            </Link>
          )}
          
          {/* Collapse toggle button - only show on desktop */}
          <button
            onClick={handleCollapseToggle}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-neo border-2 border-neoDark dark:border-white shadow-neo bg-white dark:bg-neoDark hover:bg-neoAccent/20 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-neoDark dark:text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-neoDark dark:text-white" />
            )}
          </button>

          {/* Close button - only show on mobile */}
          <button
            onClick={onToggle}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-neo border-2 border-neoDark dark:border-white shadow-neo bg-white dark:bg-neoDark hover:bg-neoAccent/20 transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4 text-neoDark dark:text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto sidebar-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-neo border-2 border-neoDark dark:border-white shadow-neo font-bold transition-all duration-200 sidebar-item-hover
                ${isCollapsed ? 'justify-center' : ''}
                ${item.active ? item.activeClass : 'bg-white text-neoDark hover:bg-neoAccent/40 dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent/40'}
              `}
              onClick={() => {
                if (window.innerWidth < 768) {
                  onToggle();
                }
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.showUnread && unreadCount > 0 && (
                    <span className="bg-neoAccent2 text-white text-xs rounded-neo px-2 py-1 min-w-[20px] h-5 flex items-center justify-center border-2 border-neoDark shadow-neo">
                      {unreadCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t-4 border-neoDark dark:border-white space-y-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className={`
              flex items-center justify-center w-full py-3 rounded-neo border-2 border-neoDark dark:border-white shadow-neo bg-white dark:bg-neoDark transition-colors duration-200
              ${isCollapsed ? '' : 'space-x-3'}
            `}
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-neoAccent" />
            ) : (
              <Moon className="h-5 w-5 text-neoAccent2" />
            )}
            {!isCollapsed && (
              <span className="font-bold text-neoDark dark:text-white">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>

          {/* Sign out button - only show when user is logged in */}
          {user && profile && (
            <button
              onClick={handleSignOut}
              className={`
                flex items-center justify-center w-full py-3 text-neoDark bg-white rounded-neo border-2 border-neoDark shadow-neo font-bold hover:bg-neoAccent2 hover:text-white transition-all duration-200
                ${isCollapsed ? '' : 'space-x-3'}
              `}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          )}
        </div>
      </div>
    </>
  );
}; 