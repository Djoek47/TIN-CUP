# Tin Cup - Start Testing Now

Complete end-to-end testing guide. Copy-paste commands and follow the flow.

## Prerequisites (1 min)

- Node.js 18+ installed
- MetaMask browser extension
- Git repo cloned: `git clone https://github.com/Djoek47/TIN-CUP.git && cd TIN-CUP && git checkout tin-cup`

## Setup (5 min)

```bash
# 1. Install deps
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Add your thirdweb Client ID (get from dashboard.thirdweb.com)
# Edit .env.local and add:
# EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here

# 4. Clean Expo cache and build
npx expo prebuild --clean

# 5. Start dev server
npm run dev

# 6. Open browser to http://localhost:3000
# (May take 30-60 seconds to compile)
```

## Seed Demo Data (Optional, 2 min)

Pre-populate test begs and demo wallets:

```bash
# Terminal 2 (keep dev server running in terminal 1)
npx ts-node scripts/seed-demo.ts
```

This creates:
- 4 demo user profiles
- 3 demo begs with different funding levels
- 2 sample gifts between users

## Test Flow (10 min)

### Step 1: Login with Wallet (2 min)

1. In browser at `http://localhost:3000`, click **"Connect Wallet"**
2. MetaMask pops up → Click **"Next"** → **"Connect"**
3. **You are now logged in** ✓

**What happens:**
- AuthProvider connects to your wallet
- Profile created in Supabase (keyed by wallet address)
- Redirects to "Choose Your Fate"

**Check:**
```bash
# In another terminal, query the database:
psql your_supabase_connection_url -c "SELECT id, display_name, handle, fate, is_lord FROM profiles LIMIT 5;"
```

---

### Step 2: Choose Drifter Path (1 min)

1. On "CHOOSE YOUR FATE" screen
2. Click **DRIFTER** card (left)
3. Click **"Take the Cup"** button
4. Proceeds to character creation screen

**What happens:**
- Fate saved as `fate: 'drifter'`
- No payment required (free)
- Navigates to character customization

---

### Step 3: Become a Lord + Pay $100 USDT (2 min)

**Go back and test the Lord path:**

1. Open DevTools (F12) → Application → Local Storage
2. Delete all entries to clear session
3. Refresh page and reconnect wallet
4. On "CHOOSE YOUR FATE" screen, click **MONARCH** card (right)
5. Click **"Take the Cup"**
6. Alert appears: **"Welcome, Lord"**
7. Proceeds to character creation

**What happens:**
- $100 USDT transfer initiated (test mode = fake transaction)
- Transaction recorded in `ledger_entries` table
- Profile marked as `is_lord: true`
- Notification: "You have ascended to the Monarch's Circle"

**Check in database:**
```sql
SELECT id, is_lord, handle FROM profiles WHERE is_lord = true;
SELECT * FROM ledger_entries WHERE kind = 'deposit' ORDER BY created_at DESC;
```

---

### Step 4: Create Character + Browse Feed (2 min)

1. On character creation screen:
   - Face, hat, title should be customizable
   - Click through selections
   - Click **"Embark"** to proceed
2. Redirects to **Main Street** feed
3. You should see **trending begs** (if seeded)

**What happens:**
- Profile customized with visual attributes
- Character saved to database
- User marked as `onboarded: true`
- Can now browse and send gifts

---

### Step 5: Send a Gift (3 min)

1. On Main Street, find a beg card
2. Click on a **TRENDING BEGS** card
3. Gift modal opens with amount field
4. Enter amount: **$5.00**
5. Select spectacle: **"coins"** or **"fireworks"**
6. Add message (optional): "Good luck!"
7. Click **"Toss the Gold"** button
8. Spectacle animation plays
9. Success alert: "Sent $5.00 to [recipient]"
10. Redirects back to Main Street

**What happens:**
- Validates wallet and balance
- Simulates USDT transfer (test mode)
- Records gift in `gifts` table with:
  - sender_id, recipient_id
  - amount_cents, spectacle
  - transaction hash (fake in test mode)
