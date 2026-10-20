# Tin Cup - Quick Start for Cursor

## TL;DR - Get Running in 2 Minutes

```bash
# 1. Clone the project (already cloned in v0, but for reference)
git clone https://github.com/Djoek47/TIN-CUP.git
cd TIN-CUP
git checkout tin-cup

# 2. Install dependencies
npm install

# 3. Fix the Expo build cache issue
npx expo prebuild --clean

# 4. Start dev server
npm run dev

# 5. Open http://localhost:3000
# Click "Connect Wallet" and use MetaMask on Mumbai testnet
```

## What You Need to Do Next

### 1. Create `.env.local`
```
EXPO_PUBLIC_SUPABASE_URL=https://owkyrwkuifhiqmbjpeob.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PjVrAFwj2bKWv9kGy-MfMA_eXYzgtzX
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=YOUR_CLIENT_ID_HERE
EXPO_PUBLIC_PROJECT_WALLET=0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb
```

**Get thirdweb Client ID**: https://dashboard.thirdweb.com → Create an API Key

### 2. Test Wallet Connection
- MetaMask → switch to "Polygon Mumbai"
- Click "Connect Wallet" on app
- Should create profile in Supabase with wallet address as ID

### 3. Test Lord Membership ($100 USDT)
- Choose "MONARCH" on Choose Your Fate screen
- Will execute USDT transfer (needs testnet USDT)
- **Testnet USDT Faucet**: https://polygon.balancer.fi/

### 4. Main Features Ready to Use
- ✅ All screens built and styled per Figma
- ✅ Wallet auth fully wired
- ✅ Supabase schema ready (wallet-keyed)
- ✅ USDT transfer helpers written
- ✅ Gift flow skeleton (needs final wiring)
- ✅ Notifications, Profile, Wallet screens complete

## Project Structure

```
app/
  (auth)/welcome.tsx              — Wallet login
  (onboarding)/choose-fate.tsx    — Lord vs Drifter + $100 payment
  (onboarding)/create.tsx         — Character creator
  (app)/index.tsx                 — Main Street feed
  (app)/compose.tsx               — Create begs
  (app)/wallet.tsx                — Balance & ledger
  (app)/notifications.tsx         — Event feed
  (app)/profile.tsx               — Account display
  gift/[id].tsx                   — Gift modal

lib/
  thirdweb.ts                     — USDT transfers, chain config
  supabase.ts                     — Database client
  types.ts                        — Wallet-keyed TypeScript types

providers/
  AuthProvider.tsx                — Wallet connection & session mgmt

theme/
  tokens.ts                       — Design system colors & spacing
  type.ts                         — Typography scale
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `Unable to resolve "react"` | `npx expo prebuild --clean && npm run dev` |
| MetaMask won't connect | Ensure MetaMask is on Mumbai testnet |
| No USDT balance | Get testnet USDT from faucet above |
| Supabase RLS errors | All tables allow public SELECT — check your User-Agent |

## Key Wallet Addresses

- **PROJECT_WALLET**: `0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb` (receives Lord memberships)
- **USDT on Mumbai**: `0xE8Cb91B6d914b0Cf44a4EF4a64C6a37c35b0Ef24`

## Next Dev Tasks

1. **Wire up gift flow** — `app/gift/[id].tsx` needs to call `sendUsdt(signer, recipient, amount)`
2. **Add leaderboards** — Query begs ordered by raised_cents
3. **Profile editing** — Allow users to change hat/face after onboarding
4. **Real error handling** — Replace Alert() with UI error cards
5. **Loading states** — Add spinners during blockchain transactions

## Deployment When Ready

```bash
# Build for EAS (native iOS/Android)
eas build --platform ios
eas build --platform android

# Submit to App Store
eas submit --platform ios
eas submit --platform android
```

---

**All code is committed to `tin-cup` branch and ready for Cursor.**

See `TIN_CUP_STATUS.md` for full architecture details.
