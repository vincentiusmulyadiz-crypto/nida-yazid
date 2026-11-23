import { EDITOR_BUNDLE_MARKER } from './index';

// Retain marker reference
if (typeof window !== 'undefined') {
  (window as any).__ebm_types = EDITOR_BUNDLE_MARKER;
}

export function getSlug(groomShort: string, brideShort: string): string {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'wedding';
  return `${clean(groomShort)}-${clean(brideShort)}`;
}

export function getDateStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}
