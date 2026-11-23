import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useInvitation } from '../context/InvitationContext';
import { Language } from '../types';
import { Countdown } from './Countdown';
import { MixedText } from './FlourishText';
import { AnimatedLinkButton } from './AnimatedButton';

interface SaveTheDateSectionProps {
  currentLang: Language;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const SaveTheDateSection: React.FC<SaveTheDateSectionProps> = ({ currentLang, scrollContainerRef }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { reception, isPreview } = useInvitation();
  const prefersReduced = useReducedMotion();

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

  const googleCalendarUrl = (() => {
    const title = encodeURIComponent(reception.calendarEvent?.title || 'Resepsi Pernikahan: Nida & Yazid');
    const start = reception.calendarEvent?.start || '20270110T034500Z';
    const end = reception.calendarEvent?.end || '20270110T060000Z';
    const dates = `${start}/${end}`;
    const details = encodeURIComponent(
      reception.calendarEvent?.description ||
        `Resepsi Pernikahan Nida & Yazid\nTanggal: ${reception.date || '10 Januari 2027'}\nWaktu: ${reception.time || '10:45 – 13:00 WIB'}\nLokasi: ${reception.venueName}, ${reception.address}`
    );
    const location = encodeURIComponent(`${reception.venueName}, ${reception.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  })();

  // Use a distinct high-resolution portrait photo from the compressed package (different from /couple.jpg)
  const photoSrc = '/photos/gallery-3.jpg';

  return (
    <section
      id="save-the-date"
      ref={sectionRef}
      className="relative w-full h-[100dvh] overflow-hidden bg-black text-center flex flex-col justify-between py-12 sm:py-14 px-6 select-none flex-none m-0 p-0 border-0 rounded-none"
    >
      {/* Background Photo Layer with Scroll Zoom */}
      <motion.div
        style={{
          scale,
          borderRadius,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          WebkitMaskImage: '-webkit-radial-gradient(white, black)',
        }}
        className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0"
      >
        <img
          src={photoSrc}
          alt="Seno & Jattu Save The Date"
          className={`object-cover w-full h-full absolute inset-0 opacity-80 ${
            isPreview ? 'select-none pointer-events-none' : ''
          }`}
          style={{ objectPosition: 'center 42%' }}
          loading="lazy"
          onContextMenu={(e) => {
            if (isPreview) e.preventDefault();
          }}
          onDragStart={(e) => {
            if (isPreview) e.preventDefault();
          }}
        />

        {/* Cinematic Vignette: Dark gradients at top & bottom for high contrast readability, leaving the center clear */}
        <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-black/85 via-black/50 to-transparent pointer-events-none z-[1]" />
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none z-[1]" />
      </motion.div>

      {/* TOP REGION: Save The Date & Date 22 November 2026 */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="relative z-10 w-full pt-[calc(env(safe-area-inset-top,0px)+24px)] max-w-sm mx-auto space-y-3 text-center"
      >
        {/* Section Subtitle / Header: SAVE THE DATE (Warna beige seperti judul section lain) */}
        <h2 className="text-[clamp(19px,4.5cqw,23px)] sm:text-[23px] tracking-[0.12em] uppercase leading-tight text-[#EADBC8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
          <MixedText text="SAVE THE DATE" color="text-[#EADBC8]" />
        </h2>

        {/* Date: 22 November 2026 (Ukuran lebih besar dari Save the Date dengan spasi konsisten)
            - 22 & 2026: Font kedua (Cormorant Garamond), warna putih
            - November: Font kedua (Cormorant Garamond italic), seluruh huruf termasuk N seragam, warna putih
            - Warna putih semua (text-white)
        */}
        <div className="flex items-baseline justify-center gap-3 sm:gap-3.5 text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] pt-0.5">
          <span className="font-['Cormorant_Garamond',serif] text-[34px] sm:text-[40px] font-medium tracking-wide text-white leading-none">
            22
          </span>
          <span className="font-['Cormorant_Garamond',serif] italic text-[34px] sm:text-[40px] font-medium tracking-wide text-white leading-none">
            November
          </span>
          <span className="font-['Cormorant_Garamond',serif] text-[34px] sm:text-[40px] font-medium tracking-wide text-white leading-none">
            2026
          </span>
        </div>
      </motion.div>

      {/* CENTER SPACER: Keeps the photo of Seno & Jattu visible and unobstructed */}
      <div className="flex-1" />

      {/* BOTTOM REGION: Live Countdown & Simpan ke Kalender */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="relative z-10 w-full pb-[calc(env(safe-area-inset-bottom,0px)+48px)] sm:pb-[calc(env(safe-area-inset-bottom,0px)+56px)] max-w-sm mx-auto flex flex-col items-center text-center"
      >
        {/* Live Countdown: Digits & labels (Hari, Jam, Menit, Detik) in font kedua (Cormorant Garamond) & pure white */}
        <Countdown currentLang={currentLang} className="w-full my-0 py-1 bg-transparent text-center" />

        {/* Button: Simpan ke Kalender dengan jarak yang lebih jauh dan lega dari countdown */}
        <div className="pt-9 sm:pt-11">
          <AnimatedLinkButton
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            icon="calendar"
            aria-label="Simpan ke Google Calendar"
          >
            Simpan ke Kalender
          </AnimatedLinkButton>
        </div>
      </motion.div>
    </section>
  );
};
