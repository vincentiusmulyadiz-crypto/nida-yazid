import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { invitationData, MEDIA, APP_MODE } from '../data/invitation';
import orderJson from '../data/order.json';
import { CoupleInfo, EventDetail, GalleryPhoto, StoryMilestone, BankAccount } from '../types';
import { decodeGuestCode, decodeGuestQuota, getInitialGuestMaxPax, isGuestLockedFromUrl } from '../utils/guestCode';
import {
  resolveVideoSource,
  ResolvedVideoSource,
  UserVideoInfo,
  PresetVideo,
} from '../utils/videoSource';

interface InvitationContextType {
  // App Mode
  appMode: typeof APP_MODE;

  // Couple Information (Flows from customer inputs / default)
  couple: typeof invitationData.couple;
  updateCoupleField: (section: 'groom' | 'bride', field: string, value: string) => void;
  updateQuote: (text: string, source: string) => void;

  // Events (Akad, Cultural Ceremony, & Reception)
  akad: EventDetail;
  culturalCeremony?: EventDetail;
  reception: EventDetail;
  updateEventField: (
    eventKey: 'akadOrMatrimony' | 'culturalCeremony' | 'reception',
    field: keyof EventDetail,
    value: string
  ) => void;

  // Section Visibility Toggles
  showHolyMatrimony: boolean;
  setShowHolyMatrimony: (show: boolean) => void;
  showAdat: boolean;
  setShowAdat: (show: boolean) => void;
  showReception: boolean;
  setShowReception: (show: boolean) => void;
  showStory: boolean;
  setShowStory: (show: boolean) => void;
  showRsvp: boolean;
  setShowRsvp: (show: boolean) => void;
  showAccessCard: boolean;
  setShowAccessCard: (show: boolean) => void;
  showGift: boolean;
  setShowGift: (show: boolean) => void;
  showPhysicalGift: boolean;
  setShowPhysicalGift: (show: boolean) => void;
  showPreWedVideo: boolean;
  setShowPreWedVideo: (show: boolean) => void;

  // Background Options (Video vs Photo vs Slideshow)
  bgType: 'video' | 'photo' | 'slideshow';
  setBgType: (type: 'video' | 'photo' | 'slideshow') => void;
  bgPhoto: string;
  setBgPhoto: (src: string) => void;
  bgPhotos: string[];
  setBgPhotos: (photos: string[]) => void;
  addBgPhoto: (src: string) => void;
  updateBgPhoto: (index: number, newSrc: string) => void;
  removeBgPhoto: (index: number) => void;

  // Wedding Gift Details
  bankAccounts: BankAccount[];
  updateBankAccount: (index: number, field: keyof BankAccount, value: string) => void;
  addBankAccount: () => void;
  removeBankAccount: (index: number) => void;
  physicalGiftAddress: typeof invitationData.physicalGiftAddress;
  updatePhysicalGiftAddress: (field: string, value: string) => void;

  // Pre-Wedding Video Link
  preWedVideoUrl: string;
  setPreWedVideoUrl: (url: string) => void;

  // Story Milestones
  storyMilestones: StoryMilestone[];
  updateStoryMilestone: (index: number, field: keyof StoryMilestone, value: string) => void;
  setStoryMilestones: (milestones: StoryMilestone[]) => void;
  addStoryMilestone: () => void;
  removeStoryMilestone: (index: number) => void;

  // Gallery Photos
  galleryPhotos: GalleryPhoto[];
  addGalleryPhoto: (src: string, orientation?: any) => void;
  updateGalleryPhoto: (index: number, newSrc: string) => void;
  removeGalleryPhoto: (index: number) => void;
  deleteGalleryPhoto: (index: number) => void;

  // Visual Media
  coverImage: string;
  setCoverImage: (src: string) => void;
  removeCoverImage: () => void;
  welcomePhoto: string;
  setWelcomePhoto: (src: string) => void;
  welcomeData: typeof invitationData.welcome;
  updateWelcomeData: (field: keyof typeof invitationData.welcome, value: string) => void;
  couplePhoto: string;
  setCouplePhoto: (src: string) => void;
  coupleSectionData: typeof invitationData.coupleSection;
  updateCoupleSectionData: (field: keyof typeof invitationData.coupleSection, value: string) => void;
  accessCardPhoto: string;
  setAccessCardPhoto: (src: string) => void;
  closingPhoto: string;
  setClosingPhoto: (src: string) => void;

