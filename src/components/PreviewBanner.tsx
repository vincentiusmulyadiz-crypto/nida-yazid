import React from 'react';
import { useInvitation } from '../context/InvitationContext';
import { APP_MODE } from '../data/invitation';
import { Language } from '../types';

interface PreviewBannerProps {
  currentLang: Language;
}

export const PreviewBanner: React.FC<PreviewBannerProps> = ({ currentLang }) => {
  const { isPreview } = useInvitation();

  if (APP_MODE !== 'demo' || !isPreview) return null;

  const text =
    currentLang === 'id'
      ? 'Ini hanya preview. Pesan untuk mendapatkan versi final.'
      : 'This is a preview only. Order to receive the final version.';

  return (
    <div className="w-full py-2 px-4 bg-black/60 border-b border-white/15 backdrop-blur-md text-center text-xs text-[#F2EFE8]/80 font-serif-display italic z-20 sticky top-0 select-none">
      <span>{text}</span>
    </div>
  );
};
