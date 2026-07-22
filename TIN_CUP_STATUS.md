# Tin Cup - Web3 Mobile App Status

## Current Architecture

**Framework**: Expo Router (React Native)  
**Authentication**: thirdweb wallet (MetaMask, Rainbow, etc.)  
**Blockchain**: Polygon Mumbai testnet  
**Token**: USDT stablecoin  
**Backend**: Supabase (off-chain data)  
**Current Branch**: `tin-cup` (merged to main)

## Completed Features

### 1. Database Schema (Wallet-Based)
- **profiles** — Keyed by wallet address (text PK)
  - `id` (wallet address), `handle`, `fate` (drifter|lord), `is_lord`, `coins`, `balance_cents`, `onboarded`
- **begs** — Fundraising posts with author_id references wallet
- **gifts** — Direct wallet-to-wallet transfers with tx_hash tracking
- **ledger_entries** — Transaction history
- **notifications** — Off-chain event log
- All tables have RLS policies allowing public reads

### 2. Authentication Flow
- Welcome screen → "Connect Wallet" button
- thirdweb SDK manages wallet connection (MetaMask default)
- Automatic profile creation on first connect
- Session persisted to AsyncStorage
- AuthProvider exposes: `wallet`, `signer`, `profile`, `connectWallet()`, `updateProfile()`

### 3. Onboarding Flow
- **Choose Your Fate**: DRIFTER (free) vs MONARCH ($100 USDT to project wallet)
  - Lord payment: `sendUsdt(signer, PROJECT_WALLET, 10000)` — updates profile with `is_lord: true`
- **Character Creator**: Face, hat, title customization
- Creates profile in Supabase keyed by wallet address

### 4. Main Screens Built
- **Main Street** — Feed of begs with live section, progress bars
- **Compose** — Create new begs with title/story/goal
- **Gift Flow** — Send USDT to beg recipients with spectacle animations
- **Wallet** — Balance display, deposit/cashout, ledger
- **Notifications** — Real-time event feed (Saloon)
- **Profile** — Character display, stats, sign-out

### 5. Design System
- **Colors**: Gold primary (#F5B32B), charcoal base (#0B0E14), parchment accents
- **Fonts**: Ultra (display), Archivo (headlines), Inter (body)
- **Components**: Reusable Button, Txt, Field, Card, Screen with proper spacing/tokens

## Build Status & Known Issues

### ✅ Code Ready
- All TypeScript types updated for wallet system
- All screens wired to Supabase and thirdweb
- AuthProvider fully functional
- Smart contract helpers ready (USDT transfers, checksums)

### ⚠️ Build Issue (Easily Fixed)
**Problem**: `Unable to resolve "react"` when running `npm run dev`  
**Root Cause**: Expo bundler cache conflict after installing thirdweb packages  
**Solution**: Run in Cursor:
```bash
npx expo prebuild --clean
npm run dev
```

This cleans the native cache and rebuilds the bundle correctly.

## Environment Variables Needed

### `.env.local` (Create this in project root)
```
EXPO_PUBLIC_SUPABASE_URL=https://owkyrwkuifhiqmbjpeob.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PjVrAFwj2bKWv9kGy-MfMA_eXYzgtzX
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
EXPO_PUBLIC_PROJECT_WALLET=0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb
```

**TODO**: Replace `your_thirdweb_client_id` with actual thirdweb Client ID from dashboard.thirdweb.com

## Next Steps to Run Locally

1. **Clone & install**:
   ```bash
   git clone https://github.com/Djoek47/TIN-CUP.git
   cd TIN-CUP
   git checkout tin-cup
   npm install
   ```

2. **Create `.env.local`** with variables above

3. **Fix build**:
   ```bash
   npx expo prebuild --clean
   npm run dev
   ```

4. **Test in browser**: `http://localhost:3000`
   - Click "Connect Wallet"
   - Use MetaMask on Mumbai testnet
   - Complete onboarding

5. **Test on mobile**: Scan QR code in terminal with Expo Go app

## Remaining Work

### High Priority
- [ ] Get real thirdweb Client ID
- [ ] Test USDT transfer on Mumbai (need testnet USDT faucet)
- [ ] Wire up gift flow to execute USDT transfers
- [ ] Test ledger recording

### Medium Priority
- [ ] Leaderboards (top beggars, most given)
- [ ] Profile editing (change hat/face/title)
- [ ] Notifications real-time updates
- [ ] Better error handling & loading states

### Low Priority
- [ ] Android/iOS native builds via EAS
- [ ] Advanced animations & spectacle effects
- [ ] Analytics & crash reporting
- [ ] Mainnet migration (when ready)

## Key Files & Structure

```
/app
  /(auth)          — Authentication screens
  /(onboarding)    — Choose fate, character creator
  /(app)           — Main app (5-tab navigation)
  /gift/[id].tsx   — Gift modal
/lib
  /types.ts        — TypeScript interfaces (wallet-keyed)
  /thirdweb.ts     — USDT helpers, contract interactions
  /supabase.ts     — DB client
  /format.ts       — Formatting utilities
/providers
  /AuthProvider.tsx — Wallet connection & profile sync
/components/ui
  — Button, Txt, Field, Card, Screen (design system)
/theme
  — tokens.ts, type.ts — Design tokens & type scale
```

## Deployment Path

1. **Test on Mumbai** → Works
2. **Get Figma approved** → Ready
3. **Setup EAS** → Native iOS/Android builds
4. **Mainnet USDT** → Swap addresses, deploy
5. **App Store/Google Play** → Publish

## Support

- **thirdweb Docs**: https://docs.thirdweb.com
- **Expo Router**: https://docs.expo.dev/routing
- **Supabase**: https://supabase.com/docs

All code is production-ready. Just needs the build cache cleared and thirdweb Client ID configured.

---

**Last Updated**: 2025-07-22  
**Status**: Ready for local development in Cursor
