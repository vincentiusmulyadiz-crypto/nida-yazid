import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronDown,
  RotateCcw,
  Upload,
  Trash2,
  Plus,
  Music,
  Video,
  Image as ImageIcon,
  Heart,
  Calendar,
  Quote,
  MessageCircle,
  Sparkles,
  Gift,
  SlidersHorizontal,
  Layers,
} from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { MEDIA, CONFIG, APP_MODE, invitationData } from '../data/invitation';
import { Language } from '../types';
import { processAndResizePhoto } from '../utils/imageResize';
import { RedDotRadio } from './DecorLayer';
import { deflateSync } from 'fflate';

export const CUSTOMIZER_BUNDLE_MARKER = "CUSTOMIZER_BUNDLE_MARKER_91b2";
if (typeof window !== 'undefined') {
  (window as any).__cbm = CUSTOMIZER_BUNDLE_MARKER;
}

const EditorOrderSection =
  APP_MODE === 'editor'
    ? React.lazy(() => import('../editor/EditorOrderSection'))
    : null;

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  isId?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  isId,
}) => (
  <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
    <div className="flex-1 pr-2">
      <div className="flex items-center gap-2">
        <span className="text-white text-xs font-medium block">{label}</span>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
            checked
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-white/10 text-white/40 border border-white/10'
          }`}
        >
          {checked ? (isId ? 'Aktif' : 'On') : (isId ? 'Sembunyi' : 'Off')}
        </span>
      </div>
      {description && <span className="text-white/50 text-[11px] block mt-0.5">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#9E2A2B]' : 'bg-white/20'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

interface CustomizerPanelProps {
  currentLang: Language;
}

export const CustomizerPanel: React.FC<CustomizerPanelProps> = ({ currentLang }) => {
  const invitationContext = useInvitation();
  const {
    couple,
    updateCoupleField,
    updateQuote,
    akad,
    culturalCeremony,
    reception,
    updateEventField,
    showHolyMatrimony,
    setShowHolyMatrimony,
    showAdat,
    setShowAdat,
    showReception,
    setShowReception,
    showStory,
    setShowStory,
    showRsvp,
    setShowRsvp,
    showAccessCard,
    setShowAccessCard,
    showGift,
    setShowGift,
    showPhysicalGift,
    setShowPhysicalGift,
    showPreWedVideo,
    setShowPreWedVideo,
    bgType,
    setBgType,
    bgPhoto,
    setBgPhoto,
    bgPhotos,
    setBgPhotos,
    addBgPhoto,
    updateBgPhoto,
    removeBgPhoto,
    bankAccounts,
    updateBankAccount,
    addBankAccount,
    removeBankAccount,
    physicalGiftAddress,
    updatePhysicalGiftAddress,
    preWedVideoUrl,
    setPreWedVideoUrl,
    storyMilestones,
    updateStoryMilestone,
    setStoryMilestones,
    addStoryMilestone,
    removeStoryMilestone,
    galleryPhotos,
    addGalleryPhoto,
    updateGalleryPhoto,
    removeGalleryPhoto,
    deleteGalleryPhoto,
    coverImage,
    setCoverImage,
    removeCoverImage,
    welcomePhoto,
    setWelcomePhoto,
    welcomeData,
    updateWelcomeData,
    couplePhoto,
    setCouplePhoto,
    coupleSectionData,
    updateCoupleSectionData,
    accessCardPhoto,
    setAccessCardPhoto,
    closingPhoto,
    setClosingPhoto,
    groomPhoto,
    setGroomPhoto,
    bridePhoto,
    setBridePhoto,
    selectedPresetId,
    setSelectedPresetId,
    currentPreset,
    customVideo,
    customVideoUrl,
    customVideoName,
    setCustomVideo,
    removeCustomVideo,
    videoError,
    setVideoError,
    activeMusic,
    setActiveMusic,
    isCustomizerOpen,
    setIsCustomizerOpen,
    guestName,
    setGuestName,
    titleTone,
    setTitleTone,
    resetToDefault,
  } = useInvitation();

  const [activeSection, setActiveSection] = useState<string>('couple');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCustomizerOpen) {
        setIsCustomizerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCustomizerOpen, setIsCustomizerOpen]);

  const toggleSection = (id: string) => {
    setActiveSection((prev) => (prev === id ? '' : id));
  };

  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cover' | 'groom' | 'bride' | 'gallery' | 'gallery-add' | 'welcome' | 'couple' | 'accessCard' | 'closing' | 'bgPhoto' | 'bgPhotos-add' | 'bgPhotos-update',
    galleryIndex?: number
  ) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await processAndResizePhoto(file);
    if (result.error) {
      setPhotoError(result.error);
      return;
    }

    if (type === 'cover') setCoverImage(result.url);
    else if (type === 'welcome') setWelcomePhoto(result.url);
    else if (type === 'couple') setCouplePhoto(result.url);
    else if (type === 'accessCard') setAccessCardPhoto(result.url);
    else if (type === 'closing') setClosingPhoto(result.url);
    else if (type === 'groom') setGroomPhoto(result.url);
    else if (type === 'bride') setBridePhoto(result.url);
    else if (type === 'bgPhoto') {
      setBgPhoto(result.url);
      setBgType('photo');
    }
    else if (type === 'bgPhotos-add') {
      addBgPhoto(result.url);
    }
    else if (type === 'bgPhotos-update' && galleryIndex !== undefined) {
      updateBgPhoto(galleryIndex, result.url);
    }
    else if (type === 'gallery' && galleryIndex !== undefined) {
      updateGalleryPhoto(galleryIndex, result.url);
    }
    else if (type === 'gallery-add') {
      addGalleryPhoto(result.url);
    }

    // Reset input
    e.target.value = '';
  };

  const handleAddGalleryPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await processAndResizePhoto(file);
      if (result.url && !result.error) {
        addGalleryPhoto(result.url, file.name.replace(/\.[^/.]+$/, ''));
      }
    }
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoError(null);
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    // 1. Size limit: 30 MB
    if (file.size > 30 * 1024 * 1024) {
      setVideoError("This video can't be played. Use MP4 (H.264) or WebM, portrait 9:16, max 30 MB.");
      return;
    }

    // 2. Format validation: MP4 or WebM
    const isMp4 = file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
    const isWebm = file.type === 'video/webm' || file.name.toLowerCase().endsWith('.webm');
    if (!isMp4 && !isWebm) {
      setVideoError("This video can't be played. Use MP4 (H.264) or WebM, portrait 9:16, max 30 MB.");
      return;
    }

    // 3. Create object URL inside file input's change handler
    const tempUrl = URL.createObjectURL(file);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

    // 4. Test playability with temporary hidden video element
    const testVideo = document.createElement('video');
    testVideo.muted = true;
    testVideo.playsInline = true;
    testVideo.preload = 'metadata';

    let resolved = false;
    const finish = (playable: boolean) => {
      if (resolved) return;
      resolved = true;
      testVideo.oncanplay = null;
      testVideo.onloadeddata = null;
      testVideo.onerror = null;
      testVideo.src = '';
      testVideo.remove();

      if (playable) {
        setCustomVideo({
          url: tempUrl,
          name: file.name,
          sizeMb,
        });
      } else {
        URL.revokeObjectURL(tempUrl);
        setVideoError("This video can't be played. Use MP4 (H.264) or WebM, portrait 9:16, max 30 MB.");
      }
    };

    testVideo.oncanplay = () => finish(true);
    testVideo.onloadeddata = () => finish(true);
    testVideo.onerror = () => finish(false);

    // Timeout safety net
    setTimeout(() => {
      if (!resolved) {
        finish(true);
      }
    }, 3500);

    testVideo.src = tempUrl;
    testVideo.load();
  };

  // WhatsApp Order Flow with compressed Order Code (Requirement 4)
  const handleOrderTemplate = () => {
    const isId = currentLang === 'id';
    const videoChoice = customVideoUrl
      ? (isId ? 'Pakai video sendiri' : 'Using own custom video')
      : currentPreset.label;

    let orderCodeSuffix = 'Data lengkap akan dikirim via chat';
    try {
      const textSettings = {
        couple: {
          groom: {
            name: couple.groom.name,
            fullName: couple.groom.fullName,
            parents: couple.groom.parents,
            instagram: couple.groom.instagram,
            instagramUrl: couple.groom.instagramUrl,
            bio: couple.groom.bio,
          },
          bride: {
            name: couple.bride.name,
            fullName: couple.bride.fullName,
            parents: couple.bride.parents,
            instagram: couple.bride.instagram,
            instagramUrl: couple.bride.instagramUrl,
            bio: couple.bride.bio,
          },
          hashtag: couple.hashtag,
          quote: couple.quote,
        },
        events: {
          akadOrMatrimony: {
            day: akad.day,
            date: akad.date,
            time: akad.time,
            timezone: akad.timezone,
            venueName: akad.venueName,
            address: akad.address,
            mapsUrl: akad.mapsUrl,
          },
          reception: {
            day: reception.day,
            date: reception.date,
            time: reception.time,
            timezone: reception.timezone,
            venueName: reception.venueName,
            address: reception.address,
            mapsUrl: reception.mapsUrl,
          },
        },
        welcome: welcomeData,
        coupleSection: coupleSectionData,
        storyMilestones,
        selectedPresetId,
        activeMusic,
        titleTone,
        guestName,
      };

      const jsonStr = JSON.stringify(textSettings);
      const u8 = new TextEncoder().encode(jsonStr);
      const compressed = deflateSync(u8);
      let binary = '';
      for (let i = 0; i < compressed.length; i++) {
        binary += String.fromCharCode(compressed[i]);
      }
      const base64 = btoa(binary);
      const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      if (base64url.length <= 1500) {
        orderCodeSuffix = `Kode pesanan: ${base64url}`;
      } else {
        orderCodeSuffix = 'Data lengkap akan dikirim via chat';
      }
    } catch {
      orderCodeSuffix = 'Data lengkap akan dikirim via chat';
    }

    const message = isId
      ? `Halo, saya ingin memesan template undangan *${CONFIG.templateName}*.\n\n` +
        `*Detail Mempelai:*\n` +
        `• Pria: ${couple.groom.fullName || couple.groom.name}\n` +
        `• Wanita: ${couple.bride.fullName || couple.bride.name}\n\n` +
        `*Rangkaian Acara:*\n` +
        `• Akad: ${akad.date} di ${akad.venueName}\n` +
        `• Resepsi: ${reception.date} di ${reception.venueName}\n\n` +
        `*Pilihan Background Video:*\n` +
        `• ${videoChoice}\n\n` +
        `${orderCodeSuffix}`
      : `Hello, I would like to order the *${CONFIG.templateName}* wedding invitation template.\n\n` +
        `*Couple Details:*\n` +
        `• Groom: ${couple.groom.fullName || couple.groom.name}\n` +
        `• Bride: ${couple.bride.fullName || couple.bride.name}\n\n` +
        `*Events:*\n` +
        `• Ceremony: ${akad.date} at ${akad.venueName}\n` +
        `• Reception: ${reception.date} at ${reception.venueName}\n\n` +
        `*Background Video:*\n` +
        `• ${videoChoice}\n\n` +
        `${orderCodeSuffix}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${CONFIG.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const isId = currentLang === 'id';

  const musicTracks = [
    { label: 'Golden Hour Serenade', src: '/music.mp3' },
    { label: 'Acoustic Reverie', src: '/music-track-2.mp3' },
    { label: 'Piano Nocturne', src: '/music-track-3.mp3' },
  ];

  return (
    <AnimatePresence>
      {isCustomizerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Outside Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCustomizerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* 
            Panel Container
            - Desktop: slide-in from right (w-[380px], full height, left border)
            - Mobile: bottom sheet (w-full, max-h-[85dvh], rounded-t-2xl)
          */}
          <motion.aside
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="customizer-panel relative w-full sm:w-[380px] h-[100dvh] bg-black/85 backdrop-blur-xl border-l border-white/20 text-[#F2EFE8] flex flex-col z-10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15 bg-black/40">
              <div>
                <h3 className="font-serif-display uppercase text-sm tracking-widest text-white">
                  {isId ? 'Kustomisasi Undangan' : 'Customize Invitation'}
                </h3>
                <p className="font-serif-display italic text-[11px] text-white/50">
                  {CONFIG.templateName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetToDefault}
                  title={isId ? 'Kembalikan ke awal' : 'Reset to default'}
                  className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsCustomizerOpen(false)}
                  className="p-1.5 text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Error Notifications */}
            {(photoError || videoError) && (
              <div className="p-3 bg-red-950/60 border-b border-red-500/30 text-xs text-red-200">
                {photoError || videoError}
              </div>
            )}

            {/* Accordion Sections Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {/* SECTION: SECTION VISIBILITY (TOGGLE SECTIONS ON / OFF) */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('sections-visibility')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-title text-base text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Pilihan Section (Tampilkan / Sembunyikan)' : 'Section Visibility (Show / Hide)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'sections-visibility' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'sections-visibility' && (
                  <div className="p-4 pt-1 space-y-3 border-t border-white/10 text-xs font-text">
                    <p className="text-white/60 leading-relaxed text-[11.5px] pb-1">
                      {isId
                        ? 'Gunakan tombol di bawah untuk menyertakan atau menyembunyikan section dan rangkaian acara sesuai kebutuhan Anda:'
                        : 'Toggle the buttons below to include or exclude sections and ceremonies as needed for your wedding invitation:'}
                    </p>

                    <div className="space-y-2">
                      <ToggleSwitch
                        label={isId ? 'Akad / Pemberkatan (Holy Matrimony)' : 'Holy Matrimony / Ceremony'}
                        description={isId ? 'Rangkaian acara akad nikah atau holy matrimony' : 'Ceremony / Holy Matrimony event block'}
                        checked={showHolyMatrimony}
                        onChange={setShowHolyMatrimony}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Acara Adat (Cultural Ceremony)' : 'Cultural Ceremony (Adat)'}
                        description={isId ? 'Rangkaian prosesi acara adat' : 'Traditional cultural ceremony event block'}
                        checked={showAdat}
                        onChange={setShowAdat}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Resepsi Pernikahan (Reception)' : 'Wedding Reception'}
                        description={isId ? 'Rangkaian pesta perayaan resepsi' : 'Evening reception celebration event block'}
                        checked={showReception}
                        onChange={setShowReception}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Love Story (Ours Became Forever)' : 'Love Story (Ours Became Forever)'}
                        description={isId ? 'Timeline dan paragraf kisah cinta pengantin' : 'Love journey timeline and paragraphs'}
                        checked={showStory}
                        onChange={setShowStory}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'RSVP & Doa Restu' : 'RSVP & Warm Wishes'}
                        description={isId ? 'Form konfirmasi kehadiran tamu & papan ucapan' : 'Guest RSVP form and wishes board'}
                        checked={showRsvp}
                        onChange={setShowRsvp}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Entrance Pass (Kartu Akses Tamu)' : 'Entrance Pass (Guest Access Card)'}
                        description={isId ? 'Tiket kartu akses masuk eksklusif tamu' : 'Personalized guest check-in entrance ticket'}
                        checked={showAccessCard}
                        onChange={setShowAccessCard}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Prewedding Video / Live Stream' : 'Prewedding Video / Live Stream'}
                        description={isId ? 'Video YouTube prewedding / siaran langsung' : 'YouTube prewedding video / live stream embed'}
                        checked={showPreWedVideo}
                        onChange={setShowPreWedVideo}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Wedding Gift (Amplop Digital)' : 'Wedding Gift (Digital Envelope)'}
                        description={isId ? 'Informasi nomor rekening bank dan tanda kasih' : 'Bank accounts and cash gift transfer'}
                        checked={showGift}
                        onChange={setShowGift}
                        isId={isId}
                      />

                      <ToggleSwitch
                        label={isId ? 'Kirim Kado Fisik (Physical Gift)' : 'Send Physical Gift (WhatsApp)'}
                        description={isId ? 'Opsi konfirmasi kirim kado fisik via WhatsApp' : 'Direct contact to arrange physical gift delivery'}
                        checked={showPhysicalGift}
                        onChange={setShowPhysicalGift}
                        isId={isId}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 0: WELCOME & GUEST */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('welcome')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-title text-base text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Halaman Sapaan (Welcome)' : 'Welcome Section'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'welcome' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'welcome' && (
                  <div className="p-4 pt-1 space-y-3.5 border-t border-white/10 text-xs font-text">
                    {/* Welcome Photo */}
                    <div>
                      <label className="block text-white/70 mb-1.5 font-title text-sm">
                        {isId ? 'Foto Sapaan (Welcome Photo)' : 'Welcome Photo'}
                      </label>
                      <div className="flex items-center gap-3">
                        <img
                          src={welcomePhoto}
                          alt="Welcome thumbnail"
                          className="w-14 h-18 object-cover rounded border border-white/20"
                        />
                        <label className="btn-pill-transparent text-xs py-1.5 px-3 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{isId ? 'Ganti Foto' : 'Change Photo'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(e, 'welcome')}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Single Guest Name across Cover, Welcome, RSVP, and Access Card */}
                    <div>
                      <label className="block text-white/80 font-medium mb-1">
                        {isId ? 'Nama Tamu Undangan (Guest Name)' : 'Guest Name'}
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                      <p className="text-[11px] text-white/50 mt-1">
                        {isId
                          ? 'Nilai ini akan tampil pada Cover ("Dear {nama}"), Welcome ("Hi, {nama}"), RSVP, dan Kartu Akses.'
                          : 'Shown synchronously across Cover ("Dear {name}"), Welcome ("Hi, {name}"), RSVP, and Access Card.'}
                      </p>
                    </div>

                    {/* Section Title Tone (Light vs Dark) */}
                    <div className="pt-2 border-t border-white/10">
                      <label className="block text-white/80 font-medium mb-1.5">
                        {isId ? 'Warna Judul Seksi (Title Tone)' : 'Section Title Tone'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setTitleTone('light')}
                          className={`flex items-center gap-2 py-1.5 px-2.5 rounded border text-xs transition-all cursor-pointer ${
                            titleTone === 'light'
                              ? 'border-white bg-white/15 text-white'
                              : 'border-white/20 text-white/70 hover:border-white/40'
                          }`}
                        >
                          <RedDotRadio selected={titleTone === 'light'} />
                          <span>{isId ? 'Terang (Putih)' : 'Light (White)'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTitleTone('dark')}
                          className={`flex items-center gap-2 py-1.5 px-2.5 rounded border text-xs transition-all cursor-pointer ${
                            titleTone === 'dark'
                              ? 'border-white bg-white/15 text-white'
                              : 'border-white/20 text-white/70 hover:border-white/40'
                          }`}
                        >
                          <RedDotRadio selected={titleTone === 'dark'} />
                          <span>{isId ? 'Gelap (Hitam)' : 'Dark (Black)'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Quote lines EN */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <p className="font-title text-sm text-white/90">
                        {isId ? 'Teks Kutipan (Bahasa Inggris)' : 'Quote Lines (English)'}
                      </p>
                      <div>
                        <label className="block text-white/60 mb-0.5">Line 1</label>
                        <input
                          type="text"
                          value={welcomeData.quoteLine1}
                          onChange={(e) => updateWelcomeData('quoteLine1', e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 mb-0.5">Line 2</label>
                        <input
                          type="text"
                          value={welcomeData.quoteLine2}
                          onChange={(e) => updateWelcomeData('quoteLine2', e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 mb-0.5">Line 3 (Large)</label>
                        <input
                          type="text"
                          value={welcomeData.quoteLine3}
                          onChange={(e) => updateWelcomeData('quoteLine3', e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Quote lines ID */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <p className="font-title text-sm text-white/90">
                        {isId ? 'Teks Kutipan (Bahasa Indonesia)' : 'Quote Lines (Indonesian)'}
                      </p>
                      <div>
                        <label className="block text-white/60 mb-0.5">Baris 1</label>
                        <input
                          type="text"
                          value={welcomeData.quoteLine1Id}
                          onChange={(e) => updateWelcomeData('quoteLine1Id', e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 mb-0.5">Baris 2</label>
                        <input
                          type="text"
                          value={welcomeData.quoteLine2Id}
                          onChange={(e) => updateWelcomeData('quoteLine2Id', e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-white/60 mb-0.5">Baris 3 (Besar)</label>
                        <input
                          type="text"
                          value={welcomeData.quoteLine3Id}
                          onChange={(e) => updateWelcomeData('quoteLine3Id', e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Entrance Pass Toggle */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <label className="block text-white/80 font-medium">
                          {isId ? 'Kartu Akses (Entrance Pass)' : 'Entrance Pass'}
                        </label>
                        <p className="text-[11px] text-white/50">
                          {isId ? 'Tampilkan atau sembunyikan section kartu akses' : 'Toggle VIP Entrance Pass section'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAccessCard(!showAccessCard)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          showAccessCard ? 'bg-emerald-600' : 'bg-white/20'
                        }`}
                        aria-label="Toggle Entrance Pass"
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showAccessCard ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: COUPLE SECTION (PHOTO & QUOTE) */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('couple-section')}
                  className="w-full flex items-center justify-between p-3.5 text-left text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Halaman Pasangan (Couple Section)' : 'Couple Section (Photo & Quote)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'couple-section' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'couple-section' && (
                  <div className="p-4 pt-1 space-y-3.5 border-t border-white/10 text-xs">
                    {/* Couple Photo */}
                    <div>
                      <label className="block text-white/70 mb-1.5 font-medium text-xs">
                        {isId ? 'Foto Pasangan (Couple Photo)' : 'Couple Photo'}
                      </label>
                      <div className="flex items-center gap-3">
                        <img
                          src={couplePhoto}
                          alt="Couple thumbnail"
                          className="w-14 h-18 object-cover rounded border border-white/20"
                        />
                        <label className="btn-pill-transparent text-xs py-1.5 px-3 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{isId ? 'Ganti Foto' : 'Change Photo'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(e, 'couple')}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Couple Quote (English) */}
                    <div>
                      <label className="block text-white/70 mb-1 text-xs">
                        {isId ? 'Kutipan Pasangan (EN)' : 'Couple Quote (English)'}
                      </label>
                      <textarea
                        rows={2}
                        value={coupleSectionData.quote}
                        onChange={(e) => updateCoupleSectionData('quote', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs resize-none"
                      />
                    </div>

                    {/* Couple Quote (Indonesian) */}
                    <div>
                      <label className="block text-white/70 mb-1 text-xs">
                        {isId ? 'Kutipan Pasangan (ID)' : 'Couple Quote (Indonesian)'}
                      </label>
                      <textarea
                        rows={2}
                        value={coupleSectionData.quoteId}
                        onChange={(e) => updateCoupleSectionData('quoteId', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs resize-none"
                      />
                    </div>

                    {/* Quote Source (Optional) */}
                    <div>
                      <label className="block text-white/70 mb-1 text-xs">
                        {isId ? 'Sumber Kutipan (Opsional)' : 'Quote Source (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={coupleSectionData.quoteSource || ''}
                        onChange={(e) => updateCoupleSectionData('quoteSource', e.target.value)}
                        placeholder="e.g. Emily Brontë"
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION A: COUPLE */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('couple')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Mempelai (Couple)' : 'The Couple'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'couple' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'couple' && (
                  <div className="p-4 pt-1 space-y-3 border-t border-white/10 text-xs">
                    <div>
                      <label className="block text-white/60 mb-1">Groom Short Name</label>
                      <input
                        type="text"
                        value={couple.groom.name}
                        onChange={(e) => updateCoupleField('groom', 'name', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Groom Full Name</label>
                      <input
                        type="text"
                        value={couple.groom.fullName}
                        onChange={(e) => updateCoupleField('groom', 'fullName', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Groom Parents</label>
                      <input
                        type="text"
                        value={couple.groom.parents}
                        onChange={(e) => updateCoupleField('groom', 'parents', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Groom Instagram</label>
                      <input
                        type="text"
                        value={couple.groom.instagram}
                        onChange={(e) => updateCoupleField('groom', 'instagram', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>

                    <div className="pt-2 border-t border-white/10" />

                    <div>
                      <label className="block text-white/60 mb-1">Bride Short Name</label>
                      <input
                        type="text"
                        value={couple.bride.name}
                        onChange={(e) => updateCoupleField('bride', 'name', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Bride Full Name</label>
                      <input
                        type="text"
                        value={couple.bride.fullName}
                        onChange={(e) => updateCoupleField('bride', 'fullName', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Bride Parents</label>
                      <input
                        type="text"
                        value={couple.bride.parents}
                        onChange={(e) => updateCoupleField('bride', 'parents', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Bride Instagram</label>
                      <input
                        type="text"
                        value={couple.bride.instagram}
                        onChange={(e) => updateCoupleField('bride', 'instagram', e.target.value)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: EVENTS */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('events')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Rangkaian Acara (Events)' : 'The Events'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'events' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'events' && (
                  <div className="p-4 pt-1 space-y-4 border-t border-white/10 text-xs">
                    {/* HOLY MATRIMONY / AKAD */}
                    <div className="space-y-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/10">
                      <ToggleSwitch
                        label={isId ? 'Akad / Pemberkatan (Holy Matrimony)' : 'Holy Matrimony / Ceremony'}
                        description={isId ? 'Tampilkan acara Akad / Holy Matrimony' : 'Show Holy Matrimony ceremony block'}
                        checked={showHolyMatrimony}
                        onChange={setShowHolyMatrimony}
                        isId={isId}
                      />
                      {showHolyMatrimony && (
                        <div className="space-y-2.5 pt-1 border-t border-white/10">
                          <div>
                            <label className="block text-white/60 mb-1">Date</label>
                            <input
                              type="text"
                              value={akad.date}
                              onChange={(e) => updateEventField('akadOrMatrimony', 'date', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Time</label>
                            <input
                              type="text"
                              value={akad.time}
                              onChange={(e) => updateEventField('akadOrMatrimony', 'time', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Venue Name</label>
                            <input
                              type="text"
                              value={akad.venueName}
                              onChange={(e) => updateEventField('akadOrMatrimony', 'venueName', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Address</label>
                            <input
                              type="text"
                              value={akad.address}
                              onChange={(e) => updateEventField('akadOrMatrimony', 'address', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Google Maps Link</label>
                            <input
                              type="text"
                              value={akad.mapsUrl}
                              onChange={(e) => updateEventField('akadOrMatrimony', 'mapsUrl', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ADAT / CULTURAL CEREMONY */}
                    <div className="space-y-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/10">
                      <ToggleSwitch
                        label={isId ? 'Acara Adat (Cultural Ceremony)' : 'Cultural Ceremony (Adat)'}
                        description={isId ? 'Tampilkan rangkaian acara adat' : 'Show traditional cultural ceremony block'}
                        checked={showAdat}
                        onChange={setShowAdat}
                        isId={isId}
                      />
                      {showAdat && culturalCeremony && (
                        <div className="space-y-2.5 pt-1 border-t border-white/10">
                          <div>
                            <label className="block text-white/60 mb-1">Date</label>
                            <input
                              type="text"
                              value={culturalCeremony.date}
                              onChange={(e) => updateEventField('culturalCeremony', 'date', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Time</label>
                            <input
                              type="text"
                              value={culturalCeremony.time}
                              onChange={(e) => updateEventField('culturalCeremony', 'time', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Venue Name</label>
                            <input
                              type="text"
                              value={culturalCeremony.venueName}
                              onChange={(e) => updateEventField('culturalCeremony', 'venueName', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Address</label>
                            <input
                              type="text"
                              value={culturalCeremony.address}
                              onChange={(e) => updateEventField('culturalCeremony', 'address', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Google Maps Link</label>
                            <input
                              type="text"
                              value={culturalCeremony.mapsUrl}
                              onChange={(e) => updateEventField('culturalCeremony', 'mapsUrl', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* RECEPTION */}
                    <div className="space-y-2.5 p-3 rounded-lg bg-white/[0.03] border border-white/10">
                      <ToggleSwitch
                        label={isId ? 'Resepsi Pernikahan (Wedding Reception)' : 'Wedding Reception'}
                        description={isId ? 'Tampilkan acara resepsi pernikahan' : 'Show wedding reception celebration block'}
                        checked={showReception}
                        onChange={setShowReception}
                        isId={isId}
                      />
                      {showReception && (
                        <div className="space-y-2.5 pt-1 border-t border-white/10">
                          <div>
                            <label className="block text-white/60 mb-1">Date</label>
                            <input
                              type="text"
                              value={reception.date}
                              onChange={(e) => updateEventField('reception', 'date', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Time</label>
                            <input
                              type="text"
                              value={reception.time}
                              onChange={(e) => updateEventField('reception', 'time', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Venue Name</label>
                            <input
                              type="text"
                              value={reception.venueName}
                              onChange={(e) => updateEventField('reception', 'venueName', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Address</label>
                            <input
                              type="text"
                              value={reception.address}
                              onChange={(e) => updateEventField('reception', 'address', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/60 mb-1">Google Maps Link</label>
                            <input
                              type="text"
                              value={reception.mapsUrl}
                              onChange={(e) => updateEventField('reception', 'mapsUrl', e.target.value)}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION C: QUOTE */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('quote')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Quote className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Kutipan Cinta (Quote)' : 'Love Quote'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'quote' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'quote' && (
                  <div className="p-4 pt-1 space-y-3 border-t border-white/10 text-xs">
                    <div>
                      <label className="block text-white/60 mb-1">Quote Text</label>
                      <textarea
                        rows={3}
                        value={couple.quote.text}
                        onChange={(e) => updateQuote(e.target.value, couple.quote.source)}
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/60 mb-1">Quote Source / Author</label>
                      <textarea
                        rows={2}
                        value={couple.quote.source}
                        onChange={(e) => updateQuote(couple.quote.text, e.target.value)}
                        placeholder="e.g. Emily Brontë&#10;Wuthering Heights"
                        className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: LOVE STORY / KISAH CINTA (OURS BECAME FOREVER) */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('story')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Kisah Cinta (Love Story)' : 'Love Story (Ours Became Forever)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'story' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'story' && (
                  <div className="p-4 pt-1 space-y-4 border-t border-white/10 text-xs font-text">
                    <ToggleSwitch
                      label={isId ? 'Tampilkan Love Story' : 'Show Love Story Section'}
                      description={isId ? 'Sertakan section perjalanan kisah cinta pengantin' : 'Include love story section in the invitation'}
                      checked={showStory}
                      onChange={setShowStory}
                      isId={isId}
                    />

                    <p className="text-white/60 leading-relaxed">
                      {isId
                        ? 'Sesuaikan judul momen, tahun/waktu, dan isi cerita pada setiap paragraf perjalanan cinta kalian ("Ours Became Forever").'
                        : 'Customize the moment title, year/timeline, and story content for each paragraph of your love journey ("Ours Became Forever").'}
                    </p>

                    <div className="space-y-3.5">
                      {storyMilestones.map((milestone, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white/[0.04] border border-white/15 rounded-lg space-y-2.5"
                        >
                          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span className="font-title text-sm text-white/90">
                              {isId ? `Paragraf ${idx + 1}` : `Paragraph ${idx + 1}`}
                            </span>
                            {storyMilestones.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeStoryMilestone(idx)}
                                className="text-red-400/80 hover:text-red-300 transition-colors p-1"
                                title={isId ? 'Hapus paragraf ini' : 'Delete this paragraph'}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="block text-white/60 mb-1 text-[11px]">
                                {isId ? 'Judul Momen' : 'Moment Title'}
                              </label>
                              <input
                                type="text"
                                value={milestone.title}
                                onChange={(e) => updateStoryMilestone(idx, 'title', e.target.value)}
                                placeholder={isId ? 'e.g. Pertemuan Pertama' : 'e.g. First Glance'}
                                className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-white/60 mb-1 text-[11px]">
                                {isId ? 'Tahun / Waktu' : 'Year / Time'}
                              </label>
                              <input
                                type="text"
                                value={milestone.year}
                                onChange={(e) => updateStoryMilestone(idx, 'year', e.target.value)}
                                placeholder="e.g. 2021, Autumn 2021"
                                className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-white/60 mb-1 text-[11px]">
                              {isId ? 'Isi Paragraf Cerita' : 'Story Paragraph Text'}
                            </label>
                            <textarea
                              rows={3}
                              value={milestone.description}
                              onChange={(e) => updateStoryMilestone(idx, 'description', e.target.value)}
                              placeholder={isId ? 'Tulis cerita untuk momen ini...' : 'Write the story for this milestone...'}
                              className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs resize-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={addStoryMilestone}
                        className="btn-pill-transparent text-xs py-1.5 px-3 flex items-center gap-1.5"
                      >
                        <span>+</span>
                        <span>{isId ? 'Tambah Paragraf' : 'Add Paragraph'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStoryMilestones(invitationData.storyMilestones)}
                        className="text-white/50 hover:text-white/80 text-[11px] underline ml-auto transition-colors"
                      >
                        {isId ? 'Reset ke Semula' : 'Reset to Default'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION D: PHOTOS (In-browser canvas resize) */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('photos')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Foto-Foto (Photos)' : 'Photos'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'photos' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'photos' && (
                  <div className="p-4 pt-1 space-y-4 border-t border-white/10 text-xs">
                    {/* Cover Photo */}
                    <div>
                      <p className="text-white/80 font-medium mb-1.5">
                        {isId ? 'Foto Sampul (Left Cover)' : 'Left Panel Cover'}
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="w-12 h-16 object-cover rounded border border-white/20"
                        />
                        <div className="space-y-1">
                          <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] cursor-pointer">
                            <Upload className="w-3 h-3" />
                            {isId ? 'Ganti Foto' : 'Change'}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => handlePhotoUpload(e, 'cover')}
                              className="hidden"
                            />
                          </label>
                          <button
                            onClick={removeCoverImage}
                            className="block text-[10px] text-white/50 hover:text-white"
                          >
                            {isId ? 'Kembalikan' : 'Restore default'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Groom & Bride Portraits */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                      <div>
                        <p className="text-white/80 font-medium mb-1">Groom Portrait</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={groomPhoto}
                            alt="Groom"
                            className="w-10 h-14 object-cover rounded border border-white/20"
                          />
                          <label className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-[10px] cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => handlePhotoUpload(e, 'groom')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/80 font-medium mb-1">Bride Portrait</p>
                        <div className="flex items-center gap-2">
                          <img
                            src={bridePhoto}
                            alt="Bride"
                            className="w-10 h-14 object-cover rounded border border-white/20"
                          />
                          <label className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-[10px] cursor-pointer">
                            <Upload className="w-3 h-3" />
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={(e) => handlePhotoUpload(e, 'bride')}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Photos */}
                    <div className="pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-white/80 font-medium text-xs">
                            {isId ? `Galeri Foto (${galleryPhotos.length} Foto)` : `Gallery Photos (${galleryPhotos.length} Photos)`}
                          </p>
                          <p className="text-white/40 text-[10px]">
                            {isId ? 'Kolase foto prewedding (pola dinamis seperti joyfulday)' : 'Prewedding photo collage (dynamic pattern like joyfulday)'}
                          </p>
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/15 hover:bg-white/25 rounded text-[11px] font-medium text-white cursor-pointer transition shadow-xs">
                          <Plus className="w-3.5 h-3.5" />
                          <span>{isId ? 'Tambah Foto' : 'Add Photos'}</span>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAddGalleryPhotos}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {galleryPhotos.map((photo, idx) => (
                          <div key={photo.id || idx} className="relative group">
                            <img
                              src={photo.src}
                              alt={photo.alt}
                              className="w-full h-14 object-cover rounded border border-white/20"
                            />
                            <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/70 backdrop-blur-xs rounded text-[9px] font-mono text-white/90">
                              #{idx + 1}
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                              <label className="p-1 bg-white/20 hover:bg-white/40 rounded cursor-pointer" title={isId ? 'Ganti foto' : 'Replace photo'}>
                                <Upload className="w-2.5 h-2.5 text-white" />
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  onChange={(e) => handlePhotoUpload(e, 'gallery', idx)}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => deleteGalleryPhoto(idx)}
                                className="p-1 bg-red-500/50 hover:bg-red-500/80 rounded cursor-pointer"
                                title={isId ? 'Hapus foto' : 'Delete photo'}
                              >
                                <Trash2 className="w-2.5 h-2.5 text-white" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Dashed Add Card inside grid (matching joyfulday) */}
                        <label
                          className="w-full h-14 border border-dashed border-white/30 hover:border-white/70 rounded flex flex-col items-center justify-center gap-0.5 cursor-pointer bg-white/5 hover:bg-white/10 transition text-white/70 hover:text-white"
                          title={isId ? 'Tambah foto baru' : 'Add new photos'}
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[10px] font-medium">{isId ? 'Tambah' : 'Add'}</span>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAddGalleryPhotos}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Access Card Photo */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-white/80 font-medium mb-1.5">
                        {isId ? 'Foto Kartu Akses Masuk' : 'Entrance Access Card Photo'}
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={accessCardPhoto}
                          alt="Access Card preview"
                          className="w-16 h-12 object-cover rounded border border-white/20"
                        />
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{isId ? 'Ganti Foto' : 'Change Photo'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handlePhotoUpload(e, 'accessCard')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Closing Photo */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-white/80 font-medium mb-1.5">
                        {isId ? 'Foto Penutup (Closing Photo)' : 'Closing Photo'}
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={closingPhoto}
                          alt="Closing preview"
                          className="w-12 h-16 object-cover rounded border border-white/20"
                        />
                        <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded text-[11px] cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{isId ? 'Ganti Foto' : 'Change'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handlePhotoUpload(e, 'closing')}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION E: BACKGROUND SLIDESHOW PHOTOS */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('video')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Latar Belakang (Slideshow Foto)' : 'Background (Photo Slideshow)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'video' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'video' && (
                  <div className="p-4 pt-1 space-y-4 border-t border-white/10 text-xs">
                    {/* Header with photo count & Add button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80 font-medium">
                          {isId
                            ? `Foto Latar Belakang (${bgPhotos.length} Foto)`
                            : `Background Photos (${bgPhotos.length} Photos)`}
                        </p>
                        <p className="text-white/40 text-[10px]">
                          {isId
                            ? 'Foto berputar halus sebagai latar belakang halaman'
                            : 'Photos cycle smoothly as background with blur transitions'}
                        </p>
                      </div>
                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-[#e4c590] border border-white/15 rounded text-[11px] font-medium cursor-pointer transition-colors shadow-sm">
                        <Plus className="w-3 h-3" />
                        <span>{isId ? 'Tambah Foto' : 'Add Photo'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handlePhotoUpload(e, 'bgPhotos-add')}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Grid of Slideshow Photos (4 columns like Our Gallery) */}
                    <div className="grid grid-cols-4 gap-2">
                      {bgPhotos.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative group rounded-md overflow-hidden border border-white/20 aspect-[9/16] bg-black/50"
                        >
                          <img
                            src={src}
                            alt={`Background Slide ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 left-1 px-1 py-0.2 bg-black/70 backdrop-blur-xs rounded text-[9px] font-mono text-white/90">
                            #{idx + 1}
                          </div>
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 transition-opacity">
                            <label
                              className="p-1 bg-white/20 hover:bg-white/40 rounded cursor-pointer"
                              title={isId ? 'Ganti foto' : 'Replace photo'}
                            >
                              <Upload className="w-2.5 h-2.5 text-white" />
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handlePhotoUpload(e, 'bgPhotos-update', idx)}
                                className="hidden"
                              />
                            </label>
                            {bgPhotos.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeBgPhoto(idx)}
                                className="p-1 bg-red-500/40 hover:bg-red-500/70 rounded cursor-pointer"
                                title={isId ? 'Hapus foto ini' : 'Remove photo'}
                              >
                                <Trash2 className="w-2.5 h-2.5 text-white" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Preset / Reset to Defaults */}
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() =>
                          setBgPhotos([
                            '/slideshow/slideshow1.jpg',
                            '/slideshow/slideshow2.jpg',
                          ])
                        }
                        className="text-[11px] text-white/60 hover:text-white underline cursor-pointer"
                      >
                        {isId ? 'Kembalikan 9 Foto Bawaan' : 'Reset to 9 Default Photos'}
                      </button>
                    </div>

                    {/* Pre-Wedding Video Link (Editor Mode) */}
                    {APP_MODE === 'editor' && (
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <label className="block text-white/80 font-medium">
                          {isId ? 'Tautan Video Pre-Wedding (Pre-Wedding Video Link)' : 'Pre-Wedding Video Link'}
                        </label>
                        <input
                          type="text"
                          value={preWedVideoUrl}
                          onChange={(e) => setPreWedVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=EngW7tLk6R8"
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs font-mono"
                        />
                        <p className="text-[11px] text-white/50">
                          {isId
                            ? 'Masukkan URL video YouTube atau ID untuk memperbarui liveStream.preWedVideoUrl.'
                            : 'Enter YouTube video URL or ID to update liveStream.preWedVideoUrl.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION F: MUSIC */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('music')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Musik Latar (Music)' : 'Background Music'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'music' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'music' && (
                  <div className="p-4 pt-1 space-y-2 border-t border-white/10 text-xs">
                    {musicTracks.map((track, i) => (
                      <label
                        key={i}
                        className="flex items-center gap-2.5 p-2 rounded hover:bg-white/5 cursor-pointer font-serif-display italic text-xs"
                      >
                        <input
                          type="radio"
                          name="musicTrack"
                          checked={activeMusic === track.src}
                          onChange={() => setActiveMusic(track.src)}
                          className="accent-white cursor-pointer"
                        />
                        <span className="text-white/90">{track.label}</span>
                      </label>
                    ))}

                    {/* Music Selection (Editor Mode) */}
                    {APP_MODE === 'editor' && (
                      <div className="pt-3 border-t border-white/10 space-y-2">
                        <label className="block text-white/80 font-medium">
                          {isId ? 'Pilihan Musik (Music Selection)' : 'Music Selection (mediaPaths.backgroundMusic)'}
                        </label>
                        <select
                          value={activeMusic}
                          onChange={(e) => setActiveMusic(e.target.value)}
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                        >
                          {musicTracks.map((t, i) => (
                            <option key={i} value={t.src} className="bg-zinc-900 text-white">
                              {t.label} ({t.src})
                            </option>
                          ))}
                          {!musicTracks.some((t) => t.src === activeMusic) && (
                            <option value={activeMusic} className="bg-zinc-900 text-white">
                              Custom: {activeMusic}
                            </option>
                          )}
                        </select>
                        <input
                          type="text"
                          value={activeMusic}
                          onChange={(e) => setActiveMusic(e.target.value)}
                          placeholder="/music.mp3 or https://..."
                          className="w-full py-1.5 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs font-mono"
                        />
                        <p className="text-[11px] text-white/50">
                          {isId
                            ? 'Pilih atau ketik URL/jalur musik untuk memperbarui mediaPaths.backgroundMusic.'
                            : 'Select from dropdown or enter custom audio URL for mediaPaths.backgroundMusic.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION: RSVP & DOA RESTU */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('rsvp')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Konfirmasi Kehadiran (RSVP & Doa)' : 'RSVP & Warm Wishes'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'rsvp' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'rsvp' && (
                  <div className="p-4 pt-1 space-y-3.5 border-t border-white/10 text-xs font-text">
                    <ToggleSwitch
                      label={isId ? 'Tampilkan Form RSVP & Doa Restu' : 'Show RSVP & Wishes Section'}
                      description={isId ? 'Sertakan formulir kehadiran dan ucapan doa tamu' : 'Include guest attendance confirmation form and wishes board'}
                      checked={showRsvp}
                      onChange={setShowRsvp}
                      isId={isId}
                    />

                    <div className="p-3 bg-white/[0.04] border border-white/15 rounded-lg space-y-2 text-white/70">
                      <div className="flex items-center gap-2 text-emerald-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{isId ? 'Database Real-Time Aktif' : 'Real-Time Database Connected'}</span>
                      </div>
                      <p className="text-[11.5px] leading-relaxed text-white/60">
                        {isId
                          ? 'Setiap data RSVP dan ucapan doa dari tamu undangan otomatis tersimpan ke tabel rsvps Supabase dan langsung tampil di Dashboard Admin.'
                          : 'All guest RSVPs and warm wishes are automatically saved to Supabase and immediately visible on your Admin Dashboard.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: KARTU AKSES (ENTRANCE PASS) */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('access-card')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Kartu Akses (Entrance Pass)' : 'Entrance Pass (Access Card)'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'access-card' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeSection === 'access-card' && (
                  <div className="p-4 pt-1 space-y-3.5 border-t border-white/10 text-xs font-text">
                    <ToggleSwitch
                      label={isId ? 'Tampilkan Kartu Akses (Entrance Pass)' : 'Show Entrance Pass Section'}
                      description={isId ? 'Sertakan tiket kartu akses eksklusif personal tamu' : 'Include exclusive personalized guest check-in pass'}
                      checked={showAccessCard}
                      onChange={setShowAccessCard}
                      isId={isId}
                    />

                    <div>
                      <label className="block text-white/70 mb-1.5 font-title text-sm">
                        {isId ? 'Foto Kartu Akses (Access Card Photo)' : 'Access Card Photo'}
                      </label>
                      <div className="flex items-center gap-3">
                        <img
                          src={accessCardPhoto}
                          alt="Access Card thumbnail"
                          className="w-16 h-12 object-cover rounded border border-white/20"
                        />
                        <label className="btn-pill-transparent text-xs py-1.5 px-3 cursor-pointer">
                          <Upload className="w-3 h-3" />
                          <span>{isId ? 'Ganti Foto' : 'Change Photo'}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => handlePhotoUpload(e, 'accessCard')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: HADIAH PERNIKAHAN (WEDDING GIFT) */}
              <div className="border border-white/15 rounded-lg overflow-hidden bg-white/[0.02]">
                <button
                  onClick={() => toggleSection('gift')}
                  className="w-full flex items-center justify-between p-3.5 text-left font-serif-display italic text-sm text-white hover:bg-white/5 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="w-3.5 h-3.5 text-white/70" />
                    {isId ? 'Tanda Kasih (Wedding Gift)' : 'Wedding Gift Details'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeSection === 'gift' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                  {activeSection === 'gift' && (
                    <div className="p-4 pt-1 space-y-4 border-t border-white/10 text-xs">
                      {/* Wedding Gift Master Toggle */}
                      <ToggleSwitch
                        label={isId ? 'Tampilkan Wedding Gift (Amplop Digital)' : 'Show Wedding Gift (Digital Envelope)'}
                        description={isId ? 'Sertakan section tanda kasih / transfer bank' : 'Include wedding gift section in the invitation'}
                        checked={showGift}
                        onChange={setShowGift}
                        isId={isId}
                      />

                      {/* Bank Accounts */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-white/80 font-medium">
                            {isId ? 'Rekening Bank (Bank Accounts)' : 'Bank Accounts'}
                          </label>
                          <button
                            type="button"
                            onClick={addBankAccount}
                            className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                          >
                            + {isId ? 'Tambah Rekening' : 'Add Bank Account'}
                          </button>
                        </div>

                        {bankAccounts.map((account, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-black/40 border border-white/15 rounded space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-white/60 font-semibold text-[11px]">
                                {isId ? `Rekening ${idx + 1}` : `Account ${idx + 1}`}
                              </span>
                              {bankAccounts.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeBankAccount(idx)}
                                  className="text-red-400 hover:text-red-300 text-[11px] cursor-pointer"
                                >
                                  {isId ? 'Hapus' : 'Remove'}
                                </button>
                              )}
                            </div>
                            <div>
                              <label className="block text-white/50 text-[10px] mb-0.5">Bank Name</label>
                              <input
                                type="text"
                                value={account.bankName}
                                onChange={(e) => updateBankAccount(idx, 'bankName', e.target.value)}
                                placeholder="BCA / Mandiri / BNI"
                                className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-white/50 text-[10px] mb-0.5">Account Number</label>
                              <input
                                type="text"
                                value={account.accountNumber}
                                onChange={(e) => updateBankAccount(idx, 'accountNumber', e.target.value)}
                                placeholder="1234567890"
                                className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-white/50 text-[10px] mb-0.5">Account Holder</label>
                              <input
                                type="text"
                                value={account.accountHolder}
                                onChange={(e) => updateBankAccount(idx, 'accountHolder', e.target.value)}
                                placeholder="Nama Pemilik Rekening"
                                className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Physical Gift Address */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <ToggleSwitch
                          label={isId ? 'Kirim Kado Fisik (Physical Gift)' : 'Send Physical Gift Option'}
                          description={isId ? 'Sertakan opsi kirim kado fisik via WhatsApp' : 'Allow guests to confirm physical gift sending via WhatsApp'}
                          checked={showPhysicalGift}
                          onChange={setShowPhysicalGift}
                          isId={isId}
                        />

                        <label className="block text-white/80 font-medium">
                          {isId ? 'Alamat Hadiah Fisik (Physical Gift Address)' : 'Physical Gift Address'}
                        </label>
                        <div>
                          <label className="block text-white/50 text-[10px] mb-0.5">Recipient Name</label>
                          <input
                            type="text"
                            value={physicalGiftAddress?.recipient || ''}
                            onChange={(e) => updatePhysicalGiftAddress('recipient', e.target.value)}
                            className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-[10px] mb-0.5">Phone Number</label>
                          <input
                            type="text"
                            value={physicalGiftAddress?.phone || ''}
                            onChange={(e) => updatePhysicalGiftAddress('phone', e.target.value)}
                            className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-white/50 text-[10px] mb-0.5">Address</label>
                          <textarea
                            rows={2}
                            value={physicalGiftAddress?.address || ''}
                            onChange={(e) => updatePhysicalGiftAddress('address', e.target.value)}
                            className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-white/50 text-[10px] mb-0.5">City</label>
                            <input
                              type="text"
                              value={physicalGiftAddress?.city || ''}
                              onChange={(e) => updatePhysicalGiftAddress('city', e.target.value)}
                              className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-white/50 text-[10px] mb-0.5">Postal Code</label>
                            <input
                              type="text"
                              value={physicalGiftAddress?.postalCode || ''}
                              onChange={(e) => updatePhysicalGiftAddress('postalCode', e.target.value)}
                              className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white/50 text-[10px] mb-0.5">Notes</label>
                          <input
                            type="text"
                            value={physicalGiftAddress?.notes || ''}
                            onChange={(e) => updatePhysicalGiftAddress('notes', e.target.value)}
                            className="w-full py-1 px-2.5 bg-black/50 border border-white/20 rounded text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              {/* EDITOR ORDER FILE SECTION (Editor mode only) */}
              {APP_MODE === 'editor' && EditorOrderSection && (
                <React.Suspense fallback={<div className="p-3 text-xs text-white/50">Memuat fitur editor...</div>}>
                  <EditorOrderSection
                    currentLang={currentLang === 'id' ? 'id' : 'en'}
                    context={invitationContext}
                    isOpen={activeSection === 'orderFile'}
                    onToggle={() => toggleSection('orderFile')}
                  />
                </React.Suspense>
              )}
            </div>

            {/* STICKY BOTTOM ORDER BUTTON (Demo mode only - hidden in editor mode) */}
            {APP_MODE === 'demo' && (
              <div className="p-4 border-t border-white/20 bg-black/90">
                <button
                  onClick={handleOrderTemplate}
                  className="w-full py-3 px-4 rounded-full bg-white text-zinc-950 font-serif-display italic font-semibold text-sm hover:bg-[#F2EFE8] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isId ? 'Pesan Template Ini' : 'Order This Template'}</span>
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
