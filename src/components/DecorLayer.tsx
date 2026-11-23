import React from 'react';

/**
 * Hand-drawn doodle decorations reproduced from the reference image:
 * - DoodleFlower: 6-lobed playful daisy flower with center dot
 * - DoodleHeart: hand-drawn outlined heart beside guest greeting
 * - DoodleStar: 5-point organic hand-drawn star
 */

export const DoodleFlower: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 36,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] ${className}`}
    aria-hidden="true"
  >
    {/* Daisy petals */}
    <path
      d="M32 20C29 11 19 14 22 23C13 21 11 31 20 34C11 39 16 49 25 45C24 54 34 56 37 47C42 56 52 51 47 42C56 43 58 33 49 30C58 25 53 15 44 20C45 11 35 10 32 20Z"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Inner center ring */}
    <circle
      cx="33"
      cy="33"
      r="5.5"
      stroke="currentColor"
      strokeWidth="2.4"
      fill="rgba(255, 230, 100, 0.45)"
    />
  </svg>
);

export const DoodleHeart: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 28,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] ${className}`}
    aria-hidden="true"
  >
    <path
      d="M16 28C16 28 4 20 4 11C4 6.5 7.5 3 12 3C14.5 3 16 4.5 16 4.5C16 4.5 17.5 3 20 3C24.5 3 28 6.5 28 11C28 20 16 28 16 28Z"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DoodleStar: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 32,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none pointer-events-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] ${className}`}
    aria-hidden="true"
  >
    <path
      d="M20 3L24.5 14L36.5 15L27.5 23L30.5 35L20 28.5L9.5 35L12.5 23L3.5 15L15.5 14L20 3Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Reusable Clear Selected State Indicator (Beige-White Dot)
 * 22px circle, 2px solid ring (white 60% unselected, 100% selected)
 * Dark translucent fill rgba(0,0,0,.35)
 * Selected: filled beige-white dot inside (12px, #F5EFEB), soft glow, scale-in animation
 */
export const RedDotRadio: React.FC<{ selected: boolean; className?: string }> = ({
  selected,
  className = '',
}) => (
  <span
    className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all duration-150 ${
      selected
        ? 'border-2 border-[#EADBC8] bg-black/35 shadow-[0_0_0_1px_rgba(234,219,200,0.5)]'
        : 'border-2 border-white/60 bg-black/35 group-hover:border-white/90'
    } ${className}`}
    aria-hidden="true"
  >
    {selected && (
      <span
        style={{
          boxShadow: '0 0 0 3px rgba(234, 219, 200, 0.35)',
        }}
        className="w-3 h-3 rounded-full bg-[#F5EFEB] animate-scale-in"
      />
    )}
  </span>
);
