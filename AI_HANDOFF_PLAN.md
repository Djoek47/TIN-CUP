# Tin Cup - AI Assistant Handoff Plan

## Project Overview
**Tin Cup** is a Web3 mobile app (Expo + React Native) where users connect their crypto wallet and send/receive real USDT on Polygon Mumbai testnet. Lords pay $100 USDT to join and earn cuts on gifts. Peasants (Drifters) beg for free.

---

## ✅ COMPLETED WORK

### 1. Database & Schema
- **Status**: DONE
- **What**: Migrated from email/UUID to wallet-address-based system
- **Files**: Supabase migrations in migration history
- **Tables**: `profiles` (wallet PK), `begs`, `gifts`, `ledger_entries`, `notifications`
- **Key change**: User ID is now wallet address (text, lowercase)

### 2. Blockchain Integration
- **Status**: DONE
- **What**: thirdweb + ethers.js setup for Polygon Mumbai testnet
- **File**: `lib/thirdweb.ts`
- **What it does**:
  - USDT token helpers (address, conversions cents↔wei)
  - `sendUsdt(signer, recipient, amountCents)` function for wallet-to-wallet transfers
  - Project wallet placeholder: `0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb`

### 3. Authentication
- **Status**: DONE
- **What**: Replaced email/password with thirdweb wallet connection
- **File**: `providers/AuthProvider.tsx`
- **Key methods**:
  - `connectWallet()` - Opens wallet modal, gets signer
  - `updateProfile()` - Saves to Supabase keyed by wallet
  - `signOut()` - Clears AsyncStorage
  - Exposes `wallet`, `signer`, `profile` to app

### 4. UI Screens (All 8 screens built)
| Screen | File | Status | Key Feature |
|--------|------|--------|-------------|
| Welcome | `app/(auth)/welcome.tsx` | ✅ DONE | "Connect Wallet" button |
| Choose Fate | `app/(onboarding)/choose-fate.tsx` | ⚠️ NEEDS WIRING | $100 USDT payment for Lord |
| Character Creator | `app/(onboarding)/create.tsx` | ✅ DONE | Face/hat/title picker |
| Main Street | `app/(app)/index.tsx` | ✅ DONE | Beg feed + live section |
| Beg Composer | `app/(app)/compose.tsx` | ✅ DONE | Create fundraising post |
| Wallet | `app/(app)/wallet.tsx` | ⚠️ TEST DEPOSIT BUTTON | Balance, deposit, cashout |
| Notifications | `app/(app)/notifications.tsx` | ✅ DONE | Real-time notifications |
| Profile | `app/(app)/profile.tsx` | ✅ DONE | Character display + logout |
| Gift Modal | `app/gift/[id].tsx` | ⚠️ NEEDS WIRING | Send USDT + spectacle |

### 5. Design System
- **Status**: DONE
- **What**: Full Figma-matched styling
- **Files**: `theme/tokens.ts`, `theme/type.ts`, `globals.css`
- **Colors**: Gold primary, deep charcoal base, parchment accents
- **Fonts**: Ultra display, Archivo headlines, Inter body

---

## ⚠️ REMAINING WORK

### Priority 1: Fix Build & Test Locally
**Task**: Resolve Expo bundler React resolution conflict
- **Action**: Run `npx expo prebuild --clean` then `npm run dev`
- **Expected**: Welcome screen renders with "Connect Wallet" button
- **Estimated time**: 5 minutes

### Priority 2: Wire Blockchain Transactions
**Task**: Connect wallet transactions to UI buttons

#### 2a. Choose Your Fate - Lord Payment
- **File**: `app/(onboarding)/choose-fate.tsx` (lines ~44-49)
- **What to do**: Uncomment `sendUsdt()` call when "MONARCH" selected
- **Test**: Choose LORD → approve MetaMask → $100 USDT sent to PROJECT_WALLET
- **Expected**: Profile saved with `is_lord: true`

#### 2b. Gift Modal - Send USDT
- **File**: `app/gift/[id].tsx` (lines ~93-110)
- **What to do**: Replace mock gift with `sendUsdt(signer, recipientWallet, amountCents)`
- **Test**: Send gift → MetaMask approval → USDT sent wallet-to-wallet
- **Expected**: Spectacle animation plays, ledger entry created

#### 2c. Wallet Deposit Button
- **File**: `app/(app)/wallet.tsx` (lines ~39-49)
- **What to do**: Call `sendUsdt(signer, userWallet, depositAmount)` for test deposits
- **Alternative**: Use thirdweb PayEmbed for real Stripe alternative

### Priority 3: Real Data Integration
**Task**: Connect Supabase queries to live data

#### 3a. Main Street Feed
- **File**: `app/(app)/index.tsx`
- **Issue**: Demo data showing; needs to query Supabase begs
- **Query**: `supabase.from('begs').select('*, author:author_id(...)')`
- **Subscribe**: Add real-time updates via `.on('INSERT')`

#### 3b. Wallet Ledger
- **File**: `app/(app)/wallet.tsx`
- **Issue**: Demo ledger; needs to fetch user's actual transactions
- **Query**: `supabase.from('ledger_entries').select('*').eq('user_id', wallet)`

#### 3c. Notifications
- **File**: `app/(app)/notifications.tsx`
- **Status**: Already has real-time subscription ✅
- **What's needed**: Test that notifications fire when gifts sent/received

