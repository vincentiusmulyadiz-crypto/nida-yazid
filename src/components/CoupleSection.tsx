import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { Language } from '../types';
import { CoupleName, HandwrittenText, HandwrittenCoupleName } from './FlourishText';

interface CoupleSectionProps {
  currentLang: Language;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  isCoverRemoved?: boolean;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  scrollContainerRef,
  isCoverRemoved = false,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { couple, couplePhoto, coupleSectionData, titleTone } = useInvitation();
  const [photoError, setPhotoError] = useState(false);
  const prefersReduced = useReducedMotion();

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  // Scroll Zoom: photo grows from 0.92 to 1 and border-radius from 24px to 0
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
    container: isDesktop ? scrollContainerRef : undefined,
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const rawRadius = useTransform(scrollYProgress, [0, 1], ['24px', '0px']);
  const rawContentOpacity = useTransform(scrollYProgress, [0.65, 0.92], [0, 1]);
  const rawContentY = useTransform(scrollYProgress, [0.65, 0.92], [12, 0]);

  const scale = !isDesktop || isCoverRemoved || prefersReduced ? 1 : rawScale;
  const borderRadius = !isDesktop || isCoverRemoved || prefersReduced ? '0px' : rawRadius;
  const contentOpacity = isCoverRemoved || prefersReduced ? 1 : rawContentOpacity;
  const contentY = isCoverRemoved || prefersReduced ? 0 : rawContentY;

  const rawQuote =
    coupleSectionData?.quote ||
    'Kecil saja: ingin sampai rumah saat senja.';
  const cleanQuote = rawQuote.replace(/^["“”']+|[”"']+$/g, '').trim();

  const rawSource = coupleSectionData?.quoteSource || 'Joko Pinurbo (Cita-Cita)';
  const cleanSource = rawSource.replace(/^[—–-]\s*/, '').trim();

  return (
    <section
      id="couple"
      ref={sectionRef}
      className="relative w-full min-h-[100lvh] h-[100lvh] lg:h-[100dvh] overflow-hidden select-none bg-transparent flex-none m-0 p-0 border-0 rounded-none"
    >
      {/* Photo layer with scroll zoom, 85% brightness, and 10% analog film grain */}
      <motion.div
        style={{
          scale,
          borderRadius,
          transformOrigin: 'center center',
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: 1000,
        }}
        className="absolute inset-0 w-full h-full overflow-hidden bg-transparent"
      >
        {!photoError && couplePhoto ? (
          <img
            src={couplePhoto}
            alt={`${couple.bride.name} & ${couple.groom.name}`}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{ objectPosition: 'center 35%', filter: 'brightness(0.82)' }}
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1511] via-[#120f0d] to-[#0a0807]" />
        )}

        {/* Readability gradients (desktop only so mobile Safari edge-sampler sees pure photo) */}
        <div className="hidden lg:block absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-[1]" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none z-[1]" />
      </motion.div>

      {/* Quote at the TOP: centered, delicate */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="absolute inset-x-0 mx-auto text-center px-6 z-10 pointer-events-none"
      >
        <div
          style={{
            marginTop: 'calc(env(safe-area-inset-top, 0px) + 52px)',
          }}
          className="max-w-[85%] mx-auto text-center"
        >
          <p
            className={`font-['Arimo',sans-serif] italic text-[clamp(15px,3.4cqw,18px)] leading-[1.5] text-center [text-wrap:balance] drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] font-normal ${
              titleTone === 'dark' ? 'text-black' : 'text-[#F7F5F0]'
            }`}
          >
            &ldquo;<HandwrittenText text={cleanQuote} delay={0.15} trigger="view" />&rdquo;
          </p>
          {cleanSource && (
            <p className="font-['Arimo',sans-serif] text-[11px] sm:text-[11.5px] text-[#EADBC8]/90 mt-2.5 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] tracking-wider font-medium text-center">
              <HandwrittenText text={cleanSource.startsWith('(') ? cleanSource : cleanSource.includes('(') ? cleanSource : `(${cleanSource})`} delay={0.65} trigger="view" />
            </p>
          )}
        </div>
      </motion.div>

      {/* 
        Both names at the BOTTOM:
        Preceded by "the wedding of" in Arimo with generous spacing above CoupleName
      */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="absolute inset-x-0 bottom-[96px] text-center px-6 z-10 pointer-events-auto flex flex-col items-center"
      >
        {/* "the wedding of" line */}
        <p className="font-['Arimo',sans-serif] text-[11px] sm:text-[11.5px] uppercase tracking-[0.24em] text-[#F7F5F0]/90 font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] mb-4">
          <HandwrittenText text="the wedding of" delay={0.2} trigger="view" />
        </p>

        <h2 className="text-[clamp(36px,8.5cqw,46px)] text-[#EADBC8] leading-[1.08] [text-shadow:0_2px_14px_rgba(0,0,0,0.7),0_1px_4px_rgba(0,0,0,0.5)] text-center [text-wrap:balance]">
          <HandwrittenCoupleName groom={couple.bride.name} bride={couple.groom.name} delay={0.45} trigger="view" />
        </h2>
      </motion.div>
    </section>
  );
};
