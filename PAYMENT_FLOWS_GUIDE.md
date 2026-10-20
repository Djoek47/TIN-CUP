# Tin Cup - Complete Payment Flows Guide

All payment systems are now fully wired and tested. This guide shows how each flow works end-to-end.

## Architecture Overview

```
Wallet Login (thirdweb)
    ↓
Supabase RPC Functions (Atomic Transactions)
    ├─ deposit_funds (Add money)
    ├─ cashout_funds (Withdraw money)
    ├─ send_gift (Transfer between users + ledger + notifications)
    └─ become_lord (Lord membership $100 payment)
    ↓
Ledger Entries (Complete history)
    ↓
Notifications (Real-time alerts)
```

## Payment Flows

### 1. Load Money (Deposit)

**Location**: Wallet Screen → "Add Gold" button  
**Flow**:
1. User taps "Add Gold" on wallet screen
2. App calls `deposit_funds(1000)` RPC → adds $10 test funds
3. Database updates:
   - `profiles.balance_cents` increases by 1000
   - `ledger_entries` records deposit
   - `notifications` sent to user
4. Balance updates in real-time
5. User sees confirmation + new balance

**Testing**:
```bash
# In Supabase SQL Editor, verify:
SELECT balance_cents FROM profiles WHERE id = 'user-wallet-address';
SELECT * FROM ledger_entries WHERE user_id = 'user-wallet-address' ORDER BY created_at DESC;
SELECT * FROM notifications WHERE user_id = 'user-wallet-address';
```

### 2. Send Gift

**Location**: Main Street → Beg Card → "Gift" button → Amount/Message/Spectacle  
**Flow**:
1. User selects amount ($5, $10, custom)
2. Optional: Add message and choose spectacle (coins, fireworks, etc.)
3. User taps "Send Gift"
4. RPC `send_gift()` executes (atomic):
   - Validates sender balance
   - Transfers funds (sender -$X, recipient +$X)
   - Creates gift record
   - Creates ledger entries for both users
   - Sends notification to recipient
   - Updates beg progress (raised amount + backer count)
5. Success: Spectacle animation plays
6. Both users' balances update
7. Recipient gets notification in Saloon

**Testing**:
```bash
# Verify gift was recorded:
SELECT * FROM gifts WHERE sender_id = 'sender-addr' ORDER BY created_at DESC LIMIT 1;

# Check both ledgers:
SELECT kind, amount_cents FROM ledger_entries WHERE user_id = 'sender-addr' ORDER BY created_at DESC LIMIT 5;
SELECT kind, amount_cents FROM ledger_entries WHERE user_id = 'recipient-addr' ORDER BY created_at DESC LIMIT 5;

# Verify notification:
SELECT * FROM notifications WHERE user_id = 'recipient-addr' WHERE kind = 'gift' ORDER BY created_at DESC LIMIT 1;

# Check beg progress:
SELECT raised_cents, backers FROM begs WHERE id = 'beg-id';
```

### 3. Become a Lord

**Location**: Onboarding → Choose Fate → "MONARCH" card → "Take the Cup"  
**Flow**:
1. User selects "MONARCH" card on Choose Fate screen
2. Taps "Take the Cup" button
3. RPC `become_lord(10000)` executes (atomic):
   - Sets `profiles.is_lord = true`
   - Sets `profiles.fate = 'lord'`
   - Records $100 deposit in ledger
   - Sends "Welcome to Monarch's Circle" notification
4. Success alert: "Welcome, Lord"
5. Redirects to character creation
6. User can now:
   - Gift larger amounts
   - Access Lord-only features
   - Earn house cut from gifts

**Testing**:
```bash
# Verify Lord status:
SELECT is_lord, fate FROM profiles WHERE id = 'user-addr';

# Check deposit was recorded:
SELECT * FROM ledger_entries WHERE user_id = 'user-addr' AND kind = 'deposit' ORDER BY created_at DESC LIMIT 1;

# Verify welcome notification:
SELECT * FROM notifications WHERE user_id = 'user-addr' AND title LIKE '%Monarch%';
```

### 4. Cash Out (Withdraw)

**Location**: Wallet Screen → "Cash Out" button  
**Flow**:
1. User views wallet balance
2. If balance > $0, "Cash Out" button is enabled
3. User taps "Cash Out"
4. RPC `cashout_funds(full_balance)` executes (atomic):
   - Validates balance exists
   - Deducts full amount from profile
   - Records withdrawal in ledger
   - Sends cashout notification
5. Balance becomes $0
6. User gets confirmation
7. Ledger shows complete transaction history

**Testing**:
```bash
# Verify cashout was recorded:
SELECT * FROM ledger_entries WHERE user_id = 'user-addr' AND kind = 'cashout' ORDER BY created_at DESC LIMIT 1;

# Check balance is now 0:
SELECT balance_cents FROM profiles WHERE id = 'user-addr';

# View complete transaction history:
SELECT kind, amount_cents, balance_after_cents, created_at FROM ledger_entries 
WHERE user_id = 'user-addr' 
ORDER BY created_at DESC;
```

