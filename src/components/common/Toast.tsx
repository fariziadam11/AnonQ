import React from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose: () => void;
  duration?: number; // ms
}

const typeStyles = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-blue-500 text-white',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', visible, onClose, duration = 3000 }) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        ${typeStyles[type]}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center space-x-2">
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-white/80 hover:text-white font-bold">×</button>
      </div>
    </div>
  );
};

export default Toast; 