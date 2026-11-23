---
name: joyever-final-invitation
description: >-
  Standard and mandatory rules for all Joyever final wedding invitations and templates.
  Enforces locked guest name autofill from RSVP dashboard, guest allocation quota limit,
  and edge-to-edge mobile full-screen display (viewport-fit=cover, translucent status bar, anti-loading-bleed).
---

# Joyever Final Invitation & Template Standard

When producing, modifying, or auditing any Joyever wedding invitation or template (e.g., `FINAL SENO JATTU`, `FINAL INDAH RICKY`, `FINAL DITA-FACHRUL`, `FINAL RISA-ADI`, `Template Seno & Jattu`, etc.), the following rules are **MANDATORY**:

## 1. Locked Guest Name Autofill (Clean & Read-Only)
- **Rule**: Guest name must be automatically prefilled from the invitation URL (`?c=...`, `?code=...`, `?to=...`) or Supabase `guests` lookup.
- **Locking**: When the guest name is provided (not empty and not generic fallback `Guest`/`John Doe`), the name input field in `Rsvp.tsx` MUST be **read-only** (`readOnly={isLockedGuest}`). The guest CANNOT edit or change their name ("TANPA BISA DIUBAH").
- **Clean Label**: JANGAN buat teks keterangan tambahan seperti `(telah disesuaikan)`. Biarkan label tetap bersih (`{t.yourNameLabel}`).
- **State Protection**: Prevent manual edits by ignoring `onChange` when `isLockedGuest` is true.

## 2. Guest Count Selection up to Dashboard Quota (maxPax)
- **Rule**: Tamu tetap bisa memilih jumlah kehadiran yang diinginkan, tetapi jatah maksimalnya (`maxPax`) HANYA sesuai dengan kuota yang ditentukan di RSVP dashboard (misal jika jatah 2, pilihannya 1 atau 2).
- **Clean Label**: JANGAN ada teks keterangan tambahan seperti `(sesuai jatah reservasi)` atau badge `Terkunci`. Biarkan label tetap bersih (`{t.guestCountLabel}`).
- **Dropdown Options**:
  ```tsx
  {Array.from({ length: maxPax }, (_, i) => i + 1).map((num) => (
    <option key={num} value={num} className="bg-zinc-900 text-white">
      {num} {currentLang === 'id' ? 'Orang' : (num === 1 ? 'Person' : 'Persons')}
    </option>
  ))}
  ```
- **Default Value**: Inisialisasi `guestCount` dengan nilai `maxPax` (kuota penuh).
- **Submission**: Pada submit RSVP, kirim `Math.max(1, Math.min(guestCount, maxPax))`.

## 3. Access Card Validity Sync
- In `AccessCard.tsx`, the card validity string and canvas download must dynamically display `guestQuota` / `maxPax` instead of a hardcoded number:
  - Text: `Valid for (${maxPax}) person(s)`
  - Canvas: `ctx.fillText(\`Valid for (${maxPax}) person(s)\`, canvas.width / 2, ...)`

## 4. Required Utility Functions (`src/utils/guestCode.ts`)
Each final project must include:
- `encodeGuestCode(name: string, maxGuests?: number): string`
- `decodeGuestCode(code: string | null | undefined): string | null`
- `decodeGuestQuota(code: string | null | undefined): number | null`
- `getInitialGuestMaxPax(): number`
- `isGuestLockedFromUrl(): boolean`

## 5. Mobile Full-Screen Edge-to-Edge & Anti-Loading-Bleed Standard
- **Viewport Meta Tag**:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  ```
  `viewport-fit=cover` is strictly mandatory. Without it, mobile Safari/Chrome renders solid letterboxing bars at the top notch and bottom navigation bar.
- **Translucent Status Bar & Theme Color**:
  ```html
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="theme-color" content="[template-primary-bg]" />
  <meta name="msapplication-navbutton-color" content="[template-primary-bg]" />
  ```
- **Strict Anti-Loading Bleed Rule**:
  Loading screens (`#joyever-initial-loader` in `index.html` and `LoadingScreen.tsx` in React) MUST use the template's own background color (e.g. `#12100E` for dark templates like Seno & Jattu, `#0A0A0A` for Risa & Adi, or `#FAF6EC` for light templates like Joyful Day / Mario & Givina).
  **NEVER** use blue `#0E435A` on invitation loading screens! If `#0E435A` is used, mobile Safari will sample the blue overlay on launch and permanently lock the top status bar (notch) and bottom address bar in blue `#0E435A`, ruining the seamless full-screen illusion.
- **Edge-to-Edge CSS Base**:
  ```css
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    min-height: 100dvh;
    background-color: [template-primary-bg];
    -webkit-text-size-adjust: 100%;
  }
  ```
- **Safe Area Insets**:
  Controls (music toggle, drawer menu button, bottom sheet, cover CTA) must use `calc(env(safe-area-inset-bottom, 0px) + ...)` and `calc(env(safe-area-inset-top, 0px) + ...)` so interactive elements are fully accessible while visuals flow edge-to-edge across the entire screen.

## 6. Mobile Native Document Scrolling (Flawless Safari Floating Pill)
- **NEVER** trap the mobile invitation scroll inside `<main className="h-[100dvh] overflow-y-auto">` or an outer `h-[100dvh] overflow-hidden` div.
- iOS Safari **ONLY** collapses its address bar into the compact floating pill (like `Mario & Givina` on `connectied.id`) and expands content edge-to-edge behind the status bar and toolbar when the **ROOT DOCUMENT (`window` / `html` / `body`) SCROLLS**.
- Restrict `h-[100dvh] overflow-y-auto` strictly to desktop split view (`lg:h-[100dvh] lg:overflow-y-auto`).
- On mobile (`< 1024px`), container must be `min-h-[100dvh] lg:h-[100dvh] relative lg:overflow-hidden` and `<main>` must be `min-h-[100dvh] lg:h-[100dvh] ${hasOpened ? 'lg:overflow-y-auto' : 'overflow-hidden lg:overflow-hidden'}`.
- Floating controls (`GlobalControls`) must use `fixed lg:absolute` with `bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)`.
- In Framer Motion `useScroll`, pass `container: isDesktop ? scrollContainerRef : undefined` so scroll animations link to `window` on mobile and `scrollContainerRef` on desktop.