  // Groom & Bride Portraits
  groomPhoto: string;
  setGroomPhoto: (src: string) => void;
  bridePhoto: string;
  setBridePhoto: (src: string) => void;

  // Background Video State (Single Source of Truth)
  selectedPresetId: string;
  setSelectedPresetId: (id: string) => void;
  currentPreset: PresetVideo;
  customVideo: UserVideoInfo | null;
  customVideoUrl: string | null;
  customVideoName: string | null;
  setCustomVideo: (info: UserVideoInfo) => void;
  removeCustomVideo: () => void;
  resolvedVideo: ResolvedVideoSource;
  videoError: string | null;
  setVideoError: (err: string | null) => void;
  reportVideoError: (message: string) => void;

  // Background Music
  activeMusic: string;
  setActiveMusic: (src: string) => void;

  // Customizer Panel State
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (isOpen: boolean) => void;

  // Preview Protection State
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;

  // Single Guest Name used across Cover, Welcome, RSVP, and Access Card
  guestName: string;
  setGuestName: (name: string) => void;
  guestCode: string | null;
  setGuestCode: (code: string | null) => void;
  guestQuota: number;
  setGuestQuota: (quota: number) => void;
  isLockedGuest: boolean;

  // Title tone ("light" = white, "dark" = black)
  titleTone: 'light' | 'dark';
  setTitleTone: (tone: 'light' | 'dark') => void;

  // Apply imported data (from zip or order code)
  applyImportedState: (data: any) => void;

  // Reset all fields
  resetToDefault: () => void;
}

const SESSION_STORAGE_KEY = 'wedding_invitation_draft_v1';

/**
 * ORDER = isi src/data/order.json (hasil "Download Order File" dari mode editor).
 * Dipakai sebagai nilai awal sehingga build FINAL mengikuti pilihan di editor:
 * section on/off, background video/foto, foto-foto upload, video custom, musik, dll.
 * Di mode demo/editor order.json biasanya `{}` sehingga tidak berpengaruh.
 */
const ORDER: any = (orderJson as any) || {};

/** Normalisasi path media lama "order/x.jpg" -> "/order/x.jpg" (file berada di public/order/). */
const fixPath = (p: any): string | undefined => {
  if (typeof p !== 'string' || !p) return undefined;
  if (p.startsWith('order/')) return `/${p}`;
  return p;
};
const orderBool = (key: string, fallback = true): boolean =>
  typeof ORDER[key] === 'boolean' ? ORDER[key] : fallback;
const orderStr = (key: string): string | undefined => fixPath(ORDER[key]);

const getOrderCustomVideo = (): UserVideoInfo | null => {
  const v = fixPath(ORDER?.media?.video);
  if (!v) return null;
  return { url: v, name: v.split('/').pop() || 'bg.mp4', sizeMb: '' };
};

const normalizeCouple = (c: typeof invitationData.couple): typeof invitationData.couple => ({
  ...c,
  groom: { ...c.groom, photo: fixPath(c.groom?.photo) || c.groom?.photo },
  bride: { ...c.bride, photo: fixPath(c.bride?.photo) || c.bride?.photo },
});
const INITIAL_COUPLE = normalizeCouple(invitationData.couple);
const INITIAL_GALLERY: GalleryPhoto[] = (invitationData.galleryPhotos || []).map((p) => ({
  ...p,
  src: fixPath(p.src) || p.src,
}));

