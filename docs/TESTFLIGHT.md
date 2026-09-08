# TestFlight — tonight

## Prerequisites (on your Mac)
1. Apple Developer account membership
2. App created in App Store Connect (`com.tincup.app`)
3. `eas-cli` logged in: `npm i -g eas-cli && eas login`

## Build & submit
```bash
cd TIN-CUP
git checkout cursor/vessel-testflight-mvp-78c3
git pull
npm install --legacy-peer-deps
# edit eas.json → submit.production.ios.ascAppId
eas build -p ios --profile production
eas submit -p ios --profile production
```

## What testers get
- Vessel dual-caste UI (Vagrant lime / Lord gold)
- Mock wallet with fake money by default
- Camera fallback for Go Live / Live (LiveKit when env set)
- Full 23-screen navigation loop

## Optional env for device build
Set in EAS secrets / `.env.local` before build:
- `EXPO_PUBLIC_MONEY_MODE=testnet` + thirdweb client id for Base Sepolia
- `EXPO_PUBLIC_LIVEKIT_URL` + `EXPO_PUBLIC_LIVEKIT_TOKEN_URL` for real rooms
