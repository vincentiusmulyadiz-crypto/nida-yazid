/**
 * Client-side image resizing utility.
 * Accepts jpg, png, webp <= 5MB.
 * Resizes image to max 1600px on the longer side using HTML canvas,
 * returning a memory-efficient blob Object URL.
 */

export interface ResizeResult {
  url: string;
  error?: string;
}

export async function processAndResizePhoto(file: File): Promise<ResizeResult> {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { url: '', error: 'Format must be JPG, PNG, or WebP.' };
  }

  // Max 5 MB check
  if (file.size > 5 * 1024 * 1024) {
    return { url: '', error: 'Image exceeds maximum 5 MB size limit.' };
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        const maxDimension = 1600;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ url: objectUrl });
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with quality 0.85
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (blob) {
              const resizedUrl = URL.createObjectURL(blob);
              resolve({ url: resizedUrl });
            } else {
              resolve({ url: objectUrl });
            }
          },
          'image/webp',
          0.85
        );
      } catch (err) {
        resolve({ url: objectUrl });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ url: '', error: 'Failed to load image for resizing.' });
    };

    img.src = objectUrl;
  });
}
