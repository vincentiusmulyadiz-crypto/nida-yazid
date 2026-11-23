/**
 * EDITABLE INVITATION DATA
 * 
 * To duplicate this project for a new client:
 * Edit the fields below (couple info, dates, venues, parents, bank accounts,
 * photo paths, story, quote, and translations).
 */

import { InvitationData } from '../types';
import orderData from './order.json';

export { APP_MODE, type AppMode } from './mode';

export const ORDER_SCHEMA_VERSION = 1;

export function deepMerge<T>(target: T, source: any): T {
  if (source === undefined || source === null) return target;
  if (Array.isArray(source)) {
    // Arrays are replaced, not merged per requirement
    return source as unknown as T;
  }
  if (typeof source === 'object' && !Array.isArray(source)) {
    const output = { ...(target as any) };
    for (const key of Object.keys(source)) {
      if (source[key] === undefined) continue;
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof output[key] === 'object' &&
        output[key] !== null &&
        !Array.isArray(output[key])
      ) {
        output[key] = deepMerge(output[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output as T;
  }
  return source as unknown as T;
}

export const MEDIA = {
  cover: "/cover.jpg",
  welcomePhoto: "/welcome.jpg",
  couplePhoto: "/couple.jpg",
  accessCardPhoto: "/photos/story.jpg",
  poster: "/poster.jpg",
  music: "/music.mp3",
  presets: [
    { id: "v1", label: "Midnight", mp4: "/videos/v1.mp4", webm: "/videos/v1.webm", poster: "/videos/v1.jpg" },
    { id: "v2", label: "Ocean", mp4: "/videos/v2.mp4", webm: "/videos/v2.webm", poster: "/videos/v2.jpg" },
    { id: "v3", label: "Rose", mp4: "/videos/v3.mp4", webm: "/videos/v3.webm", poster: "/videos/v3.jpg" },
  ],
};

const defaultConfig = {
  templateName: "SENJA — Seno & Jattu",
  whatsapp: "6288228684215",
  customerId: (import.meta.env.VITE_CUSTOMER_ID as string) || "0df84d42-e5cf-4873-8236-522fde515f0f",
  ownerId: (import.meta.env.VITE_OWNER_ID as string) || "0809f3e3-2be1-4fad-9d44-14c46b956d41",
  supabaseUrl: (import.meta.env.VITE_SUPABASE_URL as string) || "https://uazfzmuvunmhnjdfxbbi.supabase.co",
  supabasePublishableKey: (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "sb_publishable_Kbhrasv4jWCwnd52QRvprQ_1bJ-EDpe",
};

const getQueryCustomerId = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('cid') || p.get('customer_id') || p.get('customer') || null;
    } catch {
      return null;
    }
  }
  return null;
};

const mergedConfig = deepMerge(defaultConfig, (orderData as any).config || {});
const dynamicCid = getQueryCustomerId();
if (dynamicCid) {
  mergedConfig.customerId = dynamicCid;
}

export const CONFIG = mergedConfig;

const defaultInvitationData: InvitationData = {
  couple: {
    groom: {
      name: 'Alif',
      fullName: 'Alif Pratama Danuarta, B.Arch.',
      parents: 'Mr. Bambang Danuarta & Mrs. Sri Rahayu',
      instagram: '@alifdanuarta',
      instagramUrl: 'https://instagram.com/alifdanuarta',
      photo: '/photos/groom.jpg',
      bio: 'Architect, minimalist, and lover of timeless spatial harmony.',
    },
    bride: {
      name: 'Lakshita',
      fullName: 'Lakshita Anandita Wardhani, M.Ds.',
      parents: 'Mr. Hendra Wardhani & Mrs. Ratna Dewi',
      instagram: '@lakshitaanandita',
      instagramUrl: 'https://instagram.com/lakshitaanandita',
      photo: '/photos/bride.jpg',
      bio: 'Editorial textile designer with a passion for film photography and slow mornings.',
    },
    hashtag: '',
    quote: {
      text: 'Whatever our souls are made of, his and mine are the same.',
      source: 'Emily Brontë\nWuthering Heights',
    },
  },

  events: {
    countdownTarget: '2027-01-10T08:00:00+07:00',
    akadOrMatrimony: {
      id: 'holy-matrimony',
      title: 'Akad Nikah / Holy Matrimony',
      subtitle: 'The Sacred Vows & Solemnization',
      day: 'Saturday',
      date: 'November 21, 2026',
      time: '09:00 AM – 11:00 AM WIB',
      timezone: 'WIB (UTC+7)',
      venueName: 'The Glasshouse at Plataran',
      address: 'Jl. Durian No. 16, Jagakarsa, South Jakarta 12620',
      mapsUrl: 'https://maps.google.com/?q=Plataran+Cilandak+Jakarta',
      calendarEvent: {
        title: 'Akad Nikah: Alif & Lakshita',
        description: 'Solemnization of marriage between Alif Pratama and Lakshita Anandita.',
        location: 'The Glasshouse at Plataran, South Jakarta',
        start: '20261121T020000Z', // 09:00 WIB is 02:00 UTC
        end: '20261121T040000Z',
      },
    },
    culturalCeremony: {
      id: 'cultural-ceremony',
      title: 'Cultural Ceremony (Adat)',
      subtitle: 'Traditional Rituals & Blessings',
      day: 'Saturday',
      date: 'November 21, 2026',
      time: '01:00 PM – 03:30 PM WIB',
      timezone: 'WIB (UTC+7)',
      venueName: 'The Heritage Hall at Plataran',
      address: 'Jl. Durian No. 16, Jagakarsa, South Jakarta 12620',
      mapsUrl: 'https://maps.google.com/?q=Plataran+Cilandak+Jakarta',
      calendarEvent: {
        title: 'Cultural Ceremony (Adat): Alif & Lakshita',
        description: 'Traditional cultural ceremony and blessings for Alif and Lakshita.',
        location: 'The Heritage Hall at Plataran, South Jakarta',
        start: '20261121T060000Z',
        end: '20261121T083000Z',
      },
    },
    reception: {
      id: 'wedding-reception',
      title: 'Wedding Reception',
      subtitle: 'Dinner, Music & Celebration',
      day: 'Saturday',
      date: 'November 21, 2026',
      time: '06:30 PM – 10:00 PM WIB',
      timezone: 'WIB (UTC+7)',
      venueName: 'The Grand Pavilion & Courtyard',
      address: 'Jl. Durian No. 16, Jagakarsa, South Jakarta 12620',
      mapsUrl: 'https://maps.google.com/?q=Plataran+Cilandak+Jakarta',
      calendarEvent: {
        title: 'Wedding Reception: Alif & Lakshita',
        description: 'Evening celebration and dinner for Alif and Lakshita.',
        location: 'The Grand Pavilion & Courtyard, South Jakarta',
        start: '20261121T113000Z', // 18:30 WIB is 11:30 UTC
        end: '20261121T150000Z',
      },
    },
  },

  storyMilestones: [
    {
      year: 'Autumn 2021',
      title: 'A Shared Bench in Kyoto',
      description: 'We met by pure coincidence under the golden ginkgo trees near the Kamo River. Two sketchbooks, one pot of roasted hojicha, and a conversation that forgot the sunset.',
      image: '/photos/gallery-1.jpg',
    },
    {
      year: 'Winter 2023',
      title: 'The Blueprint of Us',
      description: 'After two years of distance between Tokyo and Jakarta, we built our first joint design studio. We realized that every blueprint we drafted led to one shared home.',
      image: '/photos/gallery-2.jpg',
    },
    {
      year: 'Spring 2025',
      title: 'The Promise on Mount Batur',
      description: 'At dawn, wrapped in heavy wool blankets above the sea of clouds, Alif knelt with a raw silver ring. Lakshita whispered yes before he even finished asking.',
      image: '/photos/gallery-3.jpg',
    },
    {
      year: 'November 2026',
      title: 'Ours Became Forever',
      description: 'Surrounded by our families and dearest companions, we embark on the sacred journey of a lifetime.',
      image: '/photos/story.jpg',
    },
  ],

  galleryPhotos: [
    { id: 1, src: '/photos/gallery-1.jpg', alt: 'Alif and Lakshita in Kyoto', caption: 'Kyoto golden hour, 2021', orientation: 'portrait' },
    { id: 2, src: '/photos/gallery-2.jpg', alt: 'Candid in Tokyo studio', caption: 'Architectural shadows, Tokyo 2023', orientation: 'landscape' },
    { id: 3, src: '/photos/gallery-3.jpg', alt: 'Mount Batur sunrise', caption: 'Dawn on the volcanic ridge, 2025', orientation: 'portrait' },
    { id: 4, src: '/photos/gallery-4.jpg', alt: 'Intimate film portrait', caption: '35mm Tri-X film candid', orientation: 'square' },
    { id: 5, src: '/photos/gallery-5.jpg', alt: 'Holding hands along the coast', caption: 'Uluwatu cliff walk', orientation: 'portrait' },
    { id: 6, src: '/photos/gallery-6.jpg', alt: 'Silk gown movement', caption: 'Editorial veil motion study', orientation: 'landscape' },
    { id: 7, src: '/photos/gallery-7.jpg', alt: 'Shared laugh at evening dinner', caption: 'Candlelight in Menteng', orientation: 'square' },
    { id: 8, src: '/photos/gallery-8.jpg', alt: 'Quiet moment together', caption: 'The quiet before the vows', orientation: 'portrait' },
  ],

  welcome: {
    defaultGuestName: 'John Doe',
    quoteLine1: "we're tying the knot",
    quoteLine2: "and you're on the",
    quoteLine3: 'Guest List',
    quoteLine1Id: 'kami akan menikah',
    quoteLine2Id: 'dan kamu ada di',
    quoteLine3Id: 'Daftar Tamu',
  },

  coupleSection: {
    photo: '/couple.jpg',
    quote: "Two hearts, one story, and we're only getting started.",
    quoteId: 'Dua hati, satu cerita, dan kami baru memulainya.',
    quoteSource: '',
  },

  titleTone: 'light' as 'light' | 'dark',
  accessCardPhoto: MEDIA.accessCardPhoto,
  showHolyMatrimony: true,
  showAdat: true,
  showReception: true,
  showStory: true,
  showRsvp: true,
  showAccessCard: true,
  showGift: true,
  showPhysicalGift: true,
  bgType: 'video' as 'video' | 'photo',
  bgPhoto: '/poster.jpg',

  liveStream: {
    preWedVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with client YouTube video
    liveStreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with client live stream link
  },

  bankAccounts: [
    {
      bankName: 'Bank Central Asia (BCA)',
      accountNumber: '8820391204',
      accountHolder: 'Alif Pratama Danuarta',
    },
    {
      bankName: 'Bank Mandiri',
      accountNumber: '1370019283741',
      accountHolder: 'Lakshita Anandita Wardhani',
    },
  ],

  physicalGiftAddress: {
    recipient: 'Alif Pratama & Lakshita Anandita',
    phone: '+62 812-9876-5432',
    address: 'Kavling Harmoni Asri Blok B No. 8, Cilandak Barat',
    city: 'Jakarta Selatan, DKI Jakarta',
    postalCode: '12430',
    notes: 'Please write "Wedding Gift - Alif & Lakshita" on the package label.',
  },

  mediaPaths: {
    backgroundVideoMp4: MEDIA.presets[0].mp4,
    backgroundVideoWebm: MEDIA.presets[0].webm,
    posterJpg: MEDIA.poster,
    backgroundMusic: MEDIA.music,
    columnBgCover: MEDIA.cover,
    columnBgMiddle: '/photos/story.jpg',
    columnBgClosing: '/photos/closing.jpg',
  },

  translations: {
    en: {
      weddingOf: 'The Wedding of',
      youAreInvited: ['you', 'are', 'invited'],
      dear: 'Dear',
      openInvitation: 'Open Invitation',
      invitationGreeting: 'We joyfully request the honor of your presence to witness and celebrate the holy matrimony of our union.',
      theGroom: 'The Groom',
      theBride: 'The Bride',
      sonOf: 'The Son of',
      daughterOf: 'The Daughter of',
      theCelebration: 'The Celebration',
      celebrationSubtitle: 'Two moments, one unforgettable day',
      openMaps: 'Open in Google Maps',
      addToCalendar: 'Add to Calendar',
      countdown: {
        days: 'Days',
        hours: 'Hours',
        minutes: 'Mins',
        seconds: 'Secs',
      },
      ourStory: 'Our Story',
      storyHeadline: 'Ours became forever',
      gallery: 'Visual Memoir',
      gallerySubtitle: 'Moments captured on 35mm film',
      accessCard: 'Entrance Pass',
      accessSubtitle: 'Please present this digital pass upon arrival at the venue',
      scanQrNotice: 'Scan at reception desk for swift check-in',
      downloadPass: 'Download Pass',
      guestNameLabel: 'Guest Name',
      guestPassId: 'Pass ID',
      seatsLabel: 'Seats Reserved',
      tableZone: 'VIP / Zone A',
      watchLive: 'Watch Live',
      watchSubtitle: 'For distant family & companions joining us in spirit',
      watchPreWed: 'Watch Pre-Wedding Film',
      watchStream: 'Watch Live Stream',
      rsvpAndWishes: 'RSVP & Wishes',
      rsvpSubtitle: 'Your presence and prayers mean the world to us',
      attendanceLabel: 'Will you attend?',
      attending: 'Joyfully Accept',
      notAttending: 'Regretfully Decline',
      undecided: 'Still Deciding',
      guestCountLabel: 'Number of Guests',
      yourNameLabel: 'Guest Name',
      yourWishLabel: 'Your Warm Wishes & Prayers',
      sendRsvp: 'Confirm RSVP & Send Wishes',
      submitting: 'Submitting...',
      rsvpThankYou: 'Thank you! Your RSVP & wishes have been received.',
      rsvpError: 'Failed to send RSVP. Please try again.',
      maxSubmissions: 'Maximum submissions reached.',
      loadingWishes: 'Loading wishes...',
      noWishesYet: 'No wishes yet. Be the first to send your blessings!',
      submittedWishes: 'Wishes from Beloved Friends & Family',
      weddingGift: 'Wedding Gift',
      giftSubtitle: 'Your love and blessings are the greatest gift. However, should you wish to honor us with a token of love, we provide our details below.',
      copyAccount: 'Copy Account Number',
      copied: 'Copied to clipboard',
      copyAddress: 'Copy Address',
      sendPhysicalGift: 'Send Physical Gift',
      closingThankYou: 'With heartfelt gratitude for being part of our story, your presence and warm wishes complete our celebration.',
      closingSentence: 'May happiness and peace accompany every step of your journey, as it has blessed ours.',
      withWarmth: 'With love & warmth',
      footerCredit: 'Editorial Digital Invitation · Curated with Love',
      menuSections: {
        cover: 'Cover',
        welcome: 'Welcome',
        couple: 'Us',
        groom: 'The Groom',
        bride: 'The Bride',
        events: 'Celebration',
        story: 'Our Story',
        gallery: 'Gallery',
        access: 'Entrance Pass',
        live: 'Prewedding Video',
        rsvp: 'RSVP',
        gift: 'Wedding Gift',
        closing: 'Closing',
      },
    },
    id: {
      weddingOf: 'The Wedding of',
      youAreInvited: ['kami', 'mengundang', 'anda'],
      dear: 'Dear,',
      openInvitation: 'Open Invitation',
      invitationGreeting: 'Dengan penuh rasa syukur dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.',
      theGroom: 'Mempelai Pria',
      theBride: 'Mempelai Wanita',
      sonOf: 'Putra dari',
      daughterOf: 'Putri dari',
      theCelebration: 'Rangkaian Acara',
      celebrationSubtitle: 'Dua momen sakral dalam satu hari bahagia',
      openMaps: 'Buka di Google Maps',
      addToCalendar: 'Simpan ke Kalender',
      countdown: {
        days: 'Hari',
        hours: 'Jam',
        minutes: 'Menit',
        seconds: 'Detik',
      },
      ourStory: 'Kisah Kami',
      storyHeadline: 'Kisah kita menjadi selamanya',
      gallery: 'Galeri Kami',
      gallerySubtitle: 'Momen indah dalam perjalanan kami',
      accessCard: 'Kartu Akses',
      accessSubtitle: 'Tunjukkan kartu digital ini saat tiba di meja penerima tamu',
      scanQrNotice: 'Pindai QR saat kedatangan untuk registrasi cepat',
      downloadPass: 'Unduh Kartu Akses',
      guestNameLabel: 'Nama Tamu',
      guestPassId: 'ID Tiket',
      seatsLabel: 'Jumlah Kursi',
      tableZone: 'VIP / Zona A',
      watchLive: 'Siaran Langsung',
      watchSubtitle: 'Bagi keluarga dan sahabat yang menyaksikan dari kejauhan',
      watchPreWed: 'Tonton Video Pre-Wedding',
      watchStream: 'Tonton Siaran Langsung',
      rsvpAndWishes: 'RSVP & Ucapan',
      rsvpSubtitle: 'Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan anugerah terindah bagi kami',
      attendanceLabel: 'Konfirmasi Kehadiran',
      attending: 'Hadir',
      notAttending: 'Tidak Dapat Hadir',
      undecided: 'Masih Ragu',
      guestCountLabel: 'Jumlah Tamu',
      yourNameLabel: 'Nama',
      yourWishLabel: 'Ucapan & Doa Restu',
      sendRsvp: 'Kirim Konfirmasi & Ucapan',
      submitting: 'Mengirimkan...',
      rsvpThankYou: 'Terima kasih! Konfirmasi & ucapan Anda telah tersimpan.',
      rsvpError: 'Gagal mengirim konfirmasi. Silakan coba lagi.',
      maxSubmissions: 'Batas pengiriman tercapai.',
      loadingWishes: 'Memuat doa & ucapan...',
      noWishesYet: 'Belum ada ucapan. Jadilah yang pertama memberikan doa restu!',
      submittedWishes: 'Doa & Harapan dari Sahabat & Kerabat',
      weddingGift: 'Tanda Kasih',
      giftSubtitle: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun apabila Anda berkehendak memberikan tanda kasih, dapat melalui rekening berikut.',
      copyAccount: 'Salin No. Rekening',
      copied: 'Berhasil disalin',
      copyAddress: 'Salin Alamat',
      sendPhysicalGift: 'Kirim Kado Fisik',
      closingThankYou: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.',
      closingSentence: 'Semoga cinta dan kedamaian senantiasa melimpahi kita semua.',
      withWarmth: 'Dengan cinta & doa restu',
      footerCredit: 'Undangan Digital Editorial · Dirancang dengan Sepenuh Cinta',
      menuSections: {
        cover: 'Sampul',
        welcome: 'Sapaan',
        couple: 'Pasangan',
        groom: 'Mempelai Pria',
        bride: 'Mempelai Wanita',
        events: 'Acara',
        story: 'Kisah',
        gallery: 'Galeri',
        access: 'Akses Masuk',
        live: 'Video Prewedding',
        rsvp: 'RSVP',
        gift: 'Tanda Kasih',
        closing: 'Penutup',
      },
    },
  },
};

export const invitationData: InvitationData = deepMerge(defaultInvitationData, orderData as any);

