import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData } from '../data/invitation';
import { Language } from '../types';
import { MixedText } from './FlourishText';
import { formatParentsLines } from '../utils/formatParents';

interface GroomSectionProps {
  currentLang: Language;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const GroomSection: React.FC<GroomSectionProps> = ({
  currentLang,
  scrollContainerRef,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { couple, groomPhoto, isPreview } = useInvitation();
  const [photoError, setPhotoError] = useState(false);
  const prefersReduced = useReducedMotion();

  const t = invitationData.translations[currentLang] || invitationData.translations.id;
  const { groom } = couple;

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'start start'],
    container: isDesktop ? scrollContainerRef : undefined,
  });

  const rawScale = useTransform(scrollYProgress, [0, 1], [0.92, 1], { clamp: true });
  const rawRadius = useTransform(scrollYProgress, [0, 1], ['24px', '0px'], { clamp: true });
  const rawContentOpacity = useTransform(scrollYProgress, [0.65, 0.92], [0, 1], { clamp: true });
  const rawContentY = useTransform(scrollYProgress, [0.65, 0.92], [14, 0], { clamp: true });

  const scale = prefersReduced ? 1 : rawScale;
  const borderRadius = prefersReduced ? '0px' : rawRadius;
  const contentOpacity = prefersReduced ? 1 : rawContentOpacity;
  const contentY = prefersReduced ? 0 : rawContentY;

  const { line1: parentsLine1, line2: parentsLine2 } = formatParentsLines(
    t.sonOf || 'Putra dari',
    groom.parents
  );

  return (
    <section
      id="groom"
      ref={sectionRef}
      className="relative w-full min-h-[100lvh] h-[100lvh] lg:h-[100dvh] overflow-hidden select-none bg-transparent flex-none m-0 p-0 border-0 rounded-none"
    >
      {/* Photo layer with scroll zoom */}
      <motion.div
        style={{
          scale,
          borderRadius,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        }}
        className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      >
        {!photoError && groomPhoto ? (
          <img
            src={groomPhoto}
            alt={groom.fullName || groom.name}
            className={`absolute inset-0 w-full h-full object-cover select-none ${
              isPreview ? 'pointer-events-none' : ''
            }`}
            style={{ objectPosition: 'center top', filter: 'brightness(0.65)' }}
            onError={() => setPhotoError(true)}
            onContextMenu={(e) => {
              if (isPreview) e.preventDefault();
            }}
            onDragStart={(e) => {
              if (isPreview) e.preventDefault();
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#181310] via-[#100d0a] to-[#0a0807]" />
        )}

        {/* Readability gradients (desktop only so mobile Safari edge-sampler sees pure photo) */}
        <div className="hidden lg:block absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-black/45 via-black/15 to-transparent pointer-events-none z-[1]" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/85 via-black/45 to-transparent pointer-events-none z-[1]" />
      </motion.div>

      {/* TOP-LEFT: "THE GROOM" Mixed Typography Title (Enlarged & Beige) */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
          top: 'calc(env(safe-area-inset-top, 0px) + 24px)',
        }}
        className="absolute left-[24px] z-10 pointer-events-none text-left"
      >
        <h3 className="text-[clamp(28px,6.5cqw,34px)] font-normal leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] text-[#EADBC8]">
          <MixedText text={currentLang === 'id' ? 'MEMPELAI PRIA' : 'THE GROOM'} />
        </h3>
      </motion.div>

      {/* TOP-RIGHT: Spinning Daisy Flower Icon (Beige #EADBC8) */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
          top: 'calc(env(safe-area-inset-top, 0px) + 24px)',
        }}
        className="absolute right-[24px] z-10 pointer-events-none flex items-center justify-center pt-1"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
          className="inline-flex items-center justify-center select-none pointer-events-none drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-8 h-8 sm:w-9 sm:h-9"
            fill="#EADBC8"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g transform="translate(50, 50)">
              {/* 16 radiating rounded beige petals */}
              {Array.from({ length: 16 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="0"
                  cy="-31"
                  rx="5"
                  ry="16"
                  transform={`rotate(${i * (360 / 16)})`}
                />
              ))}
              {/* Central floral disc */}
              <circle r="14" fill="#EADBC8" />
              <circle r="10" fill="#1C140E" opacity="0.22" />
            </g>
          </svg>
        </motion.div>
      </motion.div>

      {/* BOTTOM-RIGHT: Right-aligned Name & Details Block */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="absolute right-[24px] bottom-[96px] text-right z-20 pointer-events-auto flex flex-col items-end max-w-[85%]"
      >
        <div className="text-right">
          <h2 className="text-[clamp(46px,10.5cqw,58px)] text-[#EADBC8] leading-[1.05] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] text-right">
            <MixedText text={groom.name} />
          </h2>

          <p className="font-['Arimo',sans-serif] mt-4 sm:mt-5 text-[clamp(14px,3.2cqw,16px)] font-medium text-white/95 leading-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] tracking-wide text-right">
            {groom.fullName}
          </p>
        </div>

        {/* Parents line (right-aligned, clean, formal) */}
        <div className="font-['Arimo',sans-serif] text-[clamp(12px,2.7cqw,13.5px)] leading-[1.5] text-[#F7F5F0]/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] font-normal mt-3 text-right flex flex-col items-end">
          <span>{parentsLine1}</span>
          {parentsLine2 && <span>{parentsLine2}</span>}
        </div>

        {/* Instagram link (right-aligned, >=44px tap target per mobile layout standard) */}
        {groom.instagram && (
          <div className="mt-2 flex justify-end">
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${groom.instagram}`}
              className="inline-flex items-center gap-2 py-2.5 min-h-[44px] text-white hover:opacity-80 active:opacity-70 transition-opacity select-none"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              <span className="font-['Arimo',sans-serif] text-[13px] font-medium tracking-wide text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
                {groom.instagram}
              </span>
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
};
