/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { InvitationProvider, useInvitation } from './context/InvitationContext';
import { Language } from './types';
import { musicPlayer } from './utils/audio';

import { Hero } from './components/Hero';
import { Cover } from './components/Cover';
import { CoupleSection } from './components/CoupleSection';
import { GroomSection } from './components/GroomSection';
import { BrideSection } from './components/BrideSection';
import { SaveTheDateSection } from './components/SaveTheDateSection';
import { Events } from './components/Events';
import { Story } from './components/Story';
import { Gallery } from './components/Gallery';
import { AccessCard } from './components/AccessCard';
import { LiveStream } from './components/LiveStream';
import { Rsvp } from './components/Rsvp';
import { Gift } from './components/Gift';
import { Closing } from './components/Closing';
import { GlobalControls } from './components/GlobalControls';
import { Toast } from './components/Toast';
import { BackgroundVideo } from './components/BackgroundVideo';
import { LoadingScreen } from './components/LoadingScreen';
import { Watermark } from './components/Watermark';
import { PreviewBanner } from './components/PreviewBanner';
import { APP_MODE } from './data/invitation';
import { trackGuestOpen } from './utils/trackOpen';

// Load Customizer code in demo and editor modes via React.lazy so it is completely excluded in final builds
const isCustomizerEnabled = APP_MODE === 'demo' || APP_MODE === 'editor';

const CustomizerPanel = isCustomizerEnabled
  ? React.lazy(() =>
      import('./components/CustomizerPanel').then((m) => ({
        default: m.CustomizerPanel,
      }))
    )
  : null;

const CustomizeButton = isCustomizerEnabled
  ? React.lazy(() =>
      import('./components/CustomizeButton').then((m) => ({
        default: m.CustomizeButton,
      }))
    )
  : null;

