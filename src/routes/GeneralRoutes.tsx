import { Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { SidebarDemoPage } from '../pages/SidebarDemoPage';

const GeneralRoutes = [
  <Route key="home" index element={<HomePage />} />, 
  <Route key="sidebar-demo" path="sidebar-demo" element={<SidebarDemoPage />} />, 
  <Route key="notfound" path="*" element={<Navigate to="/" />} />,
];

export default GeneralRoutes; 