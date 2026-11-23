import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { Language, EventDetail } from '../types';
import { MixedText } from './FlourishText';
import { AnimatedLinkButton } from './AnimatedButton';

interface EventsProps {
  currentLang: Language;
}

const WEEKDAY_PREFIX =
  /^\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday|senin|selasa|rabu|kamis|jumat|jum'at|sabtu|minggu)\b/i;

export const Events: React.FC<EventsProps> = () => {
  const {
    akad,
    reception,
    showHolyMatrimony,
    showReception,
  } = useInvitation();

  const SpinningAsterisk = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
      className="inline-flex items-center justify-center select-none pointer-events-none drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
    >
      <svg
        viewBox="0 0 48 48"
        className="w-7 h-7 sm:w-8 sm:h-8"
        fill="#EADBC8"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(24, 24)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <rect
              key={deg}
              x="-3.5"
              y="-22"
              width="7"
              height="19"
              rx="3.5"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="7" />
        </g>
      </svg>
    </motion.div>
  );

  const renderEventTitle = (title: string) => {
    const formattedTitle = title || "";

    return (
      <div className="space-y-3.5">
        {/* Spinning Beige Asterisk Icon Separator */}
        <div className="flex justify-center pb-0.5">
          <SpinningAsterisk />
        </div>

        <h3 className="font-['Cormorant_Garamond',serif] italic font-medium text-[clamp(28px,6.5cqw,34px)] leading-tight text-[#EADBC8] text-balance drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
          {formattedTitle}
        </h3>
      </div>
    );
  };

  const renderEventStack = (event: EventDetail, isLast: boolean = false) => {
    
    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`text-center px-2 sm:px-4 max-w-md mx-auto bg-transparent ${
          isLast ? 'mb-0' : 'event-card-spacing'
        }`}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-5"
        >
          {renderEventTitle(event.title)}
        </motion.div>

        {/* Date & Time Block with Calendar Icon */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="space-y-1.5"
        >
          {/* Calendar Icon */}
          <div className="flex justify-center pb-0.5">
            <Calendar className="w-5 h-5 text-[#EADBC8] drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Date */}
          <p className="font-['Arimo',sans-serif] font-semibold text-[13.5px] sm:text-[14px] text-white tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {event.day && !WEEKDAY_PREFIX.test(event.date || '') ? `${event.day}, ` : ''}{event.date}
          </p>

          {/* Time */}
          <p className="font-['Arimo',sans-serif] font-normal text-[11.5px] sm:text-[12px] text-white/80 leading-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {event.time}
          </p>
        </motion.div>

        {/* Space between Date/Time and Venue/Location */}
        {/* Venue & Location Block with MapPin Icon */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="pt-7 sm:pt-8 space-y-1.5"
        >
          {/* Location Pin Icon */}
          <div className="flex justify-center pb-0.5">
            <MapPin className="w-5 h-5 text-[#EADBC8] drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Venue Name */}
          <p className="font-['Arimo',sans-serif] font-semibold text-[15px] sm:text-[15.5px] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
            {event.venueName}
          </p>

          {/* Address */}
          <p className="font-['Arimo',sans-serif] font-normal text-[11px] sm:text-[11.5px] text-white/70 leading-relaxed max-w-[46ch] mx-auto text-center text-pretty drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] px-1">
            {event.address}
          </p>
        </motion.div>

        {/* View Maps button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
          className="pt-5 flex justify-center"
        >
          <AnimatedLinkButton
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            icon="location"
            aria-label={`Buka Google Maps ${event.title}`}
          >
            Google Maps
          </AnimatedLinkButton>
        </motion.div>

        
      </motion.div>
    );
  };

  return (
    <motion.section
      id="events"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative w-full pt-16 section-transition-bottom px-4 bg-transparent text-center"
    >
      {/* Events Stack: Jarak antara Google Maps Akad ke Ikon Asterisk Resepsi persis = jarak Many West ke Our Gallery (~190px mobile / ~220px desktop) */}
      {(() => {
        const activeEvents: { event: EventDetail; isLast: boolean }[] = [];
        const akadEvent = {
          ...akad,
          title: akad.title || 'Akad Nikah',
        };
        const receptionEvent = {
          ...reception,
          title: reception.title || 'Resepsi',
        };
        if (showHolyMatrimony) activeEvents.push({ event: akadEvent, isLast: false });
        if (showReception) activeEvents.push({ event: receptionEvent, isLast: false });

        if (activeEvents.length > 0) {
          activeEvents[activeEvents.length - 1].isLast = true;
          return (
            <div className="pt-2">
              {activeEvents.map(({ event, isLast }) => renderEventStack(event, isLast))}
            </div>
          );
        }
        return null;
      })()}
    </motion.section>
  );
};
