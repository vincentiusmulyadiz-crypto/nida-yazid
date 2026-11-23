import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, VolumeX, Globe, SlidersHorizontal } from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData, APP_MODE } from '../data/invitation';
import { Language } from '../types';

interface GlobalControlsProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onNavigateToSection: (sectionId: string) => void;
  hasOpenedInvitation: boolean;
}

export const GlobalControls: React.FC<GlobalControlsProps> = ({
  currentLang,
  onLanguageChange,
  isPlayingMusic,
  onToggleMusic,
  onNavigateToSection,
  hasOpenedInvitation,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    isCustomizerOpen,
    setIsCustomizerOpen,
    showHolyMatrimony,
    showAdat,
    showReception,
    showStory,
    showRsvp,
    showAccessCard,
    showGift,
    showPreWedVideo,
  } = useInvitation();
  const t = invitationData.translations[currentLang];

  const hasAnyEvent = showHolyMatrimony || showAdat || showReception;

  // After opening, remove the Cover entry from the SideMenu (starts directly at Couple, then Bride -> Groom)
  const menuItems = [
    ...(hasOpenedInvitation ? [] : [{ id: 'cover', label: t.menuSections.cover }]),
    { id: 'couple', label: t.menuSections.couple },
    { id: 'bride', label: t.menuSections.bride },
    { id: 'groom', label: t.menuSections.groom },
    ...(hasAnyEvent ? [{ id: 'events', label: t.menuSections.events }] : []),
    { id: 'gallery', label: t.menuSections.gallery },
    ...(showStory ? [{ id: 'story', label: t.menuSections.story }] : []),
    ...(showRsvp ? [{ id: 'rsvp', label: t.menuSections.rsvp }] : []),
    ...(showAccessCard ? [{ id: 'access', label: t.menuSections.access }] : []),
    ...(showPreWedVideo ? [{ id: 'live', label: t.menuSections.live }] : []),
    ...(showGift ? [{ id: 'gift', label: t.menuSections.gift }] : []),
    { id: 'closing', label: t.menuSections.closing },
  ];

  const handleSelectSection = (id: string) => {
    setIsMenuOpen(false);
    onNavigateToSection(id);
  };

  const toggleLanguage = () => {
    onLanguageChange(currentLang === 'en' ? 'id' : 'en');
  };

  return (
    <>
      {/* 
        Floating controls positioned relative to the right column:
        Menu button, music toggle, and mobile customize icon at bottom-left
      */}
      <div
        style={{
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
          left: '16px',
        }}
        className="fixed lg:absolute z-40 flex items-center gap-2"
      >
        {/* Round Menu Button (40px) */}
        {hasOpenedInvitation && (
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-full border border-[rgba(255,255,255,0.35)] bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px] text-white hover:border-white/80 transition-all flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Navigation Menu"
            title="Navigation Menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Round Music Toggle (40px) with Full-Circle Vinyl */}
        {hasOpenedInvitation && (
          <button
            onClick={onToggleMusic}
            className="w-10 h-10 rounded-full border border-[rgba(234,219,200,0.5)] bg-[rgba(18,14,11,0.7)] backdrop-blur-[6px] text-[#EADBC8] hover:border-[#EADBC8] transition-all flex items-center justify-center cursor-pointer shadow-lg p-0 overflow-hidden relative"
            aria-label={isPlayingMusic ? 'Mute Music' : 'Play Music'}
            title={isPlayingMusic ? 'Mute Music' : 'Play Music'}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className={`w-full h-full transition-opacity duration-300 ${
                  isPlayingMusic
                    ? 'animate-[spin_4s_linear_infinite] opacity-100 text-[#EADBC8]'
                    : 'opacity-70 text-[#EADBC8]'
                }`}
              >
                {/* Full-Circle Outer Vinyl Disc */}
                <circle
                  cx="12"
                  cy="12"
                  r="11.2"
                  fill="#15110E"
                  stroke="#EADBC8"
                  strokeWidth="1.2"
                />
                {/* Vinyl Grooves */}
                <circle
                  cx="12"
                  cy="12"
                  r="9.2"
                  stroke="#EADBC8"
                  strokeWidth="0.7"
                  strokeDasharray="4 2"
                  opacity="0.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="7.4"
                  stroke="#EADBC8"
                  strokeWidth="0.6"
                  opacity="0.45"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="5.6"
                  stroke="#EADBC8"
                  strokeWidth="0.6"
                  strokeDasharray="3 2"
                  opacity="0.4"
                />
                {/* Warm Center Label */}
                <circle
                  cx="12"
                  cy="12"
                  r="3.8"
                  fill="#78482E"
                  stroke="#EADBC8"
                  strokeWidth="0.9"
                />
                {/* Spindle Hole */}
                <circle cx="12" cy="12" r="1.1" fill="#120E0B" />
              </svg>
              {!isPlayingMusic && (
                <span className="absolute w-7 h-[1.8px] bg-[#EADBC8] rotate-45 rounded-full pointer-events-none shadow-[0_0_4px_rgba(0,0,0,0.8)]" />
              )}
            </div>
          </button>
        )}

        {/* Mobile Customize Button: 40px round, 20px sliders icon, demo & editor modes, hides when panel open */}
        {(APP_MODE === 'demo' || APP_MODE === 'editor') && !isCustomizerOpen && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsCustomizerOpen(true);
            }}
            className="lg:hidden w-10 h-10 rounded-full border border-[rgba(255,255,255,0.35)] bg-[rgba(0,0,0,0.25)] backdrop-blur-[6px] text-white hover:border-white/80 transition-all flex items-center justify-center cursor-pointer shadow-lg select-none"
            aria-label="Customize"
            title="Customize"
          >
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Bottom-Right EN / ID Language Switch Toggle */}
      <div
        className="fixed lg:absolute bottom-4 right-4 z-40 pointer-events-auto"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
      >
        <button
          type="button"
          onClick={() => onLanguageChange(currentLang === 'id' ? 'en' : 'id')}
          className="h-9 px-3 rounded-full bg-black/45 hover:bg-black/65 text-white border border-white/25 backdrop-blur-md flex items-center gap-1.5 text-[11px] font-['Arimo',sans-serif] font-medium tracking-wider uppercase transition-all shadow-sm cursor-pointer select-none"
          aria-label={currentLang === 'id' ? 'Switch language to English' : 'Ganti bahasa ke Indonesia'}
          title={currentLang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <Globe className="w-3.5 h-3.5 text-[#EADBC8]" />
          <span>{currentLang === 'id' ? 'ID' : 'EN'}</span>
        </button>
      </div>



      {/* Slide-Up Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-zinc-950/95 border-t border-white/20 rounded-t-2xl p-6 z-10 font-text max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="font-title text-[var(--fs-title)] text-white font-normal">
                  {currentLang === 'id' ? 'Daftar Menu' : 'Navigation Menu'}
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-full text-white/70 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSection(item.id)}
                    className="w-full text-left py-2.5 px-3 rounded-lg text-[var(--fs-lead)] text-white/85 hover:text-white hover:bg-white/10 transition-colors font-title"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
