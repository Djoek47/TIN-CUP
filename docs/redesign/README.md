# Handoff: Tin Cup — full mobile app ("The Vessel")

## Overview
Tin Cup is a live social-giving app. Two castes: **Vagrant** (free, receives) and **Lord** (one-time $100, gives). Users go live, ask the room, send gifts, run bounties in the Arena, and settle in a Wallet. The design language is "The Vessel": money is light and liquid inside glass. **Amber = given. Lime = received.**

This bundle contains a complete, wired 23-screen prototype plus everything needed to build it for real.

## About the design files
`Tin Cup.dc.html` is a **design reference**, not production code. It is a single-file HTML prototype (a custom streaming-template runtime, `support.js`) that shows exact look, copy, states and motion. Do **not** port it verbatim.

The task is to **recreate these screens in the target codebase** — `Djoek47/TIN-CUP`, which is Vite 6 + React 18 + TypeScript + Tailwind v4 — using that project's conventions. Open the HTML in a browser and click through every screen before writing code; it is the source of truth for behavior.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, copy, easing and timings are final. Recreate pixel-close. Where the prototype fakes data (hard-coded ledgers, chat lines, leaderboards), replace with real data of the same shape.

---

## 1. State of the repo (read this first)

The repo is currently a **stub**, and one import is broken:

| File | Status |
|---|---|
| `vite.config.ts` | Good. React + Tailwind v4 plugin, `@` → `./src`. Keep. |
| `src/styles/tailwind.css` | Good. Tailwind v4 entry. Keep. |
| `src/styles/index.css` | Good. Keep. |
| `src/styles/fonts.css` | Old western fonts (Ultra/Inter/IBM Plex Mono). **Replace** — see §3. |
| `src/styles/theme.css` | Old "Gulch" western tokens (`#0B0E14`, `#F5B32B`, cactus green). **Replace** with `tokens.css` in this bundle. |
| `src/components/TinCupApp.tsx` | Re-exports `../app/App` — **that file does not exist**. Build it. |
| `package.json`, `src/main.tsx`, `index.html`, `tsconfig.json` | **Missing.** Scaffold them. |
| `README.md` | Describes the abandoned Perdition Gulch western direction. Rewrite. |

The western theme (parchment, wanted posters, "beg", Gulch tokens) is **scrapped**. Ignore all of it. The design in this bundle supersedes the repo README entirely.

### Step 0 — make it run
```bash
pnpm init
pnpm add react@18 react-dom@18 sonner
pnpm add -D vite@6 @vitejs/plugin-react typescript @types/react @types/react-dom \
  tailwindcss @tailwindcss/vite tw-animate-css
```
Add `index.html` (viewport `width=device-width, initial-scale=1, viewport-fit=cover`), `src/main.tsx` importing `./styles/index.css`, and a `tsconfig.json` with the `@/*` path alias mirroring `vite.config.ts`.

---

## 2. Suggested structure

```
src/
├── app/
│   ├── App.tsx                 ← shell: status bar, screen router, bottom nav, wipe, toast
│   └── routes.tsx
├── screens/                    ← one file per screen (23), see §5
├── components/
│   ├── Shell.tsx               ← phone frame (dev only), safe areas
│   ├── BottomNav.tsx
│   ├── Toast.tsx
│   ├── Vessel.tsx              ← the cup SVG + fill/meniscus
│   ├── PourSlider.tsx          ← drag-to-pour amount control
│   ├── HoldButton.tsx          ← hold-to-confirm (Go Live 1300ms, PONR 2000ms)
│   ├── Hairline.tsx            ← list row divider primitive
│   ├── MonoNum.tsx             ← tabular-nums money text
│   └── Switch.tsx
├── state/
│   ├── AppState.tsx            ← caste, theme, screen, balance, ledger, user
│   └── useCaste.ts             ← derives Lord vs Vagrant surfaces
├── lib/
│   ├── thirdweb.ts             ← client, chain, wallets
│   ├── money.ts                ← fmt(), tabular formatting
│   └── motion.ts               ← the easing/duration constants in §7
└── styles/
```

Router: the prototype uses a single `screen` string with a 250ms wipe. In production use **React Router** (`react-router-dom`) with the same names as paths (`/home`, `/live/:id`, `/give`, `/wallet`, `/arena`, …) and keep the wipe as a route transition. Onboarding screens and `broadcast`/`golive`/`received`/`editprofile`/`settings` render **without** the bottom nav.

---

## 3. Design tokens

