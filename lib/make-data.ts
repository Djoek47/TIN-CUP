/** Mock data mirrored from Figma Make Tin-Cup-V2 App.tsx — visual parity seed. */

export type MakeBeg = {
  id: number
  handle: string
  title: string
  beg: string
  coins: number
  goal: number | null
  givers: number
  timeLeft: number
  cat: string
}

export type MakeChallenge = {
  id: number
  lord: string
  bounty: number
  task: string
  deadline: string
  participants: number
}

export type MakeStream = {
  id: number
  host: string
  viewers: number
  battle: boolean
  leftCoins?: number
  rightCoins?: number
}

export const BEGS: MakeBeg[] = [
  { id: 1, handle: "DustyPete", title: "Drifter", beg: "Fund my championship mustache wax regionals", coins: 847, goal: 1000, givers: 23, timeLeft: 18, cat: "GROOMING" },
  { id: 2, handle: "RaggedMolly", title: "Notorious Outlaw", beg: "Best outlaw dance for $50 bounty right here", coins: 234, goal: 500, givers: 8, timeLeft: 6, cat: "PERFORMANCE" },
  { id: 3, handle: "SorrySam", title: "Beggar", beg: "My horse ate my hat. Again. Third time this month.", coins: 1240, goal: null, givers: 47, timeLeft: 22, cat: "COMEDY" },
  { id: 4, handle: "DesperateDoug", title: "Rascal", beg: "Funding world-class spittoon cleaning education", coins: 89, goal: 250, givers: 5, timeLeft: 12, cat: "AMBITION" },
  { id: 5, handle: "WailfulWendy", title: "Folk Hero", beg: "My collection of decorative tin cups runneth over", coins: 2100, goal: null, givers: 89, timeLeft: 3, cat: "COMEDY" },
  { id: 6, handle: "BokeKershaw", title: "Beggar", beg: "Name a star after my ex so it can also ignore me", coins: 320, goal: 400, givers: 12, timeLeft: 14, cat: "HEARTBREAK" },
]

export const CHALLENGES: MakeChallenge[] = [
  { id: 1, lord: "BaronVaultsworth", bounty: 500, task: "Sing 'Home on the Range' wearing a barrel in Times Square", deadline: "2d", participants: 14 },
  { id: 2, lord: "TycoonBlackridge", bounty: 250, task: "Convince a total stranger that you're actually a ghost", deadline: "18h", participants: 6 },
]

export const STREAMS: MakeStream[] = [
  { id: 1, host: "BaronVaultsworth", viewers: 1847, battle: true, leftCoins: 12400, rightCoins: 8900 },
  { id: 2, host: "LordCrimsonhat", viewers: 423, battle: false },
  { id: 3, host: "TheDuchess", viewers: 892, battle: false },
]

export const LEADERBOARD = [
  { rank: 1, name: "BaronVaultsworth", title: "Baron", value: "48,200" },
  { rank: 2, name: "TycoonBlackridge", title: "Tycoon", value: "31,890" },
  { rank: 3, name: "LordCrimsonhat", title: "Lord", value: "22,450" },
  { rank: 4, name: "BaronMonroe", title: "Baron", value: "19,100" },
  { rank: 5, name: "LordHightower", title: "Lord", value: "11,240" },
]

export const LEDGER = [
  { id: 1, icon: "💰", desc: "Gift from BaronVaultsworth on your beg", coins: "+247", time: "2h ago", fee: false },
  { id: 2, icon: "🦅", desc: "The Monarch's cut (10%)", coins: "−24", time: "2h ago", fee: true },
  { id: 3, icon: "💰", desc: "Gift from LordCrimsonhat on your beg", coins: "+89", time: "5h ago", fee: false },
  { id: 4, icon: "🦅", desc: "The Monarch's cut (10%)", coins: "−8", time: "5h ago", fee: true },
  { id: 5, icon: "🏦", desc: "Deposit via Bank (1% Monarch's cut already taken)", coins: "+495", time: "1d ago", fee: false },
]

export const NOTIFICATIONS = [
  { id: 1, group: "Money", icon: "💰", title: "A Baron just emptied his purse on your sorry beg.", sub: "89 coins, partner. Check your wallet.", time: "2m ago", coins: "+89" },
  { id: 2, group: "Town", icon: "🤠", title: "RaggedMolly started following you.", sub: "They're watching. Beg accordingly.", time: "14m ago", coins: null as string | null },
  { id: 3, group: "Money", icon: "🦅", title: "The Monarch collected his cut.", sub: "1% on your deposit. He never misses.", time: "1h ago", coins: "−5" },
  { id: 4, group: "The Law", icon: "⭐", title: "Your beg passed the Sheriff's scan.", sub: "You're clear to post. Don't push it.", time: "3h ago", coins: null as string | null },
  { id: 5, group: "Town", icon: "🏆", title: "Lucky Hour starts in 10 minutes!", sub: "2× visibility for all active begs.", time: "10m ago", coins: null as string | null },
]

export const FEED_CLIPS = [
  { id: 1, handle: "RaggedMolly", title: "Notorious Outlaw", caption: "I trained 6 years to spin a lasso and now I beg for rent money. Watch this.", coins: 1240, bg: ["#180828", "#380860"] as const },
  { id: 2, handle: "SorrySam", title: "Drifter", caption: "My landlord raised the rent. My horse raised objections. My dignity has left the building.", coins: 847, bg: ["#081828", "#183870"] as const },
  { id: 3, handle: "DustyPete", title: "Folk Hero", caption: "Day 47 of begging for mustache wax. The mustache grows stronger. My will weakens.", coins: 2100, bg: ["#152808", "#305014"] as const },
]

export const CHAR_ITEMS = {
  Face: [
    { emoji: "😄", label: "Missing Tooth Grin" },
    { emoji: "🥹", label: "Puppy Eyes" },
    { emoji: "😅", label: "Nervous Sweat" },
    { emoji: "😤", label: "Determined Scowl" },
    { emoji: "🎭", label: "Theatrical Despair" },
  ],
  Hair: [
    { emoji: "💇", label: "Tangled Mop" },
    { emoji: "🧶", label: "Knotted Mess" },
    { emoji: "🪶", label: "Sad Bun" },
    { emoji: "🧵", label: "Straggly Wisps" },
    { emoji: "👑", label: "Velvet Crown", locked: true },
  ],
  Rags: [
    { emoji: "🧥", label: "Patched Duster" },
    { emoji: "👔", label: "Moth-eaten Vest" },
    { emoji: "🧤", label: "One-finger Gloves" },
    { emoji: "🎪", label: "Canvas Sack Poncho" },
    { emoji: "🥻", label: "Velvet Frock Coat", locked: true },
    { emoji: "👘", label: "Brocade Vest", locked: true },
  ],
  Cup: [
    { emoji: "🫙", label: "Slightly Dented" },
    { emoji: "🪣", label: "Moderately Dented" },
    { emoji: "🎃", label: "Extremely Dented" },
    { emoji: "💀", label: "Actually a Skull" },
    { emoji: "✨", label: "Gold-Plated Cup", locked: true },
  ],
  Quirk: [
    { emoji: "🦟", label: "Fly Halo" },
    { emoji: "🎵", label: "Sad Harmonica" },
    { emoji: "💧", label: "Eternal Tear" },
    { emoji: "🫧", label: "Hiccup Bubble" },
    { emoji: "🌟", label: "Lucky Glint", locked: true },
  ],
} as const

export type CharCat = keyof typeof CHAR_ITEMS