function InvitationApp() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [hasOpened, setHasOpened] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const rightColumnRef = useRef<HTMLDivElement>(null);
  const {
    activeMusic,
    couple,
    showHolyMatrimony,
    showAdat,
    showReception,
    showStory,
    showRsvp,
    showAccessCard,
    showGift,
    showPreWedVideo,
  } = useInvitation();

  // Mode-specific metadata: title and robots
  useEffect(() => {
    if (APP_MODE === 'editor') {
      document.title = 'Editor';
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    } else if (APP_MODE === 'final') {
      document.title = `The Wedding of ${couple.bride.name} & ${couple.groom.name}`;
      let metaRobots = document.querySelector('meta[name="robots"]');
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.setAttribute('name', 'robots');
        document.head.appendChild(metaRobots);
      }
      metaRobots.setAttribute('content', 'noindex, nofollow');
    }
  }, [couple.groom.name, couple.bride.name]);

  useEffect(() => {
    musicPlayer.init(activeMusic);
  }, [activeMusic]);

  // When Cover is removed, reset scroll position to top synchronously
  useLayoutEffect(() => {
    if (coverRemoved) {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024 && rightColumnRef.current) {
        rightColumnRef.current.scrollTop = 0;
      } else if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  }, [coverRemoved]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2000);
  };

  const handleOpenInvitation = async () => {
    trackGuestOpen();
    setHasOpened(true);
    // User gesture trigger for BackgroundVideo autoplay on iOS and Android
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('app-open-invitation'));
    }
    const played = await musicPlayer.play();
    setIsPlayingMusic(played);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCoverRemoved(true);
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    if (isMobile) {
      // Identical to Amik & Aldo: fade out cover cleanly, then reveal main invitation at top of native document flow
      setTimeout(() => {
        setCoverRemoved(true);
      }, 450);
      return;
    }

    // Desktop: Smooth-scroll (about 900ms) directly to the Couple section inside rightColumnRef
    const coupleEl = document.getElementById('couple');
    if (coupleEl) {
      coupleEl.scrollIntoView({ behavior: 'smooth' });
    }

    // After scroll finishes, remove Cover from DOM and reset scrollTop in useLayoutEffect
    setTimeout(() => {
      setCoverRemoved(true);
    }, 900);
  };

  const handleToggleMusic = () => {
    const isPlaying = musicPlayer.toggle();
    setIsPlayingMusic(isPlaying);
  };

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full bg-[#12100E] text-[#F2EFE8] font-body selection:bg-white/20 selection:text-white flex flex-col lg:flex-row">
      {/* 
        DESKTOP LEFT SCREEN (>=1024px): 
        Takes ALL remaining width: flex: 1 (min-width: 0), full height (100dvh).
        Static cover image, dark gradient overlay, and bottom-left editorial typography.
      */}
      <Hero currentLang={currentLang} />

      {/* 
        RIGHT INVITATION COLUMN:
        - Desktop (>=1024px): exact 9:16 frame -> height: 100dvh; width: min(calc(100dvh * 9 / 16), 40vw); flex: none;
        - Mobile (<1024px): natural single full-bleed column flowing with root document (like Amik & Aldo)
        - container-type: inline-size for cqw-based typography
      */}
      <div className="w-full md:max-w-[440px] md:mx-auto lg:max-w-none lg:mx-0 lg:w-[min(calc(100dvh*9/16),40vw)] lg:flex-none min-h-screen min-h-[100dvh] lg:h-[100dvh] relative lg:overflow-hidden bg-transparent invitation-column z-20">
        {/* Slim preview banner at the top of the invitation column (demo mode only) */}
        {APP_MODE === 'demo' && <PreviewBanner currentLang={currentLang} />}

        {/* 
          RIGHT COLUMN FULLSCREEN BACKGROUND VIDEO:
          Fills this exact 9:16 frame on desktop, fixed full screen on mobile.
          Object-fit cover, center. Zero cropping on 9:16 frame.
          Stays still within column bounds while content scrolls.
        */}
        <BackgroundVideo hasOpened={hasOpened} />

        {/* Scrollable invitation content container (desktop uses inner scrollbar, mobile uses root document scroll) */}
        <main
          ref={rightColumnRef}
          className={`w-full min-h-[100dvh] lg:h-[100dvh] relative z-10 ${
            hasOpened ? 'lg:overflow-y-auto' : 'lg:overflow-hidden'
          } no-scrollbar bg-transparent`}
        >
          {/* Invitation Content Sections (Fully Transparent, Sitting directly on the fixed background) */}
          <div className="relative z-10 w-full min-h-[100dvh]">
            {/* 1. Cover (only rendered before opening; removed from DOM after open) */}
            {!coverRemoved && (
              <Cover
                currentLang={currentLang}
                onOpenInvitation={handleOpenInvitation}
                isOpen={hasOpened}
              />
            )}

            {/* 
              Full-Bleed Photo Sections Wrapper:
              Couple -> The Bride -> The Groom
              On mobile, hidden until cover is opened (like Amik & Aldo) so document is 1 screen tall without overflow:hidden
            */}
            <div
              className={`${
                !coverRemoved ? 'max-lg:hidden' : 'block'
              } m-0 p-0 gap-0 bg-transparent lg:bg-black w-full`}
            >
              <CoupleSection
                currentLang={currentLang}
                scrollContainerRef={rightColumnRef}
                isCoverRemoved={coverRemoved}
              />
              <BrideSection
                currentLang={currentLang}
                scrollContainerRef={rightColumnRef}
              />
              <GroomSection
                currentLang={currentLang}
                scrollContainerRef={rightColumnRef}
              />
            </div>

            {/* Content unlocked when Open Invitation is tapped (Transparent over fixed background video) */}
            <div
              className={`transition-opacity duration-700 ${
                !coverRemoved ? 'max-lg:hidden ' : ''
              }${
                hasOpened ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* 4. Save The Date & Live Countdown */}
              <SaveTheDateSection currentLang={currentLang} scrollContainerRef={rightColumnRef} />

              {/* 5. The Celebration Events */}
              {(showHolyMatrimony || showAdat || showReception) && (
                <Events currentLang={currentLang} />
              )}

              {/* 5. Visual Memoir Gallery */}
              <Gallery currentLang={currentLang} />

              {/* 6. Our Story Timeline */}
              {showStory && <Story currentLang={currentLang} />}

              {/* 7. RSVP and Warm Wishes */}
              {showRsvp && <Rsvp currentLang={currentLang} onShowToast={showToast} />}

              {/* 8. Entrance Access Card (The ONLY Light Element) */}
              {showAccessCard && <AccessCard currentLang={currentLang} />}

              {/* 9. Watch Live Stream & Pre-Wed (Disabled by default) */}
              {showPreWedVideo && <LiveStream currentLang={currentLang} />}

              {/* 10. Wedding Gift */}
              {showGift && <Gift currentLang={currentLang} onShowToast={showToast} />}

              {/* 11. Closing Thank You */}
              <Closing currentLang={currentLang} />
            </div>
          </div>
        </main>

        {/* Floating Controls positioned relative to the column */}
        <GlobalControls
          currentLang={currentLang}
          onLanguageChange={setCurrentLang}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={handleToggleMusic}
          onNavigateToSection={handleNavigateToSection}
          hasOpenedInvitation={hasOpened}
        />

        {/* Subtle Preview badge in bottom-right corner of the column (demo mode only) */}
        {APP_MODE === 'demo' && <Watermark />}
      </div>

      {/* Toast Notification (Transparent Pill) */}
      <Toast message={toastMessage} />

      {/* Thin red ribbon in editor mode */}
      {APP_MODE === 'editor' && (
        <div className="fixed top-0 left-0 z-[9999] bg-red-600 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 shadow-md select-none pointer-events-none">
          EDITOR
        </div>
      )}

      {/* Slide-In Customizer Panel (demo and editor modes only, loaded via React.lazy) */}
      {isCustomizerEnabled && CustomizerPanel && (
        <React.Suspense fallback={null}>
          <CustomizerPanel currentLang={currentLang} />
        </React.Suspense>
      )}

      {/* Joyever Official Loading Screen */}
      <LoadingScreen isLoading={isLoading} />
    </div>
  );
}

export default function App() {
  return (
    <InvitationProvider>
      <InvitationApp />
    </InvitationProvider>
  );
}
