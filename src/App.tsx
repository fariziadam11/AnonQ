import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { MessagesProvider } from './context/MessagesContext';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/common/Spinner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppRoutes from './routes/AppRoutes';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center bg-neoBg dark:bg-neoDark"><Spinner message="Initializing..." /></div>;
  }
  return (
      <Router>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-neoBg dark:bg-neoDark"><Spinner message="Loading page..." /></div>}>
          <AppRoutes />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'font-bold rounded-neo border-2 border-neoDark shadow-neo-sm',
            style: {
              background: '#FDF6E3', // neoBg
              color: '#1F2937', // neoDark
            },
            success: {
              className: 'font-bold rounded-neo border-2 border-green-500 shadow-neo-sm',
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              className: 'font-bold rounded-neo border-2 border-red-500 shadow-neo-sm',
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
      </Router>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProfileProvider>
        <MessagesProvider>
          <AppContent />
          <ReactQueryDevtools/>
        </MessagesProvider>
      </ProfileProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;