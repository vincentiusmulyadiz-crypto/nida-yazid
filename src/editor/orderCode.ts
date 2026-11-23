import { inflateSync, strFromU8 } from 'fflate';
import { EDITOR_BUNDLE_MARKER } from './index';

if (typeof window !== 'undefined') {
  (window as any).__ebm_code = EDITOR_BUNDLE_MARKER;
}

const sanitizeString = (val: any, maxLen = 300): string => {
  if (typeof val !== 'string') return '';
  // Strip HTML tags and control characters
  return val
    .replace(/<[^>]*>?/gm, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .slice(0, maxLen);
};

export function parseAndValidateOrderCode(code: string): any {
  if (!code || typeof code !== 'string') {
    throw new Error('Order code cannot be empty');
  }

  // 1. Decode base64url
  let base64 = code.trim().replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    throw new Error('Invalid base64 encoding');
  }

  const u8 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    u8[i] = binary.charCodeAt(i);
  }

  // 2. Decompress with inflateSync
  let decompressed: Uint8Array;
  try {
    decompressed = inflateSync(u8);
  } catch {
    throw new Error('Decompression failed: corrupt order code');
  }

  // 3. JSON parse
  let raw: any;
  try {
    const jsonStr = strFromU8(decompressed);
    raw = JSON.parse(jsonStr);
  } catch {
    throw new Error('Malformed JSON payload inside order code');
  }

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Invalid payload structure');
  }

  // 4. Strict validation and sanitization (known keys only, string length limits, no html/control chars)
  const sanitized: any = {};

  if (raw.couple && typeof raw.couple === 'object') {
    sanitized.couple = {};
    if (raw.couple.groom && typeof raw.couple.groom === 'object') {
      sanitized.couple.groom = {
        name: sanitizeString(raw.couple.groom.name, 50),
        fullName: sanitizeString(raw.couple.groom.fullName, 100),
        parents: sanitizeString(raw.couple.groom.parents, 120),
        instagram: sanitizeString(raw.couple.groom.instagram, 50),
        instagramUrl: sanitizeString(raw.couple.groom.instagramUrl, 150),
        bio: sanitizeString(raw.couple.groom.bio, 200),
      };
    }
    if (raw.couple.bride && typeof raw.couple.bride === 'object') {
      sanitized.couple.bride = {
        name: sanitizeString(raw.couple.bride.name, 50),
        fullName: sanitizeString(raw.couple.bride.fullName, 100),
        parents: sanitizeString(raw.couple.bride.parents, 120),
        instagram: sanitizeString(raw.couple.bride.instagram, 50),
        instagramUrl: sanitizeString(raw.couple.bride.instagramUrl, 150),
        bio: sanitizeString(raw.couple.bride.bio, 200),
      };
    }
    if (raw.couple.hashtag) {
      sanitized.couple.hashtag = sanitizeString(raw.couple.hashtag, 60);
    }
    if (raw.couple.quote && typeof raw.couple.quote === 'object') {
      sanitized.couple.quote = {
        text: sanitizeString(raw.couple.quote.text, 250),
        source: sanitizeString(raw.couple.quote.source, 100),
      };
    }
  }

  if (raw.events && typeof raw.events === 'object') {
    sanitized.events = {};
    if (raw.events.akadOrMatrimony && typeof raw.events.akadOrMatrimony === 'object') {
      sanitized.events.akadOrMatrimony = {
        day: sanitizeString(raw.events.akadOrMatrimony.day, 30),
        date: sanitizeString(raw.events.akadOrMatrimony.date, 60),
        time: sanitizeString(raw.events.akadOrMatrimony.time, 60),
        timezone: sanitizeString(raw.events.akadOrMatrimony.timezone, 30),
        venueName: sanitizeString(raw.events.akadOrMatrimony.venueName, 120),
        address: sanitizeString(raw.events.akadOrMatrimony.address, 200),
        mapsUrl: sanitizeString(raw.events.akadOrMatrimony.mapsUrl, 300),
      };
    }
    if (raw.events.culturalCeremony && typeof raw.events.culturalCeremony === 'object') {
      sanitized.events.culturalCeremony = {
        day: sanitizeString(raw.events.culturalCeremony.day, 30),
        date: sanitizeString(raw.events.culturalCeremony.date, 60),
        time: sanitizeString(raw.events.culturalCeremony.time, 60),
        timezone: sanitizeString(raw.events.culturalCeremony.timezone, 30),
        venueName: sanitizeString(raw.events.culturalCeremony.venueName, 120),
        address: sanitizeString(raw.events.culturalCeremony.address, 200),
        mapsUrl: sanitizeString(raw.events.culturalCeremony.mapsUrl, 300),
      };
    }
    if (raw.events.reception && typeof raw.events.reception === 'object') {
      sanitized.events.reception = {
        day: sanitizeString(raw.events.reception.day, 30),
        date: sanitizeString(raw.events.reception.date, 60),
        time: sanitizeString(raw.events.reception.time, 60),
        timezone: sanitizeString(raw.events.reception.timezone, 30),
        venueName: sanitizeString(raw.events.reception.venueName, 120),
        address: sanitizeString(raw.events.reception.address, 200),
        mapsUrl: sanitizeString(raw.events.reception.mapsUrl, 300),
      };
    }
  }

  if (raw.welcome && typeof raw.welcome === 'object') {
    sanitized.welcome = {
      quoteLine1: sanitizeString(raw.welcome.quoteLine1, 60),
      quoteLine2: sanitizeString(raw.welcome.quoteLine2, 60),
      quoteLine3: sanitizeString(raw.welcome.quoteLine3, 60),
      quoteLine1Id: sanitizeString(raw.welcome.quoteLine1Id, 60),
      quoteLine2Id: sanitizeString(raw.welcome.quoteLine2Id, 60),
      quoteLine3Id: sanitizeString(raw.welcome.quoteLine3Id, 60),
    };
  }

  if (raw.coupleSection && typeof raw.coupleSection === 'object') {
    sanitized.coupleSection = {
      quote: sanitizeString(raw.coupleSection.quote, 200),
      quoteId: sanitizeString(raw.coupleSection.quoteId, 200),
      quoteSource: sanitizeString(raw.coupleSection.quoteSource, 100),
    };
  }

  if (raw.selectedPresetId && typeof raw.selectedPresetId === 'string') {
    sanitized.selectedPresetId = sanitizeString(raw.selectedPresetId, 20);
  }

  if (raw.activeMusic && typeof raw.activeMusic === 'string') {
    sanitized.activeMusic = sanitizeString(raw.activeMusic, 100);
  }

  if (raw.titleTone === 'light' || raw.titleTone === 'dark') {
    sanitized.titleTone = raw.titleTone;
  }

  if (raw.guestName && typeof raw.guestName === 'string') {
    sanitized.guestName = sanitizeString(raw.guestName, 60);
  }

  if (typeof raw.showHolyMatrimony === 'boolean') {
    sanitized.showHolyMatrimony = raw.showHolyMatrimony;
  }
  if (typeof raw.showAdat === 'boolean') {
    sanitized.showAdat = raw.showAdat;
  }
  if (typeof raw.showReception === 'boolean') {
    sanitized.showReception = raw.showReception;
  }
  if (typeof raw.showStory === 'boolean') {
    sanitized.showStory = raw.showStory;
  }
  if (typeof raw.showRsvp === 'boolean') {
    sanitized.showRsvp = raw.showRsvp;
  }
  if (typeof raw.showAccessCard === 'boolean') {
    sanitized.showAccessCard = raw.showAccessCard;
  }
  if (typeof raw.showGift === 'boolean') {
    sanitized.showGift = raw.showGift;
  }
  if (typeof raw.showPhysicalGift === 'boolean') {
    sanitized.showPhysicalGift = raw.showPhysicalGift;
  }
  if (raw.bgType === 'video' || raw.bgType === 'photo' || raw.bgType === 'slideshow') {
    sanitized.bgType = raw.bgType;
  }
  if (typeof raw.bgPhoto === 'string') {
    sanitized.bgPhoto = sanitizeString(raw.bgPhoto, 200);
  }
  if (Array.isArray(raw.bgPhotos)) {
    sanitized.bgPhotos = raw.bgPhotos.slice(0, 30).map((p: any) => sanitizeString(p, 250));
  }

  if (Array.isArray(raw.bankAccounts)) {
    sanitized.bankAccounts = raw.bankAccounts.slice(0, 5).map((b: any) => ({
      bankName: sanitizeString(b.bankName, 50),
      accountNumber: sanitizeString(b.accountNumber, 50),
      accountHolder: sanitizeString(b.accountHolder, 100),
    }));
  }

  if (raw.physicalGiftAddress && typeof raw.physicalGiftAddress === 'object') {
    sanitized.physicalGiftAddress = {
      recipient: sanitizeString(raw.physicalGiftAddress.recipient, 100),
      phone: sanitizeString(raw.physicalGiftAddress.phone, 30),
      address: sanitizeString(raw.physicalGiftAddress.address, 200),
      city: sanitizeString(raw.physicalGiftAddress.city, 50),
      postalCode: sanitizeString(raw.physicalGiftAddress.postalCode, 20),
      notes: sanitizeString(raw.physicalGiftAddress.notes, 200),
    };
  }

  if (raw.preWedVideoUrl && typeof raw.preWedVideoUrl === 'string') {
    sanitized.preWedVideoUrl = sanitizeString(raw.preWedVideoUrl, 200);
  } else if (raw.liveStream?.preWedVideoUrl && typeof raw.liveStream.preWedVideoUrl === 'string') {
    sanitized.preWedVideoUrl = sanitizeString(raw.liveStream.preWedVideoUrl, 200);
  }

  if (Array.isArray(raw.storyMilestones)) {
    sanitized.storyMilestones = raw.storyMilestones.slice(0, 10).map((m: any) => ({
      year: sanitizeString(m.year, 50),
      title: sanitizeString(m.title, 100),
      description: sanitizeString(m.description, 600),
      image: sanitizeString(m.image, 200),
    }));
  }

  return sanitized;
}
