# Expo OTA (no Apple distribution yet)

Apple TestFlight / Distribution Certificate is deferred. Use **Expo Go + EAS Update** (and/or a live tunnel) for now.

## Project
- Expo account: `djoek47`
- Project: [@djoek47/tin-cup](https://expo.dev/accounts/djoek47/projects/tin-cup)
- Project ID: `8f127ab8-eec3-4110-8492-b1ce0cb7739c`

## Open in Expo Go (live tunnel)
```bash
npm install --legacy-peer-deps
npm run dev
```
Scan the QR with Expo Go (SDK 57).

## Publish an OTA update
Requires `EXPO_TOKEN` in the environment:
```bash
npm run update:preview
```
Then open the update from the Expo dashboard → project → Updates, or:
`https://expo.dev/accounts/djoek47/projects/tin-cup/updates`

## Later (Apple distribution)
When ready for TestFlight, add ASC API secrets / run `eas credentials -p ios`, then:
```bash
npm run eas:build:ios
npm run eas:submit:ios
```
