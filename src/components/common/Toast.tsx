import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-fadeIn">
      <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-emerald-400/30">
        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
