import React from 'react';
import { AuthForm } from '../../components/auth/AuthForm';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full flex items-center justify-center bg-yellow-300 dark:bg-gray-900">
      <div className="w-full max-w-md p-4">
        <AuthForm onSuccess={() => navigate('/dashboard')} mode="register" />
      </div>
    </div>
  );
};

export default RegisterPage; 