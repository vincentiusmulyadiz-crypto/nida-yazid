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
  currentLang,
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
            style={{ objectPosition: 'center center', filter: 'brightness(0.82)' }}
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1511] via-[#120f0d] to-[#0a0807]" />
        )}

        {/* Readability gradients (desktop only so mobile Safari edge-sampler sees pure photo) */}
        <div className="hidden lg:block absolute inset-x-0 top-0 h-[30%] bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none z-[1]" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none z-[1]" />
      </motion.div>

      {/* Quote at the TOP: Arial font + balanced sizing so Arabic & translation stay centered inside bounds */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="absolute inset-x-0 top-0 mx-auto text-center px-3 sm:px-4 z-10 pointer-events-none"
      >
        <div
          style={{
            marginTop: 'calc(env(safe-area-inset-top, 0px) + 44px)',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
          className="w-[88cqw] mx-auto flex flex-col items-center text-center"
        >
          <p
            dir="rtl"
            lang="ar"
            className="mb-2.5 text-[clamp(6.8px,1.75cqw,8.4px)] leading-[1.6] whitespace-nowrap text-center drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] font-normal text-white/95"
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
          </p>
          <p
            className="text-[clamp(9.2px,2.25cqw,10.5px)] leading-[1.45] text-center drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] font-normal text-white/95"
          >
            &ldquo;{currentLang === 'id'
              ? 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.'
              : 'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.'}&rdquo;
          </p>
          <p className="text-[clamp(9.5px,2.5cqw,12px)] tracking-[0.16em] font-semibold uppercase text-white/90 mt-2 text-center drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] leading-relaxed">
            (QS. Ar-Rum: 21)
          </p>
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

        <h2 className="w-full flex justify-center text-[clamp(36px,8.5cqw,46px)] text-[#EADBC8] leading-[1.08] [text-shadow:0_2px_14px_rgba(0,0,0,0.7),0_1px_4px_rgba(0,0,0,0.5)] text-center [text-wrap:balance]">
          <HandwrittenCoupleName groom={couple.bride.name} bride={couple.groom.name} delay={0.45} trigger="view" />
        </h2>
      </motion.div>
    </section>
  );
};