Drop `tokens.css` (in this bundle) in as `src/styles/theme.css`. It defines four themes as CSS custom properties: **Vagrant dark** (canonical), Vagrant light, **Lord dark**, Lord light. Switch by setting `data-caste="vagrant|lord"` and `data-theme="dark|light"` on the app root.

### Core palette
| Token | Vagrant dark | Role |
|---|---|---|
| `--bg` | `#08090B` | canvas |
| `--ink` | `#F4F3F0` | primary text |
| `--dim` | `rgba(244,243,240,.5)` | secondary text |
| `--faint` | `rgba(244,243,240,.32)` | inactive nav, tertiary |
| `--line` | `rgba(255,255,255,.10)` | hairline dividers |
| `--surf` | `rgba(255,255,255,.035)` | raised surface |
| `--gls` | `rgba(255,255,255,.22)` | glass stroke |
| `--navbg` | `rgba(20,21,24,.72)` | nav pill (blur 24px) |
| `--amb` | `#FFB43D` | **given** — amber |
| `--lim` | `#C4F000` | **received** — acid lime |
| `--rad` | `20px` | shell radius |

Lord dark: `--bg:#0C0906`, `--ink:#F7F1E4`, `--line:rgba(255,180,61,.16)`, `--surf:rgba(255,180,61,.05)`, `--navbg:rgba(30,22,12,.78)`, `--rad:8px`, and **lime is replaced by bone `#EDE6D6`** — a Lord has no receive channel.
Vagrant light: `--bg:#EDEBE5`, `--ink:#0B0C0E`, `--amb:#A86A00`, `--lim:#6E8C00`.
Lord light: `--bg:#F2ECDF`, `--ink:#17110A`, `--amb:#8A5300`.

Note `--amb`/`--lim` are the *text-safe* values (darkened in light mode for contrast); `--ambfill`/`--limfill` stay at full chroma for solid button fills, which always take `#0a0a0a` ink.

### Typography
- **Archivo** variable, axes `wdth 62..125`, `wght 100..900` — all UI text. Hierarchy comes from the **width axis**, not just weight: wordmark `wdth 118`, big numbers `wdth 112`.
- **JetBrains Mono** 300/400/500/700 — every number, label, kicker, timer. Always `font-feature-settings:'tnum'`.
- Scale in use: 33px/800 wordmark · 29px/800 hero amount · 22–24px/700 screen titles · 13.5px/600 row title · 11.5px body-dim · 9.5px mono label (`letter-spacing:.2em`, uppercase) · 8.5px mono micro-label.
- Money is **never** proportional-figure. Mono, tabular, tight tracking.

### Shape and spacing
Screen padding `22px` horizontal. Section gap `26px`. Row padding `14px 0` with a `1px solid var(--line)` top border — **hairlines, not cards**. Pills `border-radius:100px` (Vagrant) / `4px` (Lord). Buttons 56px tall, radius 100px / 8px. Media thumbs `14px`. Bottom nav floats with `backdrop-filter: blur(24px)`.

---

## 4. The caste system (the most important mechanic)

`caste: 'vagrant' | 'lord'` changes the whole app, not a badge. Model it as one derived object, not scattered conditionals.

| Surface | Vagrant | Lord |
|---|---|---|
| Canvas | cool near-black `#08090B` | warm amber-black `#0C0906` |
| Hairlines | white 10% | gold 16% |
| Radii | 20px / pills | 8px / 4px |
| Lime | present (received) | **removed**, bone instead |
| Nav slot 3 | `ASK` → Go Live | `GIVE` → Send |
| Primary action | "ASK THE ROOM" | "POUR INTO SOMEONE" |
| Wallet CTA | `CASH OUT` → /cash | `ADD FUNDS` |
| Arena CTA | "ENTER CHALLENGE" | "FUND THIS BOUNTY" |
| Go Live | available | locked ("Lords do not ask. They pour.") |
| Cash Out | available | hidden ("Lords put in. Nothing comes out.") |
| Profile | Level ladder + XP | Court standing ("COURT OF MAVERICK") |
| Wordmark tracking | `.3em` | `.44em` |

A Vagrant's shape is soft; a Lord's is sharp. The transition happens once, at Coronation, and is **irreversible** — enforce that server-side, not just in UI.

---

## 5. Screens

23 screens. Each entry below is: purpose → layout → notable behavior. Exact copy, sizes and colors: read the corresponding block in `Tin Cup.dc.html` (blocks are commented `<!-- ─── NN NAME ─── -->`).