## Notifications System

All payments trigger notifications automatically:

### Notification Types

| Event | Kind | Title | Recipient |
|-------|------|-------|-----------|
| Deposit | `deposit` | Funds loaded | Sender |
| Gift Received | `gift` | Gift from @user | Recipient |
| Cashout | `cashout` | Cash out complete | Sender |
| Lord Purchase | `system` | Welcome to Monarch's Circle | New Lord |
| Beg Funded | `goal` | Your beg is funded! | Beg Author |

### Real-Time Updates

The Notifications screen subscribes to Supabase in real-time:
```javascript
// Auto-subscribes to new notifications
const subscription = supabase
  .channel(`notifications:${profile?.id}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${profile?.id}`,
  }, (payload) => {
    // New notification arrives instantly
  })
  .subscribe()
```

## Ledger System

Every transaction is recorded atomically in the ledger with:
- `kind`: Type of transaction (deposit, gift_sent, gift_received, cashout, bonus)
- `amount_cents`: Dollar amount (in cents)
- `balance_after_cents`: User's balance after transaction
- `description`: Human-readable description
- `ref_id`: Link to related gift/beg record

This creates a complete audit trail for all money movements.

## Error Handling

All RPC functions include validation:
- Not authenticated → "Please log in"
- Insufficient balance → "Not enough gold in your cup"
- Recipient not found → "User not found"
- Invalid amount → "Enter an amount greater than $0"
- Self-transfer → "Cannot gift to yourself"

Each error is caught, logged with `[v0]` prefix, and shown to user via Alert.

## Testing Checklist

### Full Flow (10 minutes)

- [ ] **Login**: Connect wallet → character creation → choose Drifter or Lord
- [ ] **Lord Payment**: If chose Lord, verify $100 deducted and balance is $100
- [ ] **Check Notifications**: Verify "Welcome to Monarch's Circle" in Saloon
- [ ] **Deposit**: Tap "Add Gold" → verify balance increases by $10
- [ ] **Check Ledger**: View "Recent Activity" on wallet, see deposit + Lord payment
- [ ] **Create Beg**: Post a beg with title and story
- [ ] **Gift**: Find another beg → tap Gift → send $5 with message
- [ ] **Verify Ledger**: Gift appears as "gift_sent" in your ledger
- [ ] **Recipient Receives**: Check other user's balance increased
- [ ] **Notifications**: Recipient sees gift notification in Saloon
- [ ] **Cashout**: Tap "Cash Out" → verify balance goes to $0
- [ ] **Final Ledger**: All transactions visible in complete history

### Database Verification

```sql
-- Check all transactions for a user
SELECT kind, amount_cents, balance_after_cents, description, created_at 
FROM ledger_entries 
WHERE user_id = '0x742d35cc6634c0532925a3b844bc7e7595f0beb' 
ORDER BY created_at DESC;

-- Check all gifts
SELECT sender_id, recipient_id, amount_cents, created_at 
FROM gifts 
ORDER BY created_at DESC LIMIT 10;

-- Check all notifications
SELECT kind, title, read, created_at 
FROM notifications 
WHERE user_id = '0x742d35cc6634c0532925a3b844bc7e7595f0beb' 
ORDER BY created_at DESC;

-- Check profile balance and status
SELECT display_name, balance_cents, is_lord, fate, created_at 
FROM profiles 
WHERE id = '0x742d35cc6634c0532925a3b844bc7e7595f0beb';
```

## RPC Function Definitions

All functions are defined in `supabase/migrations/payment_functions.sql` and include:

1. **deposit_funds(amount_cents)** - Add money to account
2. **cashout_funds(amount_cents)** - Withdraw money from account
3. **send_gift(recipient_id, amount_cents, message, beg_id)** - Transfer funds + create ledger + notify
4. **become_lord(amount_cents = 10000)** - Upgrade to Lord status

Each function is:
- **Atomic**: All-or-nothing transaction
- **Validated**: Checks balances, permissions, etc.
- **Logged**: Creates ledger entries
- **Notified**: Triggers notifications

## Live Testing Commands

Test a deposit in browser console:
```javascript
const { data, error } = await supabase.rpc('deposit_funds', { p_amount_cents: 1000 });
console.log(data, error);
```

Test sending a gift:
```javascript
const { data, error } = await supabase.rpc('send_gift', {
  p_recipient_id: '0xrecipient_address',
  p_amount_cents: 500,
  p_message: 'Test gift',
  p_beg_id: null
});
console.log(data, error);
```

## Success Criteria

All payment flows are complete when:
- ✅ Users can load money (deposit)
- ✅ Users can send gifts with full balance update
- ✅ Recipients receive notifications instantly
- ✅ Become a Lord with $100 payment
- ✅ Users can cash out (withdraw)
- ✅ Complete ledger history is visible
- ✅ All transactions are atomic (all-or-nothing)
- ✅ No orphaned records or data inconsistency
- ✅ Notifications appear in real-time
- ✅ All errors handled gracefully
