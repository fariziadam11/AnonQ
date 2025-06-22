import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import UserListPage from '../pages/dashboard/UserListPage';
import PopularProfilesPage from '../pages/dashboard/PopularProfilesPage';

const DashboardRoutes = [
  <Route key="dashboard" path="dashboard" element={<ProtectedRoute allowedRoles={['user', 'admin']}><DashboardPage /></ProtectedRoute>} />, 
  <Route key="users" path="users" element={<ProtectedRoute allowedRoles={['admin']}><UserListPage /></ProtectedRoute>} />, 
  <Route key="popular" path="popular" element={<ProtectedRoute allowedRoles={['admin']}><PopularProfilesPage /></ProtectedRoute>} />,
];

export default DashboardRoutes; 