# Tin-Cup-V2 Make → Expo Router map

Source of truth: [`Tin-Cup-V2-App.tsx`](./Tin-Cup-V2-App.tsx)

| Make screen / tab / sub | Expo route |
|---|---|
| `splash` | `app/index.tsx` |
| `welcome` | `app/(auth)/welcome.tsx` |
| `chooseFate` | `app/(onboarding)/choose-fate.tsx` |
| `characterCreator` | `app/(onboarding)/create.tsx` |
| tab `mainStreet` | `app/(app)/index.tsx` |
| tab `feed` | `app/(app)/search.tsx` → **renamed UX to Feed** (`app/(app)/feed.tsx`) |
| tab `lobbies` | `app/(app)/leaderboard.tsx` → **Lobby** (`app/(app)/lobbies.tsx`) |
| tab `profile` | `app/(app)/profile.tsx` |
| sub `composer` | `app/(app)/compose.tsx` |
| sub `wallet` | `app/(app)/wallet.tsx` |
| sub `deposit` | `app/(app)/deposit.tsx` |
| sub `cashOut` | `app/(app)/cash-out.tsx` |
| sub `notifications` | `app/(app)/notifications.tsx` |
| sub `search` | `app/(app)/discover.tsx` |
| sub `leaderboard` | `app/(app)/leaderboard.tsx` |
| sub `liveStream` | `app/(app)/live-stream.tsx` |
| sub `begDetail` | `app/beg-details.tsx` |
| sub `challengeDetail` | `app/challenge-details.tsx` |
| sub `ascension` | `app/(app)/ascension.tsx` |
| sub `ponr` | `app/(app)/ponr.tsx` |
| Coronation overlay | `app/(app)/coronation.tsx` |

Nav labels (Make): Main St · Feed · Lobbies · Poster · center ActionOrb (cup / dynamite).
