/**
 * Utility for encoding and decoding guest names + quota to/from random-looking URL-safe codes.
 */

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function encodeGuestCode(name: string, maxGuests?: number): string {
  if (!name || !name.trim()) return '';
  const cleanName = name.trim();
  const quota =
    typeof maxGuests === 'number' && !isNaN(maxGuests) && maxGuests >= 1 && maxGuests <= 500
      ? Math.floor(maxGuests)
      : 2;

  const h0 = Math.floor(Math.random() * 15) + 1;
  const h1 = Math.floor(Math.random() * 15) + 1;
  const h2 = (h0 ^ h1 ^ 0xa) & 0xf;
  const h3 = (h0 + h1 + (quota <= 10 ? quota : 0)) & 0xf;

  const salt = h0.toString(16) + h1.toString(16) + h2.toString(16) + h3.toString(16);
  const saltNum = parseInt(salt, 16);
  const payloadText = quota > 10 ? `${cleanName}:::${quota}` : cleanName;
  const bytes = new TextEncoder().encode(payloadText);
  const scrambled = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    const keyByte = (saltNum >> ((i % 2) * 8)) & 0xff;
    scrambled[i] = bytes[i] ^ (keyByte || 0x5a);
  }
  return salt + base64UrlEncode(scrambled);
}

function hasInvalidDecodedChars(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c < 0x20 || c === 0x7f || c === 0xfffd) return true;
  }
  return false;
}

export function decodeGuestCode(code: string | null | undefined): string | null {
  if (!code || typeof code !== 'string') return null;
  const clean = code.trim();
  if (clean.length < 5) return null;
  const salt = clean.slice(0, 4);
  if (!/^[0-9a-f]{4}$/i.test(salt)) return null;
  const b64 = clean.slice(4);
  const saltNum = parseInt(salt, 16);

  const h0 = parseInt(salt[0], 16);
  const h1 = parseInt(salt[1], 16);
  const h2 = parseInt(salt[2], 16);
  const h3 = parseInt(salt[3], 16);
  if (h2 !== ((h0 ^ h1 ^ 0xa) & 0xf)) return null;

  try {
    const scrambled = base64UrlDecode(b64);
    if (base64UrlEncode(scrambled) !== b64) return null;
    const bytes = new Uint8Array(scrambled.length);
    for (let i = 0; i < scrambled.length; i++) {
      const keyByte = (saltNum >> ((i % 2) * 8)) & 0xff;
      bytes[i] = scrambled[i] ^ (keyByte || 0x5a);
    }
    let decoded = new TextDecoder().decode(bytes).trim();
    if (!decoded || hasInvalidDecodedChars(decoded)) return null;
    const q = (h3 - h0 - h1 + 32) & 0xf;
    if (!decoded.includes(':::') && (q < 1 || q > 10)) return null;
    if (decoded.includes(':::')) {
      decoded = decoded.split(':::')[0].trim();
    }
    return decoded || null;
  } catch {
    return null;
  }
}

export function decodeGuestQuota(code: string | null | undefined): number | null {
  if (!code || typeof code !== 'string') return null;
  const clean = code.trim();
  if (clean.length < 5) return null;
  const salt = clean.slice(0, 4);
  if (!/^[0-9a-f]{4}$/i.test(salt)) return null;
  const b64 = clean.slice(4);
  const saltNum = parseInt(salt, 16);

  const h0 = parseInt(salt[0], 16);
  const h1 = parseInt(salt[1], 16);
  const h2 = parseInt(salt[2], 16);
  const h3 = parseInt(salt[3], 16);
  if (h2 !== ((h0 ^ h1 ^ 0xa) & 0xf)) return null;

  try {
    const scrambled = base64UrlDecode(b64);
    if (base64UrlEncode(scrambled) !== b64) return null;
    const bytes = new Uint8Array(scrambled.length);
    for (let i = 0; i < scrambled.length; i++) {
      const keyByte = (saltNum >> ((i % 2) * 8)) & 0xff;
      bytes[i] = scrambled[i] ^ (keyByte || 0x5a);
    }
    const raw = new TextDecoder().decode(bytes).trim();
    if (!raw || hasInvalidDecodedChars(raw)) return null;
    if (raw.includes(':::')) {
      const q = parseInt(raw.split(':::')[1], 10);
      if (!isNaN(q) && q >= 1 && q <= 500) return q;
    }

    const q = (h3 - h0 - h1 + 32) & 0xf;
    if (q >= 1 && q <= 10) return q;
    return null;
  } catch {
    return null;
  }
}

export function isGroupInvitationFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const p = new URLSearchParams(window.location.search);
    const g = p.get('g') || p.get('group') || p.get('grup');
    return g === '1' || g === 'true';
  } catch {
    return false;
  }
}

export function getInitialGuestMaxPax(): number {
  if (typeof window === 'undefined') return 2;
  try {
    const p = new URLSearchParams(window.location.search);
    const rp = p.get('pax') || p.get('quota') || p.get('max') || p.get('guests');
    if (rp) {
      const n = parseInt(rp, 10);
      if (!isNaN(n) && n >= 1 && n <= 500) return n;
    }
    const c = p.get('c') || p.get('code') || p.get('to');
    const dq = decodeGuestQuota(c);
    if (dq) return dq;
  } catch {}
  return 2;
}

export function isGuestLockedFromUrl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const p = new URLSearchParams(window.location.search);
    const v = p.get('c') || p.get('code') || p.get('to') || p.get('guest') || p.get('name') || p.get('tamu');
    return Boolean(v && v.trim() && v.trim().toLowerCase() !== 'guest');
  } catch {
    return false;
  }
}

/** Deterministic Pass ID matching `JOY-[2-LETTER INITIALS]-XXX` used across Admin & QR Check-In. */
export function generateGuestPassId(guestName: string, groomName?: string, brideName?: string): string {
  const clean = (guestName || 'Guest').trim();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const numeric = Math.abs(hash % 900) + 100;
  const gIni = ((groomName || '').match(/[a-zA-Z]/) || [''])[0];
  const bIni = ((brideName || '').match(/[a-zA-Z]/) || [''])[0];
  const prefix = (gIni && bIni ? gIni + bIni : 'WD').toUpperCase();
  return `JOY-${prefix}-${numeric}`;
}
