import { Route } from 'react-router-dom';
import GuestRoute from '../components/auth/GuestRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

const AuthRoutes = [
  <Route key="login" path="login" element={<GuestRoute><LoginPage /></GuestRoute>} />, 
  <Route key="register" path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />, 
  <Route key="forgot-password" path="forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />,
];

export default AuthRoutes; 