**Onboarding (no nav)**
1. `splash` — cup SVG fills with amber→lime gradient over 2.6s (`cubic-bezier(.22,1,.28,1)`, .25s delay), a 2.5px white meniscus line rides the top with an amber drop-shadow. Wordmark reveals at 1.5s, CTA "ENTER THE ARENA" at 2.2s with a 3.4s shimmer sweep.
2. `start` — value props, "Get Started".
3. `connect` — wallet/social connect list (thirdweb in-app wallet — §8).
4. `verify` — 6-digit code, "New code sent" toast on resend.
5. `fate` — **Choose Fate.** Two selectable panels: Vagrant (lime border/tint when picked) vs Lord (amber). CTA text and color follow the pick: `START AS A VAGRANT` (lime fill) or `BECOME A LORD · $100` (amber fill). Vagrant → home; Lord → PONR.
6. `ascend` — Lord pitch, stepped scroll.
7. `ponr` — **Point of No Return.** Press-and-hold 2000ms; a fill bar tracks `requestAnimationFrame` progress; releasing early resets to 0. Completion sets caste = lord and routes to Coronation.
8. `crown` — Coronation. The vessel is full.

**Core (with nav)**
9. `home` — sticky header, hero story card with `image-slot`, LIVE pill (5px lime dot, 1.6s pulse), received amount + `GOAL $2,000` + a 2px lime progress rail with a `0 0 14px` glow. Three story tabs (`Luna` / `Stella` / `Kai`) switch the hero. Below: "Live Moments" horizontal rail of 112×148 thumbs → live, then a hairline activity list (↓ lime received, ↑ amber sent).
10. `live` — full-bleed stream frame, top/bottom scrims, LIVE + timer, viewers, raised-vs-goal bar, right gift column, rising chat, quick-gift pills ($10/$50/$100/$250 filled/$500). Tapping a pill fires a gift burst for 2600ms.
11. `broadcast` — your own stream. Runs a 1400ms interval feeding chat, viewers (+3–20 each tick) and raised total; mic/cam/flip/filter toggles each toast; End Live stops the interval and returns home.
12. `golive` — camera preview, category / audience / goal cyclers, **hold 1300ms** to start → broadcast. Locked for Lords.
13. `send` (Give) — **drag-to-pour.** A vertical glass vessel; pointer Y maps to fill 2–100%; amount = `round(pour*500/5)*5`, min $5. Preset chips set 5/10/20/50%. Uses `setPointerCapture`. Sending routes to `live` then fires the gift burst 700ms later.
14. `arena` — three tabs: Featured challenge, Blind Give roulette (5-min spins), Midnight Marathon event. Each has kicker, title, rule, reward, countdown, CTA. CTA flips per caste (§4).
15. `wallet` — balance hero `$1,843.75` with hide/show (`••••`), available `$1,356.20` / on hold `$487.55`, payment method cycler (Bank ···· 4567 / Apple Pay ···· 8802 / Tin Cup Balance / USDC 0x7A3f···4C21), hairline ledger.
16. `cash` — **drag-to-cash-out.** Horizontal drag maps X to amount, quantized to $25, max $1,356. Confirm toasts and returns to wallet.
17. `activity` — four filter chips (All / Received / Sent / Challenges) filtering the hairline list.
18. `received` — receipt screen, no nav.
19. `profile` — avatar, handle, followers/following/given, then **Level ladder + XP** (Vagrant) or **Court standing** (Lord). Info taps explain Coin Dust, Marks, XP (1 per $1 given, 5 per challenge).
20. `level` — Your Level detail.
21. `givers` — Top Givers. Period selector (Day/Week/Month/All) with a filled amber active pill; podium 1–3 then rows 4–8; "your rank" strip.
22. `settings` — appearance (dark/light), notification switches (gifts, live, court), privacy, hide amounts, help, legal, sign out.
23. `editprofile` — avatar drop, handle, bio, save → toast + back to profile.

---

## 6. Interactions & behavior

