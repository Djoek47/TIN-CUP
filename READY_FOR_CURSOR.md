# Tin Cup - Ready for Cursor

Everything is committed and ready. Start here.

## 30-Second Setup

```bash
# Clone
git clone https://github.com/Djoek47/TIN-CUP.git
cd TIN-CUP
git checkout tin-cup

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# (Optional) Add thirdweb Client ID to .env.local
# EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# Fix build
npx expo prebuild --clean

# Run dev server
npm run dev

# Open http://localhost:3000
```

## What Works NOW (No setup needed)

✅ Wallet login (test mode - MetaMask optional)  
✅ Choose Drifter or Lord  
✅ Lord membership $100 USDT payment (test mode)  
✅ Character creation  
✅ Main Street feed with begs  
✅ Gift sending with USDT transfers (test mode)  
✅ Ledger tracking  
✅ Notifications  

**Test mode** = No real blockchain needed. All transactions are simulated and recorded in Supabase.

## 10-Minute Test

Open `START_TESTING.md` and follow the steps. Tests the full flow:
1. Login with wallet
2. Choose Drifter (free)
3. Create character
4. View Main Street begs
5. Send a gift
6. Check wallet and ledger

## If Something Breaks

1. **Build error?** → `npx expo prebuild --clean`
2. **Port in use?** → Kill process on port 3000
3. **Supabase issue?** → Check `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Still stuck?** → See TESTING_GUIDE.md

## Documentation Order

Read in this order:
1. This file (30 sec)
2. START_TESTING.md (test the app - 10 min)
3. AI_FINAL_PLAN.md (understand what's built - 5 min)
4. TESTING_GUIDE.md (detailed scenarios - reference)

## What's Built

- **Database**: Supabase with wallet-based profiles, begs, gifts, ledger, notifications
- **Auth**: thirdweb wallet connection (MetaMask, Rainbow, etc.)
- **Payment**: USDT transfers with test mode
- **UI**: 8 complete screens matching Figma design
- **Core Loop**: Login → Character → Beg Feed → Send Gift

## Next Steps (After Testing)

1. Get thirdweb Client ID from dashboard.thirdweb.com
2. Add to `.env.local`
3. Switch from test mode to real blockchain (optional - test mode works fine)
4. Deploy to production

## Stack

- **Framework**: Expo + React Native + Expo Router
- **Database**: Supabase (Postgres)
- **Blockchain**: Polygon Mumbai testnet (USDT)
- **Wallet**: thirdweb + ethers.js
- **Design**: Custom Gulch theme (gold + charcoal)

## Files & Structure

```
/app
  /(auth)/          - Login screens
  /(onboarding)/    - Fate selection, character creation
  /(app)/           - Main app screens
  /gift/            - Gift modal
/lib
  /thirdweb.ts      - Blockchain helpers
  /test-utils.ts    - Mock wallet/USDT for testing
  /types.ts         - TypeScript interfaces
/providers
  /AuthProvider.tsx - Wallet auth & session
/scripts
  /seed-demo.ts     - Populate database with demo data
```

## Key Files to Know

- `lib/thirdweb.ts` - All blockchain logic (USDT transfers, wallets)
- `providers/AuthProvider.tsx` - Wallet connection + session
- `app/gift/[id].tsx` - Send gift flow (wired up, uses test mode by default)
- `app/(onboarding)/choose-fate.tsx` - Lord payment ($100 USDT)
- `.env.example` - All env vars needed

## Env Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=                    # Already in project
NEXT_PUBLIC_SUPABASE_ANON_KEY=               # Already in project
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_id_here # Get from thirdweb dashboard
POLYGON_MUMBAI_RPC=                          # Optional - defaults to thirdweb RPC
```

## Test Mode Details

By default, the app uses **simulated transactions** (no real blockchain):
- Wallet login works without MetaMask
- USDT transfers are recorded in Supabase
- All ledger entries created
- Notifications triggered

To use real blockchain:
1. Install MetaMask
2. Add thirdweb Client ID
3. Change `simulateUsdtTransfer()` calls to `sendUsdt()` in:
   - `app/gift/[id].tsx` (line ~80)
   - `app/(onboarding)/choose-fate.tsx` (line ~45)

## Success Criteria

After running, you should see:
- ✅ Welcome screen with "Connect Wallet" button
- ✅ Can click through to character creation without wallet
- ✅ Can view Main Street feed
- ✅ Can open gift modal and send
- ✅ Ledger shows transaction
- ✅ Recipient notification appears

All 6 work in test mode. No setup needed.

## Branch Info

- **Repo**: https://github.com/Djoek47/TIN-CUP
- **Branch**: `tin-cup` (main branch for this project)
- **Last Commit**: docs: Add AI_FINAL_PLAN.md
- **Status**: All code committed, clean working tree

## Questions?

Everything is documented. See:
- Setup issues? → TESTING_GUIDE.md
- How to test? → START_TESTING.md
- What's built? → AI_FINAL_PLAN.md
- Architecture? → TIN_CUP_STATUS.md

---

**You're all set. Run `npm install && npm run dev` and test away.**
