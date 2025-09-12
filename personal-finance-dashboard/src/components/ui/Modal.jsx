import React from 'react';
import Button from './Button';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="h-screen fixed inset-0 z-50 flex items-center justify-center" style={{background: 'rgba(0,0,0,0.4)'}}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[320px] max-w-lg w-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <span className="text-xl">&times;</span>
        </Button>
        {children}
      </div>
    </div>
  );
}