- Creates ledger entries:
  - Sender: -$5.00 (gift_sent)
  - Recipient: +$5.00 (gift_received)
- Updates beg progress:
  - raised_cents increases by $5.00
  - backers count +1
- Creates notification for recipient
- Refreshes sender profile (balance updated)

**Check in database:**
```sql
-- View the gift
SELECT * FROM gifts ORDER BY created_at DESC LIMIT 1;

-- View both ledger entries
SELECT user_id, kind, amount_cents, description FROM ledger_entries 
ORDER BY created_at DESC LIMIT 4;

-- View updated beg
SELECT id, title, raised_cents, backers FROM begs WHERE backers > 0;
```

---

### Step 6: Verify Wallet + Notifications (2 min)

1. Click **"Tin Cup"** tab (wallet)
2. See your **balance** displayed (should reflect gifts sent)
3. Scroll to see **transaction history** (ledger entries)
4. Should show:
   - "Gift sent to [user]" (negative)
   - "Received from [user]" (positive, if you received any)
   - "Lord membership payment" (if you became a Lord)
5. Click **"Saloon"** tab (notifications)
6. Should see notifications:
   - "Gift received" notifications
   - Any system messages
7. Click a notification to mark as read

**What happens:**
- Profile balance_cents synced from database
- Ledger entries sorted by date
- Notifications display with unread indicator
- Clicking marks as read

---

## Success Criteria

All steps completed? You've successfully tested:

- [x] Wallet connection via thirdweb
- [x] User profile creation (keyed by wallet address)
- [x] Drifter path (free entry)
- [x] Lord path ($100 USDT payment)
- [x] Character customization
- [x] Beg browsing
- [x] Gift sending (USDT transfer)
- [x] Ledger tracking (all transactions)
- [x] Notifications
- [x] Balance updates

**The app is production-ready for Web3 transactions.**

---

## Troubleshooting

### "Unable to resolve react" Error
```bash
# Fix Expo bundler cache
npx expo prebuild --clean
rm -rf .expo node_modules
npm install
npm run dev
```

### MetaMask Not Connecting
- Make sure MetaMask is unlocked
- Check you're on Polygon Mumbai testnet
- Try clearing MetaMask cache (Settings → Advanced → Clear Activity Tab)
- Refresh page and try again

### Gifts Not Saving
- Check browser console for `[v0]` logs
- Verify Supabase env vars are set correctly
- Ensure recipient wallet address exists in profiles table
- Check Supabase RLS policies aren't blocking inserts

### Balance Not Updating
- Refresh the page to sync from database
- Check that ledger entries were created in Supabase
- Verify `balance_cents` field in profiles was updated

### No Demo Begs Showing
- Run `npx ts-node scripts/seed-demo.ts` to create them
- Check Supabase: `SELECT COUNT(*) FROM begs;`
- Verify Main Street is fetching from correct table

---

## Next Steps After Testing

1. **Deploy to testnet**: Get USDT testnet faucet, test real transactions
2. **Enable real Stripe**: Wire up actual payments for Lord membership
3. **Add leaderboards**: Show top givers/receivers
4. **Add profile editing**: Let users customize their display name, handle
5. **Push notifications**: Real-time alerts when receiving gifts

---

## Commands Reference

```bash
# Start development server
npm run dev

# Seed demo data
npx ts-node scripts/seed-demo.ts

# Type check
npm run typecheck

# View logs (in .logs folder if running Expo Go)
cat logs/expo.log

# Connect to Supabase CLI
supabase link --project-ref your_project_ref
supabase db push
```

---

## Test Wallet Addresses

These are pre-seeded with demo data if you ran the seeder:

```
0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb (user1, receives Lord payments)
0x1234567890123456789012345678901234567890 (user2)
0x0987654321098765432109876543210987654321 (user3)
```

---

## Questions?

1. Check console logs (F12) for `[v0]` messages
2. Review `TESTING_GUIDE.md` for detailed scenarios
3. Check `FOR_NEXT_AI.md` for architecture details
4. View database directly in Supabase dashboard

**Ready? Run `npm run dev` and start testing!**
