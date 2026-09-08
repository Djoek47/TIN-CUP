# TestFlight — tonight

## Apple credentials (required for TestFlight)

Non-interactive cloud builds need App Store Connect API access. Add these Cloud Agent secrets:

| Secret | What it is |
|---|---|
| `EXPO_TOKEN` | Expo access token (done) |
| `EXPO_ASC_KEY_ID` | App Store Connect API Key ID |
| `EXPO_ASC_ISSUER_ID` | App Store Connect Issuer ID |
| `EXPO_ASC_API_KEY_P8` | Full contents of the `.p8` private key |

Create the key: [App Store Connect → Users and Access → Integrations → App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api)

One-time alternative on your Mac (stores creds on Expo servers):
```bash
eas credentials -p ios
eas build -p ios --profile production
```

## Cloud Agent secret

Add Cursor Cloud Agent secret **`EXPO_TOKEN`** (Expo → Account → Access Tokens).
Never commit it. After adding, restart the agent so the env picks it up, then:

```bash
npm run eas:whoami
npm run eas:build:ios
```

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
