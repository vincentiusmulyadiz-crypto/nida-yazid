import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PhotoItem {
  id: number | string;
  src: string;
  alt: string;
  caption: string;
}

interface LightboxProps {
  photos: PhotoItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex?: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
}) => {
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onClose, onNext, onPrev]);

  if (currentIndex === null) return null;
  const currentPhoto = photos[currentIndex];
  const len = photos.length;
  const prev2Index = (currentIndex - 2 + len) % len;
  const prev1Index = (currentIndex - 1 + len) % len;
  const next1Index = (currentIndex + 1) % len;
  const next2Index = (currentIndex + 2) % len;

  const prev2Photo = photos[prev2Index];
  const prev1Photo = photos[prev1Index];
  const next1Photo = photos[next1Index];
  const next2Photo = photos[next2Index];

  const handleSelect = (idx: number) => {
    if (onSelectIndex) {
      onSelectIndex(idx);
    } else if (idx === next1Index) {
      onNext();
    } else if (idx === prev1Index) {
      onPrev();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 45) {
      onNext();
    } else if (diff < -45) {
      onPrev();
    }
    touchStartX.current = null;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl p-3 sm:p-6 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Control Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between z-20 py-1.5 sm:py-2 px-2">
          <span className="text-[13px] tracking-[0.24em] text-[#EADBC8] font-sans font-medium">
            {currentIndex + 1} / {photos.length}
          </span>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Media Area */}
        <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-auto px-2">
          {/* Previous Button: round dark button with chevron */}
          <button
            onClick={onPrev}
            className="absolute left-2 sm:left-6 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 border border-white/25 text-white hover:bg-black/85 hover:border-white/60 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md shadow-xl"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Current Active Image */}
          <motion.div
            key={currentPhoto.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative max-h-[66vh] sm:max-h-[70vh] max-w-full flex items-center justify-center bg-black overflow-hidden shadow-2xl rounded-sm"
          >
            <img
              src={currentPhoto.src}
              alt={currentPhoto.alt || 'Prewedding Photo'}
              className="max-h-[66vh] sm:max-h-[70vh] max-w-full object-contain"
            />
          </motion.div>

          {/* Next Button: round dark button with chevron */}
          <button
            onClick={onNext}
            className="absolute right-2 sm:right-6 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 border border-white/25 text-white hover:bg-black/85 hover:border-white/60 transition-all flex items-center justify-center cursor-pointer backdrop-blur-md shadow-xl"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Bottom 5-Photo Preview Bar (2 Left, 1 Center Active, 2 Right) */}
        {photos.length > 1 && (
          <div className="w-full max-w-lg flex items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-3 mb-1 z-20 px-2 sm:px-4">
            {/* Outer Left Photo Preview (-2) */}
            {photos.length >= 4 && (
              <button
                type="button"
                onClick={() => handleSelect(prev2Index)}
                className="group relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-white/20 bg-black/50 opacity-40 hover:opacity-85 transition-all cursor-pointer flex-shrink-0 active:scale-90 shadow-sm"
                aria-label="Preview Foto 2 Langkah Sebelumnya"
              >
                <img
                  src={prev2Photo.src}
                  alt={prev2Photo.alt || 'Foto Sebelumnya'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
              </button>
            )}

            {/* Inner Left Photo Preview (-1) */}
            <button
              type="button"
              onClick={() => handleSelect(prev1Index)}
              className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-white/30 bg-black/50 opacity-65 hover:opacity-100 transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-md"
              aria-label="Preview Foto Sebelumnya"
            >
              <img
                src={prev1Photo.src}
                alt={prev1Photo.alt || 'Foto Sebelumnya'}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />
            </button>

            {/* Center Active Photo Preview (Current) */}
            <div
              className="relative w-15 h-15 sm:w-18 sm:h-18 rounded-xl overflow-hidden border-2 border-[#EADBC8] shadow-[0_0_16px_rgba(234,219,200,0.35)] bg-black/70 flex-shrink-0 scale-105"
              aria-label="Foto Yang Sedang Dilihat"
            >
              <img
                src={currentPhoto.src}
                alt={currentPhoto.alt || 'Foto Yang Sedang Dilihat'}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/30 rounded-xl pointer-events-none" />
            </div>

            {/* Inner Right Photo Preview (+1) */}
            <button
              type="button"
              onClick={() => handleSelect(next1Index)}
              className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-white/30 bg-black/50 opacity-65 hover:opacity-100 transition-all cursor-pointer flex-shrink-0 active:scale-95 shadow-md"
              aria-label="Preview Foto Selanjutnya"
            >
              <img
                src={next1Photo.src}
                alt={next1Photo.alt || 'Foto Selanjutnya'}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-transparent transition-colors" />
            </button>

            {/* Outer Right Photo Preview (+2) */}
            {photos.length >= 4 && (
              <button
                type="button"
                onClick={() => handleSelect(next2Index)}
                className="group relative w-9 h-9 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-white/20 bg-black/50 opacity-40 hover:opacity-85 transition-all cursor-pointer flex-shrink-0 active:scale-90 shadow-sm"
                aria-label="Preview Foto 2 Langkah Selanjutnya"
              >
                <img
                  src={next2Photo.src}
                  alt={next2Photo.alt || 'Foto Selanjutnya'}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
