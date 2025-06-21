import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md">
        <div className="rounded-neo border-4 border-neoDark bg-white p-6 shadow-neo-lg dark:border-white dark:bg-neoDark">
          <div className="flex items-start gap-4">
            {isDestructive && (
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            )}
            <div className="flex-1">
              <h3
                className="text-2xl font-extrabold text-neoDark dark:text-white"
                id="modal-title"
              >
                {title}
              </h3>
              <p className="mt-2 text-base text-neoDark/80 dark:text-white/80">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-neo border-2 border-neoDark p-1 shadow-neo transition-all hover:bg-neoAccent/40 hover:shadow-none dark:border-white dark:hover:bg-neoAccent2/40"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-neoDark dark:text-white" />
            </button>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={onClose}
              className="w-full rounded-neo border-2 border-neoDark bg-white px-6 py-2 font-bold text-neoDark shadow-neo transition-all hover:bg-neoAccent/40 sm:w-auto dark:border-white dark:bg-neoDark dark:text-white dark:hover:bg-neoAccent2/40"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`w-full rounded-neo border-2 border-neoDark px-6 py-2 font-bold text-white shadow-neo transition-all sm:w-auto ${
                isDestructive
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-neoAccent2 hover:bg-neoAccent3'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 