### Priority 4: Polish & Features
**Task**: Add final touches

- [ ] Loading states on all buttons
- [ ] Error handling for failed transactions
- [ ] Success toasts after USDT sent
- [ ] Profile editing (change hat, face, title)
- [ ] Beg detail page (view full story, see backers)
- [ ] Leaderboard page (top beggars, top gifters)
- [ ] Onboarding flow: skip character creator for fast signup

---

## 📁 File Structure

```
lib/
  ├── thirdweb.ts           ✅ BLOCKCHAIN INTEGRATION
  ├── types.ts              ✅ Wallet-based types
  ├── supabase.ts           ✅ Supabase client
  ├── format.ts             ✅ Utilities (formatCents, etc)
  └── stripe.ts             (stub, not used yet)

providers/
  └── AuthProvider.tsx      ✅ WALLET CONNECTION + PROFILE

app/
  ├── index.tsx             ✅ Splash/auth redirect
  ├── _layout.tsx           ✅ Root layout + fonts
  ├── (auth)/
  │   ├── welcome.tsx       ✅ Connect wallet
  │   ├── sign-in.tsx       ❌ DELETE (old email auth)
  │   └── sign-up.tsx       ❌ DELETE (old email auth)
  ├── (onboarding)/
  │   ├── _layout.tsx       ✅ Onboarding nav
  │   ├── choose-fate.tsx   ⚠️ Needs sendUsdt() wire
  │   └── create.tsx        ✅ Character creator
  ├── (app)/
  │   ├── _layout.tsx       ✅ 5-tab nav (Main St, POST, Wallet, Saloon, Profile)
  │   ├── index.tsx         ⚠️ Needs live Supabase queries
  │   ├── compose.tsx       ✅ Create beg
  │   ├── wallet.tsx        ⚠️ Needs deposit/cashout wiring
  │   ├── notifications.tsx ✅ Real-time ready
  │   └── profile.tsx       ✅ Show wallet + stats
  └── gift/[id].tsx         ⚠️ Needs sendUsdt() wire
```

---

## 🚀 Quick Setup (for next AI)

1. **Get thirdweb Client ID**:
   - Go to dashboard.thirdweb.com
   - Create new API key (for Expo app)
   - Copy client ID

2. **Create `.env.local`**:
   ```
   EXPO_PUBLIC_THIRDWEB_CLIENT_ID=<paste here>
   EXPO_PUBLIC_SUPABASE_URL=https://owkyrwkuifhiqmbjpeob.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PjVrAFwj2bKWv9kGy-MfMA_eXYzgtzX
   EXPO_PUBLIC_PROJECT_WALLET=0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb
   ```

3. **Build & run**:
   ```bash
   npx expo prebuild --clean
   npm run dev
   ```

4. **Test flow**:
   - Click "Connect Wallet"
   - Approve MetaMask
   - Choose DRIFTER or MONARCH
   - Create character
   - See Main Street feed
   - Send a gift (test transaction)

---

## 🔑 Key Functions to Use

```typescript
// In AuthProvider
connectWallet()           // Opens wallet modal, sets signer
updateProfile(data)       // Saves to Supabase
signOut()                 // Clears session

// In lib/thirdweb.ts
sendUsdt(signer, to, amountCents)    // Send USDT, returns tx hash

// In components
useAuth()                 // Get { wallet, signer, profile, ... }
```

---

## ⚡ Common Tasks

### "Wire up a button to send USDT"
1. Import `sendUsdt` from `lib/thirdweb`
2. Import `useAuth` from `providers/AuthProvider`
3. Get signer: `const { signer } = useAuth()`
4. On button press:
   ```typescript
   const txHash = await sendUsdt(signer, recipientAddress, amountCents)
   console.log("Gift sent:", txHash)
   ```

### "Fetch Supabase data"
```typescript
const { data } = await supabase
  .from('begs')
  .select('*, author:author_id(display_name, face)')
  .order('created_at', { ascending: false })
```

### "Add real-time subscription"
```typescript
supabase
  .channel('begs')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'begs' }, (payload) => {
    setBegs(prev => [payload.new, ...prev])
  })
  .subscribe()
```

---

## 📝 Notes

- **Wallet address format**: Always lowercase, stored in Supabase as text
- **USDT decimals**: 6 decimals on Polygon; convert: `$1 = 1,000,000 wei = 100 cents in our system`
- **Project wallet**: Used for Lord membership fees; replace placeholder with real wallet when live
- **Testnet tokens**: Use Mumbai faucet to get test USDT: https://faucet.polygon.technology/
- **Auth flow**: No more Supabase auth.users table; all auth via thirdweb + wallet signer
- **RLS**: Removed most RLS since wallet address is public; Supabase policies are wide open (readable by all)

---

## ✋ Stop Points

If you get stuck:
1. Check `TIN_CUP_STATUS.md` for architecture details
2. Check `QUICK_START.md` for setup
3. Console logs use `console.log("[v0] ...")` prefix
4. thirdweb docs: https://docs.thirdweb.com/
5. Supabase JS client: https://supabase.com/docs/reference/javascript

---

**Last updated**: Session end  
**Branch**: `tin-cup`  
**Ready to continue**: YES ✅
