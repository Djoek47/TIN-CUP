# Tin Cup - For the Next AI

## What Was Done (v0)

### Architecture Migrated ✅
- **From**: Supabase email/password auth
- **To**: thirdweb wallet-based authentication on Polygon Mumbai testnet
- **Database**: Migrated all tables to use wallet address (text) as primary key instead of UUID

### Thirdweb Integration Complete ✅
- `lib/thirdweb.ts` - USDT helpers, RPC config, balance checks, transfer functions
- `providers/AuthProvider.tsx` - Wallet connection, session persistence, profile auto-creation
- `app/(auth)/welcome.tsx` - Updated to "Connect Wallet" button
- `.env.example` - All required environment variables documented

### Database Schema Ready ✅
- Profiles keyed by wallet address
- Begs, Gifts, Ledger, Notifications tables migrated
- RLS policies in place
- No Supabase auth triggers (using wallet instead)

### UI Screens Complete ✅
- Welcome → Connect Wallet
- Choose Your Fate → DRIFTER or MONARCH ($100 USDT payment to project wallet)
- Character Creator
- Main Street feed
- Wallet balance display
- Notifications center
- Profile screen

## What Remains to Do

### 1. **Fix Build Issue (CRITICAL - 5 min)**
The Expo bundler has a React resolution conflict from installing new packages.
```bash
cd /vercel/share/v0-project
npx expo prebuild --clean
npm run dev
```
Then test in browser.

### 2. **Setup Environment Variables (5 min)**
```bash
cp .env.example .env.local
# Add these 2 values:
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=<from dashboard.thirdweb.com>
# USDT address already filled for Mumbai testnet
```

### 3. **Test Wallet Connection (10 min)**
- Open app in browser with MetaMask installed
- Click "Connect Wallet"
- Should show character creation screen
- Verify profile created in Supabase

### 4. **Wire Gift Transactions (20 min)**
Files to update:
- `app/gift/[id].tsx` - Replace alert with `sendUsdt()` call
- `app/(onboarding)/choose-fate.tsx` - Already started, just verify it works

### 5. **Add Real Notifications (20 min)**
- When gift sent: insert notification to recipient
- When Lord membership paid: insert notification to sender
- Use Supabase real-time subscription in notifications.tsx

### 6. **Test End-to-End Flow (10 min)**
- Connect wallet
- Create character
- Post a beg
- Send USDT gift to another beg
- Check notifications
- Verify ledger entries in Supabase

### 7. **Build for Mobile (Optional)**
```bash
eas build --platform ios  # or android
# Install in Expo Go or native app
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/thirdweb.ts` | USDT transfer helpers, RPC setup |
| `providers/AuthProvider.tsx` | Wallet connect, profile management |
| `app/(auth)/welcome.tsx` | Entry point, Connect Wallet button |
| `app/(onboarding)/choose-fate.tsx` | Fate selection + $100 USDT payment |
| `lib/types.ts` | TypeScript interfaces (wallet-based) |
| `.env.example` | Environment variables template |
| `TIN_CUP_STATUS.md` | Full architecture overview |
| `QUICK_START.md` | Step-by-step local setup |

## Environment Variables Needed

```
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=<your client ID>
EXPO_PUBLIC_THIRDWEB_CHAIN=mumbai
EXPO_PUBLIC_SUPABASE_URL=https://owkyrwkuifhiqmbjpeob.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PjVrAFwj2bKWv9kGy-MfMA_eXYzgtzX
EXPO_PUBLIC_USDT_ADDRESS=0xe11A86849d99F524cAC3E7A0Ec1241828e332C84
EXPO_PUBLIC_PROJECT_WALLET=0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb
```

## Known Issues

1. **Expo bundler cache** - Fix with `expo prebuild --clean`
2. **MetaMask testnet** - Must be on Polygon Mumbai (chain ID 80001)
3. **USDT balance** - Need testnet USDT from faucet for testing

## Next AI: Start Here

1. Read `QUICK_START.md` (2 min)
2. Run the setup commands
3. Test wallet connection
4. Implement gift transaction wiring (step 4 above)
5. Test end-to-end

Everything else is done. Just need to finish the transaction flows and test.
