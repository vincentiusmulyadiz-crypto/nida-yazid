---
name: final-joyever
description: >-
  Triggered by /final-joyever. Enforces the complete Joyever final wedding invitation standard:
  guest name lock (without extra labels), guest count max limit (without extra labels),
  access card validity sync, and edge-to-edge mobile full-screen display (viewport-fit=cover, anti-loading-bleed).
---

# Joyever Final Invitation Standard (`/final-joyever`)

When producing, modifying, or auditing any Joyever final wedding invitation, follow these strict rules:

## 1. Locked Guest Name Autofill (Clean & Read-Only)
- Guest name is prefilled from `?c=...` or Supabase lookup.
- If present, name input is `readOnly={isLockedGuest}` without extra text like `(telah disesuaikan)`. Label remains clean: `{t.yourNameLabel}`.
- Guest cannot edit or overwrite their name.

## 2. Guest Count Selection up to Dashboard Quota (maxPax)
- Guest can choose 1 up to `maxPax` (quota from dashboard).
- Label remains clean: `{t.guestCountLabel}` without extra text like `(sesuai jatah reservasi)`.
- Default value is `maxPax`. Options: `1` to `maxPax`.

## 3. Access Card Validity Sync
- AccessCard displays `Valid for (${maxPax}) person(s)` dynamically.

## 4. Mobile Full-Screen Edge-to-Edge & Anti-Loading-Bleed
- `index.html` MUST use:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="theme-color" content="[template-primary-bg]" />
  <meta name="msapplication-navbutton-color" content="[template-primary-bg]" />
  ```
- **STRICT ANTI-LOADING BLEED**: The loading screen (`#joyever-initial-loader` and React `LoadingScreen`) MUST use the template's background color (`#12100E` for dark, `#FAF6EC` for light). **NEVER use `#0E435A` on invitations**, as mobile Safari samples it and permanently turns the top status bar and bottom toolbar blue.
- `html, body` must have `min-height: 100dvh; background-color: [template-primary-bg];`.
- Interactive buttons must use `env(safe-area-inset-bottom)` and `env(safe-area-inset-top)` so visuals flow 1 full screen edge-to-edge seamlessly.

## 5. Mobile Native Document Scrolling (Flawless Safari Floating Pill)
- **NEVER** trap the mobile invitation scroll inside `<main className="h-[100dvh] overflow-y-auto">` or an outer `h-[100dvh] overflow-hidden` div.
- iOS Safari **ONLY** collapses its address bar into the compact floating pill (like `Mario & Givina` on `connectied.id`) and expands content edge-to-edge behind the status bar and toolbar when the **ROOT DOCUMENT (`window` / `html` / `body`) SCROLLS**.
- Restrict `h-[100dvh] overflow-y-auto` strictly to desktop split view (`lg:h-[100dvh] lg:overflow-y-auto`).
- On mobile (`< 1024px`), container must be `min-h-[100dvh] lg:h-[100dvh] relative lg:overflow-hidden` and `<main>` must be `min-h-[100dvh] lg:h-[100dvh] ${hasOpened ? 'lg:overflow-y-auto' : 'overflow-hidden lg:overflow-hidden'}`.
- Floating controls (`GlobalControls`) must use `fixed lg:absolute` with `bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)`.
- In Framer Motion `useScroll`, pass `container: isDesktop ? scrollContainerRef : undefined` so scroll animations link to `window` on mobile and `scrollContainerRef` on desktop.
