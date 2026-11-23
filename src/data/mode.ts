export type AppMode = "demo" | "editor" | "final";

const getUrlMode = (): AppMode | null => {
  if (typeof window !== 'undefined') {
    const m = new URLSearchParams(window.location.search).get('mode');
    if (m === 'editor' || m === 'final' || m === 'demo') return m;
  }
  return null;
};

// Di folder FINAL SENO JATTU, default selalu "final".
export const APP_MODE: AppMode = getUrlMode() || "final";
