import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';

interface BackgroundVideoProps {
  className?: string;
  hasOpened?: boolean;
}

const DEFAULT_SLIDES = [
  '/slideshow/slideshow1.jpg',
  '/slideshow/slideshow2.jpg',
];

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ className = '', hasOpened = false }) => {
  const { isPreview, bgPhotos } = useInvitation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = bgPhotos && bgPhotos.length > 0 ? bgPhotos : DEFAULT_SLIDES;

  // Auto-advance slideshow every 7 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const activeIndex = currentSlide % (slides.length || 1);

  return (
    <div
      style={{
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
      }}
      className={`fixed lg:absolute -top-[env(safe-area-inset-top,0px)] -bottom-[env(safe-area-inset-bottom,0px)] inset-x-0 lg:inset-0 w-full min-h-[100lvh] lg:min-h-0 lg:h-full z-0 pointer-events-none select-none overflow-hidden bg-transparent ${className}`}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.02 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.6, ease: 'easeInOut' },
            scale: { duration: 7.2, ease: 'easeOut' },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slides[activeIndex]}
            alt={`Prewedding Nida & Yazid slide ${activeIndex + 1}`}
            style={{
              filter: hasOpened ? 'brightness(0.45) contrast(1.04)' : 'brightness(0.65) contrast(1.02)',
              transition: 'filter 1s ease',
            }}
            className="w-full h-full object-cover object-center select-none pointer-events-none"
            loading="eager"
            onContextMenu={(e) => {
              if (isPreview) e.preventDefault();
            }}
            onDragStart={(e) => {
              if (isPreview) e.preventDefault();
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
