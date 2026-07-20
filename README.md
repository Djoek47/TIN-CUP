# TIN CUP · Perdition Gulch

> "Where strangers throw real gold at strangers — for glory, for laughs, for the story."

A full-featured Western-themed social tipping app built with React 18, Tailwind CSS v4, and the Gulch Design System. Dark-first, gold-accented, glass-morphic iOS 27 aesthetic.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS v4 + custom glass utilities |
| Build | Vite 6 |
| Animation | motion/react + CSS keyframes |
| Notifications | sonner |
| Icons | Inline SVG (custom Gulch icon set) |
| Fonts | Ultra · Archivo · Inter · IBM Plex Mono |

---

## Project Structure

```
src/
├── app/
│   └── App.tsx          ← Full app (splash → main, all screens)
├── components/
│   └── TinCupApp.tsx    ← V0-compatible re-export
├── styles/
│   ├── fonts.css        ← Google Fonts + keyframes + glass utilities
│   ├── theme.css        ← Tailwind tokens (Gulch Design System)
│   └── index.css        ← Tailwind entry + @theme inline mapping
└── main.tsx
```

---

## Screens

| Screen | Notes |
|---|---|
| Splash | 2.8s auto-advance, coin drop animation |
| Welcome | Pan background, CTA |
| Choose Fate | Accordion expand — Vagrant (free) vs Lord ($100) |
| Character Creator | 5-category item picker, locked Lord-only items |
| Main Street | Live rail · Trending begs · Bounties · Leaderboard teaser |
| Feed of Madness | TikTok-style clips · Double-tap toss · Follow/share/flag |
| Lobby | Stats strip · Filter pills · Beg grid |
| Live Stream | Battle bar · Gift rail (×10/×50/×100/×500) · Chat |
| Wallet | Balance hero · Ledger · Deposit → Bank handoff · Cash out |
| Beg Detail | Gift tiers · React · Share |
| Challenge Detail | Bounty details · Rules · Enter button |
| Composer | 3-step wizard (Write → Show → Preview) |
| Leaderboard | Filter tabs · Period selector · Your rank |
| Notifications | Grouped Money / Town / The Law |
| Search | Live query filter · Trending tags |
| Ascension | Scroll crossfade Vagrant→Lord |
| PONR | 2-second hold-to-confirm fill bar |
| Coronation | Coin rain · Crown animation |
| Profile | Wanted Poster parchment card · Ascension CTA |

---

## Design System — Gulch Tokens

| Token | Value | Role |
|---|---|---|
| `m900` | `#0B0E14` | Page background |
| `g500` | `#F5B32B` | Gold — money, Lords |
| `c500` | `#3F9B5B` | Cactus — received, cash out |
| `o500` | `#8E2D30` | Oxblood — danger, flagged |
| `p100` | `#F4EEDD` | Parchment — Wanted Posters |

### Glass Classes (fonts.css)

```css
.tin-glass           /* card-level blur */
.tin-glass-elevated  /* sheet/panel heavy blur */
.tin-glass-gold      /* gold-tinted translucent */
.tin-glass-nav       /* bottom nav pill, 28px blur */
.tin-press           /* 80ms scale(0.97) on active */
.tin-press-sm        /* 80ms scale(0.94) on active */
```

---

## Local Dev

```bash
pnpm install
pnpm build
```

---

## V0 Usage

Import the component directly in a Next.js / V0 project:

```tsx
import TinCupApp from "@/components/TinCupApp"

export default function Page() {
  return <TinCupApp />
}
```

Ensure your project has `sonner` installed and Tailwind configured with the custom tokens from `src/styles/theme.css`.

---

## Castes

**Vagrant** — The drifter. Receives coin. Beg, perform, climb.  
**Lord** — The patron. Gives coin. Sets bounties, runs Courts, rains gold.

Lords never fall. And never go back.

---

*Season 1: Gold Rush · Perdition Gulch · Est. Now*
