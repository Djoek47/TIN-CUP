# TIN CUP · Perdition Gulch

> "Where strangers throw real gold at strangers — for glory, for laughs, for the story."

Mobile app ported from **Figma Make Tin-Cup-V2** + Stage 1/2 product specs. Expo SDK 54 · Gulch Design System · thirdweb wallet.

## Quick start (Expo Go)

```bash
npm install
cp .env.example .env.local
# Set EXPO_PUBLIC_THIRDWEB_CLIENT_ID from https://dashboard.thirdweb.com
npm run dev
```

1. Install **Expo Go** (SDK 54 store build)
2. Scan the tunnel QR
3. Flow: Splash → Welcome → Choose Fate → Character Creator → Main Street

Without a thirdweb client ID the app still walks the Make UI on a local demo seat.

**Expo Go note:** native thirdweb in-app wallets (`thirdweb/wallets`) cannot load inside Expo Go (AWS KMS / QuickCrypto / Coinbase MWP). Identity uses a local `0x` seat there; failed on-chain attempts show **No gold moved.** Real USDT + in-app wallet need a custom/dev client build with the same AuthProvider call sites.

## Make parity screens

Entry: Splash, Welcome, Choose Fate, Character Creator  
Tabs: Main Street, Feed of Madness, Lobbies, Wanted Poster (+ ActionOrb)  
Subs: Wallet, Deposit, Cash Out, Beg Detail, Challenge Detail, Composer, Live Stream, Notifications, Search, Leaderboard, Ascension, PONR, Coronation

Source snapshot: `docs/figma-make/` · Product bible: `docs/stage/`

## Stack

- Expo Router 54 / React Native
- GDS components in `components/gds/`
- thirdweb v5 (`inAppWallet` guest + USDT on Polygon Amoy)
- Supabase profiles / begs when configured

## Env

| Var | Purpose |
|---|---|
| `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` | Wallet + chain (required for real money) |
| `EXPO_PUBLIC_USDT_ADDRESS` | Test USDT |
| `EXPO_PUBLIC_PROJECT_WALLET` | Lord $100 stake recipient |
| `EXPO_PUBLIC_SUPABASE_URL` / `_ANON_KEY` | Profiles & begs |

Failed money ops always surface: **No gold moved.**

---

*Season 1: Gold Rush · The Gulch Design System*
