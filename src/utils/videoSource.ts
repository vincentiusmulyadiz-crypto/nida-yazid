import { MEDIA } from '../data/invitation';

export interface PresetVideo {
  id: string;
  label: string;
  mp4: string;
  webm: string;
  poster: string;
}

export interface UserVideoInfo {
  url: string;
  name: string;
  sizeMb: string;
}

export interface ResolvedVideoSource {
  isCustom: boolean;
  src?: string;
  mp4?: string;
  webm?: string;
  poster: string;
  sourceKey: string;
  name: string;
  sizeMb?: string;
}

/**
 * Single source of truth helper to resolve active video source.
 * Must work with ZERO Customizer code present.
 */
export function resolveVideoSource(
  customVideo: UserVideoInfo | null,
  selectedPresetId: string
): ResolvedVideoSource {
  // If custom video exists (blob: or static path like /order/bg.mp4)
  if (customVideo && customVideo.url && customVideo.url.trim()) {
    const fallbackPreset =
      MEDIA.presets.find((p) => p.id === selectedPresetId) || MEDIA.presets[0];
    return {
      isCustom: true,
      src: customVideo.url,
      poster: fallbackPreset.poster || MEDIA.poster,
      sourceKey: `custom-${customVideo.url}`,
      name: customVideo.name,
      sizeMb: customVideo.sizeMb,
    };
  }

  // Preset or default video
  const preset =
    MEDIA.presets.find((p) => p.id === selectedPresetId) || MEDIA.presets[0];

  return {
    isCustom: false,
    mp4: preset.mp4,
    webm: preset.webm,
    poster: preset.poster || MEDIA.poster,
    sourceKey: `preset-${preset.id}`,
    name: preset.label,
  };
}
