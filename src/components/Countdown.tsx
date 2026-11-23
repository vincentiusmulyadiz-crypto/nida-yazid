import React, { useEffect, useState } from 'react';
import { invitationData } from '../data/invitation';
import { Language } from '../types';

interface CountdownProps {
  currentLang: Language;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const parseTargetDate = (raw: string | number | undefined): number => {
  if (!raw) return NaN;
  if (typeof raw === 'number') return raw;
  const str = String(raw).trim();
  const direct = new Date(str).getTime();
  if (!isNaN(direct)) return direct;

  // Handles compact iCal format: 20261122T060000Z or 20261122T060000
  const match = str.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/i);
  if (match) {
    const [, y, m, d, hh, mm, ss, z] = match;
    return new Date(`${y}-${m}-${d}T${hh}:${mm}:${ss}${z ? 'Z' : ''}`).getTime();
  }

  // Handles date-only compact format: 20261122
  const dateMatch = str.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (dateMatch) {
    const [, y, m, d] = dateMatch;
    return new Date(`${y}-${m}-${d}T00:00:00Z`).getTime();
  }

  return NaN;
};

export const Countdown: React.FC<CountdownProps> = ({ currentLang, className = 'w-full my-4 py-2 bg-transparent text-center' }) => {
  const t = invitationData.translations[currentLang].countdown;
  const targetTime = parseTargetDate(invitationData.events.countdownTarget);

  const calculateTimeLeft = (): TimeLeft => {
    if (isNaN(targetTime)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const difference = targetTime - new Date().getTime();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  const units = [
    { label: t.days, value: isNaN(timeLeft.days) ? 0 : timeLeft.days },
    { label: t.hours, value: isNaN(timeLeft.hours) ? 0 : timeLeft.hours },
    { label: t.minutes, value: isNaN(timeLeft.minutes) ? 0 : timeLeft.minutes },
    { label: t.seconds, value: isNaN(timeLeft.seconds) ? 0 : timeLeft.seconds },
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center max-w-xs mx-auto">
        {units.map((unit, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Live countdown number: font kedua (Cormorant Garamond) & pure white */}
            <span className="font-['Cormorant_Garamond',serif] text-3xl sm:text-4xl text-white font-normal tabular-nums leading-none mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)]">
              {String(unit.value).padStart(2, '0')}
            </span>
            {/* Hari, Jam, Menit, Detik: font kedua (Cormorant Garamond) & pure white */}
            <span className="font-['Cormorant_Garamond',serif] text-[13px] sm:text-[14px] text-white/95 font-medium tracking-[0.06em] capitalize drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
