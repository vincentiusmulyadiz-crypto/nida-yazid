import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, Plus } from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { APP_MODE } from '../data/invitation';
import { processAndResizePhoto } from '../utils/imageResize';
import { Language } from '../types';
import { Lightbox } from './Lightbox';
import { SwashHeading } from './FlourishText';
import { AnimatedButton } from './AnimatedButton';

interface GalleryProps {
  currentLang: Language;
}

export const Gallery: React.FC<GalleryProps> = ({ currentLang }) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const { galleryPhotos, addGalleryPhoto } = useInvitation();

  const totalPhotos = galleryPhotos.length;

  const openLightboxAt = (index: number) => {
    setActivePhotoIndex(index);
  };

  const handleQuickAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <motion.section
      id="gallery"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative w-full section-transition-top pb-16 px-4 sm:px-6 bg-transparent text-center font-text"
    >
      {/* Heading: strictly centered, without icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="mb-8 max-w-[34ch] mx-auto text-center"
      >
        <SwashHeading text={currentLang === 'id' ? 'GALERI KAMI' : 'OUR GALLERY'} className="mx-auto text-center" />
      </motion.div>

      {/* 
        Editorial Collage Layout Matching User Reference:
        - Top: Full-width hero photo with rounded corners (Photo #1 / index 0)
        - Thematic sequence left-to-right across rows:
          Row 1: Left [1] (Tall) + Right [2] (Square)
          Row 2: Left [3] (Square) + Right [4] (Square)
          Row 3: Left [5] (Square) + Right [6] (Tall)
        - Bottom: Full-width landscape card (Photo #8 / index 7)
      */}
      <div className="space-y-3 max-w-md mx-auto select-none">
        {/* 1. Full-width top hero photo (Index 0) */}
        {galleryPhotos[0] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={() => openLightboxAt(0)}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
          >
            <img
              src={galleryPhotos[0]?.src}
              alt={galleryPhotos[0]?.alt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                <Maximize2 className="w-5 h-5" />
              </span>
            </div>
          </motion.div>
        )}

        {/* 2. Interlocking 2-column layout with left-to-right horizontal row pairing */}
        {galleryPhotos.length > 1 && (
          <div className="grid grid-cols-2 gap-3">
            {/* Left Column: Row 1 Left [1] (Tall), Row 2 Left [3] (Square), Row 3 Left [5] (Square) */}
            <div className="flex flex-col gap-3">
              {/* Row 1 Left: Photo index 1 (Tall) */}
              {galleryPhotos[1] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.04 }}
                  onClick={() => openLightboxAt(1)}
                  className="relative w-full aspect-[3/4] rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={galleryPhotos[1]?.src}
                    alt={galleryPhotos[1]?.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Row 2 Left: Photo index 3 (Square) */}
              {galleryPhotos[3] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
                  onClick={() => openLightboxAt(3)}
                  className="relative w-full aspect-square rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={galleryPhotos[3]?.src}
                    alt={galleryPhotos[3]?.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Row 3 Left: Photo index 5 (Square) */}
              {galleryPhotos[5] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.12 }}
                  onClick={() => openLightboxAt(5)}
                  className="relative w-full aspect-square rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={galleryPhotos[5]?.src}
                    alt={galleryPhotos[5]?.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Column: Row 1 Right [2] (Square), Row 2 Right [4] (Square), Row 3 Right [6] (Tall) */}
            <div className="flex flex-col gap-3">
              {/* Row 1 Right: Photo index 2 (Square) */}
              {galleryPhotos[2] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.04 }}
                  onClick={() => openLightboxAt(2)}
                  className="relative w-full aspect-square rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={galleryPhotos[2]?.src}
                    alt={galleryPhotos[2]?.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Row 2 Right: Photo index 4 (Square) */}
              {galleryPhotos[4] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.08 }}
                  onClick={() => openLightboxAt(4)}
                  className="relative w-full aspect-square rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={galleryPhotos[4]?.src}
                    alt={galleryPhotos[4]?.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Row 3 Right: Photo index 6 (Tall) */}
              {galleryPhotos[6] && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 24 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.12 }}
                  onClick={() => openLightboxAt(6)}
                  className="relative w-full aspect-[3/4] rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
                >
                  <img
                    src={galleryPhotos[6]?.src}
                    alt={galleryPhotos[6]?.alt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* 3. Photo #8 (index 7): Landscape card finishing the initial 8-photo collage */}
        {galleryPhotos[7] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={() => openLightboxAt(7)}
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-[18px] overflow-hidden border border-white/15 bg-black/40 shadow-xl cursor-pointer group"
          >
            <img
              src={galleryPhotos[7]?.src}
              alt={galleryPhotos[7]?.alt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="p-2 rounded-full bg-black/60 border border-white/30 text-white backdrop-blur-sm">
                <Maximize2 className="w-5 h-5" />
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Button: "Our Gallery" / "Buka Galeri" that triggers the Lightbox (shows all photos in modal) */}
      <div className="mt-8 flex justify-center">
        <AnimatedButton
          onClick={() => openLightboxAt(0)}
          aria-label={currentLang === 'id' ? 'Buka Galeri' : 'Open Our Gallery'}
        >
          {currentLang === 'id' ? 'Buka Galeri' : 'Our Gallery'}
        </AnimatedButton>
      </div>

      {/* Quick Add Photo option in Demo and Editor modes */}
      {APP_MODE !== 'final' && (
        <div className="mt-4 flex flex-col items-center justify-center gap-1.5 font-arial">
          <label className="btn-pill-transparent text-xs font-arial cursor-pointer inline-flex items-center gap-2 border-dashed border-white/40 hover:border-white/80 bg-white/5 hover:bg-white/15 px-4 py-2 transition shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>+ Tambah Foto ke Galeri ({galleryPhotos.length} Foto)</span>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleQuickAddPhotos}
              className="hidden"
            />
          </label>
          <span className="text-[11px] text-white/50">
            Mode Demo &amp; Editor: Bebas menambah jumlah foto sesuai keinginan
          </span>
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <Lightbox
        photos={galleryPhotos}
        currentIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onNext={() => {
          setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % totalPhotos : 0));
        }}
        onPrev={() => {
          setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + totalPhotos) % totalPhotos : 0));
        }}
        onSelectIndex={(index) => setActivePhotoIndex(index)}
      />
    </motion.section>
  );
};
