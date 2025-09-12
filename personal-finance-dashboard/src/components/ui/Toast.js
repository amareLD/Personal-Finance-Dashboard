import React, { useEffect } from 'react';

export default function Toast({ open, message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  const typeStyles = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    error: 'bg-red-600',
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white ${typeStyles[type] || typeStyles.info}`}>
      {message}
    </div>
  );
}