- **Screen change**: set `wipe=true`, swap screen at **250ms**, clear wipe at **640ms**. New screen animates in with `scIn`: `opacity 0→1`, `translateY(14px)→0`, `scale(.985)→1` over **620ms** `cubic-bezier(.16,1,.3,1)`.
- **Toast**: single-slot, 2000ms auto-dismiss, replaces any current toast. Every non-navigating action produces one — there are no dead presses. Full copy list is in the prototype's `say*` handlers; use `sonner` (already a repo dep) with a custom mono-styled toast.
- **Hold-to-confirm**: `requestAnimationFrame`, progress = `elapsed/duration`; release before 1 resets to 0 with no side effect. Go Live 1300ms, PONR 2000ms.
- **Drag controls**: pointer events + `setPointerCapture`; clamp; quantize on commit ($5 for pour, $25 for cash out).
- **Gift burst**: amount label + particle rise, 2600ms, self-clearing.
- **Live chat**: keep last 5–6 messages, new ones rise in.
- Hit targets ≥ 44px. Respect `prefers-reduced-motion`: skip the splash fill, the shimmer, and the chat rise; keep opacity fades.

---

## 7. Motion curves (refined — use these)

```ts
export const EASE = {
  enter:  'cubic-bezier(.16,1,.3,1)',    // screens, reveals, rails
  liquid: 'cubic-bezier(.22,1,.28,1)',   // anything that fills: vessel, bars, meniscus
  exit:   'cubic-bezier(.4,0,1,1)',      // dismiss, wipe out
  press:  'cubic-bezier(.2,0,0,1)',      // 80ms scale(.97) tap
};
export const DUR = {
  press: 80, wipeIn: 250, wipeOut: 640, screen: 620,
  reveal: 900, fill: 2600, giftBurst: 2600, toast: 2000,
  holdGoLive: 1300, holdPonr: 2000, chatTick: 1400,
};
```
Rules: liquid never eases linearly and never bounces — overshoot reads as spillage. Progress bars use `transition: width .7s var(--ease-enter)`. Glows are `box-shadow: 0 0 14px currentColor` on the accent, never a blur filter (mobile cost). If you adopt `motion/react`, translate these to `{ type: 'tween', ease: [.16,1,.3,1] }` — do not swap in springs.

---

## 8. thirdweb integration

The prototype fakes auth and money. Real wiring:

```bash
pnpm add thirdweb
```

```ts
// src/lib/thirdweb.ts
import { createThirdwebClient, defineChain } from 'thirdweb';
import { inAppWallet, createWallet } from 'thirdweb/wallets';

export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID,
});
export const chain = defineChain(8453); // Base — cheap, USDC-native
export const wallets = [
  inAppWallet({ auth: { options: ['email', 'phone', 'google', 'apple', 'passkey'] } }),
  createWallet('io.metamask'),
  createWallet('com.coinbase.wallet'),
];
```

Wrap the app in `<ThirdwebProvider>` and map screens to hooks:

| Screen | thirdweb |
|---|---|
| `connect` | `useConnectModal()` or a custom list calling `connect()` per wallet — keep the prototype's own list UI, not thirdweb's default modal, so the design holds |
| `verify` | in-app wallet email/phone OTP (`preAuthenticate` → `connect` with `verificationCode`); "New code sent" re-calls `preAuthenticate` |
| `fate` → Lord | one-time $100: a USDC `transfer` to the treasury via `sendTransaction`, or thirdweb Pay (`PayEmbed` / `useSendTransaction` with fiat onramp) so card users can ascend |
| `ponr` | fire the tx on hold-complete; the 2s hold is the confirm step, so do **not** add a second dialog. Show tx pending state inside the fill bar; on failure stay on PONR and toast the error |
| `crown` | wait for receipt (`waitForReceipt`) before granting the caste; write caste to your backend, not just localStorage |
| `wallet` | `useWalletBalance` for USDC; "available" vs "on hold" is your ledger, not chain state — hold = pledged to open bounties/gifts in flight |
| `send` / gift pills | USDC `transfer` to the recipient's smart account; use account abstraction (`smartAccount: { chain, sponsorGas: true }`) so gifting costs the user nothing in gas |
| `cash` | off-ramp — thirdweb Pay sell flow or your PSP; the $25 quantization is a product rule, keep it |
| `arena` bounty funding | escrow contract; fund on `FUND THIS BOUNTY`, release on completion |

Env: `VITE_THIRDWEB_CLIENT_ID`, `VITE_TREASURY_ADDRESS`, `VITE_USDC_ADDRESS`, `VITE_CHAIN_ID`. Never ship a secret key to the client — server-side actions (payouts, escrow release, caste grant) belong in a backend using the thirdweb secret key or Engine.

**Also needed but not designed** (flag to product before building): live video transport (LiveKit / Mux / 100ms), realtime chat + gift events (WebSocket or Ably), push notifications, KYC for cash out, and moderation for the "adult" toggle. The prototype's chat and viewer counts are simulated on a 1400ms interval — swap for a subscription with the same shape.

---

## 9. State shape

