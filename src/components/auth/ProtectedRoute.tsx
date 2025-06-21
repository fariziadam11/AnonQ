import React from 'react';
import { Navigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { Spinner } from '../common/Spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner message="Loading..." />
      </div>
    );
  }
  
  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute; 