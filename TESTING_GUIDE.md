# Tin Cup - Complete Testing Guide

Test the entire app flow with mock USDT transfers on Polygon Mumbai testnet.

## Quick Start (5 min)

```bash
# 1. Install and setup
npm install
cp .env.example .env.local
# Add EXPO_PUBLIC_THIRDWEB_CLIENT_ID to .env.local

# 2. Seed demo data
npx ts-node scripts/seed-demo.ts

# 3. Start dev server
npx expo prebuild --clean
npm run dev

# 4. Test in browser at localhost:3000
```

## Test Wallets

Use these addresses for testing (pre-generated with demo data):

```
user1: 0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb
user2: 0x1234567890123456789012345678901234567890
user3: 0x0987654321098765432109876543210987654321
project: 0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb (receives Lord payments)
```

## Testing Scenarios

### Scenario 1: Login + Browse as Drifter (2 min)

1. Click "Connect Wallet" → Use MetaMask to connect with user1
2. Should redirect to "Choose Your Fate"
3. Select DRIFTER (free) → Click "Take the Cup"
4. Continue to character creation
5. Verify profile shows in database with `is_lord: false`

**Expected**: Profile created, navigates to Main Street

---

### Scenario 2: Become a Lord + Pay $100 USDT (3 min)

1. Connect wallet (new session or user2)
2. On "Choose Your Fate" → Select MONARCH
3. Click "Take the Cup" → Triggers $100 USDT transfer
4. **In test mode**: Simulates payment with fake tx hash
5. Creates ledger entry for the $100 payment
6. Redirects to character creation
7. Check Supabase: profile should have `is_lord: true`

**Expected**: Transaction recorded, profile marked as Lord, success alert shown

---

### Scenario 3: Send Gift to Another User (5 min)

1. Login as user1 (Drifter)
2. Navigate to Main Street
3. Click on a beg (pre-seeded demo begs should appear)
4. Click "Toss the Gold" button
5. Enter amount: $5.00
6. Select spectacle: "coins"
7. Add message: "Good luck!"
8. Click "Toss the Gold"
9. **In test mode**: Simulates USDT transfer
10. Verifies recipient wallet address exists
11. Records gift in `gifts` table
12. Creates ledger entries for both sender (negative) and recipient (positive)
13. Updates beg progress (raised_cents, backers)
14. Creates notification for recipient
15. Shows success alert with spectacle animation

**Expected**: 
- Gift recorded in database
- Both users have ledger entries
- Beg progress updated
- Recipient receives notification
- Profile balances updated

---

### Scenario 4: Check Wallet + Ledger History (2 min)

1. Navigate to Wallet tab
2. See balance (should show balance_cents from profile)
3. Click "Add Gold" button (test: adds $10)
4. Verify balance increased
5. Scroll down to see transaction history
6. Should show:
   - Gift sent (negative amount)
   - Gift received (positive amount)
   - Deposits (positive)

**Expected**: All transactions appear in ledger, balance updates correctly

---

### Scenario 5: Notifications (2 min)

1. Navigate to Saloon (Notifications)
2. Should see notifications from:
   - Gifts received
   - System messages
3. Click notification to mark as read
4. Check that unread count decreases

**Expected**: Notifications display, read status updates

---

## Debugging

### Check Console Logs

All major operations log with `[v0]` prefix:

```
[v0] Sending gift: ...
[v0] Test transaction created: ...
[v0] Gift recorded in database
[v0] Choose fate error: ...
```

### Verify Database State

Check Supabase directly:

```sql
-- View all profiles
SELECT * FROM profiles;

-- View all gifts
SELECT g.*, 
  p1.display_name as sender_name,
  p2.display_name as recipient_name
FROM gifts g
JOIN profiles p1 ON g.sender_id = p1.id
JOIN profiles p2 ON g.recipient_id = p2.id;

-- View ledger for a user
SELECT * FROM ledger_entries 
WHERE user_id = '0x742d35Cc6634C0532925a3b844Bc7e7595f0bEb'
ORDER BY created_at DESC;

-- View begs and progress
SELECT id, title, goal_cents, raised_cents, backers, status 
FROM begs 
ORDER BY created_at DESC;
```

### Common Issues

**"Wallet not connected"**
- Make sure MetaMask is installed and unlocked
- Check that you're on Polygon Mumbai testnet
- Try refreshing the page

**"Not enough gold in your cup"**
- This is correct - you can't send more than your balance
- In test mode, use the Wallet "Add Gold" button to add demo funds

**Gift not appearing**
- Check browser console for `[v0]` logs
- Verify Supabase is accessible (check env vars)
- Confirm recipient wallet exists in profiles table

**Spectacle animation not showing**
- Check browser console for errors
- Animation requires BlurView component to render
- Try different spectacle type

---

## Real Blockchain Testing (Optional)

When ready to test with real USDT on Polygon Mumbai:

1. Add `EXPO_PUBLIC_THIRDWEB_PRIVATE_KEY` to `.env.local`
2. Get test USDT from faucet: https://mumbai-faucet.polygon.technology/
3. In `lib/thirdweb.ts`, remove the test mode check
4. Run transactions - they'll be recorded on-chain

---

## End-to-End Test Checklist

- [ ] User can connect wallet and login
- [ ] User can choose Drifter (free) path
- [ ] User can choose Lord ($100 payment) path
- [ ] Lord payment creates ledger entry
- [ ] User can browse begs on Main Street
- [ ] User can send gift to another user
- [ ] Gift updates recipient's balance
- [ ] Gift updates beg progress
- [ ] Recipient receives notification
- [ ] Wallet shows correct balance
- [ ] Ledger shows all transactions
- [ ] Notifications center displays all events

---

## Performance Notes

- **Load begs**: ~500ms (Supabase query + relations)
- **Send gift**: ~1.5s (test mode simulation)
- **Lord payment**: ~500ms (test mode simulation)
- **Refresh profile**: ~300ms

In production with real blockchain, add 15-30s for transaction confirmation.
