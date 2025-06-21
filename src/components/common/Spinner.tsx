import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 border-4',
  md: 'w-10 h-10 border-8',
  lg: 'w-16 h-16 border-8',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', message }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-neoDark dark:border-white border-t-neoAccent2 ${sizeClasses[size]}`}
      ></div>
      {message && <p className="mt-4 text-sm font-bold text-neoDark dark:text-white">{message}</p>}
    </div>
  );
}; 