import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { MessagesProvider } from './context/MessagesContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import UserListPage from './pages/UserListPage';
import { useAuth } from './context/AuthContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/users" element={<UserListPage />} />
        </Routes>
      </Layout>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </Router>
  );
};

const App: React.FC = () => {
  // Cek environment variable maintenance
  const isMaintenance = import.meta.env.VITE_MAINTENANCE === 'true';
  if (isMaintenance) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <h1>Maintenance</h1>
          <p>Situs sedang dalam perbaikan. Silakan kembali lagi nanti.</p>
        </div>
      </div>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <MessagesProvider>
            <AppContent />
          </MessagesProvider>
        </ProfileProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;