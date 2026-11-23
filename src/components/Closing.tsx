import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData } from '../data/invitation';
import { Language } from '../types';
import { FlourishText } from './FlourishText';

interface ClosingProps {
  currentLang: Language;
}

export const Closing: React.FC<ClosingProps> = ({ currentLang }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { couple, isPreview, closingPhoto } = useInvitation();
  const t = invitationData.translations[currentLang];

  return (
    <motion.section
      ref={sectionRef}
      id="closing"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full h-[100dvh] overflow-hidden bg-black text-center flex flex-col justify-between select-none"
    >
      {/* Full-bleed Photo Layer covering 1 full section */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
        <img
          src={closingPhoto}
          alt={`${couple.bride.name} & ${couple.groom.name}`}
          className={`object-cover w-full h-full absolute inset-0 ${
            isPreview ? 'select-none pointer-events-none' : ''
          }`}
          loading="lazy"
          onContextMenu={(e) => {
            if (isPreview) e.preventDefault();
          }}
          onDragStart={(e) => {
            if (isPreview) e.preventDefault();
          }}
        />

        {/* Subtle bottom gradient only for footer credit readability, keeping full photo opacity & clarity */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent pointer-events-none z-[1]" />
      </div>

      {/* Top Floating Overlay: Couple Names ("With Love" / "Dengan Kasih") */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        className="relative z-10 w-full pt-[calc(env(safe-area-inset-top,0px)+36px)] px-6 sm:px-8 space-y-1 text-center max-w-sm mx-auto"
      >
        <p className="font-['Arimo',sans-serif] text-[12px] sm:text-[12.5px] text-[#EADBC8]/90 tracking-[0.2em] uppercase font-medium drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          {currentLang === 'id' ? 'Dengan Kasih' : 'With Love'}
        </p>

        <h3 className="text-[clamp(34px,8cqw,42px)] text-[#ffffff] leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)] text-center">
          <FlourishText text={`${couple.bride.name} & ${couple.groom.name}`} />
        </h3>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Floating Overlay: Footer credits only */}
      <div className="relative z-10 w-full pb-8 sm:pb-10 px-6 sm:px-8 text-center">
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
          className="space-y-3 text-center font-text pt-2"
        >
          <p className="font-text text-[clamp(14px,3.2cqw,16px)] text-[#F7F5F0]/85 tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            Created by: <span className="font-medium text-white">joyever.id</span>
          </p>

          {/* Social Media Buttons: Instagram & TikTok */}
          <div className="flex items-center justify-center gap-3.5 pt-0.5">
            {/* Instagram Button */}
            <a
              href="https://www.instagram.com/joyever.id/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram joyever.id"
              className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md text-white/90 hover:text-white hover:border-white/80 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer shadow-lg select-none"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* TikTok Button */}
            <a
              href="https://www.tiktok.com/@joyever.id"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok joyever.id"
              className="w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md text-white/90 hover:text-white hover:border-white/80 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer shadow-lg select-none"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>

          <p
            style={{
              fontFamily:
                'Calibri, Arial, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
            className="text-[13.5px] sm:text-[14px] text-[#F7F5F0]/70 pt-1 tracking-normal text-center select-none drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
          >
            © {new Date().getFullYear()} joyever.id. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </motion.section>
  );
};
