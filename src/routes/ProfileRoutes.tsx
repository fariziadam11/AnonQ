import { Route } from 'react-router-dom';
import { ProfilePage } from '../pages/profile/ProfilePage';
import ProfileSettingsPage from '../pages/profile/ProfileSettingsPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const ProfileRoutes = [
  <Route key="profile" path="u/:username" element={<ProfilePage />} />, 
  <Route key="settings-profile" path="settings/profile" element={<ProtectedRoute allowedRoles={['user', 'admin']}><ProfileSettingsPage /></ProtectedRoute>} />,
];

export default ProfileRoutes; 