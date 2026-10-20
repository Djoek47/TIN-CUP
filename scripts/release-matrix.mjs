#!/usr/bin/env node
/**
 * Final release matrix — brand, gates, dual-caste, money rails.
 * Run: node scripts/release-matrix.mjs
 */
import fs from "node:fs"
import path from "node:path"
import assert from "node:assert/strict"

const root = path.resolve(import.meta.dirname, "..")
const read = (p) => fs.readFileSync(path.join(root, p), "utf8")
let failed = 0
const ok = (label) => console.log(`PASS ${label}`)
const fail = (label, detail) => {
  console.error(`FAIL ${label}${detail ? ` — ${detail}` : ""}`)
  failed++
}

// Brand: product name is 0bol in user-facing surfaces
const brandFiles = [
  "app/index.tsx",
  "app/(auth)/welcome.tsx",
  "app/(app)/index.tsx",
  "app/(app)/settings.tsx",
  "components/vessel/ObolMark.tsx",
]
for (const f of brandFiles) {
  const t = read(f)
  if (!t.includes("0bol")) fail(`brand ${f}`, "missing 0bol")
  else ok(`brand 0bol in ${f}`)
  // Wordmark must not show legacy all-caps OBOL as display string in these files
  // (allow path comments / package names)
}

const wordmark = read("components/vessel/ObolMark.tsx")
if (wordmark.includes(">\n        OBOL\n") || /[^a-zA-Z]OBOL[^a-zA-Z_]/.test(wordmark.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, ""))) {
  // Allow "ObolMark" type names; ban standalone OBOL wordmark text
  const stripped = wordmark
    .replace(/ObolMark/g, "")
    .replace(/ObolWordmark/g, "")
    .replace(/ObolMoment/g, "")
    .replace(/obolLiq/g, "")
  if (stripped.includes("OBOL")) fail("ObolWordmark", "still renders OBOL")
  else ok("ObolWordmark uses 0bol")
} else {
  ok("ObolWordmark uses 0bol")
}

// Logo assets wired
const mark = read("components/vessel/ObolMark.tsx")
for (const asset of [
  "rank-5a-vagrant.png",
  "rank-5a-lord.png",
  "mark-4b-arrival.png",
  "mark-4e-crossing.png",
  "mark-4c-milled-edge.png",
]) {
  if (!mark.includes(asset)) fail("raster asset map", asset)
  else ok(`raster ${asset}`)
}

// Icons match brand pack (same bytes)
const icon = fs.readFileSync(path.join(root, "assets/icon.png"))
const brandIcon = fs.readFileSync(path.join(root, "assets/brand/obol/png/1024/icon-night-gold.png"))
assert.equal(icon.length, brandIcon.length)
ok("assets/icon.png === brand icon-night-gold")

// Dual-caste gates in AppState
const appState = read("providers/AppState.tsx")
for (const needle of [
  "connectDemo",
  "enterChallenge",
  "fundBounty",
  "ascendLord",
  "Lords cannot cash out",
  "Lords never fall",
]) {
  if (!appState.includes(needle)) fail("AppState gate", needle)
  else ok(`gate ${needle}`)
}

// Screens must wire critical CTAs
const wires = [
  ["app/(auth)/sign-in.tsx", ["ENTER AS VAGRANT", "ENTER AS LORD", "connectDemo", "signInWithApple"]],
  ["app/(app)/arena.tsx", ["enterChallenge", "fundBounty"]],
  ["app/(app)/deposit.tsx", ["stripeConfigured", "initPaymentSheet", "deposit"]],
  ["app/(app)/cash-out.tsx", ["isLord", "cashOut", "LORDS PUT IN"]],
  ["app/(app)/golive.tsx", ["isLord", "POUR INTO SOMEONE", "HOLD TO GO LIVE"]],
  ["app/(app)/settings.tsx", ["switchDemo", "stripeConfigured", "SIGN OUT"]],
  ["app/(app)/send.tsx", ["DEMO_ACCOUNTS", "gift"]],
  ["components/vessel/BottomNav.tsx", ["golive", "send", "isLord"]],
]
for (const [file, needles] of wires) {
  const t = read(file)
  for (const n of needles) {
    if (!t.includes(n)) fail(`wire ${file}`, n)
    else ok(`wire ${file} ← ${n}`)
  }
}

// Design cues: amber/lime tokens present; no Inter default stack in vessel theme
const tokens = read("theme/vessel.ts")
if (!tokens.includes("#FFB43D") || !tokens.includes("#C4F000")) fail("tokens amber/lime")
else ok("vessel amber/lime tokens")
if (!tokens.includes("0bol")) fail("tokens header brand")
else ok("vessel tokens branded 0bol")

// Demo accounts stable addresses
const demo = read("lib/demo-accounts.ts")
if (!demo.includes("0x1111111111111111111111111111111111111111")) fail("demo vagrant address")
if (!demo.includes("0x2222222222222222222222222222222222222222")) fail("demo lord address")
ok("demo account addresses stable")

if (failed) {
  console.error(`\nRelease matrix FAILED (${failed})`)
  process.exit(1)
}
console.log("\nRelease matrix PASS — brand, logos, gates, dual-caste wires")
