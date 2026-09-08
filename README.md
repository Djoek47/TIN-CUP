# Tin Cup — The Vessel (Expo)

Live social-giving. Two castes: **Vagrant** (receive) and **Lord** (give). Amber = given. Lime = received.

## Try it now (no Apple distribution)

**OTA update published** to branch `preview` (SDK 54):

https://expo.dev/accounts/djoek47/projects/tin-cup/updates/b94a205f-6b37-4166-bd96-a42dd2b53731

Or run a live tunnel:

```bash
npm install --legacy-peer-deps
npm run dev
```

Open in **Expo Go (SDK 54)** via QR / tunnel URL.

See [docs/OTA.md](docs/OTA.md).

## Money
Default mock wallet: `TEST WALLET · FAKE MONEY`. Optional Base Sepolia when `EXPO_PUBLIC_MONEY_MODE=testnet` + thirdweb client id.

## Apple TestFlight
Deferred until you create distribution credentials. Then follow [docs/TESTFLIGHT.md](docs/TESTFLIGHT.md).

## Stack
Expo Router 54 · Vessel dual-caste UI · mock wallet · EAS Update · camera/LiveKit fallback
