import React, { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg dark:border-emerald-900 dark:bg-gray-800 dark:text-emerald-400">
        <FiCheckCircle className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}
