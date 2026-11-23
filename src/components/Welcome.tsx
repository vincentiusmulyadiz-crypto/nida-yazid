import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { Language } from '../types';
import { MixedText, HandwrittenText, HandwrittenMixedText } from './FlourishText';

interface WelcomeProps {
  currentLang: Language;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  isCoverRemoved?: boolean;
}

export const Welcome: React.FC<WelcomeProps> = ({
  scrollContainerRef,
  isCoverRemoved = false,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { welcomePhoto, welcomeData, guestName } = useInvitation();
  const [photoError, setPhotoError] = useState(false);
  const prefersReduced = useReducedMotion();

  // Scroll Zoom: photo grows from 0.92 to 1 and border-radius from 24px to 0
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
    container: scrollContainerRef,
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const rawRadius = useTransform(scrollYProgress, [0, 1], ['24px', '0px']);

  const scale = isCoverRemoved || prefersReduced ? 1 : rawScale;
  const borderRadius = isCoverRemoved || prefersReduced ? '0px' : rawRadius;

  const line1 = welcomeData?.quoteLine1 || "The knot is being tied—";
  const line2 = welcomeData?.quoteLine2 || "come celebrate";
  const line3 = welcomeData?.quoteLine3 || "with us.";

  return (
    <section
      id="welcome"
      ref={sectionRef}
      className="relative w-full h-[100dvh] overflow-hidden select-none bg-black flex-none m-0 p-0 border-0 rounded-none"
    >
      {/* Full-bleed photo layer with scroll zoom */}
      <motion.div
        style={{
          scale,
          borderRadius,
          willChange: 'transform',
        }}
        className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      >
        {!photoError && welcomePhoto ? (
          <img
            src={welcomePhoto}
            alt="Welcome Seno & Jattu"
            className="absolute inset-0 w-full h-full object-cover object-center z-0 select-none pointer-events-none"
            onError={() => setPhotoError(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#1b1511] via-[#120f0d] to-[#0a0807] z-0" />
        )}

        {/* Soft warm vignette & gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/65 pointer-events-none z-[1]" />
      </motion.div>

      {/* Greeting: "Dear, {guestName}" floating cleanly without button/capsule */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 whitespace-nowrap pointer-events-none text-center"
      >
        <h2 className="font-['Arimo',sans-serif] text-[clamp(17px,4cqw,22px)] text-[#F7F5F0]/95 font-medium tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          <HandwrittenText text={`Dear, ${guestName}`} delay={0.2} trigger="view" />
        </h2>
      </motion.div>

      {/* 
        Quote block in enlarged Mixed Typography:
        - Line 1: "The knot is being tied—"
        - Line 2: "come celebrate"
        - Line 3: "with us." (enlarged)
        - Rotated -3deg, positioned organically at bottom-left
      */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: 'easeOut', delay: 0.3 }}
        className="absolute left-[max(20px,7%)] bottom-[max(80px,11svh)] -rotate-3 z-10 text-white pointer-events-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] text-left select-none max-w-[85%] space-y-0.5"
      >
        <div className="text-[clamp(24px,5.8cqw,32px)] leading-tight">
          <HandwrittenMixedText text={line1} delay={0.35} trigger="view" />
        </div>
        <div className="text-[clamp(24px,5.8cqw,32px)] leading-tight -mt-0.5">
          <HandwrittenMixedText text={line2} delay={0.75} trigger="view" />
        </div>
        <div className="text-[clamp(42px,10cqw,54px)] leading-[1.05] -mt-1 text-white">
          <HandwrittenMixedText text={line3} delay={1.15} trigger="view" />
        </div>
      </motion.div>
    </section>
  );
};
