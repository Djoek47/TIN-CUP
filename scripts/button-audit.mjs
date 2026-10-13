#!/usr/bin/env node
/**
 * Static audit: every screen has wired CTAs (PrimaryButton/HoldButton/Pressable routes),
 * no user-facing mock/Apple-camera/TestFlight jargon, dual-caste gates present.
 */
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const fail = []
const pass = []

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(name)) out.push(p)
  }
  return out
}

const appFiles = walk(path.join(root, "app")).concat(walk(path.join(root, "components")))
const bannedUi = [
  /\bMOCK\b/,
  /\bMock gold\b/i,
  /\bmock escrow\b/i,
  /\bFAKE MONEY\b/i,
  /\bApple camera\b/i,
  /\bAPPLE CAMERA\b/,
  /\bTestFlight\b/i,
  /\bAVFoundation\b/,
  /\bdevice binary\b/i,
  /\bTEST ESCROW\b/,
  /\bTEST WALLET\b/,
  /\bMOCK QA\b/,
  /\bMOCK QUEUE\b/,
  /\bMOCK FIRST\b/,
]

for (const file of appFiles) {
  const rel = path.relative(root, file)
  // Skip comments-only hits in non-UI libs under components that re-export
  const text = fs.readFileSync(file, "utf8")
  // Only flag string literals / JSX text — rough: lines with quotes containing banned
  const lines = text.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.trim().startsWith("//") || line.trim().startsWith("*") || line.trim().startsWith("/*")) continue
    if (line.includes("isMock") || line.includes('mode === "mock"') || line.includes("rail: \"mock\"")) continue
    if (line.includes("moneyMode") && line.includes("mock")) continue
    for (const re of bannedUi) {
      if (re.test(line) && (/["'`]/.test(line) || /<[A-Z]/.test(line) || /title=|label=|say\(|Alert\.alert/.test(line))) {
        fail.push(`${rel}:${i + 1} banned UI copy: ${re} → ${line.trim().slice(0, 120)}`)
      }
    }
  }
}

// Required wired screens + CTAs
const required = [
  ["app/(auth)/sign-in.tsx", ["ENTER AS VAGRANT", "ENTER AS LORD", "connectDemo", "CONTINUE WITH EMAIL"]],
  ["app/(app)/index.tsx", ["GO LIVE", "COMPOSE BEG", "LIVE NOW", "OPEN BEGS"]],
  ["app/(app)/golive.tsx", ["HOLD TO GO LIVE", "isLord", "POUR INTO SOMEONE"]],
  ["app/(app)/broadcast.tsx", ["END", "LiveRoom", "endLiveSession"]],
  ["app/(app)/live.tsx", ["gift", "GO LIVE", "NO ONE IS LIVE"]],
  ["app/(app)/arena.tsx", ["enterChallenge", "fundBounty", "ENTER CHALLENGE"]],
  ["app/(app)/wallet.tsx", ["deposit", "cash-out", "balance"]],
  ["app/(app)/deposit.tsx", ["deposit", "PAY WITH STRIPE", "initPaymentSheet"]],
  ["app/(app)/cash-out.tsx", ["cashOut", "isLord", "LORDS PUT IN"]],
  ["app/(app)/send.tsx", ["gift", "POUR"]],
  ["app/(app)/settings.tsx", ["switchDemo", "SIGN OUT", "SWITCH ACCOUNT"]],
  ["components/vessel/BottomNav.tsx", ["golive", "send", "isLord", "wallet", "live"]],
  ["components/vessel/LiveRoom.tsx", ["CameraView", "CAMERA ON PHONE", "ALLOW CAMERA"]],
]

for (const [file, needles] of required) {
  const full = path.join(root, file)
  if (!fs.existsSync(full)) {
    fail.push(`missing screen ${file}`)
    continue
  }
  const text = fs.readFileSync(full, "utf8")
  for (const n of needles) {
    if (!text.includes(n)) fail.push(`${file} missing wire: ${n}`)
    else pass.push(`${file} ← ${n}`)
  }
}

// Dual-caste logic gates in AppState
const appState = fs.readFileSync(path.join(root, "providers/AppState.tsx"), "utf8")
for (const n of ["connectDemo", "enterChallenge", "fundBounty", "cashOut", "ascendLord", "gift", "deposit"]) {
  if (!appState.includes(n)) fail.push(`AppState missing ${n}`)
  else pass.push(`AppState ← ${n}`)
}

// Identity: not old Tin Cup Expo Go bundle
const appJson = JSON.parse(fs.readFileSync(path.join(root, "app.json"), "utf8"))
if (appJson.expo?.ios?.bundleIdentifier !== "com.obol.app") {
  fail.push(`bundleIdentifier must be com.obol.app, got ${appJson.expo?.ios?.bundleIdentifier}`)
} else pass.push("bundle com.obol.app")
if (appJson.expo?.name !== "0bol") fail.push(`name must be 0bol, got ${appJson.expo?.name}`)
else pass.push("name 0bol")
if (appJson.expo?.scheme === "tincup") fail.push("scheme still tincup (old Expo Go)")
else pass.push(`scheme ${appJson.expo?.scheme}`)

console.log(pass.map((p) => `PASS ${p}`).join("\n"))
if (fail.length) {
  console.error("\n" + fail.map((f) => `FAIL ${f}`).join("\n"))
  console.error(`\nButton audit FAIL — ${fail.length} issue(s)`)
  process.exit(1)
}
console.log(`\nButton audit PASS — ${pass.length} checks`)
