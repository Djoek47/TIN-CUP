# TIN CUP — Stage 2: Figma Design Specification

Built on the Stage 1 Product Bible with the four locked decisions:
1. **No real-money mini-games** (skill duels stake cosmetics/coin-dust only; Beggar's Roulette is free-entry, Lord-funded).
2. **Forced rags/squalor designs for Vagrants only.** Squalor is the locked caste aesthetic; Lords unlock finery. This is now a *progression mechanic*, not a skin choice.
3. **Class mobility is one-way.** $100 minimum buys Lordship forever; there is no path back to Vagrant. Requires a permanent-choice ceremony modal.
4. **Zero in-app purchases.** All deposits happen via external redirect to web checkout. The Deposit screen is a handoff screen, and no coin package or price appears inside the app binary.

---

# SECTION 1 — DESIGN SYSTEM ("The Gulch Design System" / GDS)

## 1.1 Design principles
1. **Dark-first.** The app is night in the desert. Dark mode is the canonical mode; light mode ("High Noon") is a derived theme.
2. **Gold means money. Green means paid. Red means law.** Color is a contract; never break it.
3. **Fintech numbers, carnival chrome.** Any number a user can lose sleep over (balances, fees, amounts) renders in calm, tabular, high-contrast type. Everything around it can be a circus.
4. **Every screen is a screenshot.** Assume every state will be posted to TikTok; design each one to be identifiable as Tin Cup without a logo.
5. **Weight over speed.** Money interactions feel heavy (longer, physical animations); navigation feels instant.

## 1.2 Color tokens

**Primitives (Figma Variables → collection `primitive/color`):**

| Token | Hex | Name |
|---|---|---|
| `midnight/900` | `#0B0E14` | app background (dark) |
| `midnight/800` | `#12161F` | raised surface |
| `midnight/700` | `#1A2029` | card |
| `midnight/600` | `#242B36` | elevated card / sheet |
| `midnight/500` | `#303844` | borders, dividers |
| `gold/500` | `#F5B32B` | primary gold |
| `gold/400` | `#FFC94D` | gold hover/glow |
| `gold/600` | `#C98F14` | gold pressed |
| `gold/100` | `#FFF3D6` | gold tint bg |
| `oxblood/500` | `#8E2D30` | law / danger |
| `oxblood/400` | `#B33A3E` | danger hover |
| `oxblood/100` | `#F6E3E3` | danger tint |
| `cactus/500` | `#3F9B5B` | money received / cash-out ONLY |
| `cactus/100` | `#E1F2E7` | success tint |
| `parchment/100` | `#F4EEDD` | parchment card / light bg |
| `parchment/300` | `#E4DAC0` | parchment shade |
| `ink/900` | `#17130C` | text on parchment/gold |
| `white/hi` | `#F7F5F0` | primary text (dark mode), 96% |
| `white/mid` | `#B9B4A8` | secondary text |
| `white/lo` | `#7A766C` | tertiary/disabled |
| `dust/500` | `#8C7A5B` | coin-dust currency accent |
| `sky/500` | `#4E7DA6` | links, informational (used sparingly) |

**Semantic tokens (collection `semantic/color`, modes: `Dark` / `HighNoon`):**
`bg/canvas`, `bg/surface`, `bg/card`, `bg/sheet`, `border/subtle`, `border/strong`, `text/primary`, `text/secondary`, `text/tertiary`, `text/inverse`, `action/primary` (→gold/500), `action/primary-pressed`, `action/danger` (→oxblood/500), `money/positive` (→cactus/500), `money/amount` (→gold/500), `money/fee` (→white/mid), `status/warning` (→gold/600 on oxblood/100 in light), `status/live` (`#E5484D` pulsing dot), `overlay/scrim` (midnight/900 @ 72%).

**High Noon (light) mapping:** canvas `parchment/100`, surface `#FFFFFF` warmed to `#FDFBF5`, card `parchment/100`, text `ink/900`, gold and oxblood unchanged (they pass contrast on parchment), borders `parchment/300`. Light mode is deliberately "daytime saloon," not generic white.

**Contrast rules:** all text ≥ 4.5:1; `gold/500` is never used for body text on midnight below 18px bold (it passes at 8.2:1 but reserve it for amounts/CTAs to protect the color contract); `white/lo` only for disabled/placeholder.

## 1.3 Typography

| Role | Face | Usage |
|---|---|---|
| **Display / Ceremonial** | **Ultra** (fat Clarendon slab — the wanted-poster face) | Hero moments only: gift amounts in spectacle, titles ("BARON"), season names, big-drop takeovers. Never body. Always uppercase, tracking +2%. |
| **Headline / UI Display** | **Archivo** (Black & SemiBold, SemiExpanded for headers) | Screen titles, card titles, buttons, tabs. |
| **Body / UI** | **Inter** (Regular 400, Medium 500, SemiBold 600) | Everything readable. |
| **Numeric / Ledger** | **IBM Plex Mono** (Medium, tabular figures) | ALL money values in wallet/ledger/receipts. Amounts inside spectacle use Ultra; amounts inside finance surfaces use Plex Mono. |

**Type scale (Figma text styles, 8pt-aligned line heights):**
`display/XL` Ultra 56/60 · `display/L` Ultra 40/44 · `headline/XL` Archivo Black 28/32 · `headline/L` Archivo SemiExpanded Bold 22/28 · `headline/M` Archivo Bold 18/24 · `body/L` Inter 17/24 · `body/M` Inter 15/20 · `body/S` Inter 13/16 · `caption` Inter Medium 12/16, tracking +1% · `numeric/L` Plex Mono 24/32 · `numeric/M` Plex Mono 17/24 · `numeric/S` Plex Mono 13/16 · `button/L` Archivo Bold 17/24 · `button/M` Archivo Bold 15/20 · `overline` Archivo SemiBold 11/16, uppercase, tracking +8% (used for lore labels: "MAIN STREET", "THE COURTHOUSE").

Dynamic Type: body and caption styles scale with OS settings up to 135%; display styles cap at 110%; money values never truncate — containers grow.

## 1.4 Spacing, grid, radius, elevation

- **8pt base grid.** Spacing tokens: `space/1`=4, `/2`=8, `/3`=12, `/4`=16, `/5`=24, `/6`=32, `/7`=40, `/8`=48, `/9`=64. Screen margins: 16 (compact), 24 (≥400pt width). Vertical rhythm between stacked cards: 12.
- **Radius:** `radius/xs`=6 (chips, tags), `/s`=10 (buttons, inputs), `/m`=14 (cards), `/l`=20 (sheets, modals), `/full`=999 (pills, avatars). Parchment "poster" cards use `radius/xs` with a 1px `ink/900 @12%` deckle border to feel like paper, not plastic.
- **Elevation (dark mode uses glow+border, not gray shadows):**
  - `elev/0` flat; `elev/1` card: border `border/subtle` + shadow `0 1 2 rgba(0,0,0,.4)`;
  - `elev/2` raised: `0 4 12 rgba(0,0,0,.5)`;
  - `elev/3` sheet/modal: `0 12 32 rgba(0,0,0,.6)`;
  - `elev/gold` (money moments only): outer glow `0 0 24 rgba(245,179,43,.35)`.
- **Blur:** sheet scrim backdrop-blur 8; no glassmorphism elsewhere (it fights the parchment/wood materiality).

## 1.5 Iconography
24×24 grid, 2px stroke, rounded caps, single-color, drawn with subtle "hand-forged" imperfection (one corner per icon slightly beveled). Core set: tin-cup (beg), coin-stack (wallet), coin-single, wanted-poster (profile), sheriff-star, saloon-doors (lobbies), dynamite (challenges), lasso (loading/reactions), spur (settings), horseshoe (luck), crown (Lords), vulture (fees), cactus (cash-out), bell, magnifier, megaphone (Town Crier), scales (Courthouse), padlock, eye/eye-off, share-arrow, flag (report), chevron set, close, check, plus/minus, camera, mic, stream-signal. Filled variants exist only for the active tab state. **No firearm icons anywhere in UI chrome** (app-review safety); gunshot exists as *sound and flash*, never as a rendered gun.

## 1.6 Motion tokens
- Durations: `motion/instant` 80ms (taps), `/fast` 160ms (chips, toggles), `/base` 240ms (navigation, sheets), `/slow` 400ms (celebrations), `/ceremony` 900–1600ms (money spectacle only).
- Easings: `ease/standard` cubic-bezier(0.2, 0, 0, 1); `ease/enter` (0, 0, 0, 1); `ease/exit` (0.3, 0, 1, 1); `ease/spring-heavy` spring(mass 1.2, stiffness 180, damping 18) — coins and money objects only; `ease/overshoot` (0.34, 1.56, 0.64, 1) — badges, level-ups.
- Rules: navigation never exceeds `/base`; only one `/ceremony` animation may play at a time (a priority queue drops lower-tier spectacles when a bigger gift lands); ALL motion above `/fast` is replaced by 160ms crossfades when OS Reduce Motion is on; money-rain particle count caps at 60 (perf floor: 60fps on 4-year-old midrange Android).

## 1.7 Sound guidelines
Foley palette: coin *ting* (single), coin rattle-in-cup (small gift), coin cascade (medium), gunshot+cascade (large — gunshot is a dry crack, not realistic), saloon doors creak (lobby enter), spurs step (tab switch, ≤ -18LUFS, subtle), tumbleweed whoosh (empty state appears), harmonica sting (session open after midnight), crowbar creak + chest (daily reward), vulture squawk (fee line item appears on receipts — 300ms, comedic), gavel (dispute resolved). Master rules: obey silent switch absolutely; no sound on navigation except spurs (user-disableable); every sound has a haptic twin so muted users lose nothing.

## 1.8 Accessibility baseline
44×44pt minimum touch targets; visible focus ring (2px gold) for external keyboards; all money values exposed to screen readers as "X coins, equals Y dollars"; spectacle animations have text-equivalent announcements ("Baron DustyPete gifted 500 coins"); flashing never exceeds 3Hz; color never the sole carrier of meaning (fee lines get the vulture icon, not just gray text); RTL mirroring supported for all layouts except western-illustration scenes.

## 1.9 Figma variables & tokens structure
Collections: `primitive/color`, `semantic/color` (modes Dark/HighNoon), `space`, `radius`, `type` (mapped to text styles), `motion` (number variables for durations), `content` (string variables for lore labels so copy edits propagate). All components consume ONLY semantic tokens. Token naming mirrors code: `bg/card` in Figma = `theme.bg.card` in RN.

---

# SECTION 2 — SCREEN INVENTORY (62 screens)

**Entry & Auth (8):** S01 Splash · S02 Loading/handoff · S03 Welcome (guest CTA) · S04 Sign up / Sign in · S05 OTP verify · S06 Age gate (DOB) · S07 Permissions primer (notifications, camera) · S08 Choose Your Fate (Drifter vs Lord path)
**Onboarding (4):** S09 Character Creator — Vagrant (squalor set) · S10 Character Creator — Lord (finery set, post-ascension only) · S11 Naming (handle + outlaw name) · S12 First-action tutorial overlay
**Core (7):** S13 Main Street (home feed) · S14 Feed of Madness (vertical clips) · S15 Clip detail · S16 Lobby directory · S17 General Lobby (Main Street live board) · S18 Themed lobby · S19 Live Saloon Stream (viewer)
**Begging (5):** S20 Beg composer · S21 Sheriff scan result (pass/flag/reject) · S22 AI Dramatizer preview · S23 Beg detail (live state) · S24 Beg recap (24h expiry card)
**Challenges (5):** S25 Challenge board · S26 Challenge detail · S27 Challenge composer (Lord) · S28 Proof submission (Vagrant) · S29 Verdict screen (Lord)
**Money (9):** S30 Wallet home · S31 Deposit handoff (external redirect) · S32 Deposit return/success · S33 Cash-out amount · S34 Cash-out review (fee itemized) · S35 Cash-out status · S36 Ledger · S37 Transaction receipt · S38 Tax center
**KYC (3):** S39 KYC intro ("Get deputized") · S40 ID + selfie capture (vendor SDK shell) · S41 KYC status (pending/verified/flagged)
**Ascension (2):** S42 Become a Lord (pitch + $100 explainer) · S43 The Point of No Return (permanent-choice ceremony)
**Social (7):** S44 Profile / Wanted Poster (own) · S45 Profile (other) · S46 Followers/Fans/Worshippers list · S47 Court (Lord's private lobby) · S48 Court management (Lord admin) · S49 Posse (guild) · S50 Messages/DM thread (gift-attach enabled)
**Progression (4):** S51 Leaderboards · S52 Season hub (Gold Rush) · S53 Badges & titles collection · S54 Cosmetics shop (coin-priced only — no cash prices in-app)
**Games (2):** S55 Beggar's Roulette room (free-entry) · S56 Duel (cosmetic-stakes) 
**System (10):** S57 Notifications center · S58 Search & discover · S59 Settings root (+ nested: account, payout methods, limits & self-exclusion, privacy, blocked users, legal) · S60 Sheriff's Office (report flow, dispute center, Courthouse appeal) · S61 Help & FAQ · S62 Error/offline/maintenance/forced-update family
**Overlay inventory (not screens, but built as components):** gift composer sheet, spectacle takeover, streak reminder, Lucky Hour toast, season-end recap story, cooling-off modal, self-exclusion confirm, logout confirm, delete-account flow.

---

# SECTION 3 — SCREEN SPECIFICATIONS

Format: Purpose → Layout → Key components → States → A11y → Copy → Rationale. Deep specs for the 15 load-bearing screens; compact specs for the rest.

### S01 Splash
Full-bleed midnight/900; Tin Cup logotype (Ultra, gold) center; a single coin drops into a tin cup silhouette (600ms, `ease/spring-heavy`) and the *ting* plays; version number caption bottom. No spinner — splash IS the loading state up to 1.5s, then S02. A11y: decorative only, announce "Tin Cup, loading."

### S03 Welcome
Purpose: convert to guest immediately; the show is the funnel. Layout: looping muted background montage of (pre-approved, house-made) clip footage behind a scrim; logotype top; two buttons bottom-stacked: primary gold "Walk into town" (guest mode), tertiary "I've been here before" (sign in). Caption under primary: "Look around free. No account till you touch money." Rationale: zero-friction voyeur entry is the acquisition thesis. Empty/offline state: montage replaced by static illustrated Main Street scene.

### S08 Choose Your Fate
Purpose: caste selection; the app's identity moment. Layout: split-screen diptych — left panel parchment card "THE DRIFTER" with a raggedy character illustration (patched duster, dented cup), right panel midnight+gold card "THE LORD" with a silhouetted fine coat and crown glint, price chip "$100 buy-in". Vertical divider is a rope. Tap a side → it expands to 70% with details; CTA per side ("Take the cup" / "Claim your title"). Footer caption: "Drifters can rise. Lords never fall — and never go back." Rationale: presenting Lordship as expensive and *permanent* from minute one makes the $100 feel like identity purchase, not paywall. A11y: both panels are buttons with full descriptive labels. Copy is the one-way-door disclosure moment #1 (repeated at S43).

### S09 Character Creator — Vagrant
Purpose: identity within enforced squalor. Layout: character stage top 55% (avatar on a dirt-road backdrop, idle animation: swaying, flies circling — comedic), category tabs bottom sheet (Face / Hair / Rags / Cup / Quirk), horizontal option carousels, every option free, all visibly worn: patched hats, mismatched boots, missing-tooth grin options, cups ranging "dented" to "very dented." A padlocked row at bottom of every category shows grayed **finery items with lock+crown icon** — "Lords only." Tapping a locked item bounces it and shows tooltip "Rise to Lordship to wear this." CTA "That'll do." Rationale: forced squalor per decision #2, but every locked item is an advertisement for ascension — the caste ceiling is rendered *visible and touchable*, which converts the restriction into desire. States: loading skeleton = mannequin of straw. A11y: options labeled ("Patched brown duster, equipped").

### S13 Main Street (Home)
Purpose: the algorithmic front porch; route to lobbies, begs, challenges. Layout: top app bar (logo-mark left; coin balance pill right — Plex Mono, tap→Wallet; bell with badge); "MAIN STREET" overline; then a mixed-module vertical feed: (1) Live Now rail — horizontally scrolling Saloon Stream cards with red live dot and viewer count; (2) trending Beg Cards (see §4); (3) Challenge cards with bounty in gold; (4) leaderboard teaser strip; (5) Lucky Hour banner slot (appears only when active, gold shimmer). Pull-to-refresh: a lasso spins and snaps (320ms). Bottom nav (5 tabs): Main St · Madness · [center raised gold action button: tin-cup icon → Beg composer for Vagrants / dynamite → Challenge composer for Lords] · Lobbies · Poster (profile). Rationale: the center action morphs by caste — the nav itself expresses identity. Empty state (new town, no follows): illustrated tumbleweed + "Quiet out here. Ride into a Saloon →". Error: "Lost the trail. [Try again]". A11y: live cards announce "Live, 214 watching."

### S14 Feed of Madness
Purpose: TikTok-grade retention + share loop. Layout: full-bleed vertical pager, one clip per page, autoplay muted with captions burned; right rail (avatar → profile, reaction lasso count, Nickel Toss quick-gift button, share, flag); bottom gradient scrim: outlaw name + title chip, clip caption, gifted-total ticker ("💰 1,240 coins thrown"). Double-tap = lasso reaction (free spectacle). Long-press = pause + context menu. Nickel Toss: tap → instant 5-coin gift with mini coin-flip animation, no sheet (frictionless observer conversion; requires balance, else routes to deposit handoff). Share: renders watermarked vertical export + referral code. States: loading = shimmer over a film-slate illustration; end-of-feed (rare): "You've seen everything the town did today. Come back at sundown." Rationale: reactions free / gifts paid = the upsell gradient; the gifted-ticker turns every clip into a leaderboard. A11y: full VoiceOver custom rotor for rail actions; captions mandatory at upload.

### S17 General Lobby (Main Street live board)
Purpose: the town square where Vagrant begs live for 24h. Layout: header with lobby name + live pot stats strip (Plex Mono: total thrown today, active begs, biggest drop); filter chips (Newest · Rising · Ridiculous · Nearly funded · Big goals); masonry of Beg Cards (2-col ≥400pt, 1-col compact); each card shows character portrait (squalor avatar acting out an "asking" pose), beg title (Archivo), goal progress bar if goal-type, gifted count + giver avatars stack, time-left ring. FAB not needed (center nav is composer). Tap card → S23. States: empty at 4am: sleeping character under a cactus, "Even beggars sleep. First beg of the morning gets the Early Bird badge." Rationale: social proof (giver stacks) + urgency (24h ring) are the two strongest give-triggers from GoFundMe/Reddit psychology.

### S19 Live Saloon Stream (viewer)
Purpose: whale-war arena. Layout: video full-bleed; top scrim: host poster chip, viewer count, LIVE tag; if Lord-vs-Lord battle active: a tug-of-war gold bar across the top showing generosity totals per side with both crests — the core battle visualization; right rail gift rockets (tier shortcuts: 10 / 50 / 100 / 500 with their spectacle icons); chat overlay bottom 40% with gift events rendered as full-width gold event rows; challenge overlay slot (when host attaches a bounty: parchment banner drops from top with dynamite fuse timer). Gift tap → gift composer sheet pre-scoped to host. Spectacles: play IN the stream layer so all viewers see them simultaneously (see §5). States: stream drop: sepia freeze-frame + "Connection shot down. Reloading…" A11y: gift events announced; battle-bar values readable.

### S20 Beg composer
Purpose: the core content creation act; also the Sheriff's front door. Layout: stepper (1 Write · 2 Show · 3 Preview): Step 1 — title field (60 chars, counter), story field (280), goal toggle (amount + deadline picker if on), category chips; persistent **parchment guidance banner**: "Keep it legal & fun, partner. ✔ 'Best outlaw dance for $50' ✔ 'Fund my mustache wax' ✘ scams ✘ danger ✘ sob-scams" — allowed-examples-first per Bible. Step 2 — video capture/upload (≤60s) with retake; "Dramatize with AI" button (disabled state until Sheriff scan passes, sublabel "The Sheriff checks it first"). Step 3 — live preview rendered exactly as the lobby card + Post button showing daily quota ("2nd of 2 today"). Submit → S21 scan interstitial (armadillo stamps papers, 1–3s). Rejection state: oxblood banner, plain-language reason, edit CTA, appeal link. Rationale: preview-as-card sets quality expectations; quota shown at the button prevents surprise. A11y: all steps navigable without video (video optional).

### S23 Beg detail
Layout: hero = the character portrait performing beg pose on a stage vignette; title in headline/XL; story; goal progress bar (gold fill, Plex Mono numbers) with giver avatar stack + "47 strangers chipped in"; gift button row (Nickel Toss · 25 · 100 · Custom — custom opens gift sheet); reactions; comments below fold; share and flag in overflow. When a gift lands while viewing: the spectacle plays over the hero and the progress bar fills with `ease/spring-heavy`. Expired state: sepia wash + recap stats + "The cup's been emptied. [See recap card]".

### S30 Wallet home
Purpose: trust surface — the one screen with zero comedy chrome except the vulture. Layout: balance hero card (`elev/gold` glow): coin total in numeric/L, USD equivalent below in text/secondary, caste crest watermark; two primary buttons: "Add gold" (→S31, Lords/any depositor) and cactus-green "Cash out" (→S33, shown only when balance > 0 and KYC-eligible); pending holds row (if any) with Sheriff-star icon + plain explanation; recent ledger (last 5, →S36); tax center + limits links. Fee transparency block: static line "The Monarch takes 1% when gold comes in, 10% when Vagrants cash out" + vulture mark. Rationale: principle 3 — this screen is Stripe, not circus; trust here licenses chaos everywhere else. A11y: balance announced with both units. Error (balance fetch fail): cached balance with "as of" timestamp — never show zero on error.

### S31 Deposit handoff (ZERO-IAP architecture)
Purpose: route money loading out of the binary, compliantly. Layout: parchment card explaining the trip: "Gold gets minted at the Bank, not the Saloon. We'll take you to our secure site to load up." Amount is NOT selected in-app (no price display in-binary); single primary button "Ride to the Bank ↗" opens external browser (universal link with signed session token). Sub-caption: lock icon + "Handled by [licensed partner]" + "You'll come right back." State machine: after redirect, app shows S02-style waiting state with "Counting your gold…" (polls webhook-confirmed status, 60s timeout → "Taking longer than usual" with manual refresh). Return deep-link → S32 success: coin-rain `/ceremony`, new balance counts up in Plex Mono, vulture takes his 1% coin on-screen with squawk, receipt link. Failure return: neutral "The Bank couldn't complete it. No gold moved." + retry. Rationale: decision #4 verbatim — no packages, no prices, no purchase UI in-app; the fiction ("the Bank is in another building") makes the redirect feel like lore instead of friction. A11y: external-link behavior announced before leaving app.

### S33–S35 Cash-out
S33: amount entry (numpad, Plex Mono display, MAX chip), available-after-holds shown. S34 review: itemized parchment receipt — amount, **Monarch's cut −10% as its own line with vulture icon** (the vulture animates in and takes a coin off the stack, 500ms), net in cactus green, destination account (masked), arrival estimate; primary cactus button "Claim your money" with Face ID above $100. First-ever cash-out inserts an interstitial: Sheriff armadillo + "First haul gets counted for 24 hours. Standard law." S35 status: three-step progress (Counted → Sent → Landed) with push updates; success: cactus bloom + green confetti (the ONLY green celebration in the app). Rationale: honest fee theater beats hidden fees — the vulture converts resentment into a bit.

### S42–S43 Ascension (one-way door)
S42 pitch: cinematic scroll — your current squalor avatar on the left slowly crossfades to a finery silhouette as you scroll; benefit list (give gold, run Courts, set challenges, wear finery, titles ladder); price block "$100 minimum stake · the Monarch takes 1" ; CTA "Begin the Ascension" → deposit handoff if unfunded. S43 The Point of No Return: full-screen midnight, a literal illustrated door in a rock face, gold light through the cracks. Copy in Ultra: "LORDS NEVER FALL." Body: "Once you take the title, you can never beg again. No Vagrant days. No going back. Ever." Confirmation is deliberately heavy: hold-to-confirm button (2s fill, haptic ramp) labeled "Hold to swear the oath", beneath it a quiet text button "I'm not ready." On confirm: doors burst open, coronation ceremony (see §5), squalor wardrobe visibly locks away in a chest, finery creator (S10) opens. Rationale: decision #3 — irreversibility must be impossible to miss (disclosure + drama are the same design move); hold-to-confirm is the strongest consent pattern that isn't a legal wall. A11y: hold gesture has an alternative double-confirm dialog.

### S44 Wanted Poster (Profile)
Layout: parchment poster card — "WANTED" overline replaced by caste overline ("DRIFTER" / "BARON"); character portrait in poster frame; outlaw name in Ultra; star rating + trust badge row; stat trio in Plex Mono (Given · Received · Streak); badge shelf (horizontal, rare badges glint); "My Story" timeline for Vagrants (rags-to-riches milestones) / "My Court" module for Lords (member count, enter CTA); season rank chip. Own-profile edit pencil; other-profile actions: Follow → Fan → Kneel (Worshipper, confirm sheet with absurd oath copy), Gift, Message, Flag. Rationale: the poster IS the shareable identity artifact; export-as-image built into overflow.

### S51 Leaderboards
Tabs: Richest Baron · Luckiest Drifter · Fastest Climber · Most Ridiculous; period segmented control (Today/Week/Season). Rows: rank medallion (gold/silver/bronze illustrated coins for top 3), poster chip, value in Plex Mono; own row pinned bottom with gold border regardless of rank ("You — #412"). Season countdown ribbon on top. Empty (season start): "Fresh season. Nobody's rich yet. Terrifying."

### S60 Sheriff's Office
Hub cards: Report something · My disputes · The Courthouse (appeals) · The Law (rules, allowed-wildness examples first). Report flow: 2-step (what → why, category chips with plain labels), confirmation "The Sheriff's on it. We'll write to you." Dispute center rows with status chips (Under review / Ruled / Appealable); Courthouse appeal: statement field + evidence attach + 72h SLA promise printed. All copy dead-serious per tone spectrum (the 5%). Rationale: safety surfaces drop the drawl-comedy but keep the lore vocabulary — trustworthy but still in-world.

### Compact specs (remaining screens)
S02 loading: revolver-cylinder→lasso spinner (see 1.5 note; lasso is default). S04–S05: standard auth, midnight, gold CTAs, phone-first, Apple/Google buttons, OTP with auto-read; error shake 3×4px. S06 age gate: DOB picker, under-18 → dead-end screen (no retry loop). S07 permissions: two illustrated primer cards before OS dialogs; skippable. S11 naming: handle availability inline check, profanity filter with drawl error ("That name's already on a poster / That name'll get you shot — pick another"). S12: 3-coach-mark overlay max. S15 clip detail: comments + source-beg link. S16 lobby directory: category cards with live occupancy dots. S18 themed lobby: S17 layout + theme banner + house rules pinned. S24 recap: shareable stat card, auto-generated. S25–S29 challenges: board = card grid with bounty-first hierarchy; composer mirrors S20 with escrow line ("Bounty locked in the safe until you rule"); proof submission = video + note; verdict = side-by-side ask/proof with Approve (gold) / Reject (oxblood, requires reason) / Split-pot option; rejected → auto-appeal banner for Vagrant. S36 ledger: grouped by day, every row icon-coded, fee rows always visible (never netted silently); S37 receipt: parchment, itemized, vulture stamp, export PDF. S38 tax center: YTD received in Plex Mono, threshold progress bar, 1099-K download list, "gifts may be taxable" disclosure. S39–S41 KYC: "Get deputized" framing, vendor SDK wrapped in GDS chrome, status screens with plain ETAs; flagged state gives a human-contact path. S46 relations: 3 tabs, Worshippers rendered kneeling in row illustration (comedy), remove/block per row. S47 Court: private lobby + role crests; S48 admin: roles (Worshipper→Favored→Knight), shower-the-court group-gift composer, member moderation. S49 Posse: crest, roster, team beg CTA, team board. S50 DMs: text + gift-attach chip (gift renders as sealed coin-pouch bubble, opens with cascade); Sheriff scanning notice in thread header. S52 season hub: theme art, timeline, quest board (Bounty Board), pass track (cosmetic-only, coin-priced). S53 collection: badge grid, locked silhouettes, rare glint on 4s idle loop. S54 shop: coin prices ONLY (no currency symbols — zero-IAP hygiene), rarity frames, preview-on-avatar before buy, seasonal shelf with stock counters. S55 roulette: wheel of entered Drifters' portraits, Lord-funded pot in center (Plex Mono), free-entry button (1/day), draw ceremony at fixed hour, official-rules link footer (sweepstakes). S56 duel: cosmetic-stake picker → best-of-3 quickdraw reaction minigame → winner takes item; explicit "no money changes hands" caption. S57 notifications: grouped (Money / Town / The Law), each row written in-voice, money rows show amounts in Plex Mono. S58 search: users/lobbies/tags, trending strip. S59 settings: standard lists; **Limits & self-exclusion** gets top-level placement with shield icon (deposit caps, gift caps, cool-down, self-exclusion with re-entry delay — confirm flows are sober, no drawl). S61 help: FAQ accordion + contact. S62 family: offline (cut telegraph wire illustration), maintenance (town closed for repairs, sheriff hammering sign), forced update (new law posted), 404-equivalent (empty desert, "Nothing out here but bones"), generic error ("Something spooked the horses. [Try again]").

---

# SECTION 4 — COMPONENT LIBRARY

Naming: `Component/Variant` with Figma properties. All built with Auto Layout, consuming semantic tokens only.

- **Button** — props: `variant` (primary-gold / secondary-outline / tertiary-text / danger-oxblood / money-cactus), `size` (L 56pt / M 48 / S 36), `state` (default/pressed/disabled/loading), `icon` (none/left/right), `holdToConfirm` (bool — fill-up variant for irreversible acts). Pressed = 4% darken + scale .98 + 80ms. Loading = lasso spinner replaces label, width locked.
- **CoinAmount** — atomic money display: coin glyph + Plex Mono value + optional USD sub-line; props `size`, `signed` (+gold / −white-mid / net-cactus), `animated` (count-up). Used EVERYWHERE money renders; forbidden to typeset money outside this component.
- **BegCard** — portrait slot (character pose), title, optional GoalBar, GiverStack (max 5 avatars + "+42"), TimeRing (24h radial), gifted CoinAmount, category Tag. Variants: feed / lobby-masonry / preview / expired(sepia) / flagged(oxblood corner banner).
- **ChallengeCard** — dynamite icon, bounty CoinAmount (dominant, Ultra at L size), task title, Lord poster chip, deadline fuse (literal burning-fuse progress bar), participants count. Variants: open / accepted / judging / paid / expired.
- **WalletCard** — balance hero: `elev/gold`, crest watermark, CoinAmount XL, two-button row slot.
- **PosterChip** — mini identity: avatar in poster frame + name + title chip; sizes S/M; the universal user reference.
- **TitleChip** — caste/title pill: Ultra XS uppercase, gold-on-midnight for Lords, dust-on-parchment for Vagrants; rare-title variant with glint loop.
- **GoalBar** — parchment track, gold fill, Plex Mono fraction, spring-fill on update, "FUNDED" burst state (stamp animation).
- **GiftRow / SpectacleTier shortcuts** — 10/50/100/500 quick buttons with tier icon previews.
- **GiftComposerSheet** — bottom sheet: recipient PosterChip, amount presets + custom numpad, spectacle preview thumbnail per tier, fee note line, confirm (FaceID ≥$100). 2-tap happy path enforced.
- **SpectacleOverlay** — full-screen celebration layer, `tier 1–5` variants (see §5); queue-managed singleton.
- **LiveBattleBar** — two-sided tug bar, crests at ends, totals in Plex Mono, lead side glows.
- **StatusChip** — live(red pulse) / pending / verified(sheriff star) / flagged / funded / expired.
- **Badge** — sizes S/M/L; rarity frames (common tin / rare silver / legendary gold-animated); locked variant silhouette.
- **TrustMeter** — 1–5 stars + sheriff-badge tier; compact and expanded variants.
- **Alert/Banner** — info(parchment) / warning(gold-on-oxblood-tint) / danger(oxblood) / success(cactus, money-only); icon + title + body + optional action.
- **Dialog** — radius/l card, max 2 actions, destructive always left-weighted oxblood text; **IrreversibleDialog** variant with hold-to-confirm.
- **BottomSheet** — grabber, radius/l top, snap points 40/70/100%, scrim blur 8.
- **NavBar (bottom)** — 5 slots, center raised ActionOrb (56pt gold circle, caste-morphing icon), active tab = filled icon + gold underline dot.
- **TopAppBar** — leading slot / title (overline lore label + headline) / trailing (BalancePill, bell).
- **BalancePill** — compact CoinAmount pill, tap→wallet; pulses gold when balance changes.
- **LedgerRow** — icon, description, CoinAmount signed, timestamp; fee sub-row with vulture mark.
- **ProgressBar / XPBar** — XP variant has spark travel on gain.
- **Tag** — category, radius/xs.
- **Toast** — top-drop parchment strip, in-voice copy, 3s, swipe-dismiss; money toasts include CoinAmount.
- **EmptyState** — illustration slot + line + optional CTA; per-screen art from §6 scene kit.
- **StreamGiftEvent** — full-width chat row for gifts, tier-colored, auto-scroll-pinned for tier ≥3.
- **AvatarBuilderOptionCell** — item thumb, equipped check, locked(crown) variant with bounce-on-tap.
- **RouletteWheel** — portrait segments, pot center, tick-spin physics.
- **ReceiptCard** — parchment, deckle edge, itemized rows, vulture stamp corner, export action.

---

# SECTION 5 — MOTION DESIGN

**Gift spectacle tiers (SpectacleOverlay variants):**
- **T1 Nickel Toss (1–9):** single coin arcs into a tin cup, *ting*, 450ms, `ease/spring-heavy`, light haptic.
- **T2 Handful (10–49):** coin toss + cup rattle, cup tilts, 700ms, medium haptic double-tap.
- **T3 Purse (50–99):** purse drops, bursts, 12–20 coins with physics bounce, 900ms, cascade sound, success haptic.
- **T4 Gunshot Drop (100–499):** screen flash 80ms (≤3Hz safe), dry-crack gunshot, coin rain 40 particles, amount slams in Ultra with 8px screen-shake, 1200ms, heavy haptic.
- **T5 Gold Train (500+):** saloon doors burst open frame-left, a gold locomotive crosses screen dragging coin dust, every lobby/stream viewer sees it simultaneously, amount + giver PosterChip on the caboose, 1600ms, long haptic ramp. Priority queue: T5 interrupts T1–T3, queues behind concurrent T5s.
- **Money rain (generic big-win):** 60-particle cap, gold coins with 3 sprite rotations, gravity + floor bounce, despawn 400ms after settle.

**Ceremonies:** Deposit success — coins pour into wallet card top, balance counts up (Plex Mono odometer), vulture swoops, takes 1 coin, squawk, tips crown, exits (total 1400ms). Cash-out success — cactus grows from button, blooms, green confetti (only green burst in app), 1100ms. **Coronation (S43):** doors open with light bloom → crown lowers onto character (2s) → squalor outfit folds itself into a chest, chest locks with an audible clunk (the one-way door made literal) → title stamps in Ultra → shareable card slides up. Total 4s, skippable after 1.5s.
**Losing/negative:** duel loss — hat tumbles off, tumbleweed crosses, 600ms, no shame sting (losses stay light); beg expiry — sepia wash 400ms; rejection states never animate beyond a 240ms banner slide (the Sheriff is not entertainment).
**XP/level:** spark travels XP bar (240ms); level-up — badge stamps with `ease/overshoot`, dust puff, 500ms. Streak — dynamite fuse lights another notch, sizzle sound.
**Transitions:** tab switch = 160ms crossfade + spurs; push nav = 240ms slide `ease/standard`; sheets = 240ms up with scrim fade; spectacle layers render above nav. Pull-refresh lasso: pull distance winds the rope, release snaps (320ms).
**Loading:** lasso spinner (revolver cylinder rejected for store-safety), skeletons shimmer at 1.2s loop in `midnight/600`.
**Haptics map:** light=selection, medium=gift sent, success pattern=money received, heavy=T4+, ramp=hold-to-confirm fill, error=double-buzz short. All haptics fire even when muted; Reduce Motion swaps every spectacle for a static celebratory card + haptic + sound (nothing is lost, only motion).

---

# SECTION 6 — ILLUSTRATION SYSTEM

**Style:** chunky 2D vector-cartoon, thick variable-weight ink outlines (3–5px at 1x), squash-and-stretch physique, grotesque-comedy proportions (big heads, tiny legs, huge hands), textured flat fills with subtle paper grain, rim-light from gold sources. Reference vector: Supercell expressiveness × Lackadaisy western × classic Looney anatomy. Never realistic, never cute-corporate.

**Characters:**
- **Vagrants (squalor set — enforced):** base bodies gaunt-or-lumpy comedic; wardrobe library ALL worn: patched dusters (6 patch patterns), rope belts, mismatched boots, straw hats with bites taken out, fingerless gloves, dented tin cups (5 dent tiers — the cup is the Vagrant's signature prop and levels visually with XP), quirk slots (fly halo, hiccup bubble, sad harmonica). Expressions skew pleading-theatrical: puppy eyes, hopeful grin with missing tooth, dramatic despair, jackpot shock. The squalor is *performed*, never pitiable — every pose is vaudeville.
- **Lords (finery set):** upright silhouettes, velvet frock coats (oxblood/midnight/emerald), brocade vests, top hats/stetsons with hatbands, monocles, gold-tipped canes, signet rings; crest system (choose sigil at coronation). Expressions skew imperious-comedy: smug, magnanimous, scandalized, make-it-rain glee. Idle animation: coin flip.
- **The Monarch (mascot):** obese vulture, crooked crown, counting-house sleeve garters, ledger under wing; appears ONLY at fee moments and merch. 12 poses (swoop, take-coin, tip-crown, shrug "them's the rules," sleeping on gold).
- **The Sheriff:** weary armadillo, star badge, coffee, stamp; poses for scan/verdict/warning/ban ("run out of town" — pointing at the horizon). Never comedic during hard enforcement.
- **NPCs/scene kit:** bartender bison, telegraph-operator prairie dog, undertaker crow (handles deleted accounts), tumbleweeds, cacti (bloom state reserved for cash-out), Perdition Gulch backdrops: Main Street day/night, saloon interior, bank facade (deposit lore), courthouse, desert-empty.
- **Props/collectibles:** cups, hats, crests, badges (tin/silver/gold frames), season trophies (Gold Rush pan, nugget, locomotive), poster frames, coin sprite set (3 rotations + stack of 5 sizes).
- **Avatar builder architecture:** layered rig — body / head / expression / headwear / outfit / accessory / prop(cup or cane) / backdrop; all items authored on the shared rig so caste swap at coronation is a wardrobe transaction, not a re-rig. Expression set (10) shared across castes, styled per caste.

---

# SECTION 7 — FLOWS AS TRANSITIONS (visual spec)

- **Guest → member:** any gated tap → BottomSheet (not full screen — keep the show visible behind scrim) "Need a name in this town" → auth → return to the exact interrupted action with state preserved.
- **First gift (observer conversion):** Nickel Toss tap with zero balance → sheet: "Your pockets are empty, partner" → "Ride to the Bank ↗" → external → return deep-link lands back ON THE SAME CLIP, toast "Gold's in," Nickel Toss auto-completes with T1 spectacle. (The interrupted-intent restoration is the single most important flow in the app — spec it pixel-perfect.)
- **Beg lifecycle:** composer → scan interstitial (pass: stamp THUD, green-lit? no — gold-lit check; reject: oxblood slide-in with reason) → dramatizer opt-in (before/after preview slider) → post confetti-less (posting isn't the win; getting gifted is) → live card → gift events animate progress → 24h sepia expiry → recap card slide-up with share.
- **Ascension:** S42 scroll-crossfade → funded check (else deposit handoff loop with return-to-S42) → S43 hold-to-confirm (haptic ramp; releasing early rewinds fill with rope-creak) → coronation ceremony → finery creator → Main Street re-entry where the nav ActionOrb morphs cup→dynamite in front of the user (identity change made visible).
- **Dispute:** verdict rejection → Vagrant banner "Appeal at the Courthouse" → statement flow → status chip lifecycle (filed→heard→ruled) via notification rows, each written formally.
- **Errors, globally:** field-level = shake + inline oxblood caption; network = toast with retry; money-mutation failures = full Dialog, never toast ("No gold moved." is the mandatory reassurance line on every failed money op); destructive confirms = Dialog; irreversible = IrreversibleDialog with hold.
- **Success states, globally:** money-in = gold ceremonies; money-out = the only green; everything else (follows, posts, saves) = quiet toasts. Scarcity of celebration protects the value of celebration.

---

# SECTION 8 — DEVELOPER NOTES (React Native)

- **Stack:** RN + TypeScript; Expo (dev-client) acceptable given no IAP; Reanimated 3 + Skia for spectacles/particles; Lottie for character ceremonies; react-navigation (native-stack + bottom-tabs); FlashList for feeds; LiveKit/Agora SDK for streams; vendor SDK (Persona/Sumsub) for KYC; universal links for deposit return.
- **State:** server state = TanStack Query (balances, feeds, lobbies — with websocket cache patches for live gift events); client state = Zustand slices (`session`, `wallet`, `spectacleQueue`, `composerDraft`, `settings`); spectacle queue is a priority queue singleton consumed by a root-level `<SpectacleLayer/>` mounted above navigation.
- **Folder structure:**
```
src/
  app/            # navigation trees, screens by domain
    auth/ onboarding/ home/ madness/ lobbies/ beg/
    challenges/ wallet/ kyc/ ascension/ profile/
    social/ progression/ games/ system/
  components/     # GDS library, 1 folder per component + stories
  design/         # tokens.ts (generated from Figma variables), themes, motion.ts, haptics.ts, sounds.ts
  features/       # domain logic hooks (useGift, useBegComposer, useAscension)
  services/       # api client, ws, deeplinks, kyc, payments-handoff
  stores/         # zustand slices
  assets/         # lottie/ sprites/ foley/ illustrations/
```
- **Naming:** components PascalCase matching Figma names 1:1 (`BegCard`, `GiftComposerSheet`); tokens mirror Figma paths (`color.bg.card`, `space[4]`, `motion.base`); analytics events `noun_verb` (`gift_sent`, `beg_posted`, `ascension_confirmed`).
- **Token pipeline:** Figma Variables → Tokens Studio export → style-dictionary → `tokens.ts` + native theme files; CI fails on orphan hex values in components.
- **Money rules in code:** all amounts integer coins (never floats); display via `<CoinAmount/>` only; fees computed server-side and rendered from API, never client-derived; optimistic UI allowed for reactions, NEVER for money mutations.
- **Zero-IAP guardrails:** no price strings, no product SKUs, no purchase verbs ("buy") in the binary for real currency; shop uses coin-prices only; deposit flow = `Linking.openURL(signedCheckoutUrl)` + `appState` resume polling + deep-link confirm.
- **Perf budgets:** 60fps on Pixel 4a-class; spectacle particle cap 60; FlashList estimated sizes mandatory; images via expo-image with blurhash placeholders.
- **Accessibility:** every GDS component ships with a11y props baked in; screen-reader announcements for gift events throttled to 1/2s.

---

# SECTION 9 — FIGMA AUTO LAYOUT CONSTRUCTION RULES

- **File architecture (pages):** 00 Cover · 01 Foundations (variables, styles, grid demos) · 02 Components (GDS, one section per component, all variants) · 03 Patterns (sheets, dialogs, spectacle frames) · 04 Screens–Entry · 05 Screens–Core · 06 Screens–Money · 07 Screens–Social · 08 Screens–System · 09 Flows (prototype wiring boards) · 10 Illustration kit · 11 Handoff notes.
- **Frames:** base frame 393×852 (iPhone 15) with 16px margins; secondary artboards at 360×800 (Android compact) for every money screen and Main Street; all screens are top-level vertical Auto Layout frames: children = TopAppBar (fixed), ScrollArea (fill, its own AL stack, gap 12), NavBar (fixed). Constraints: pin nav bottom, app bar top, scroll fills.
- **Auto Layout discipline:** every component is AL, no absolutely-positioned children except SpectacleOverlay art layers (in an absolute-position wrapper frame flagged `fx/`); padding uses `space/*` variables exclusively — no raw numbers; gaps likewise; min/max widths set on Buttons (min 120) and Cards; text layers set to Fill width, truncate only where spec'd (names truncate, money never truncates — containers hug).
- **Variants & properties:** components use Figma properties matching Section 4 prop tables verbatim (so the AI builder and RN share a schema); boolean props for icon slots; instance-swap properties for illustration slots (BegCard portrait, EmptyState art); text properties for all copy so content variables can drive lore labels.
- **Variables usage:** color = semantic collection with Dark/HighNoon modes toggled at frame level; spacing/radius as number variables bound to AL padding and corner fields; string variables for lore vocabulary ("MAIN STREET", "THE COURTHOUSE") bound into overline text layers.
- **Responsive rules:** 1-col ↔ 2-col masonry switch at 400pt via component variant (`layout=compact/regular`); NavBar labels hide below 360pt; all sheets use % snap heights; test frames included at 320pt width for accessibility large-text overflow checks.
- **Prototype wiring (page 09):** flows per Section 7 with smart-animate reserved for spectacle previews only; sheet open = move-in 240ms standard curve; every gated action wired to the auth sheet return-path.

---

# SECTION 10 — MASTER AI FIGMA PROMPT

> Copy everything between the lines into the AI Figma builder.

---

Build a complete production-grade mobile app design file for **TIN CUP**, a satirical Wild-West entertainment app where users gift real money to strangers. Two permanent castes: **Vagrants** (receivers — enforced comedic "squalor" avatars: patched rags, dented tin cups, missing-tooth grins) and **Lords** (givers — velvet finery, crowns, canes; entered via a one-way $100 ascension, can never return to Vagrant). The platform mascot is **the Monarch**, a fat smug vulture who visibly takes the fee on every receipt; the safety mascot is **the Sheriff**, a weary armadillo. World: "Perdition Gulch," night-desert palette, wanted-poster typography, saloon vocabulary. Tone: 80% deadpan-western comedy, 15% hype, 5% dead-serious (all money/safety surfaces). Critical constraint: **zero in-app purchases** — money loading happens via an external "Ride to the Bank ↗" browser redirect; no prices, packages, or purchase UI appear anywhere except coin-denominated cosmetic prices.

**DESIGN SYSTEM.** Dark-first. Colors (create as variables, semantic collection with Dark + "High Noon" light modes): canvas #0B0E14, surface #12161F, card #1A2029, elevated #242B36, border #303844; gold primary #F5B32B (hover #FFC94D, pressed #C98F14); danger oxblood #8E2D30; money-received green #3F9B5B used ONLY for cash-out moments; parchment #F4EEDD with shade #E4DAC0 and ink #17130C; text #F7F5F0 / #B9B4A8 / #7A766C; dust #8C7A5B; link blue #4E7DA6; light mode = parchment canvas, warmed white surfaces, ink text, gold/oxblood unchanged. Rule: gold = money, green = paid out, oxblood = law/danger — never violate. Typography: **Ultra** (fat Clarendon) for ceremonial display only — gift amounts in celebrations, caste titles, season names, uppercase +2% tracking; **Archivo** (Black/SemiExpanded Bold) for headlines, buttons, tabs; **Inter** for all body/UI; **IBM Plex Mono** tabular for every financial number in wallets/ledgers/receipts. Type styles: display 56/60 and 40/44 (Ultra); headlines 28/32, 22/28, 18/24 (Archivo); body 17/24, 15/20, 13/16 (Inter); numeric 24/32, 17/24, 13/16 (Plex Mono); caption 12/16; overline 11/16 uppercase +8% tracking for lore labels ("MAIN STREET"). 8pt spacing scale (4,8,12,16,24,32,40,48,64) as number variables bound to all Auto Layout padding; radii 6/10/14/20/999; dark elevation = subtle borders + black shadows (0-1-2, 0-4-12, 0-12-32) plus a gold glow (0 0 24 rgba(245,179,43,.35)) reserved for the wallet balance card and money ceremonies. Icons: 24px, 2px rounded strokes, hand-forged single bevel; set includes tin-cup, coin-stack, wanted-poster, sheriff-star, saloon-doors, dynamite, lasso, spur, horseshoe, crown, vulture, cactus, scales, megaphone, bell, flag, share, camera, stream-signal, chevrons, close, check; NO firearm imagery anywhere. Accessibility: 4.5:1 minimum contrast, 44pt touch targets, money values never truncate, all layouts tested at 320pt width and 135% text scale.

**COMPONENTS (build as variants with these exact properties).** Button(variant: primaryGold/secondaryOutline/tertiaryText/dangerOxblood/moneyCactus; size L56/M48/S36; state default/pressed/disabled/loading; icon none/left/right; holdToConfirm boolean — a 2s fill-up press for irreversible actions). CoinAmount(size; signed +gold/−muted/netGreen; coin glyph + Plex Mono value + optional USD sub-line) — the only way money is ever typeset. BegCard(variants feed/masonry/preview/expired-sepia/flagged: character portrait slot [instance-swap], Archivo title, optional GoalBar with gold spring-fill + Plex Mono fraction + FUNDED stamp state, giver avatar stack "+42", 24-hour radial time ring, gifted CoinAmount, category tag). ChallengeCard(bounty CoinAmount dominant in Ultra, task title, Lord PosterChip, literal burning-fuse deadline bar; states open/accepted/judging/paid/expired). WalletCard(gold-glow hero, crest watermark, XL CoinAmount, two-button row). PosterChip(avatar in poster frame + name + TitleChip; S/M). TitleChip(Ultra XS uppercase pill; Lord gold-on-midnight, Vagrant dust-on-parchment, rare variant with glint). GiftComposerSheet(recipient chip, presets 10/50/100/500 with spectacle-tier preview thumbnails, custom numpad, fee note, FaceID confirm ≥$100; two-tap happy path). SpectacleOverlay(tiers 1–5 full-screen celebration frames — see MOTION). LiveBattleBar(two-sided gold tug-of-war with crests and Plex Mono totals). StatusChip(live-pulsing-red/pending/verified-star/flagged/funded/expired). Badge(rarity frames tin/silver/animated-gold; locked silhouette variant). TrustMeter(5 stars + sheriff tier). Alert(info-parchment/warning/danger/success-green-money-only). Dialog(max 2 actions; IrreversibleDialog variant with hold-to-confirm). BottomSheet(grabber, 20px top radius, 40/70/100% snaps, blurred scrim). Bottom NavBar(5 slots; raised 56pt gold center ActionOrb whose icon is caste-dependent: tin-cup for Vagrants → dynamite for Lords). TopAppBar(overline lore label + headline; trailing BalancePill that pulses on change + bell). LedgerRow(icon, description, signed CoinAmount, fee sub-rows marked with vulture icon, never hidden). Toast(parchment top strip, in-voice copy). EmptyState(illustration slot + one line + optional CTA). StreamGiftEvent(tier-colored full-width chat row). ReceiptCard(parchment, deckle border, itemized rows, vulture stamp, export). RouletteWheel(portrait segments, Plex Mono pot center). AvatarBuilderOptionCell(equipped check; locked variant with crown padlock that bounces on tap).

**SCREENS (62 — build every one, base frame 393×852 with 16px margins plus a 360×800 variant for all money screens; top-level vertical Auto Layout: fixed TopAppBar, filling scroll stack gap 12, fixed NavBar).** Splash (coin drops into cup silhouette). Welcome (muted clip montage behind scrim; primary "Walk into town" guest mode; caption "Look around free. No account till you touch money."). Sign up/in, OTP, DOB age gate with under-18 dead-end, permissions primer. **Choose Your Fate**: parchment "THE DRIFTER" vs gold "THE LORD $100 buy-in" diptych split by a rope divider, tap-to-expand 70%, footer "Drifters can rise. Lords never fall — and never go back." **Vagrant Character Creator**: avatar stage on dirt-road backdrop (idle sway + flies), tabs Face/Hair/Rags/Cup/Quirk, all options free and worn (patched dusters, dented cups in 5 dent tiers, missing-tooth grins), plus a padlocked grayed finery row in every category labeled "Lords only" that bounces with tooltip "Rise to Lordship to wear this." Lord Creator (finery: velvet coats, top hats, monocles, canes, crest picker). Naming with drawl error copy. **Main Street home**: overline MAIN STREET; Live Now horizontal rail of stream cards (red pulse, viewer counts); trending BegCards; ChallengeCards; leaderboard teaser; gold-shimmer Lucky Hour banner slot; lasso pull-to-refresh; empty state tumbleweed "Quiet out here. Ride into a Saloon →". **Feed of Madness**: full-bleed vertical clip pager, right rail (avatar/lasso-react/Nickel-Toss instant 5-coin gift/share/flag), bottom scrim with outlaw name + title chip + caption + gifted ticker "1,240 coins thrown"; double-tap lasso reaction; end-of-feed "You've seen everything the town did today. Come back at sundown." Clip detail. Lobby directory (occupancy dots). **General Lobby**: pot stats strip in Plex Mono (total thrown today, active begs, biggest drop), filter chips Newest/Rising/Ridiculous/Nearly-funded/Big-goals, 2-column BegCard masonry (1-col under 400pt), 4am empty state: character asleep under cactus, "Even beggars sleep. First beg of the morning gets the Early Bird badge." Themed lobby with pinned house rules. **Live Saloon Stream**: full-bleed video, top scrim host chip + LIVE + viewers, LiveBattleBar when Lord-vs-Lord, right gift shortcuts 10/50/100/500, chat with gold StreamGiftEvent rows, parchment bounty banner with dynamite fuse timer; drop state: sepia freeze "Connection shot down. Reloading…". **Beg composer** 3-step (Write with 60-char title + 280 story + goal toggle + parchment banner "Keep it legal & fun, partner. ✔ 'Best outlaw dance for $50' ✔ 'Fund my mustache wax' ✘ scams ✘ danger"; Show with 60s video + "Dramatize with AI" disabled until scan passes, sublabel "The Sheriff checks it first"; Preview rendered as the exact lobby card, post button "2nd of 2 today"). Sheriff scan interstitial (armadillo stamping, 1–3s; reject = oxblood banner with plain reason + edit + appeal link). Dramatizer before/after slider. **Beg detail**: character performing on stage vignette, goal bar with giver stack "47 strangers chipped in," gift row Nickel/25/100/Custom, spectacle plays over hero when gifts land; expired sepia + recap link. Recap share card. Challenge board/detail/composer (escrow line "Bounty locked in the safe until you rule")/proof submission/verdict (Approve gold, Reject oxblood requiring reason, Split-pot; rejection triggers Vagrant appeal banner). **Wallet home** — the sober screen: gold-glow balance card (coins Plex Mono XL + USD sub-line), buttons "Add gold" and green "Cash out," pending-holds row with sheriff icon, last-5 ledger, tax center + limits links, static fee disclosure "The Monarch takes 1% when gold comes in, 10% when Vagrants cash out" with vulture mark. **Deposit handoff**: parchment card "Gold gets minted at the Bank, not the Saloon. We'll take you to our secure site to load up," single button "Ride to the Bank ↗" (external browser), lock icon + partner name, NO amounts or prices anywhere; waiting state "Counting your gold…"; return success = coin rain + odometer count-up + vulture takes his 1% coin with a squawk; failure = "The Bank couldn't complete it. No gold moved." **Cash-out**: numpad amount with MAX chip → parchment review receipt with −10% Monarch line (vulture animates taking a coin), net in green, FaceID ≥$100, first-time interstitial "First haul gets counted for 24 hours. Standard law." → 3-step status Counted/Sent/Landed → cactus-bloom green confetti success (the only green celebration in the app). Ledger (fees never netted), Receipt (vulture stamp, export), Tax center (YTD Plex Mono, 1099-K threshold bar, "gifts may be taxable"). KYC "Get deputized" intro, capture shell, status pending/verified/flagged-with-human-contact. **Ascension pitch**: scroll crossfades squalor avatar into finery silhouette, benefits, "$100 minimum stake," CTA "Begin the Ascension." **The Point of No Return**: full-screen midnight, illustrated door with gold light through cracks, Ultra headline "LORDS NEVER FALL," body "Once you take the title, you can never beg again. No going back. Ever.", hold-to-confirm 2s "Hold to swear the oath" with haptic ramp + quiet "I'm not ready" — then coronation: doors burst, crown lowers, squalor wardrobe folds into a chest that locks shut, title stamps, share card. **Wanted Poster profile**: parchment poster, caste overline, portrait frame, Ultra outlaw name, stars + trust badge, Given/Received/Streak in Plex Mono, badge shelf with glint, Vagrant "My Story" rags-to-riches timeline OR Lord "My Court" module, season rank chip; other-profile actions Follow→Fan→Kneel (Worshipper oath confirm sheet), Gift, Message, Flag; export-poster action. Relations list with kneeling Worshipper row illustration. Court (private lobby, role crests Worshipper/Favored/Knight) + Court admin with shower-the-court group gift. Posse guild page. DMs with sealed coin-pouch gift bubbles + Sheriff scan notice in header. **Leaderboards**: tabs Richest Baron/Luckiest Drifter/Fastest Climber/Most Ridiculous × Today/Week/Season, illustrated coin medallions top 3, own row pinned bottom with gold border "You — #412," season-start empty "Fresh season. Nobody's rich yet. Terrifying." Season hub (Gold Rush art, Bounty Board quests, cosmetic pass track coin-priced). Badge collection (locked silhouettes). Cosmetics shop (coin prices only, rarity frames, preview-on-avatar, seasonal stock counters). Beggar's Roulette (portrait wheel, Lord-funded pot center, free entry 1/day, fixed draw hour, official-rules footer). Duel (cosmetic stakes, quickdraw best-of-3, caption "no money changes hands"). Notifications grouped Money/Town/The Law, every row in-voice ("A Baron just emptied his purse on your sorry beg. 89 coins, partner."). Search. Settings with top-level "Limits & self-exclusion" shield section (deposit caps, gift caps, cool-downs, self-exclusion with re-entry delay; sober copy). **Sheriff's Office**: hub (Report/My disputes/The Courthouse/The Law with allowed-wildness examples first), 2-step report flow, dispute rows with status chips, Courthouse appeal with 72h SLA printed — all safety copy drops the comedy. Help/FAQ. Error family: offline cut-telegraph-wire, maintenance town-closed sheriff-hammering, forced-update new-law-posted, empty-desert 404, generic "Something spooked the horses. [Try again]"; every failed money operation shows the mandatory line "No gold moved."

**MOTION (annotate on frames; build spectacle frames as separate artboards).** Durations 80/160/240/400ms + 900–1600ms money ceremonies; standard curve cubic-bezier(.2,0,0,1), heavy-spring for coins, overshoot(.34,1.56,.64,1) for badges. Gift tiers: T1 single coin arc + ting 450ms; T2 cup rattle 700ms; T3 purse burst 12–20 physics coins 900ms; T4 (100–499) 80ms flash + dry gunshot + 40-coin rain + Ultra amount slam + 8px shake 1200ms; T5 Gold Train (500+) saloon doors burst, gold locomotive crosses with giver chip on caboose, visible to all lobby viewers, 1600ms; one ceremony at a time, bigger interrupts smaller; 60-particle cap; Reduce Motion swaps all spectacles for static celebration cards. Coronation 4s (doors→crown→wardrobe locks into chest→title stamp), skippable after 1.5s. Deposit success vulture swoop 1400ms; cash-out cactus bloom 1100ms. Losses stay light (hat tumbles + tumbleweed 600ms). Lasso pull-to-refresh, lasso loading spinner, 1.2s skeleton shimmer. Tab crossfade 160ms with spur-step sound; sheets 240ms.

**PROTOTYPE WIRING.** Wire: guest browsing → any gated action opens auth as a bottom sheet over the live content and returns to the exact interrupted action; Nickel Toss with empty balance → "Your pockets are empty, partner" sheet → external Bank redirect → deep-link return lands on the SAME clip and auto-completes the gift with T1 spectacle; full beg lifecycle composer→scan→post→gifted→expiry→recap; full ascension including early-release rewind on the hold button; cash-out with first-time 24h-hold interstitial; report→dispute→appeal chain. Use smart-animate only for spectacle previews.

**FILE ORGANIZATION.** Pages: 00 Cover · 01 Foundations · 02 Components (all variants) · 03 Patterns · 04–08 Screens by domain (Entry/Core/Money/Social/System) · 09 Flow wiring · 10 Illustration kit (characters: gaunt comedic Vagrants in 6 patch-pattern dusters with 5-tier dented cups and theatrical pleading expressions; imperious Lords in velvet with coin-flip idle; the vulture Monarch's 12 poses; the armadillo Sheriff; bison bartender, prairie-dog telegraph operator, undertaker crow; Perdition Gulch backdrops day/night, saloon, bank, courthouse, desert; props: badges in tin/silver/gold frames, trophies, coin sprites; thick-ink chunky 2D cartoon style, squash-and-stretch, paper-grain fills, gold rim light, never realistic) · 11 Handoff. Every layer named, every component using Auto Layout with spacing variables, semantic color variables with Dark/HighNoon modes, string variables for lore labels, no raw hex values anywhere.

---

*End of Stage 2. Stage 3 (build) proceeds from this document plus the Stage 1 Bible.*
