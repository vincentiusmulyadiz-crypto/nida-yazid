import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-4 py-2 bg-black/75 text-white border border-white/25 shadow-xl backdrop-blur-md rounded-full pointer-events-none"
        >
          <Check className="w-3.5 h-3.5 text-white/95 shrink-0" strokeWidth={2.5} />
          <span className="font-['Arimo',sans-serif] text-[13px] font-medium tracking-wide text-white">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
