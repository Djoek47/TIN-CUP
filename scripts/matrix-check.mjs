#!/usr/bin/env node
/**
 * Static matrix: every app route file exists + key handlers reference expected APIs.
 * Run: node scripts/matrix-check.mjs
 */
import fs from "node:fs"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const routes = [
  "app/index.tsx",
  "app/(auth)/welcome.tsx",
  "app/(auth)/sign-in.tsx",
  "app/(auth)/verify.tsx",
  "app/(onboarding)/choose-fate.tsx",
  "app/(onboarding)/create.tsx",
  "app/(app)/index.tsx",
  "app/(app)/live.tsx",
  "app/(app)/wallet.tsx",
  "app/(app)/profile.tsx",
  "app/(app)/send.tsx",
  "app/(app)/arena.tsx",
  "app/(app)/golive.tsx",
  "app/(app)/broadcast.tsx",
  "app/(app)/deposit.tsx",
  "app/(app)/cash-out.tsx",
  "app/(app)/activity.tsx",
  "app/(app)/received.tsx",
  "app/(app)/level.tsx",
  "app/(app)/leaderboard.tsx",
  "app/(app)/settings.tsx",
  "app/(app)/edit-profile.tsx",
  "app/(app)/notifications.tsx",
  "app/(app)/compose.tsx",
  "app/(app)/ascension.tsx",
  "app/(app)/ponr.tsx",
  "app/(app)/coronation.tsx",
  "app/beg-details.tsx",
  "app/challenge-details.tsx",
]

const mustContain = [
  ["app/(auth)/sign-in.tsx", ["connectDemo", "ENTER AS VAGRANT", "ENTER AS LORD"]],
  ["app/(app)/arena.tsx", ["enterChallenge", "fundBounty"]],
  ["app/(app)/settings.tsx", ["switchDemo", "Notifications", "Compose beg"]],
  ["app/(app)/send.tsx", ["DEMO_ACCOUNTS", "gift", "RECIPIENTS"]],
  ["app/beg-details.tsx", ["gift(", "WATCH LIVE"]],
  ["app/challenge-details.tsx", ["enterChallenge", "fundBounty", "GO RECORD"]],
  ["providers/AppState.tsx", ["connectDemo", "hydrateFromAuth", "enterChallenge", "fundBounty"]],
  ["lib/demo-accounts.ts", ["DEMO_VAGRANT", "DEMO_LORD"]],
]

let failed = 0
for (const r of routes) {
  const p = path.join(root, r)
  if (!fs.existsSync(p)) {
    console.error(`MISSING ${r}`)
    failed++
  } else {
    console.log(`ok route ${r}`)
  }
}

for (const [file, needles] of mustContain) {
  const text = fs.readFileSync(path.join(root, file), "utf8")
  for (const n of needles) {
    if (!text.includes(n)) {
      console.error(`FAIL ${file} missing "${n}"`)
      failed++
    } else {
      console.log(`ok wire ${file} ← ${n}`)
    }
  }
}

// Dual-caste surfaces
const casteFiles = {
  "app/(app)/wallet.tsx": ["isLord", "cash-out", "deposit"],
  "app/(app)/golive.tsx": ["isLord", "send"],
  "app/(app)/profile.tsx": ["isLord", "COURT", "LEVEL"],
  "components/vessel/BottomNav.tsx": ["isLord", "golive", "send"],
}
for (const [file, needles] of Object.entries(casteFiles)) {
  const text = fs.readFileSync(path.join(root, file), "utf8")
  for (const n of needles) {
    if (!text.includes(n)) {
      console.error(`FAIL caste ${file} missing "${n}"`)
      failed++
    } else {
      console.log(`ok caste ${file} ← ${n}`)
    }
  }
}

if (failed) {
  console.error(`\nMatrix FAILED (${failed})`)
  process.exit(1)
}
console.log("\nMatrix PASS — routes + dual-caste + mock wires present")
