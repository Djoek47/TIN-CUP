# Tin Cup — The Vessel (Expo)

Live social-giving. Two castes: **Vagrant** (receive) and **Lord** (give). Design: money is light in glass. Amber = given. Lime = received.

## Tonight TestFlight MVP

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
npm run dev
```

Flow: Splash → Get Started → Connect → Verify → Choose Fate → Home  
Mock wallet is default (`TEST WALLET · FAKE MONEY`).

### TestFlight (you run locally with Apple creds)

```bash
npm i -g eas-cli
eas login
eas build:configure
eas build -p ios --profile production
eas submit -p ios --profile production
```

Set `submit.production.ios.ascAppId` in `eas.json` to your App Store Connect app id.

### Env

| Var | Purpose |
|---|---|
| `EXPO_PUBLIC_MONEY_MODE` | `mock` (default) or `testnet` |
| `EXPO_PUBLIC_THIRDWEB_CLIENT_ID` | Enables testnet rail (Base Sepolia) |
| `EXPO_PUBLIC_USDT_ADDRESS` / `EXPO_PUBLIC_TREASURY_ADDRESS` | Test USDC + Lord stake |
| `EXPO_PUBLIC_LIVEKIT_URL` / `EXPO_PUBLIC_LIVEKIT_TOKEN_URL` | Live video; camera fallback if unset |

Design source: `docs/redesign/`

### Scripts

- `npm run dev` — Expo tunnel
- `npm run build:ios` — EAS production iOS build
