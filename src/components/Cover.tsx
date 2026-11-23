import React from 'react';
import { motion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData } from '../data/invitation';
import { Language } from '../types';
import { FlourishText, HandwrittenText, HandwrittenCoupleName } from './FlourishText';
import { AnimatedButton } from './AnimatedButton';

interface CoverProps {
  currentLang: Language;
  onOpenInvitation: () => void;
  isOpen: boolean;
}

export const Cover: React.FC<CoverProps> = ({ onOpenInvitation, isOpen }) => {
  const { couple, guestName } = useInvitation();

  return (
    <section
      id="cover"
      className={`relative min-h-[100dvh] h-[100dvh] w-full flex flex-col justify-between p-6 sm:p-8 pt-[calc(env(safe-area-inset-top,0px)+28px)] pb-[calc(env(safe-area-inset-bottom,0px)+72px)] sm:pb-[calc(env(safe-area-inset-bottom,0px)+84px)] z-20 text-center bg-transparent select-none overflow-hidden box-border transition-all duration-500 ease-out ${
        isOpen ? 'max-lg:opacity-0 max-lg:scale-96 max-lg:pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top: "Dear, {guestName}" - Sedikit lebih kecil dan warna putih */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="pt-2 sm:pt-3"
      >
        <p className="font-['Arimo',sans-serif] text-[clamp(19px,4.5cqw,22px)] sm:text-[22px] leading-tight text-white font-medium [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]">
          <HandwrittenText text={`Dear, ${guestName}`} delay={0.2} trigger="animate" />
        </p>
      </motion.div>

      {/* Spacer to push couple names down */}
      <div className="flex-1" />

      {/* 
        Bottom Stack:
        - Couple Names (Beige)
        - "are getting married" subtitle (Warna Putih)
        - "Open Invitation" Button with elevated position
      */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
        className="pb-2 space-y-7 sm:space-y-8 max-w-sm mx-auto w-full"
      >
        <div className="text-center space-y-1.5">
          <h1 className="text-[clamp(36px,8.5cqw,46px)] leading-[1.08] text-[#EADBC8] font-normal [text-shadow:0_2px_14px_rgba(0,0,0,0.7),0_1px_4px_rgba(0,0,0,0.5)] [text-wrap:balance]">
            <HandwrittenCoupleName groom={couple.bride.name} bride={couple.groom.name} delay={0.45} trigger="animate" />
          </h1>
          <p className="font-['Cormorant_Garamond',serif] italic text-[20px] sm:text-[23px] text-white tracking-widest [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            <HandwrittenText text="are getting married" delay={1.4} trigger="animate" />
          </p>
        </div>

        {/* Open Invitation Button (Animated Button) */}
        <div className="pt-1">
          <AnimatedButton
            onClick={onOpenInvitation}
            aria-label="Open Invitation"
          >
            Open Invitation
          </AnimatedButton>
        </div>

        {isOpen && (
          <p className="font-['Arimo',sans-serif] text-[11px] text-[#F2EFE8]/70 pt-0.5 animate-pulse">
            Gulir ke bawah untuk melihat undangan
          </p>
        )}
      </motion.div>
    </section>
  );
};