```ts
type Caste = 'vagrant' | 'lord';
type AppState = {
  caste: Caste;                 // irreversible once 'lord'
  theme: 'dark' | 'light';
  user: { handle: string; avatar?: string; bio: string; adult: boolean };
  balance: { total: number; available: number; hold: number; hidden: boolean };
  ledger: Entry[];              // {dir:'in'|'out', who, amount, kind, ts}
  live: { streamId?: string; viewers: number; raised: number; goal: number; elapsed: number };
  compose: { category: string; audience: string; goal: number|null; mic: boolean; cam: boolean; front: boolean; filter: boolean };
  prefs: { nGifts: boolean; nLive: boolean; nCourt: boolean; priv: boolean; hideAmt: boolean };
};
```
Transient (component-local, not global): `pour`, `cash`, `hold`, `ponr`, `gift`, `toast`, `wipe`, tab indices.

Persist `caste`, `theme`, `prefs`, `user` server-side; hydrate on connect. Everything money-related is server-authoritative.

---

## 10. Assets
- Fonts: Archivo + JetBrains Mono (Google Fonts). Self-host for production; drop the western fonts from `fonts.css`.
- No raster assets shipped. Every photo/video surface in the prototype is an `<image-slot>` placeholder (stream frames, story cards, moment thumbs, avatars) — real media comes from the backend. `image-slot.js` is included only so the prototype renders.
- Icons: inline SVG, 1.1–1.5px stroke, `currentColor`. Keep them thin; the design has no filled icons.

## 11. Files in this bundle
| File | What it is |
|---|---|
| `Tin Cup - standalone.html` | **Start here.** The entire design in one self-contained file — no dependencies, works offline, double-click to open. |
| `Tin Cup.dc.html` + `support.js`, `image-slot.js` | The same prototype as source files. Runtime only — do not port. |
| `tokens.css` | Production-ready CSS custom properties for all four themes → `src/styles/theme.css`. |
| `screens/` | 34 reference captures, listed below. |

### Screens folder
| File | Screen |
|---|---|
| `01-splash` … `09-coronation` | Onboarding chain: splash, get started, connect, verify, choose fate (+ Lord picked), ascension, PONR, coronation |
| `10-home-vagrant`, `11-home-story-tab-2` | Home feed; second story tab |
| `12-live-stream`, `13-live-gift-burst` | Live viewing; $250 gift burst |
| `14-give-drag-to-pour`, `15-give-pour-50` | Give screen at rest and at 50% pour |
| `16-go-live-setup`, `17-broadcasting` | Compose and live broadcast (chat/viewers/raised running) |
| `18-arena-featured`, `19-arena-blind-give` | Arena tabs 1 and 2 |
| `20-wallet`, `21-cash-out`, `22-activity`, `23-received` | Money surfaces |
| `24-profile-vagrant`, `25-your-level`, `26-top-givers` | Profile and standing |
| `27-settings`, `28-edit-profile` | Account |
| `29-home-lord`, `30-wallet-lord`, `31-arena-lord-bounty`, `32-profile-lord-court` | **The Lord world** — compare 29 against 10 to see the full caste shift |
| `33-home-vagrant-light`, `34-home-lord-light` | Light mode, both castes |

Captures are of the prototype in a phone frame at 392×846; photo/video areas show `image-slot` placeholders because no real media exists yet.

## 12. Suggested build order
1. Scaffold (§1 Step 0), drop in `tokens.css`, fonts, `App.tsx` shell + nav + toast + wipe.
2. Primitives: `Hairline`, `MonoNum`, `Switch`, `Vessel`, `HoldButton`, `PourSlider`.
3. Onboarding chain splash → crown, with the caste switch working end to end. This proves the token system.
4. `home`, `wallet`, `profile`, `settings` — static data, real layout.
5. thirdweb: connect, verify, balance, then the $100 ascension tx.
6. `send` / gift pills with real USDC transfers.
7. Live: video provider, then `golive` → `broadcast` → `live`.
8. `arena` escrow, `cash` off-ramp, `activity` from the real ledger.

## 13. Deploy
Static SPA — Vercel or Cloudflare Pages, `pnpm build` → `dist`. Set the `VITE_*` env vars per environment and use a testnet chain id in preview. Add `_redirects`/`vercel.json` SPA fallback for React Router. Backend (ledger, escrow release, caste grant, KYC webhooks) deploys separately; keep the thirdweb secret key there. For mobile, wrap with Capacitor — the design is already 392×846 safe-area aware.
