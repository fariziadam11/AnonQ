import React, { useState } from 'react';
import { BarChart3, Copy, Share2, MessageSquare, Facebook, Instagram, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile {
  username: string;
}

interface DashboardHeaderProps {
  profile: Profile;
  onShowStats: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ profile, onShowStats }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const copyLink = () => {
    const link = `${window.location.origin}/u/${profile.username}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const getShareLink = () => `${window.location.origin}/u/${profile.username}`;

  const shareToWhatsApp = () => {
    const text = `Send me anonymous messages on AnonQ: ${getShareLink()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareLink())}`, '_blank');
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(getShareLink());
    toast.success('Link copied! Paste it in your Instagram Story');
  };

  return (
    <div className="mb-6 rounded-neo border-4 border-neoDark bg-white p-3 shadow-neo-lg sm:mb-8 sm:p-6 lg:p-8 dark:border-white dark:bg-neoDark">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h1 className="break-all text-xl font-extrabold text-neoDark sm:text-3xl dark:text-white">
            Welcome, <span className="text-neoAccent2 dark:text-neoAccent3">@{profile.username}</span>
          </h1>
          <p className="mt-1 text-sm text-neoDark/70 sm:text-base dark:text-white/70">
            Share your link to receive anonymous messages
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
          <button
            onClick={onShowStats}
            className="flex items-center justify-center rounded-neo border-2 border-neoDark bg-white p-2 font-bold text-neoDark shadow-neo transition-all duration-200 hover:bg-neoAccent/40 sm:gap-2 sm:px-4 sm:py-2 dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="hidden sm:inline">Stats</span>
          </button>
          <button
            onClick={copyLink}
            className="flex items-center justify-center rounded-neo border-2 border-neoDark bg-white p-2 font-bold text-neoDark shadow-neo transition-all duration-200 hover:bg-neoAccent/40 sm:gap-2 sm:px-4 sm:py-2 dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
          >
            <Copy className="h-5 w-5" />
            <span className="hidden sm:inline">Copy Link</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center justify-center rounded-neo border-2 border-neoDark bg-white p-2 font-bold text-neoDark shadow-neo transition-all duration-200 hover:bg-neoAccent/40 focus:outline-none focus:ring-2 focus:ring-neoAccent sm:gap-2 sm:px-4 sm:py-2 dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
            >
              <Share2 className="h-5 w-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
            {showShareMenu && (
              <>
                <div
                  className="fixed inset-0 z-30 bg-black/30 sm:hidden"
                  onClick={() => setShowShareMenu(false)}
                />
                <div className="fixed bottom-0 left-0 right-0 z-40 w-full rounded-t-neo border-t-4 border-neoDark bg-white p-4 shadow-neo-lg transition-transform duration-300 ease-in-out sm:absolute sm:bottom-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-48 sm:rounded-neo sm:border-2 sm:border-t-2 sm:p-2 dark:border-white dark:bg-neoDark">
                  <div className="mb-2 flex items-center justify-between sm:hidden">
                    <h3 className="font-extrabold text-neoDark dark:text-white">Share link via</h3>
                    <button onClick={() => setShowShareMenu(false)} className="rounded-neo border-2 border-neoDark p-1 shadow-neo transition-all hover:shadow-none dark:border-white">
                      <X className="h-4 w-4 text-neoDark dark:text-white" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <button onClick={() => { shareToWhatsApp(); setShowShareMenu(false); }} className="flex w-full items-center gap-2 rounded-neo px-3 py-2 text-neoDark transition-all duration-200 hover:bg-neoAccent/40 sm:text-sm dark:text-white dark:hover:bg-neoAccent2/40">
                      <MessageSquare className="h-5 w-5" />
                      <span>WhatsApp</span>
                    </button>
                    <button onClick={() => { shareToFacebook(); setShowShareMenu(false); }} className="flex w-full items-center gap-2 rounded-neo px-3 py-2 text-neoDark transition-all duration-200 hover:bg-neoAccent/40 sm:text-sm dark:text-white dark:hover:bg-neoAccent2/40">
                      <Facebook className="h-5 w-5" />
                      <span>Facebook</span>
                    </button>
                    <button onClick={() => { shareToInstagram(); setShowShareMenu(false); }} className="flex w-full items-center gap-2 rounded-neo px-3 py-2 text-neoDark transition-all duration-200 hover:bg-neoAccent/40 sm:text-sm dark:text-white dark:hover:bg-neoAccent2/40">
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 