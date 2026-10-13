# Obol

> A coin for the crossing.

Live social-giving. Two castes: **Vagrant** (receive) and **Lord** (give). Amber = given. Lime = received. Balances are **reference gold** (`gold_mg`) convertible to g / kg / lb / oz from USD or CAD. Funds sit in **platform escrow** until gifted or cashed out.

## Brand

| Surface | Name |
|---------|------|
| App Store / home screen | **0bol** |
| In-app wordmark | **OBOL** |
| Bundle ID | `com.obol.app` |

Unified coin mark — liquid surface locked at **y=56** across all modes (day/night, vagrant/lord, arrival/handoff/crossing). Assets live in [`assets/brand/obol/`](assets/brand/obol/).

## Stack

Expo Router · Vessel dual-caste UI · Supabase ledger · Stripe + thirdweb rails · mock wallet by default

## Money

| Mode | Env | Behavior |
|------|-----|----------|
| `mock` | default | Local escrow mint/burn |
| `stripe` | `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Fiat deposit / Connect cash-out |
| `thirdweb` | `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` | USDT ↔ treasury escrow |

Copy [`.env.example`](.env.example) → `.env` and paste keys when ready.

## Run (Expo Go — mock UI only)

```bash
npm install --legacy-peer-deps
npm run dev
```

Full thirdweb/Stripe needs a **native iOS build** (see [docs/TESTFLIGHT.md](docs/TESTFLIGHT.md)).

## TestFlight

Native archive via Xcode → App Store Connect. Not Expo Go for production money rails.
