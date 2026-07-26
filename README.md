# TIN CUP · Perdition Gulch

> "Where strangers throw real gold at strangers — for glory, for laughs, for the story."

iPhone & Android social tipping app. Expo Router + Supabase + Gulch Design System.

**Expo SDK 54** — matches the App Store / Play Store Expo Go build. (SDK 55–57 are not in store Expo Go yet.)

## Quick start (Expo Go — mobile)

```bash
npm install
cp .env.example .env.local
npm run dev
```

1. Install **Expo Go** from the App Store / Play Store (latest store build = SDK 54)
2. Scan the QR code from the terminal:
   - **iPhone:** Camera app → opens in Expo Go
   - **Android:** Expo Go → Scan QR code
3. App loads on device (splash → welcome / Main Street)

`npm run dev` uses Expo tunnel so phones can reach the cloud/dev host.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Mobile test server (Expo Go via tunnel) |
| `npm run dev:lan` | Expo Go over LAN (`exp://…`) |
| `npm start` | Expo Dev Tools |
| `npm run ios` / `android` | Open simulator / emulator |

## Stack

- React Native + Expo 57 (Router)
- TypeScript
- Supabase (Postgres + RLS)
- ethers / thirdweb (Polygon Mumbai test)
- Gulch tokens in `theme/tokens.ts`

## Docs

1. `READY_TO_CURSOR.md` — 5-minute overview
2. `FINAL_HANDOFF.md` — architecture & features
3. `START_TESTING.md` — testing checklist
4. `PAYMENT_FLOWS_GUIDE.md` — payment RPCs

## Env

`.env.local` (from `.env.example`):

- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` (defaults also in `app.json` → `extra`)
- `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` (optional)

---

*Season 1: Gold Rush · Perdition Gulch*