const getInitialGuestInfo = (): { name: string; code: string | null } => {
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cParam = urlParams.get('c') || urlParams.get('code');
      const toParam = urlParams.get('to') || urlParams.get('guest') || urlParams.get('name') || urlParams.get('tamu');

      // 1. Check for random code parameter (?c=... or ?code=...)
      if (cParam && cParam.trim()) {
        const decoded = decodeGuestCode(cParam);
        if (decoded) {
          return { name: decoded, code: cParam.trim() };
        }
      }

      // 2. Check for ?to= parameter (supports random code or plain text name)
      if (toParam && toParam.trim()) {
        const decodedFromTo = decodeGuestCode(toParam);
        if (decodedFromTo) {
          return { name: decodedFromTo, code: toParam.trim() };
        }
        const plain = decodeURIComponent(toParam.replace(/\+/g, ' ')).trim();
        if (plain) {
          return { name: plain, code: null };
        }
      }
    } catch {
      // Fallback
    }
  }

  const fallback =
    (ORDER as any)?.guestName ||
    (invitationData as any)?.guestName ||
    (APP_MODE === 'demo' ? invitationData.welcome.defaultGuestName || 'John Doe' : 'Guest');

  return { name: fallback, code: null };
};

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export const InvitationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In 'final' mode, never read from sessionStorage; always read pristine defaults from invitation.ts
  const loadDraft = () => {
    if (APP_MODE === 'final') return null;
    try {
      if (typeof window !== 'undefined') {
        const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Drop any value that starts with "blob:" and fall back to the preset
          if (typeof parsed.selectedPresetId === 'string' && parsed.selectedPresetId.startsWith('blob:')) {
            parsed.selectedPresetId = 'v1';
          }
          if (parsed.customVideo) delete parsed.customVideo;
          if (parsed.customVideoUrl) delete parsed.customVideoUrl;
          return parsed;
        }
      }
    } catch {
      // Ignore sessionStorage errors
    }
    return null;
  };

  const draft = loadDraft();
  const initialGuest = getInitialGuestInfo();

  // Single Guest Name and Random Code used across Cover, Welcome, RSVP, and Access Card
  const [guestName, setGuestNameState] = useState<string>(() => {
    return draft?.guestName || initialGuest.name;
  });

  const [guestCode, setGuestCode] = useState<string | null>(() => {
    return draft?.guestCode || initialGuest.code;
  });

  const [guestQuota, setGuestQuota] = useState<number>(() => getInitialGuestMaxPax());
  const isLockedGuest = isGuestLockedFromUrl();

  const setGuestName = (name: string) => {
    setGuestNameState(name);
    setWelcomeData((prev) => ({
      ...prev,
      defaultGuestName: name,
    }));
  };

  // Title tone ("light" = white, "dark" = black)
  const [titleTone, setTitleTone] = useState<'light' | 'dark'>(draft?.titleTone || 'light');

  // 1. Couple Information
  const [couple, setCouple] = useState<typeof invitationData.couple>(
    draft?.couple || INITIAL_COUPLE || invitationData.couple
  );

  // 2. Events (Akad, Cultural Ceremony, & Reception)
  const [akad, setAkad] = useState<EventDetail>(
    draft?.akad || invitationData.events.akadOrMatrimony
  );
  const [culturalCeremony, setCulturalCeremony] = useState<EventDetail | undefined>(
    draft?.culturalCeremony || invitationData.events.culturalCeremony
  );
  const [reception, setReception] = useState<EventDetail>(
    draft?.reception || invitationData.events.reception
  );

  // Section Visibility Toggles (Checks URL query -> draft -> order.json -> invitationData -> fallback true)
  const [showHolyMatrimony, setShowHolyMatrimony] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = new URLSearchParams(window.location.search);
        const s = (p.get('e') || p.get('s') || p.get('event') || p.get('events') || p.get('sesi') || p.get('acara') || '').toLowerCase().trim();
        if (s === 'r' || s === 'resepsi' || s === 'reception' || s === 'resepsi_saja') return false;
        if (s === 'a' || s === 'akad' || s === 'matrimony' || s === 'akad_saja') return true;
      } catch {}
    }
    if (typeof draft?.showHolyMatrimony === 'boolean') return draft.showHolyMatrimony;
    return orderBool('showHolyMatrimony', (invitationData as any).showHolyMatrimony ?? true);
  });
  const [showAdat, setShowAdat] = useState<boolean>(() => {
    if (typeof draft?.showAdat === 'boolean') return draft.showAdat;
    return orderBool('showAdat', (invitationData as any).showAdat ?? true);
  });
  const [showReception, setShowReception] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = new URLSearchParams(window.location.search);
        const s = (p.get('e') || p.get('s') || p.get('event') || p.get('events') || p.get('sesi') || p.get('acara') || '').toLowerCase().trim();
        if (s === 'a' || s === 'akad' || s === 'matrimony' || s === 'akad_saja') return false;
        if (s === 'r' || s === 'resepsi' || s === 'reception' || s === 'resepsi_saja') return true;
      } catch {}
    }
    if (typeof draft?.showReception === 'boolean') return draft.showReception;
    return orderBool('showReception', (invitationData as any).showReception ?? true);
  });
  const [showStory, setShowStory] = useState<boolean>(() => {
    if (typeof draft?.showStory === 'boolean') return draft.showStory;
    return orderBool('showStory', (invitationData as any).showStory ?? true);
  });
  const [showRsvp, setShowRsvp] = useState<boolean>(() => {
    if (typeof draft?.showRsvp === 'boolean') return draft.showRsvp;
    return orderBool('showRsvp', (invitationData as any).showRsvp ?? true);
  });
  const [showAccessCard, setShowAccessCard] = useState<boolean>(() => {
    if (typeof draft?.showAccessCard === 'boolean') return draft.showAccessCard;
    return orderBool('showAccessCard', (invitationData as any).showAccessCard ?? true);
  });
  const [showGift, setShowGift] = useState<boolean>(() => {
    if (typeof draft?.showGift === 'boolean') return draft.showGift;
    return orderBool('showGift', (invitationData as any).showGift ?? true);
  });
  const [showPhysicalGift, setShowPhysicalGift] = useState<boolean>(() => {
    if (typeof draft?.showPhysicalGift === 'boolean') return draft.showPhysicalGift;
    return orderBool('showPhysicalGift', (invitationData as any).showPhysicalGift ?? true);
  });
  const [showPreWedVideo, setShowPreWedVideo] = useState<boolean>(() => {
    if (typeof draft?.showPreWedVideo === 'boolean') return draft.showPreWedVideo;
    return orderBool('showPreWedVideo', false);
  });

  // Background Options (Video vs Photo vs Slideshow)
  const [bgType, setBgType] = useState<'video' | 'photo' | 'slideshow'>(() => {
    if (draft?.bgType === 'photo' || draft?.bgType === 'video' || draft?.bgType === 'slideshow') return draft.bgType;
    if (ORDER?.bgType === 'photo' || ORDER?.bgType === 'video' || ORDER?.bgType === 'slideshow') return ORDER.bgType;
    return 'slideshow';
  });
  const [bgPhoto, setBgPhotoState] = useState<string>(() => {
    return draft?.bgPhoto || orderStr('bgPhoto') || (invitationData as any).bgPhoto || MEDIA.poster || '/poster.jpg';
  });
  const [bgPhotos, setBgPhotos] = useState<string[]>(() => {
    if (Array.isArray(draft?.bgPhotos) && draft.bgPhotos.length > 0) return draft.bgPhotos;
    if (Array.isArray(ORDER?.bgPhotos) && ORDER.bgPhotos.length > 0) return ORDER.bgPhotos;
    return [
      '/slideshow/slideshow1.jpg',
      '/slideshow/slideshow2.jpg',
      '/slideshow/slideshow3.jpg',
      '/slideshow/slideshow4.jpg',
      '/slideshow/slideshow5.jpg',
      '/slideshow/slideshow6.jpg',
      '/slideshow/slideshow7.jpg',
      '/slideshow/slideshow8.jpg',
      '/slideshow/slideshow9.jpg',
    ];
  });

  const addBgPhoto = (src: string) => {
    setBgPhotos((prev) => [...prev, src]);
  };

  const updateBgPhoto = (index: number, newSrc: string) => {
    setBgPhotos((prev) => {
      const next = [...prev];
      if (index >= 0 && index < next.length) {
        next[index] = newSrc;
      }
      return next;
    });
  };

  const removeBgPhoto = (index: number) => {
    setBgPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Wedding Gift Details
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    draft?.bankAccounts || invitationData.bankAccounts || []
  );
  const [physicalGiftAddress, setPhysicalGiftAddress] = useState<typeof invitationData.physicalGiftAddress>(
    draft?.physicalGiftAddress || invitationData.physicalGiftAddress
  );

  // Pre-Wedding Video Link
  const [preWedVideoUrl, setPreWedVideoUrl] = useState<string>(() => {
    return draft?.preWedVideoUrl || (ORDER?.liveStream as any)?.preWedVideoUrl || invitationData.liveStream?.preWedVideoUrl || 'https://www.youtube.com/watch?v=EngW7tLk6R8';
  });

  // 3. Story Milestones
  const [storyMilestones, setStoryMilestones] = useState<StoryMilestone[]>(
    draft?.storyMilestones || invitationData.storyMilestones
  );

  // 4. Photos (Cover, Portraits, Gallery, Welcome)
  const [coverImage, setCoverImageState] = useState<string>(() => {
    return draft?.coverImage || orderStr('coverImage') || fixPath(ORDER?.media?.cover) || fixPath((invitationData as any).coverImage) || MEDIA.cover;
  });
  const [welcomePhoto, setWelcomePhotoState] = useState<string>(() => {
    return draft?.welcomePhoto || orderStr('welcomePhoto') || fixPath(ORDER?.media?.welcome) || fixPath((invitationData as any).welcomePhoto) || MEDIA.welcomePhoto || '/welcome.jpg';
  });
  const [welcomeData, setWelcomeData] = useState<typeof invitationData.welcome>(
    draft?.welcome || invitationData.welcome
  );
  const [couplePhoto, setCouplePhotoState] = useState<string>(() => {
    return draft?.couplePhoto || orderStr('couplePhoto') || fixPath(ORDER?.media?.couple) || fixPath((invitationData as any).couplePhoto) || MEDIA.couplePhoto || '/couple.jpg';
  });
  const [coupleSectionData, setCoupleSectionData] = useState<typeof invitationData.coupleSection>(
    draft?.coupleSection || invitationData.coupleSection
  );
  const [accessCardPhoto, setAccessCardPhotoState] = useState<string>(() => {
    return draft?.accessCardPhoto || orderStr('accessCardPhoto') || fixPath(ORDER?.media?.accessCard) || fixPath((invitationData as any).accessCardPhoto) || MEDIA.accessCardPhoto || '/photos/story.jpg';
  });
  const [closingPhoto, setClosingPhotoState] = useState<string>(() => {
    return draft?.closingPhoto || orderStr('closingPhoto') || fixPath(ORDER?.media?.closing) || fixPath((invitationData as any).closingPhoto) || invitationData.mediaPaths.columnBgClosing;
  });
  const [groomPhoto, setGroomPhotoState] = useState<string>(() => {
    return draft?.groomPhoto || orderStr('groomPhoto') || fixPath(ORDER?.couple?.groom?.photo) || INITIAL_COUPLE.groom.photo || invitationData.couple.groom.photo;
  });
  const [bridePhoto, setBridePhotoState] = useState<string>(() => {
    return draft?.bridePhoto || orderStr('bridePhoto') || fixPath(ORDER?.couple?.bride?.photo) || INITIAL_COUPLE.bride.photo || invitationData.couple.bride.photo;
  });
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>(() => {
    return draft?.galleryPhotos || (INITIAL_GALLERY.length > 0 ? INITIAL_GALLERY : invitationData.galleryPhotos);
  });

  // 5. Video State (Single Source of Truth)
  const [selectedPresetId, setSelectedPresetIdState] = useState<string>(() => {
    const pId = draft?.selectedPresetId || ORDER?.selectedPresetId;
    if (pId && !pId.startsWith('blob:')) {
      return pId;
    }
    return 'v1';
  });

  const [customVideo, setCustomVideoState] = useState<UserVideoInfo | null>(() => {
    return getOrderCustomVideo();
  });
  const previousUrlRef = useRef<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const setCustomVideo = (info: UserVideoInfo) => {
    setVideoError(null);
    if (previousUrlRef.current && previousUrlRef.current !== info.url) {
      URL.revokeObjectURL(previousUrlRef.current);
    }
    previousUrlRef.current = info.url;
    setCustomVideoState(info);
  };

  const removeCustomVideo = () => {
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }
    setCustomVideoState(null);
  };

  const reportVideoError = (message: string) => {
    setVideoError(message);
    removeCustomVideo();
  };

  // Revoke object URL ONLY when the whole app unmounts
  useEffect(() => {
    return () => {
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const currentPreset =
    MEDIA.presets.find((p) => p.id === selectedPresetId) || MEDIA.presets[0];

  const resolvedVideo = resolveVideoSource(customVideo, selectedPresetId);

  // 6. Music State
  const [activeMusic, setActiveMusic] = useState<string>(() => {
    return draft?.activeMusic || orderStr('activeMusic') || ORDER?.activeMusic || MEDIA.music;
  });

  // 7. UI Controls
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isPreview, setIsPreview] = useState<boolean>(APP_MODE === 'demo');

  // Persist text fields to sessionStorage ONLY in demo mode (NEVER persist blob URLs)
  useEffect(() => {
    if (APP_MODE === 'final') return;
    try {
      const payload = {
        couple: {
          groom: {
            ...couple.groom,
            photo: invitationData.couple.groom.photo, // Don't persist blob URLs
          },
          bride: {
            ...couple.bride,
            photo: invitationData.couple.bride.photo,
          },
          hashtag: couple.hashtag,
          quote: couple.quote,
        },
        akad,
        reception,
        selectedPresetId: selectedPresetId.startsWith('blob:') ? 'v1' : selectedPresetId,
        welcome: welcomeData,
        coupleSection: coupleSectionData,
        storyMilestones,
        guestName,
        titleTone,
        showHolyMatrimony,
        showAdat,
        showReception,
        showStory,
        showRsvp,
        showAccessCard,
        showGift,
        showPhysicalGift,
        bgType,
        bgPhoto: bgPhoto.startsWith('blob:') ? MEDIA.poster : bgPhoto,
        bgPhotos: bgPhotos.filter((s: string) => !s.startsWith('blob:')),
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage quota or privacy mode error
    }
  }, [
    couple,
    akad,
    reception,
    selectedPresetId,
    welcomeData,
    coupleSectionData,
    storyMilestones,
    guestName,
    titleTone,
    showHolyMatrimony,
    showAdat,
    showReception,
    showStory,
    showRsvp,
    showAccessCard,
    showGift,
    showPhysicalGift,
    bgType,
    bgPhoto,
    bgPhotos,
  ]);

  // Setters for Welcome
  const setWelcomePhoto = (src: string) => {
    setWelcomePhotoState(src);
  };

  const updateWelcomeData = (field: keyof typeof invitationData.welcome, value: string) => {
    if (field === 'defaultGuestName') {
      setGuestNameState(value);
    }
    setWelcomeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Setters for Couple Section
  const setCouplePhoto = (src: string) => {
    setCouplePhotoState(src);
  };

  const updateCoupleSectionData = (field: keyof typeof invitationData.coupleSection, value: string) => {
    setCoupleSectionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Setter for Access Card Photo
  const setAccessCardPhoto = (src: string) => {
    setAccessCardPhotoState(src);
  };

  // Setter for Closing Photo
  const setClosingPhoto = (src: string) => {
    setClosingPhotoState(src);
  };
  const setBgPhoto = (src: string) => {
    setBgPhotoState(src);
  };

  // Setters for Couple
  const updateCoupleField = (section: 'groom' | 'bride', field: string, value: string) => {
    setCouple((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateQuote = (text: string, source: string) => {
    setCouple((prev) => ({
      ...prev,
      quote: { text, source },
    }));
  };

  // Setters for Events
  const updateEventField = (
    eventKey: 'akadOrMatrimony' | 'culturalCeremony' | 'reception',
    field: keyof EventDetail,
    value: string
  ) => {
    if (eventKey === 'akadOrMatrimony') {
      setAkad((prev) => ({ ...prev, [field]: value }));
    } else if (eventKey === 'culturalCeremony') {
      setCulturalCeremony((prev) => (prev ? { ...prev, [field]: value } : undefined));
    } else {
      setReception((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Setters for Bank Accounts & Physical Gift
  const updateBankAccount = (index: number, field: keyof BankAccount, value: string) => {
    setBankAccounts((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const addBankAccount = () => {
    setBankAccounts((prev) => [
      ...prev,
      { bankName: 'BCA', accountNumber: '1234567890', accountHolder: 'Nama Penerima' },
    ]);
  };

  const removeBankAccount = (index: number) => {
    setBankAccounts((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePhysicalGiftAddress = (field: string, value: string) => {
    setPhysicalGiftAddress((prev) => ({ ...prev, [field]: value }));
  };

  const updateStoryMilestone = (index: number, field: keyof StoryMilestone, value: string) => {
    setStoryMilestones((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: value };
      }
      return copy;
    });
  };

  const addStoryMilestone = () => {
    setStoryMilestones((prev) => [
      ...prev,
      {
        year: `${new Date().getFullYear()}`,
        title: 'Momen Indah',
        description: 'Tuliskan kenangan dan kisah kasih kalian di sini.',
      },
    ]);
  };

  const removeStoryMilestone = (index: number) => {
    setStoryMilestones((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  };

  // Setters for Photos
  const setCoverImage = (src: string) => {
    setCoverImageState(src);
  };
  const removeCoverImage = () => {
    setCoverImageState(MEDIA.cover);
  };

  const setGroomPhoto = (src: string) => {
    setGroomPhotoState(src);
    updateCoupleField('groom', 'photo', src);
  };

  const setBridePhoto = (src: string) => {
    setBridePhotoState(src);
    updateCoupleField('bride', 'photo', src);
  };

  const addGalleryPhoto = (src: string, orientationOrAlt?: string) => {
    setGalleryPhotos((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        src,
        alt: `Seno & Jattu Prewedding ${prev.length + 1}`,
        caption: `Seno & Jattu Prewedding ${prev.length + 1}`,
        orientation: (orientationOrAlt === 'landscape' || orientationOrAlt === 'square') ? orientationOrAlt : 'portrait',
      },
    ]);
  };

  const updateGalleryPhoto = (index: number, newSrc: string) => {
    setGalleryPhotos((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], src: newSrc };
      }
      return copy;
    });
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteGalleryPhoto = (index: number) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const setSelectedPresetId = (id: string) => {
    setSelectedPresetIdState(id);
  };

  // Reset All to Default
  const resetToDefault = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
    removeCustomVideo();
    setVideoError(null);
    setCouple(invitationData.couple);
    setAkad(invitationData.events.akadOrMatrimony);
    setReception(invitationData.events.reception);
    setCoverImageState(MEDIA.cover);
    setWelcomePhotoState(MEDIA.welcomePhoto || '/welcome.jpg');
    const guestInit = getInitialGuestInfo();
    setGuestNameState(guestInit.name);
    setGuestCode(guestInit.code);
    setCouplePhotoState(MEDIA.couplePhoto || '/couple.jpg');
    setCoupleSectionData(invitationData.coupleSection);
    setAccessCardPhotoState(MEDIA.accessCardPhoto || '/photos/story.jpg');
    setClosingPhotoState(invitationData.mediaPaths.columnBgClosing);
    setGroomPhotoState(invitationData.couple.groom.photo);
    setBridePhotoState(invitationData.couple.bride.photo);
    setGalleryPhotos(invitationData.galleryPhotos);
    setStoryMilestones(invitationData.storyMilestones);
    setSelectedPresetIdState('v1');
    setActiveMusic(MEDIA.music);
    setCulturalCeremony(invitationData.events.culturalCeremony);
    setShowHolyMatrimony(true);
    setShowAdat(true);
    setShowReception(true);
    setShowStory(true);
    setShowRsvp(true);
    setShowAccessCard(true);
    setShowGift(true);
    setShowPhysicalGift(true);
    setBgType('video');
    setBgPhotoState(MEDIA.poster || '/poster.jpg');
    setBankAccounts(invitationData.bankAccounts || []);
    setPhysicalGiftAddress(invitationData.physicalGiftAddress);
    setPreWedVideoUrl(invitationData.liveStream?.preWedVideoUrl || 'https://www.youtube.com/watch?v=EngW7tLk6R8');
  };

  const applyImportedState = (data: any) => {
    if (!data || typeof data !== 'object') return;

    if (data.couple) {
      setCouple((prev) => ({
        ...prev,
        ...data.couple,
        groom: { ...prev.groom, ...(data.couple.groom || {}) },
        bride: { ...prev.bride, ...(data.couple.bride || {}) },
        quote: { ...prev.quote, ...(data.couple.quote || {}) },
      }));
    }
    if (data.events?.akadOrMatrimony) {
      setAkad((prev) => ({ ...prev, ...data.events.akadOrMatrimony }));
    }
    if (data.events?.culturalCeremony) {
      setCulturalCeremony(data.events.culturalCeremony);
    }
    if (data.events?.reception) {
      setReception((prev) => ({ ...prev, ...data.events.reception }));
    }
    if (typeof data.showHolyMatrimony === 'boolean') {
      setShowHolyMatrimony(data.showHolyMatrimony);
    }
    if (typeof data.showAdat === 'boolean') {
      setShowAdat(data.showAdat);
    }
    if (typeof data.showReception === 'boolean') {
      setShowReception(data.showReception);
    }
    if (typeof data.showStory === 'boolean') {
      setShowStory(data.showStory);
    }
    if (typeof data.showRsvp === 'boolean') {
      setShowRsvp(data.showRsvp);
    }
    if (typeof data.showAccessCard === 'boolean') {
      setShowAccessCard(data.showAccessCard);
    }
    if (typeof data.showGift === 'boolean') {
      setShowGift(data.showGift);
    }
    if (typeof data.showPhysicalGift === 'boolean') {
      setShowPhysicalGift(data.showPhysicalGift);
    }
    if (data.bgType === 'video' || data.bgType === 'photo' || data.bgType === 'slideshow') {
      setBgType(data.bgType);
    }
    if (typeof data.bgPhoto === 'string') {
      setBgPhotoState(data.bgPhoto);
    }
    if (Array.isArray(data.bgPhotos)) {
      setBgPhotos(data.bgPhotos);
    }
    if (Array.isArray(data.bankAccounts)) {
      setBankAccounts(data.bankAccounts);
    }
    if (data.physicalGiftAddress) {
      setPhysicalGiftAddress((prev) => ({ ...prev, ...data.physicalGiftAddress }));
    }
    if (data.liveStream?.preWedVideoUrl) {
      setPreWedVideoUrl(data.liveStream.preWedVideoUrl);
    } else if (data.preWedVideoUrl) {
      setPreWedVideoUrl(data.preWedVideoUrl);
    }
    if (data.welcome) {
      setWelcomeData((prev) => ({ ...prev, ...data.welcome }));
    }
    if (data.coupleSection) {
      setCoupleSectionData((prev) => ({ ...prev, ...data.coupleSection }));
    }
    if (data.titleTone === 'light' || data.titleTone === 'dark') {
      setTitleTone(data.titleTone);
    }
    if (typeof data.guestName === 'string') {
      setGuestNameState(data.guestName);
    }
    if (typeof data.selectedPresetId === 'string') {
      setSelectedPresetIdState(data.selectedPresetId);
    }
    if (Array.isArray(data.storyMilestones)) {
      setStoryMilestones(data.storyMilestones);
    }
    if (typeof data.activeMusic === 'string') {
      setActiveMusic(data.activeMusic);
    }

    // Media restorations
    if (typeof data.coverImage === 'string') setCoverImageState(data.coverImage);
    if (typeof data.welcomePhoto === 'string') setWelcomePhotoState(data.welcomePhoto);
    if (typeof data.couplePhoto === 'string') setCouplePhotoState(data.couplePhoto);
    if (typeof data.groomPhoto === 'string') setGroomPhotoState(data.groomPhoto);
    if (typeof data.bridePhoto === 'string') setBridePhotoState(data.bridePhoto);
    if (typeof data.accessCardPhoto === 'string') setAccessCardPhotoState(data.accessCardPhoto);
    if (typeof data.closingPhoto === 'string') setClosingPhotoState(data.closingPhoto);
    if (Array.isArray(data.galleryPhotos)) {
      setGalleryPhotos(data.galleryPhotos);
    }
    if (data.customVideo) {
      setCustomVideo(data.customVideo);
    }
  };

  return (
    <InvitationContext.Provider
      value={{
        appMode: APP_MODE,
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
        customVideoUrl: customVideo?.url || null,
        customVideoName: customVideo?.name || null,
        setCustomVideo,
        removeCustomVideo,
        resolvedVideo,
        videoError,
        setVideoError,
        reportVideoError,
        activeMusic,
        setActiveMusic,
        isCustomizerOpen,
        setIsCustomizerOpen,
        isPreview,
        setIsPreview,
        guestName,
        setGuestName,
        guestCode,
        setGuestCode,
        guestQuota,
        setGuestQuota,
        isLockedGuest,
        titleTone,
        setTitleTone,
        applyImportedState,
        resetToDefault,
      }}
    >
      {children}
    </InvitationContext.Provider>
  );
};

export const useInvitation = () => {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error('useInvitation must be used within an InvitationProvider');
  }
  return context;
};
