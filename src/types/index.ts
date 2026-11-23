export type Language = 'en' | 'id';

export interface Milestone {
  year: string;
  title: string;
  description: string;
  image?: string;
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logoPlaceholder?: string;
}

export interface EventDetail {
  id: string;
  title: string;
  subtitle: string;
  day: string;
  date: string;
  time: string;
  timezone: string;
  venueName: string;
  address: string;
  mapsUrl: string;
  calendarEvent: {
    title: string;
    description: string;
    location: string;
    start: string; // ISO format or YYYYMMDDTHHmmss
    end: string;
  };
}

export interface Wish {
  id?: string;
  name: string;
  attendance?: 'attending' | 'not_attending' | 'undecided' | 'hadir' | 'tidak_hadir' | 'belum_pasti';
  guestCount?: number;
  message: string;
  createdAt: string;
}

export type StoryMilestone = Milestone;
export type GalleryPhoto = {
  id: number | string;
  src: string;
  alt: string;
  caption: string;
  orientation: 'portrait' | 'landscape' | 'square';
};
export type CoupleInfo = InvitationData['couple'];

export interface InvitationData {
  couple: {
    groom: {
      name: string;
      fullName: string;
      parents: string;
      instagram: string;
      instagramUrl: string;
      photo: string;
      bio?: string;
    };
    bride: {
      name: string;
      fullName: string;
      parents: string;
      instagram: string;
      instagramUrl: string;
      photo: string;
      bio?: string;
    };
    hashtag: string;
    quote: {
      text: string;
      source: string;
    };
  };
  events: {
    akadOrMatrimony: EventDetail;
    culturalCeremony?: EventDetail;
    reception: EventDetail;
    countdownTarget: string; // ISO date string e.g. "2026-11-20T10:00:00"
  };
  storyMilestones: Milestone[];
  galleryPhotos: Array<{
    id: number | string;
    src: string;
    alt: string;
    caption: string;
    orientation: 'portrait' | 'landscape' | 'square';
  }>;
  welcome: {
    defaultGuestName: string;
    quoteLine1: string;
    quoteLine2: string;
    quoteLine3: string;
    quoteLine1Id: string;
    quoteLine2Id: string;
    quoteLine3Id: string;
  };
  coupleSection: {
    photo: string;
    quote: string;
    quoteId: string;
    quoteSource?: string;
  };
  titleTone?: 'light' | 'dark';
  accessCardPhoto: string;
  showHolyMatrimony?: boolean;
  showAdat?: boolean;
  showReception?: boolean;
  showStory?: boolean;
  showRsvp?: boolean;
  showAccessCard?: boolean;
  showGift?: boolean;
  showPhysicalGift?: boolean;
  bgType?: 'video' | 'photo';
  bgPhoto?: string;
  guestName?: string;
  liveStream: {
    preWedVideoUrl: string;
    liveStreamUrl: string;
  };
  bankAccounts: BankAccount[];
  physicalGiftAddress: {
    recipient: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
  };
  mediaPaths: {
    backgroundVideoMp4: string;
    backgroundVideoWebm: string;
    posterJpg: string;
    backgroundMusic: string;
    columnBgCover: string;
    columnBgMiddle: string;
    columnBgClosing: string;
  };
  translations: Record<Language, {
    weddingOf: string;
    youAreInvited: [string, string, string]; // "you", "are", "invited"
    dear: string;
    openInvitation: string;
    invitationGreeting: string;
    theGroom: string;
    theBride: string;
    sonOf: string;
    daughterOf: string;
    theCelebration: string;
    celebrationSubtitle: string;
    openMaps: string;
    addToCalendar: string;
    countdown: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
    ourStory: string;
    storyHeadline: string;
    gallery: string;
    gallerySubtitle: string;
    accessCard: string;
    accessSubtitle: string;
    scanQrNotice: string;
    downloadPass: string;
    guestNameLabel: string;
    guestPassId: string;
    seatsLabel: string;
    tableZone: string;
    watchLive: string;
    watchSubtitle: string;
    watchPreWed: string;
    watchStream: string;
    rsvpAndWishes: string;
    rsvpSubtitle: string;
    attendanceLabel: string;
    attending: string;
    notAttending: string;
    undecided: string;
    guestCountLabel: string;
    yourNameLabel: string;
    yourWishLabel: string;
    sendRsvp: string;
    submitting?: string;
    rsvpThankYou?: string;
    rsvpError?: string;
    maxSubmissions?: string;
    loadingWishes?: string;
    noWishesYet?: string;
    submittedWishes: string;
    weddingGift: string;
    giftSubtitle: string;
    copyAccount: string;
    copied: string;
    copyAddress: string;
    sendPhysicalGift: string;
    closingThankYou: string;
    closingSentence: string;
    withWarmth: string;
    footerCredit: string;
    menuSections: {
      cover: string;
      welcome: string;
      couple: string;
      groom: string;
      bride: string;
      events: string;
      story: string;
      gallery: string;
      access: string;
      live: string;
      rsvp: string;
      gift: string;
      closing: string;
    };
  }>;
}
