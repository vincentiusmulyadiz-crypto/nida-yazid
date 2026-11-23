import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { Language } from '../types';

export const CUSTOMIZER_BUNDLE_MARKER = "CUSTOMIZER_BUNDLE_MARKER_91b2";
if (typeof window !== 'undefined') {
  (window as any).__cbm_btn = CUSTOMIZER_BUNDLE_MARKER;
}

interface CustomizeButtonProps {
  currentLang: Language;
  className?: string;
}

export const CustomizeButton: React.FC<CustomizeButtonProps> = ({
  currentLang,
  className = '',
}) => {
  const { isCustomizerOpen, setIsCustomizerOpen } = useInvitation();

  if (isCustomizerOpen) {
    return null;
  }

  const label = currentLang === 'en' ? 'Customize' : 'Sesuaikan';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsCustomizerOpen(true);
      }}
      className={`btn-pill-transparent animate-border-pulse shadow-lg cursor-pointer pointer-events-auto select-auto ${className}`}
      aria-label={label}
    >
      <SlidersHorizontal className="w-3.5 h-3.5 text-white/90" />
      <span>{label}</span>
    </button>
  );
};
