import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  isLoading: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  const [dots, setDots] = useState('....');

  // Animated dots: ., .., ..., ....
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 4 ? '.' : prev + '.'));
    }, 320);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="joyever-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] bg-[#12100E] flex flex-col items-center justify-center p-6 select-none pointer-events-auto"
          style={{
            background: 'radial-gradient(ellipse at center, #1b1612 0%, #12100E 80%)',
          }}
        >
          {/* Subtle glowing halo behind logo */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute w-44 h-44 rounded-full bg-[#C5A880]/15 blur-2xl pointer-events-none animate-pulse" />

            {/* Official Joyever Logo with soft breathing pulse */}
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: [0.97, 1.02, 0.97], opacity: 1 }}
              transition={{
                scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                opacity: { duration: 0.35 },
              }}
              className="relative z-10 flex flex-col items-center mb-5"
            >
              <img
                src="/logo-joyever-clean.png"
                alt="joyever.id"
                className="w-auto h-11 sm:h-14 max-w-[170px] sm:max-w-[200px] object-contain drop-shadow-[0_2px_14px_rgba(0,0,0,0.3)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </motion.div>

            {/* Elegant Slim Shimmer Line */}
            <div className="w-32 sm:w-40 h-[2px] bg-white/20 rounded-full overflow-hidden mb-3.5 relative">
              <motion.div
                className="absolute inset-y-0 bg-gradient-to-r from-transparent via-[#DFD0B8] to-transparent w-full"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
              />
            </div>

            {/* User-requested: loading.... (Perfect optical center) */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="font-arial text-xs sm:text-[13px] tracking-widest text-[#FAF6EC]/85 font-medium lowercase flex items-center justify-center text-center"
            >
              <span>loading</span>
              <span className="relative inline-block w-5 text-left text-[#DFD0B8] tracking-normal font-mono">
                <span className="invisible">....</span>
                <span className="absolute left-0 top-0">{dots}</span>
              </span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
