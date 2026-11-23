---
name: template
description: >-
  Triggered by /template. Enforces Joyever wedding invitation template standards:
  edge-to-edge mobile full-screen display (viewport-fit=cover, translucent status bar, anti-loading-bleed),
  Joyever loading screen, responsive desktop split / mobile full-bleed layout, and RSVP dashboard compatibility.
---

# Joyever Template Standard (`/template`)

When building, modifying, or auditing any Joyever wedding invitation template (e.g., `Template Seno & Jattu`, `TEMPLATE JOYFUL DAY`, `TEMPLATE DAYLIGHT`, etc.):

## 1. Mobile Full-Screen Edge-to-Edge Display
- Viewport and Web App Meta:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="theme-color" content="[template-primary-bg]" />
  <meta name="msapplication-navbutton-color" content="[template-primary-bg]" />
  ```
- The mobile viewport MUST be 1 full screen edge-to-edge, extending seamlessly behind the top status bar / notch and bottom navigation bar (no solid colored bands or letterboxing).
- `html, body` must have `min-height: 100dvh; background-color: [template-primary-bg];`.

## 2. Anti-Loading Bleed Standard
- The Joyever initial loader (#joyever-initial-loader) or React LoadingScreen MUST use the template's background color (`#12100E` for dark, `#FAF6EC` for light).
- **NEVER use corporate blue `#0E435A` on invitation loading screens!** Mobile Safari samples the full-screen overlay on launch and permanently tints the status bar and bottom toolbar blue.
- Always declare `<meta name="theme-color" content="[template-primary-bg]" />` in `<head>` matching the template's background color.

## 3. Safe Area Inset Support
- Position fixed/floating controls (music player, navigation button, audio controls, drawer sheet) using:
  - `bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)`
  - `top: calc(env(safe-area-inset-top, 0px) + 16px)`
- Ensures controls stay perfectly reachable while photos and background videos flow 100% full screen.

## 4. Guest & RSVP Dashboard Integration
- Prefill guest name from `?c=...` (decodeGuestCode) or lookup.
- Quota limit `maxPax` from `?c=...` (decodeGuestQuota) or lookup.
- Supabase connection with `customerId` and `ownerId`.

## 5. Mobile Native Document Scrolling (Flawless Safari Floating Pill)
- **NEVER** trap the mobile invitation scroll inside `<main className="h-[100dvh] overflow-y-auto">` or an outer `h-[100dvh] overflow-hidden` div.
- iOS Safari **ONLY** collapses its address bar into the compact floating pill (like `Mario & Givina` on `connectied.id`) and expands content edge-to-edge behind the status bar and toolbar when the **ROOT DOCUMENT (`window` / `html` / `body`) SCROLLS**.
- Restrict `h-[100dvh] overflow-y-auto` strictly to desktop split view (`lg:h-[100dvh] lg:overflow-y-auto`).
- On mobile (`< 1024px`), container must be `min-h-[100dvh] lg:h-[100dvh] relative lg:overflow-hidden` and `<main>` must be `min-h-[100dvh] lg:h-[100dvh] ${hasOpened ? 'lg:overflow-y-auto' : 'overflow-hidden lg:overflow-hidden'}`.
- Floating controls (`GlobalControls`) must use `fixed lg:absolute` with `bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)`.
- In Framer Motion `useScroll`, pass `container: isDesktop ? scrollContainerRef : undefined` so scroll animations link to `window` on mobile and `scrollContainerRef` on desktop.
