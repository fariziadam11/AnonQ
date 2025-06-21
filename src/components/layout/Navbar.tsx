import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { Menu } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { profile } = useProfile();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b-4 border-neoDark bg-white px-4 shadow-neo-lg dark:border-white dark:bg-neoDark md:justify-end">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="rounded-neo border-2 border-neoDark bg-white p-2 shadow-neo transition-all hover:shadow-none dark:border-white dark:bg-neoDark md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5 text-neoDark dark:text-white" />
      </button>

      {/* User Info */}
      {user && profile && (
        <div className="flex items-center gap-4">
          <span className="hidden font-bold text-neoDark dark:text-white sm:block">
            Welcome,{' '}
            <span className="text-neoAccent2">@{profile.username}</span>
          </span>
          <img
            src={profile.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.username}`}
            alt="User Avatar"
            className="h-10 w-10 rounded-neo border-2 border-neoDark shadow-neo dark:border-white"
          />
        </div>
      )}
    </header>
  );
}; 