import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import AuthRoutes from './AuthRoutes';
import DashboardRoutes from './DashboardRoutes';
import ProfileRoutes from './ProfileRoutes';
import GeneralRoutes from './GeneralRoutes';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      {GeneralRoutes}
      {AuthRoutes}
      {DashboardRoutes}
      {ProfileRoutes}
    </Route>
  </Routes>
);

export default AppRoutes; 