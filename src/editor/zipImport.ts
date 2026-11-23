import { unzipSync, strFromU8 } from 'fflate';
import { EDITOR_BUNDLE_MARKER } from './index';

if (typeof window !== 'undefined') {
  (window as any).__ebm_import = EDITOR_BUNDLE_MARKER;
}

export async function importOrderZip(file: File, context: any): Promise<void> {
  const buffer = await file.arrayBuffer();
  const unzipped = unzipSync(new Uint8Array(buffer));

  // 1. Validate file paths (security check: no path traversal or dangerous files)
  const allowedPrefixes = ['images/', 'video/', 'order/', 'slideshow/'];
  const allowedRootFiles = ['order.json', 'README.txt'];

  for (const path of Object.keys(unzipped)) {
    if (path.includes('..') || path.startsWith('/') || path.startsWith('\\')) {
      throw new Error(`Invalid path detected in zip archive: ${path}`);
    }
    const isAllowedRoot = allowedRootFiles.includes(path);
    const isAllowedPrefix = allowedPrefixes.some((p) => path.startsWith(p));
    if (!isAllowedRoot && !isAllowedPrefix) {
      throw new Error(`Disallowed file found in order zip: ${path}`);
    }
  }

  // 2. Validate order.json
  if (!unzipped['order.json']) {
    throw new Error('Archive is missing required order.json descriptor');
  }

  const jsonStr = strFromU8(unzipped['order.json']);
  let orderData: any;
  try {
    orderData = JSON.parse(jsonStr);
  } catch {
    throw new Error('order.json is not valid JSON');
  }

  if (orderData.schemaVersion !== 1) {
    throw new Error(`Unsupported schemaVersion: ${orderData.schemaVersion}. Expected 1.`);
  }

  // 3. Extract images and create blob URLs
  const importedMediaBlobs: Record<string, any> = {};

  const findFileBytes = (candidates: string[]): Uint8Array | null => {
    for (const c of candidates) {
      if (unzipped[c]) return unzipped[c];
    }
    return null;
  };

  const createBlobUrl = (bytes: Uint8Array, type: string): string => {
    return URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type }));
  };

  const coverBytes = findFileBytes(['images/cover.jpg', 'images/cover.png', 'order/cover.jpg']);
  if (coverBytes) {
    importedMediaBlobs.coverImage = createBlobUrl(coverBytes, 'image/jpeg');
  }

  const welcomeBytes = findFileBytes(['images/welcome.jpg', 'images/welcome.png', 'order/welcome.jpg']);
  if (welcomeBytes) {
    importedMediaBlobs.welcomePhoto = createBlobUrl(welcomeBytes, 'image/jpeg');
  }

  const coupleBytes = findFileBytes(['images/couple.jpg', 'images/couple.png', 'order/couple.jpg']);
  if (coupleBytes) {
    importedMediaBlobs.couplePhoto = createBlobUrl(coupleBytes, 'image/jpeg');
  }

  const groomBytes = findFileBytes(['images/groom.jpg', 'images/groom.png', 'order/groom.jpg']);
  if (groomBytes) {
    importedMediaBlobs.groomPhoto = createBlobUrl(groomBytes, 'image/jpeg');
  }

  const brideBytes = findFileBytes(['images/bride.jpg', 'images/bride.png', 'order/bride.jpg']);
  if (brideBytes) {
    importedMediaBlobs.bridePhoto = createBlobUrl(brideBytes, 'image/jpeg');
  }

  const accessBytes = findFileBytes(['images/access-card.jpg', 'images/accessCard.jpg', 'order/accessCard.jpg']);
  if (accessBytes) {
    importedMediaBlobs.accessCardPhoto = createBlobUrl(accessBytes, 'image/jpeg');
  }

  const closingBytes = findFileBytes(['images/closing.jpg', 'images/closing.png', 'order/closing.jpg']);
  if (closingBytes) {
    importedMediaBlobs.closingPhoto = createBlobUrl(closingBytes, 'image/jpeg');
  }

  // Gallery images
  if (Array.isArray(orderData.galleryPhotos)) {
    const updatedGallery = orderData.galleryPhotos.map((item: any, i: number) => {
      const gBytes = findFileBytes([`images/gallery-${i + 1}.jpg`, `images/gallery-${i + 1}.png`, `order/gallery-${i + 1}.jpg`]);
      if (gBytes) {
        return {
          ...item,
          src: createBlobUrl(gBytes, 'image/jpeg'),
        };
      }
      return item;
    });
    importedMediaBlobs.galleryPhotos = updatedGallery;
  }

  // Slideshow background images
  const slideshowKeys = Object.keys(unzipped)
    .filter(
      (k) =>
        k.startsWith('slideshow/') &&
        (k.endsWith('.jpg') || k.endsWith('.jpeg') || k.endsWith('.png') || k.endsWith('.webp'))
    )
    .sort();
  if (slideshowKeys.length > 0) {
    importedMediaBlobs.bgPhotos = slideshowKeys.map((k) => createBlobUrl(unzipped[k], 'image/jpeg'));
  } else if (Array.isArray(orderData.bgPhotos) && orderData.bgPhotos.length > 0) {
    importedMediaBlobs.bgPhotos = orderData.bgPhotos;
  }

  // Video
  const videoMp4 = findFileBytes(['video/bg.mp4', 'order/bg.mp4']);
  const videoWebm = findFileBytes(['video/bg.webm', 'order/bg.webm']);
  if (videoMp4 || videoWebm) {
    const isWebm = Boolean(videoWebm);
    const bytes = (videoWebm || videoMp4)!;
    const mime = isWebm ? 'video/webm' : 'video/mp4';
    const blobUrl = createBlobUrl(bytes, mime);
    const sizeMb = (bytes.length / (1024 * 1024)).toFixed(1);
    importedMediaBlobs.customVideo = {
      url: blobUrl,
      name: isWebm ? 'bg.webm' : 'bg.mp4',
      sizeMb: `${sizeMb} MB`,
    } as any;
  }

  // 4. Merge text and restored media blobs into context
  context.applyImportedState({
    ...orderData,
    ...importedMediaBlobs,
  });
}
