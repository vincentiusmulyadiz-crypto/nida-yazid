import React from 'react';
import { useInvitation } from '../context/InvitationContext';
import { APP_MODE } from '../data/invitation';

export const Watermark: React.FC = () => {
  const { isPreview } = useInvitation();

  if (APP_MODE !== 'demo' || !isPreview) return null;

  return (
    <aside
      className="absolute bottom-16 right-5 pointer-events-none select-none z-30 opacity-60 flex items-center"
      aria-label="Preview badge"
    >
      <span className="font-serif-display italic text-xs text-[#F2EFE8] tracking-wider px-2.5 py-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-sm">
        Preview
      </span>
    </aside>
  );
};
