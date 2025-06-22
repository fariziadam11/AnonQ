import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { MessagesProvider } from './context/MessagesContext';
import { Layout } from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import GuestRoute from './components/auth/GuestRoute';
import { SidebarDemoPage } from './pages/SidebarDemoPage';
import { useAuth } from './context/AuthContext';
import { Spinner } from './components/common/Spinner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Import pages with correct export types
import { HomePage } from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import UserListPage from './pages/dashboard/UserListPage';
import PopularProfilesPage from './pages/dashboard/PopularProfilesPage';
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center bg-neoBg dark:bg-neoDark"><Spinner message="Initializing..." /></div>;
  }
  return (
      <Router>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-neoBg dark:bg-neoDark"><Spinner message="Loading page..." /></div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
              <Route path="forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
              <Route path="u/:username" element={<ProfilePage />} />
              <Route path="dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><DashboardPage /></ProtectedRoute>} />
              <Route path="users" element={<ProtectedRoute allowedRoles={['admin']}><UserListPage /></ProtectedRoute>} />
              <Route path="popular" element={<ProtectedRoute allowedRoles={['user', 'admin']}><PopularProfilesPage /></ProtectedRoute>} />
              <Route path="settings/profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ProfileSettingsPage /></ProtectedRoute>} />
              <Route path="sidebar-demo" element={<SidebarDemoPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
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