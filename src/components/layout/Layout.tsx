import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="relative flex min-h-screen">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main content */}
      <div className="flex flex-1 flex-col bg-neoBg dark:bg-neoDark">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="w-full flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};