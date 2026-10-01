import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-4 rounded-xl shadow-warm-lg transition-all duration-300 transform translate-y-0 border ${
      isError 
        ? 'bg-[#FFF5F5] border-[#FCA5A5] text-[#991B1B]' 
        : 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]'
    }`}>
      {isError ? (
        <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0" />
      ) : (
        <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
      )}
      <div className="text-sm font-medium pr-2">
        {toast.message}
      </div>
      <button 
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-black/5 transition"
      >
        <X className="w-4 h-4 text-current opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
