import React from 'react';

interface IconProps {
  className?: string;
}

const combineIconClass = (className?: string) => {
  const base = className || 'w-6 h-6';
  return base.includes('icon-wiggle') ? base : `${base} icon-wiggle`;
};

/**
 * Save The Date / Calendar icon for wedding date
 */
export const SaveTheDateIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M12 14.5c-.8-1-2.2-.8-2.2.6 0 1.4 2.2 2.7 2.2 2.7s2.2-1.3 2.2-2.7c0-1.4-1.4-1.6-2.2-.6z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

/**
 * Holy Matrimony / Akad Nikah sacred wedding rings icon
 */
export const HolyMatrimonyIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <circle cx="8.5" cy="13.5" r="5" />
    <circle cx="15.5" cy="13.5" r="5" />
    <path d="M8.5 4.5l1.5 2h-3l1.5-2z" />
    <path d="M7 6.5h3" />
  </svg>
);

/**
 * Cultural Ceremony (Adat) / Flower Bouquet icon (Buket Bunga dari file BUNGA.svg)
 */
export const AdatIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    {/* Outer Leaf / Petal Scallops */}
    <path d="M12.5 3.5c-.8-.8-1.8-.2-2.2.5-.7-.3-1.6.2-1.8 1-.8.2-1.2 1-.9 1.8-.7.6-.7 1.5-.2 2.2-.6.7-.4 1.7.3 2.2.8.6 1.8.6 2.5 0" />
    <path d="M13 3.5c.8-.8 1.8-.3 2.3.4.8-.2 1.7.3 1.9 1.1.8.3 1.2 1.2.9 2 .7.7.7 1.7.1 2.4.5.8.3 1.8-.5 2.3-.8.5-1.8.4-2.4-.2" />

    {/* Hand-drawn Roses Cluster with internal spirals */}
    {/* Rose 1: Top Center */}
    <circle cx="12.5" cy="5.2" r="1.3" />
    <path d="M12.1 4.5a.8.8 0 0 1 .9.3c.2.4-.1.8-.5.8" />

    {/* Rose 2: Top Left */}
    <circle cx="9.8" cy="6.2" r="1.3" />
    <path d="M9.4 5.6a.7.7 0 0 1 .8.2c.2.3 0 .7-.4.7" />

    {/* Rose 3: Top Right */}
    <circle cx="15.2" cy="5.8" r="1.3" />
    <path d="M14.8 5.2a.7.7 0 0 1 .8.2c.2.3 0 .7-.4.7" />

    {/* Rose 4: Center */}
    <circle cx="12.6" cy="7.8" r="1.4" />
    <path d="M12.2 7.1a.8.8 0 0 1 .9.3c.2.4-.1.8-.5.8" />

    {/* Rose 5: Far Right */}
    <circle cx="17.4" cy="7.8" r="1.2" />
    <path d="M17.1 7.3a.6.6 0 0 1 .6.2c.2.3 0 .6-.3.6" />

    {/* Rose 6: Mid Left */}
    <circle cx="10" cy="8.9" r="1.3" />
    <path d="M9.6 8.3a.7.7 0 0 1 .8.2c.2.3 0 .7-.4.7" />

    {/* Rose 7: Center Bottom */}
    <circle cx="13.2" cy="10.2" r="1.4" />
    <path d="M12.8 9.5a.8.8 0 0 1 .9.3c.2.4-.1.8-.5.8" />

    {/* Rose 8: Bottom Right */}
    <circle cx="15.8" cy="9.8" r="1.3" />
    <path d="M15.4 9.2a.7.7 0 0 1 .8.2c.2.3 0 .7-.4.7" />

    {/* Bouquet Wrapper Cone & Diagonal Crease Fold */}
    <path d="M9.2 10.6c-.3 1.8-.2 3.5.5 4.9" />
    <path d="M16.8 11.2c-.8 1.6-2.2 3.1-4.8 4.3" />
    <path d="M16 11.5c-1.4 1.5-3.3 2.7-5.8 3.5" />

    {/* Tied Neck Bands */}
    <path d="M9.7 15.5c.8.3 1.8.5 2.6.5" />
    <path d="M9.4 16.5c.8.3 1.8.5 2.6.5" />

    {/* Flared Lower Wrapper Skirt with Scalloped Hem and Folds */}
    <path d="M9.4 16.5l-2.2 3.2c-.3.4-.2.8.2 1.1l.6.5c.3.2.7.2.9-.1l.6-.7c.3-.3.7-.3 1 0l.5.6c.3.3.7.3 1 0l.4-.5c.2-.2.5-.2.7 0l.3.4" />
    <path d="M12 17l1.2 3" />
    <path d="M9.2 17.5l-.8 3.2" />
    <path d="M10.8 17.2l-.2 3" />
  </svg>
);

/**
 * Reception celebration icon (Champagne toast / clinking glasses)
 */
export const ReceptionIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <path d="M7 3l3 7v7M17 3l-3 7v7" />
    <path d="M6 17h8M10 17h8" />
    <path d="M7 3h4l-2 5zM13 3h4l-2 5z" />
    <path d="M11 2l1 2M13 1.5l-.5 2" />
  </svg>
);

/**
 * Our Gallery / Photo memoir icon
 */
export const OurGalleryIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
    <path d="M14 14l2-2 5 5" />
  </svg>
);

/**
 * Love Story milestone / Timeline romantic story icon
 */
export const LoveStoryIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <path d="M12 6.5C10-1 2 0.5 2 7.5c0 6.5 10 13 10 13s10-6.5 10-13C22 0.5 14-1 12 6.5z" />
  </svg>
);

/**
 * Entrance VIP Pass / Access Card badge icon
 */
export const EntranceVipIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="12" cy="10" r="2.5" />
    <path d="M7 16.5c0-1.8 2.2-3 5-3s5 1.2 5 3" />
    <path d="M9 2h6" />
  </svg>
);

/**
 * Video Prewed / Live Stream camera icon
 */
export const VideoPrewedIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <rect x="2" y="5" width="14" height="14" rx="3" />
    <path d="M16 10l5-3.5v11L16 14" />
    <circle cx="9" cy="12" r="2" />
  </svg>
);

/**
 * RSVP & Wishes envelope icon
 */
export const RsvpIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="15" rx="2.5" />
    <path d="M3 6.5l9 6 9-6" />
    <path d="M12 15.5l1.5 1.5 3-3" />
  </svg>
);

/**
 * Wedding Gift box icon
 */
export const GiftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={combineIconClass(className)}
    aria-hidden="true"
  >
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 8v13" />
    <rect x="2" y="5" width="20" height="3" rx="1.5" />
    <path d="M12 5C10.5 2.5 8 2.5 8 4s2.5 1 4 1z" />
    <path d="M12 5C13.5 2.5 16 2.5 16 4s-2.5 1-4 1z" />
  </svg>
);

/**
 * Clean Ticket Outline icon (minimalist, empty inside)
 */
export const LiveMusicTicketIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className || 'w-5 h-5'}
    aria-hidden="true"
  >
    <path d="M 3 9 a 3 3 0 0 1 0 6 v 2.5 a 2 2 0 0 0 2 2 h 14 a 2 2 0 0 0 2 -2 V 15 a 3 3 0 0 1 0 -6 V 6.5 a 2 2 0 0 0 -2 -2 H 5 a 2 2 0 0 0 -2 2 z" />
  </svg>
);
