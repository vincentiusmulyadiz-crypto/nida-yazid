import React from 'react';
import { useInvitation } from '../context/InvitationContext';
import { invitationData, APP_MODE } from '../data/invitation';
import { Language } from '../types';
import { FlourishText, HandwrittenText, HandwrittenCoupleName } from './FlourishText';
import { CoverImage } from './CoverImage';

// Lazy load CustomizeButton only in demo/editor modes so it is excluded from final builds
const isCustomizerEnabled = APP_MODE === 'demo' || APP_MODE === 'editor';

const CustomizeButton =
  isCustomizerEnabled
    ? React.lazy(() =>
        import('./CustomizeButton').then((m) => ({
          default: m.CustomizeButton,
        }))
      )
    : null;

interface HeroProps {
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ currentLang }) => {
  // Read customer data directly from context
  const { couple, akad, reception } = useInvitation();
  const t = invitationData.translations[currentLang];

  return (
    <aside
      className="hidden lg:flex lg:flex-1 lg:min-w-0 h-[100dvh] relative overflow-hidden bg-black select-none z-10"
      aria-label="Desktop Hero Invitation Screen"
    >
      {/* Sharp Static Cover Image */}
      <CoverImage />

      {/* Light dark overlay so the photo is clearly visible */}
      <div className="absolute inset-0 bg-black/35 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Hero Content Anchored Bottom-Left with 64px left padding */}
      <div className="absolute bottom-10 xl:bottom-14 left-[64px] max-w-[50vw] z-10 pointer-events-none">
        {/* Label "The Wedding of" (Jarak ke nama pasangan sama persis dengan jarak nama pasangan ke teks bawahnya) */}
        <p className="font-['Arimo',sans-serif] text-[clamp(13px,1.05vw,16px)] uppercase tracking-[0.2em] text-[#EADBC8] font-semibold mb-[16px] drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
          <HandwrittenText text={t.weddingOf} delay={0.2} trigger="animate" />
        </p>

        {/* Couple names in mixed handwriting typography (Ukuran proporsional lebih ringkas & elegan) */}
        <h1 className="font-name text-[clamp(36px,3.2vw,50px)] leading-[1.05] text-[#ffffff] mb-[16px] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] [text-wrap:balance]">
          <HandwrittenCoupleName groom={couple.bride.name} bride={couple.groom.name} delay={0.45} trigger="animate" />
        </h1>

        {/* Extended desktop quote using Arial */}
        <blockquote
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
          className="max-w-[48vw] drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]"
        >
          <p
            dir="rtl"
            lang="ar"
            className="mb-2 text-[clamp(11px,0.9vw,13px)] leading-[1.6] text-[#F7F5F0]/90 font-normal"
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
          </p>
          <p className="text-[clamp(13px,1vw,16px)] leading-[1.45] text-[#F7F5F0]/95 font-normal [text-wrap:pretty] mb-[6px]">
            &ldquo;{currentLang === 'id'
              ? 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.'
              : 'And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.'}&rdquo;
          </p>
          <cite className="block text-[clamp(11px,0.85vw,13px)] text-[#EADBC8] not-italic mb-[18px] tracking-[0.06em] font-semibold">
            (QS. Ar-Rum: 21)
          </cite>
        </blockquote>

        {/* Date & City Location with hand-drawn mini star divider */}
        <div className="flex items-center gap-3 font-text text-[clamp(14px,1.1vw,17px)] text-[#F7F5F0]/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
          <span>{akad.date}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white/80 inline-block"
            aria-hidden="true"
          >
            <path
              d="M 32 5 C 31.5 19 22.8 29.5 5 32 C 23.2 34.2 31.8 42.6 32 59 C 32.8 42.5 42.2 33.8 59 32 C 42.5 30.6 32.5 20.2 32 5 Z"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{reception.venueName}</span>
        </div>
      </div>

      {/* 
        DESKTOP CUSTOMIZE BUTTON:
        Rendered ONLY in demo mode. Excluded completely in final mode.
        Positioned above the text block (top: 26%-28%) so it never collides with couple names at 1280, 1440, and 1920px.
      */}
      {isCustomizerEnabled && CustomizeButton && (
        <React.Suspense fallback={null}>
          <div className="absolute top-[26%] xl:top-[28%] left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <CustomizeButton currentLang={currentLang} className="pointer-events-auto" />
          </div>
        </React.Suspense>
      )}
    </aside>
  );
};
