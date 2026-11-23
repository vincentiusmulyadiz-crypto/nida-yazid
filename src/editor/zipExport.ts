import { zipSync, strToU8 } from 'fflate';
import { getSlug, getDateStr } from './orderTypes';
import { EDITOR_BUNDLE_MARKER } from './index';

if (typeof window !== 'undefined') {
  (window as any).__ebm_export = EDITOR_BUNDLE_MARKER;
}

const isBlob = (url?: string | null): boolean => {
  return typeof url === 'string' && url.startsWith('blob:');
};

const fetchBlobBytes = async (blobUrl: string): Promise<Uint8Array> => {
  const resp = await fetch(blobUrl);
  if (!resp.ok) throw new Error(`Failed to read uploaded asset: ${resp.statusText}`);
  const blob = await resp.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

export async function downloadOrderZip(context: any): Promise<string> {
  const {
    couple,
    akad,
    culturalCeremony,
    reception,
    welcomeData,
    coupleSectionData,
    storyMilestones,
    galleryPhotos,
    coverImage,
    welcomePhoto,
    couplePhoto,
    groomPhoto,
    bridePhoto,
    accessCardPhoto,
    closingPhoto,
    customVideo,
    selectedPresetId,
    activeMusic,
    titleTone,
    guestName,
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
    bankAccounts,
    physicalGiftAddress,
    preWedVideoUrl,
  } = context;

  const groomShort = couple?.groom?.name || 'Groom';
  const brideShort = couple?.bride?.name || 'Bride';
  const slug = getSlug(groomShort, brideShort);
  const dateStr = getDateStr();
  const filename = `order-${slug}-${dateStr}.zip`;

  const filesToZip: Record<string, Uint8Array> = {};
  const mediaRelPaths: Record<string, string> = {};
  const includedFileList: string[] = ['order.json', 'README.txt'];

  // 1. Process uploaded user images
  if (isBlob(coverImage)) {
    try {
      filesToZip['images/cover.jpg'] = await fetchBlobBytes(coverImage);
      mediaRelPaths['cover'] = 'order/cover.jpg';
      includedFileList.push('images/cover.jpg');
    } catch (e) {
      console.warn('Could not read coverImage blob', e);
    }
  }

  if (isBlob(welcomePhoto)) {
    try {
      filesToZip['images/welcome.jpg'] = await fetchBlobBytes(welcomePhoto);
      mediaRelPaths['welcome'] = 'order/welcome.jpg';
      includedFileList.push('images/welcome.jpg');
    } catch (e) {
      console.warn('Could not read welcomePhoto blob', e);
    }
  }

  if (isBlob(couplePhoto)) {
    try {
      filesToZip['images/couple.jpg'] = await fetchBlobBytes(couplePhoto);
      mediaRelPaths['couple'] = 'order/couple.jpg';
      includedFileList.push('images/couple.jpg');
    } catch (e) {
      console.warn('Could not read couplePhoto blob', e);
    }
  }

  if (isBlob(groomPhoto)) {
    try {
      filesToZip['images/groom.jpg'] = await fetchBlobBytes(groomPhoto);
      mediaRelPaths['groom'] = 'order/groom.jpg';
      includedFileList.push('images/groom.jpg');
    } catch (e) {
      console.warn('Could not read groomPhoto blob', e);
    }
  }

  if (isBlob(bridePhoto)) {
    try {
      filesToZip['images/bride.jpg'] = await fetchBlobBytes(bridePhoto);
      mediaRelPaths['bride'] = 'order/bride.jpg';
      includedFileList.push('images/bride.jpg');
    } catch (e) {
      console.warn('Could not read bridePhoto blob', e);
    }
  }

  if (isBlob(accessCardPhoto)) {
    try {
      filesToZip['images/access-card.jpg'] = await fetchBlobBytes(accessCardPhoto);
      mediaRelPaths['accessCard'] = 'order/accessCard.jpg';
      includedFileList.push('images/access-card.jpg');
    } catch (e) {
      console.warn('Could not read accessCardPhoto blob', e);
    }
  }

  if (isBlob(closingPhoto)) {
    try {
      filesToZip['images/closing.jpg'] = await fetchBlobBytes(closingPhoto);
      mediaRelPaths['closing'] = 'order/closing.jpg';
      includedFileList.push('images/closing.jpg');
    } catch (e) {
      console.warn('Could not read closingPhoto blob', e);
    }
  }

  if (isBlob(bgPhoto)) {
    try {
      filesToZip['images/bgPhoto.jpg'] = await fetchBlobBytes(bgPhoto);
      mediaRelPaths['bgPhoto'] = 'order/bgPhoto.jpg';
      includedFileList.push('images/bgPhoto.jpg');
    } catch (e) {
      console.warn('Could not read bgPhoto blob', e);
    }
  }

  if (Array.isArray(galleryPhotos)) {
    for (let i = 0; i < galleryPhotos.length; i++) {
      const p = galleryPhotos[i];
      if (isBlob(p?.src)) {
        try {
          const imgKey = `images/gallery-${i + 1}.jpg`;
          filesToZip[imgKey] = await fetchBlobBytes(p.src);
          mediaRelPaths[`gallery-${i + 1}`] = `order/gallery-${i + 1}.jpg`;
          includedFileList.push(imgKey);
        } catch (e) {
          console.warn(`Could not read gallery photo ${i + 1} blob`, e);
        }
      }
    }
  }

  // 1b. Process uploaded background slideshow photos
  const cleanBgPhotos: string[] = [];
  if (Array.isArray(bgPhotos)) {
    for (let i = 0; i < bgPhotos.length; i++) {
      const p = bgPhotos[i];
      if (isBlob(p)) {
        try {
          const imgKey = `slideshow/slideshow${i + 1}.jpg`;
          filesToZip[imgKey] = await fetchBlobBytes(p);
          mediaRelPaths[`slideshow-${i + 1}`] = `slideshow/slideshow${i + 1}.jpg`;
          includedFileList.push(imgKey);
          cleanBgPhotos.push(`/slideshow/slideshow${i + 1}.jpg`);
        } catch (e) {
          console.warn(`Could not read slideshow photo ${i + 1} blob`, e);
        }
      } else if (typeof p === 'string' && p.trim()) {
        cleanBgPhotos.push(p);
      }
    }
  }

  // 2. Process uploaded user video (max 30MB)
  if (customVideo?.url && isBlob(customVideo.url)) {
    try {
      const isWebm = (customVideo.name || '').toLowerCase().endsWith('.webm');
      const vidKey = isWebm ? 'video/bg.webm' : 'video/bg.mp4';
      filesToZip[vidKey] = await fetchBlobBytes(customVideo.url);
      mediaRelPaths['video'] = isWebm ? 'order/bg.webm' : 'order/bg.mp4';
      includedFileList.push(vidKey);
    } catch (e) {
      console.warn('Could not read customVideo blob', e);
    }
  }

  // 3. Assemble order.json without any blob URLs
  const cleanOrderData = {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    slug,
    media: mediaRelPaths,
    couple: {
      groom: {
        ...couple.groom,
        photo: isBlob(groomPhoto) ? 'order/groom.jpg' : couple.groom.photo,
      },
      bride: {
        ...couple.bride,
        photo: isBlob(bridePhoto) ? 'order/bride.jpg' : couple.bride.photo,
      },
      hashtag: couple.hashtag,
      quote: couple.quote,
    },
    events: {
      akadOrMatrimony: akad,
      ...(culturalCeremony ? { culturalCeremony } : {}),
      reception: reception,
      countdownTarget: akad.calendarEvent?.start || '2026-11-21T09:00:00+07:00',
    },
    welcome: {
      ...welcomeData,
    },
    coupleSection: {
      ...coupleSectionData,
    },
    coverImage: isBlob(coverImage) ? 'order/cover.jpg' : coverImage,
    welcomePhoto: isBlob(welcomePhoto) ? 'order/welcome.jpg' : welcomePhoto,
    couplePhoto: isBlob(couplePhoto) ? 'order/couple.jpg' : couplePhoto,
    accessCardPhoto: isBlob(accessCardPhoto) ? 'order/accessCard.jpg' : accessCardPhoto,
    closingPhoto: isBlob(closingPhoto) ? 'order/closing.jpg' : closingPhoto,
    galleryPhotos: Array.isArray(galleryPhotos)
      ? galleryPhotos.map((p: any, i: number) => ({
          ...p,
          src: isBlob(p.src) ? `order/gallery-${i + 1}.jpg` : p.src,
        }))
      : [],
    storyMilestones: Array.isArray(storyMilestones)
      ? storyMilestones.map((m: any) => ({
          year: m.year || '',
          title: m.title || '',
          description: m.description || '',
          image: m.image || '',
        }))
      : [],
    selectedPresetId: selectedPresetId || 'v1',
    activeMusic: activeMusic || '/music.mp3',
    titleTone: titleTone || 'light',
    guestName: guestName || 'Guest',
    showHolyMatrimony: typeof showHolyMatrimony === 'boolean' ? showHolyMatrimony : true,
    showAdat: typeof showAdat === 'boolean' ? showAdat : true,
    showReception: typeof showReception === 'boolean' ? showReception : true,
    showStory: typeof showStory === 'boolean' ? showStory : true,
    showRsvp: typeof showRsvp === 'boolean' ? showRsvp : true,
    showAccessCard: typeof showAccessCard === 'boolean' ? showAccessCard : true,
    showGift: typeof showGift === 'boolean' ? showGift : true,
    showPhysicalGift: typeof showPhysicalGift === 'boolean' ? showPhysicalGift : true,
    bgType: bgType || 'slideshow',
    bgPhoto: isBlob(bgPhoto) ? 'order/bgPhoto.jpg' : (bgPhoto || ''),
    bgPhotos: cleanBgPhotos.length > 0 ? cleanBgPhotos : (Array.isArray(bgPhotos) ? bgPhotos : []),
    bankAccounts: bankAccounts || [],
    physicalGiftAddress: physicalGiftAddress || {},
    liveStream: {
      preWedVideoUrl: preWedVideoUrl || '',
      liveStreamUrl: '',
    },
  };

  filesToZip['order.json'] = strToU8(JSON.stringify(cleanOrderData, null, 2));

  // 4. Plain-text README.txt summary
  const readmeText = [
    '========================================',
    'WEDDING INVITATION ORDER FILE',
    '========================================',
    `Slug: ${slug}`,
    `Created At: ${cleanOrderData.createdAt}`,
    `Schema Version: 1`,
    '',
    'COUPLE:',
    `- Groom: ${couple.groom.fullName || couple.groom.name}`,
    `  Parents: ${couple.groom.parents || '-'}`,
    `  Instagram: ${couple.groom.instagram || '-'}`,
    `- Bride: ${couple.bride.fullName || couple.bride.name}`,
    `  Parents: ${couple.bride.parents || '-'}`,
    `  Instagram: ${couple.bride.instagram || '-'}`,
    `Hashtag: ${couple.hashtag || '-'}`,
    `Quote: "${couple.quote?.text || ''}" (${couple.quote?.source || ''})`,
    '',
    'EVENTS:',
    `- Akad / Ceremony:`,
    `  Date: ${akad.date} (${akad.time})`,
    `  Venue: ${akad.venueName}`,
    `  Address: ${akad.address}`,
    `- Reception:`,
    `  Date: ${reception.date} (${reception.time})`,
    `  Venue: ${reception.venueName}`,
    `  Address: ${reception.address}`,
    '',
    'BACKGROUND VIDEO:',
    `- Selected: ${customVideo ? 'User Custom Video' : `Preset ID: ${selectedPresetId}`}`,
    '',
    'USER CONTENT INCLUDED:',
    ...includedFileList.map((f) => `  • ${f}`),
    '',
    'NOTE:',
    'This zip contains only the user-uploaded customization content and order data.',
    'No template source code or default assets are bundled.',
  ].join('\n');

  filesToZip['README.txt'] = strToU8(readmeText);

  // 5. Build in-memory zip via fflate zipSync
  const zipBytes = zipSync(filesToZip, { level: 6 });

  // 6. Trigger download in browser
  const blob = new Blob([zipBytes as unknown as BlobPart], { type: 'application/zip' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

  return filename;
}
