import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from '../components/common/Toast';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');

  const showToast = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);
  }, []);

  const handleClose = () => setVisible(false);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} type={type} visible={visible} onClose={handleClose} />
    </ToastContext.Provider>
  );
}; 