import React from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom'; 

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-300 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto">
        <AuthForm onSuccess={() => navigate('/dashboard')} mode="login" />
      </div>
    </div>
  );
};

export default LoginPage; 