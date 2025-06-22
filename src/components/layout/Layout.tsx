import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import { ToastProvider } from '../../context/ToastContext';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-neoBg dark:bg-neoDark">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col min-w-0">
          <Navbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-grow">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
};