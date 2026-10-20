# 0bol → Apple TestFlight

App Store Connect name: **0bol** · In-app wordmark: **0bol** · Bundle ID: `com.obol.app` · ASC App ID: `6822289532`

Expo Go is fine for **mock UI** smoke tests. Stripe + thirdweb need a **native iOS binary**.

## Path (no EAS required)

1. Put keys in `.env` (see `.env.example`).
2. Generate the iOS project once:

```bash
npx expo prebuild --platform ios --clean
```

3. Open in Xcode:

```bash
open ios/*.xcworkspace
```

4. Select your Team, set bundle id `com.obol.app`, confirm display name **0bol**, bump build number.
5. **Product → Archive**, then **Distribute App → App Store Connect → Upload**.
6. In App Store Connect → TestFlight (app **0bol**), add internal testers.

## App icon

Default store icon is `assets/icon.png` (= `icon-night-gold`). Light / marketing variants live under `assets/brand/obol/png/1024/`.

## Checklist before upload

- [ ] Splash shows 0bol coin mark + “A COIN FOR THE CROSSING”
- [ ] Wallet shows gold_mg + USD/CAD + escrow hold
- [ ] Settings toggles currency (USD/CAD) and mass unit (mg/g/kg/lb/oz)
- [ ] Lords cannot cash out; vagrants can
- [ ] Dual demo accounts: ENTER AS VAGRANT / ENTER AS LORD
- [ ] Stripe test deposit when `pk_test` set (card 4242…)
- [ ] Explicit user approval before any TestFlight submit

## Expo Go (optional)

```bash
npm run dev
```

Use only with `EXPO_PUBLIC_MONEY_MODE=mock`. Native wallet modules will not load in Expo Go.
