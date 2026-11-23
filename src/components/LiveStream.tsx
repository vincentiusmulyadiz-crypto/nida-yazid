import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, ExternalLink } from 'lucide-react';
import { useInvitation } from '../context/InvitationContext';
import { Language } from '../types';
import { SwashHeading } from './FlourishText';
import { VideoPrewedIcon } from './Icons';

// =======================================================================
// KONFIGURASI VIDEO PREWEDDING YOUTUBE
// Ganti nilai PREWEDDING_VIDEO_ID di bawah ini dengan ID video YouTube Anda.
// Contoh: Jika URL video YouTube adalah:
//   https://www.youtube.com/watch?v=EngW7tLk6R8  atau  https://youtu.be/EngW7tLk6R8
// Maka masukkan ID: "EngW7tLk6R8"
// =======================================================================
export const PREWEDDING_VIDEO_ID = "EngW7tLk6R8";

export function extractYouTubeId(url?: string): string {
  if (!url) return PREWEDDING_VIDEO_ID;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : trimmed || PREWEDDING_VIDEO_ID;
}

interface LiveStreamProps {
  currentLang: Language;
}

export const LiveStream: React.FC<LiveStreamProps> = () => {
  const { preWedVideoUrl } = useInvitation();
  const videoId = extractYouTubeId(preWedVideoUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  );

  useEffect(() => {
    setImgSrc(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    setIsPlaying(false);
  }, [videoId]);

  return (
    <motion.section
      id="live"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
      className="relative w-full py-16 px-5 sm:px-8 bg-transparent text-center font-text flex flex-col items-center justify-center"
    >
      {/* Section Title: Pre-wedding Video (Strictly Centered across 100% width) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full mb-8 flex flex-col items-center justify-center text-center mx-auto"
      >
        <div className="flex justify-center mb-2.5 text-white/85">
          <VideoPrewedIcon className="w-8 h-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)] icon-wiggle" />
        </div>
        <SwashHeading
          text="Pre-wedding Video"
          className="whitespace-nowrap text-[clamp(24px,6.5cqw,34px)] text-center block w-full mx-auto"
        />
      </motion.div>

      {/* YouTube Video Preview / Embed Container (16:9 ratio, rounded-2xl, border & shadow) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="max-w-md mx-auto w-full"
      >
        <div className="relative w-full aspect-video rounded-[14px] overflow-hidden border border-white/20 bg-black/60 shadow-2xl backdrop-blur-sm group">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Pre-wedding Video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full cursor-pointer flex items-center justify-center select-none"
            >
              {/* YouTube Thumbnail */}
              <img
                src={imgSrc}
                alt="Pre-wedding Video Thumbnail"
                onError={() => {
                  // Fallback to hqdefault if maxresdefault is unavailable
                  if (!imgSrc.includes('hqdefault')) {
                    setImgSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                  }
                }}
                className="w-full h-full object-cover filter brightness-[0.82] group-hover:brightness-95 transition-all duration-300 group-hover:scale-105"
              />

              {/* Dark subtle vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* Central Play Button */}
              <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/55 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-0.5" />
              </div>
            </div>
          )}
        </div>

        {/* Button below the video: "Open Link" to YouTube in new tab */}
        <div className="mt-5 flex justify-center">
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-transparent inline-flex items-center gap-2 px-6 py-2.5"
            aria-label="Open Link on YouTube"
          >
            <span>Open Link</span>
            <ExternalLink className="w-4 h-4 opacity-75" />
          </a>
        </div>
      </motion.div>
    </motion.section>
  );
};
