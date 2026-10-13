# Obol

> A coin for the crossing.

Live social-giving. Two castes: **Vagrant** (receive) and **Lord** (give). Amber = given. Lime = received. Balances are **reference gold** (`gold_mg`) convertible to g / kg / lb / oz from USD or CAD. Funds sit in **platform escrow** until gifted or cashed out.

## Brand

| Surface | Name |
|---------|------|
| App Store / home screen | **0bol** |
| In-app wordmark | **0bol** |
| Bundle ID | `com.obol.app` |

Unified coin mark — liquid surface locked at **y=56** across all modes (day/night, vagrant/lord, arrival/handoff/crossing). Assets live in [`assets/brand/obol/`](assets/brand/obol/).

## Stack

Expo Router · Vessel dual-caste UI · Supabase ledger · Stripe + thirdweb rails · mock wallet by default

## Branches

Daily integration lives on **`Slack/make-vN`** (current: `Slack/make-v2`).  
**Never submit TestFlight** unless the user explicitly approves in-thread.

## Money

| Mode | Env | Behavior |
|------|-----|----------|
| `mock` | default without Stripe pk | Local escrow mint/burn |
| `auto` | when `pk_test` present | Stripe PaymentSheet if ready, else mock |
| `stripe` | `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Fiat deposit via PaymentSheet |
| `thirdweb` | `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` | USDT ↔ treasury escrow |

Secrets: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` (Supabase edge), plus Supabase URL/anon.

```bash
npm run seed:demo      # @dusty (vagrant) + @baron (lord) with mock gold
npm run qa:mock        # typecheck + route matrix + money smoke
npm run stripe:check   # verify pk + edge PaymentIntent path
```

## Run (Expo Go — mock UI only)

```bash
npm install --legacy-peer-deps
npm run dev
```

Full thirdweb/Stripe needs a **native iOS build** (see [docs/TESTFLIGHT.md](docs/TESTFLIGHT.md)).

## TestFlight

Native archive via Xcode → App Store Connect. Not Expo Go for production money rails.
