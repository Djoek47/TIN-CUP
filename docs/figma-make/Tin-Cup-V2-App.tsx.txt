import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Screen = "splash" | "welcome" | "chooseFate" | "characterCreator" | "main";
type Tab = "mainStreet" | "feed" | "lobbies" | "profile";
type SubScreen =
  | null | "wallet" | "deposit" | "cashOut" | "begDetail"
  | "leaderboard" | "composer" | "ascension" | "ponr"
  | "liveStream" | "notifications" | "search" | "challengeDetail";

// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
const C = {
  m900: "#0B0E14", m800: "#12161F", m700: "#1A2029", m600: "#242B36", m500: "#303844",
  g500: "#F5B32B", g400: "#FFC94D", g600: "#C98F14",
  o500: "#8E2D30", o400: "#B33A3E",
  c500: "#3F9B5B",
  p100: "#F4EEDD", p300: "#E4DAC0", ink: "#17130C",
  wHi: "#F7F5F0", wMid: "#B9B4A8", wLo: "#7A766C",
  dust: "#8C7A5B", sky: "#4E7DA6",
} as const;

// ─── GLASS STYLE HELPERS ──────────────────────────────────────────────────────
const G = {
  card: {
    background: "rgba(26,32,41,0.72)",
    backdropFilter: "blur(20px) saturate(150%)",
    WebkitBackdropFilter: "blur(20px) saturate(150%)",
    borderTop: "1px solid rgba(255,255,255,0.12)",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    borderLeft: "1px solid rgba(255,255,255,0.07)",
  } as React.CSSProperties,
  elevated: {
    background: "rgba(36,43,54,0.84)",
    backdropFilter: "blur(24px) saturate(160%)",
    WebkitBackdropFilter: "blur(24px) saturate(160%)",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    borderRight: "1px solid rgba(255,255,255,0.09)",
    borderBottom: "1px solid rgba(255,255,255,0.09)",
    borderLeft: "1px solid rgba(255,255,255,0.09)",
  } as React.CSSProperties,
  gold: {
    background: "rgba(245,179,43,0.13)",
    backdropFilter: "blur(16px) saturate(140%)",
    WebkitBackdropFilter: "blur(16px) saturate(140%)",
    borderTop: "1px solid rgba(245,179,43,0.35)",
    borderRight: "1px solid rgba(245,179,43,0.24)",
    borderBottom: "1px solid rgba(245,179,43,0.24)",
    borderLeft: "1px solid rgba(245,179,43,0.24)",
  } as React.CSSProperties,
  nav: {
    background: "rgba(9,12,18,0.88)",
    backdropFilter: "blur(28px) saturate(160%)",
    WebkitBackdropFilter: "blur(28px) saturate(160%)",
    borderTop: "1px solid rgba(255,255,255,0.13)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    borderLeft: "1px solid rgba(255,255,255,0.08)",
  } as React.CSSProperties,
  cactus: {
    background: "rgba(63,155,91,0.15)",
    backdropFilter: "blur(16px) saturate(140%)",
    WebkitBackdropFilter: "blur(16px) saturate(140%)",
    borderTop: "1px solid rgba(63,155,91,0.38)",
    borderRight: "1px solid rgba(63,155,91,0.28)",
    borderBottom: "1px solid rgba(63,155,91,0.28)",
    borderLeft: "1px solid rgba(63,155,91,0.28)",
  } as React.CSSProperties,
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const BEGS = [
  { id: 1, handle: "DustyPete", title: "Drifter", beg: "Fund my championship mustache wax regionals", coins: 847, goal: 1000, givers: 23, timeLeft: 18, cat: "GROOMING" },
  { id: 2, handle: "RaggedMolly", title: "Notorious Outlaw", beg: "Best outlaw dance for $50 bounty right here", coins: 234, goal: 500, givers: 8, timeLeft: 6, cat: "PERFORMANCE" },
  { id: 3, handle: "SorrySam", title: "Beggar", beg: "My horse ate my hat. Again. Third time this month.", coins: 1240, goal: null, givers: 47, timeLeft: 22, cat: "COMEDY" },
  { id: 4, handle: "DesperateDoug", title: "Rascal", beg: "Funding world-class spittoon cleaning education", coins: 89, goal: 250, givers: 5, timeLeft: 12, cat: "AMBITION" },
  { id: 5, handle: "WailfulWendy", title: "Folk Hero", beg: "My collection of decorative tin cups runneth over", coins: 2100, goal: null, givers: 89, timeLeft: 3, cat: "COMEDY" },
  { id: 6, handle: "BokeKershaw", title: "Beggar", beg: "Name a star after my ex so it can also ignore me", coins: 320, goal: 400, givers: 12, timeLeft: 14, cat: "HEARTBREAK" },
];

const CHALLENGES = [
  { id: 1, lord: "BaronVaultsworth", bounty: 500, task: "Sing 'Home on the Range' wearing a barrel in Times Square", deadline: "2d", participants: 14 },
  { id: 2, lord: "TycoonBlackridge", bounty: 250, task: "Convince a total stranger that you're actually a ghost", deadline: "18h", participants: 6 },
];

const STREAMS = [
  { id: 1, host: "BaronVaultsworth", viewers: 1847, battle: true, leftCoins: 12400, rightCoins: 8900 },
  { id: 2, host: "LordCrimsonhat", viewers: 423, battle: false },
  { id: 3, host: "TheDuchess", viewers: 892, battle: false },
];

const LEADERBOARD = [
  { rank: 1, name: "BaronVaultsworth", title: "Baron", value: "48,200" },
  { rank: 2, name: "TycoonBlackridge", title: "Tycoon", value: "31,890" },
  { rank: 3, name: "LordCrimsonhat", title: "Lord", value: "22,450" },
  { rank: 4, name: "BaronMonroe", title: "Baron", value: "19,100" },
  { rank: 5, name: "LordHightower", title: "Lord", value: "11,240" },
];

const LEDGER = [
  { id: 1, icon: "💰", desc: "Gift from BaronVaultsworth on your beg", coins: "+247", time: "2h ago", fee: false },
  { id: 2, icon: "🦅", desc: "The Monarch's cut (10%)", coins: "−24", time: "2h ago", fee: true },
  { id: 3, icon: "💰", desc: "Gift from LordCrimsonhat on your beg", coins: "+89", time: "5h ago", fee: false },
  { id: 4, icon: "🦅", desc: "The Monarch's cut (10%)", coins: "−8", time: "5h ago", fee: true },
  { id: 5, icon: "🏦", desc: "Deposit via Bank (1% Monarch's cut already taken)", coins: "+495", time: "1d ago", fee: false },
];

const NOTIFICATIONS = [
  { id: 1, group: "Money", icon: "💰", title: "A Baron just emptied his purse on your sorry beg.", sub: "89 coins, partner. Check your wallet.", time: "2m ago", coins: "+89" },
  { id: 2, group: "Town", icon: "🤠", title: "RaggedMolly started following you.", sub: "They're watching. Beg accordingly.", time: "14m ago", coins: null },
  { id: 3, group: "Money", icon: "🦅", title: "The Monarch collected his cut.", sub: "1% on your deposit. He never misses.", time: "1h ago", coins: "−5" },
  { id: 4, group: "The Law", icon: "⭐", title: "Your beg passed the Sheriff's scan.", sub: "You're clear to post. Don't push it.", time: "3h ago", coins: null },
  { id: 5, group: "Town", icon: "🏆", title: "Lucky Hour starts in 10 minutes!", sub: "2× visibility for all active begs.", time: "10m ago", coins: null },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Ico = {
  Cup: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 4h12l-2 10H8L6 4Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9 14v4m6-4v4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 18h10" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 8.5c.5-1 2.5-1 3 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Coin: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2"/>
      <path d="M12 7v10M9.5 9h5a1.5 1.5 0 0 1 0 3h-4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Sheriff: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l2.5 5.5L21 9.5l-4.5 4.5 1 6.5L12 17l-5.5 3.5 1-6.5L3 9.5l6.5-1L12 3Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Lasso: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <ellipse cx="10" cy="11" rx="7" ry="5" stroke={c} strokeWidth="2"/>
      <path d="M17 11c0 3.5 2 6 3 7" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="11" r="2.5" stroke={c} strokeWidth="2"/>
    </svg>
  ),
  Saloon: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="7.5" height="15" rx="1" stroke={c} strokeWidth="2"/>
      <rect x="13.5" y="5" width="7.5" height="15" rx="1" stroke={c} strokeWidth="2"/>
      <path d="M10.5 12.5V5M13.5 12.5V5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M3 5h18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Poster: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke={c} strokeWidth="2"/>
      <circle cx="12" cy="10" r="3.5" stroke={c} strokeWidth="2"/>
      <path d="M6 19c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Dynamite: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="8" y="7" width="8" height="12" rx="4" stroke={c} strokeWidth="2"/>
      <path d="M12 7V4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 3C13.5 3 15 4 15 4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 11h4M10 14h4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Crown: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M3 18l2.5-9 6.5 4.5 6.5-4.5 2.5 9H3Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18h18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Bell: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 10.5a6 6 0 0 1 12 0v3.5l2 3H4l2-3v-3.5Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 20a2 2 0 0 0 4 0" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Back: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Share: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 12v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="16 6 12 2 8 6" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="12" y1="2" x2="12" y2="15" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Flag: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 21V4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M4 4h14l-4 5.5 4 5.5H4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Cactus: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 21V9M12 9C12 6 10 4 8 4S4 6 4 9v2h4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 9c0-3 2-5 4-5s4 2 4 5v2h-4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 21h6" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Search: ({ s = 24, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2"/>
      <path d="M21 21l-4.35-4.35" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  Star: ({ s = 16, c = "currentColor", filled = false }: { s?: number; c?: string; filled?: boolean }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={filled ? c : "none"}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Check: ({ s = 16, c = "currentColor" }: { s?: number; c?: string }) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// ─── ATOMIC COMPONENTS ────────────────────────────────────────────────────────
const CoinAmt = ({ value, size = "M", signed = "none", usd, className = "" }: {
  value: number | string; size?: "XL" | "L" | "M" | "S"; signed?: "plus" | "minus" | "net" | "none"; usd?: string; className?: string;
}) => {
  const fs = { XL: 38, L: 22, M: 16, S: 13 };
  const cs = { XL: 28, L: 18, M: 14, S: 11 };
  const col = signed === "plus" ? C.c500 : signed === "minus" ? C.wMid : signed === "net" ? C.c500 : C.g500;
  const pre = signed === "plus" ? "+" : signed === "minus" ? "−" : "";
  return (
    <div className={`flex flex-col ${className}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: cs[size], lineHeight: 1 }}>🪙</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: fs[size], fontWeight: 500, color: col, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
          {pre}{typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
      {usd && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.wMid, marginTop: 2, paddingLeft: cs[size] + 8 }}>≈ ${usd}</span>}
    </div>
  );
};

const TitleChip = ({ title, isLord = false, small = false }: { title: string; isLord?: boolean; small?: boolean }) => (
  <span style={{
    fontFamily: "'Archivo', sans-serif", fontSize: small ? 8 : 9, fontWeight: 800, letterSpacing: "0.1em",
    padding: "2px 7px", borderRadius: 999,
    background: isLord ? C.g500 : C.dust + "40",
    color: isLord ? C.ink : C.dust, textTransform: "uppercase", display: "inline-block",
    border: isLord ? "none" : `1px solid ${C.dust}55`,
  }}>
    {title}
  </span>
);

const StatusChip = ({ type }: { type: "live" | "pending" | "verified" | "funded" | "flagged" }) => {
  const cfg = { live: { label: "LIVE", bg: C.o500, col: C.wHi, dot: true }, pending: { label: "PENDING", bg: C.m600, col: C.wMid, dot: false }, verified: { label: "VERIFIED", bg: C.c500, col: C.wHi, dot: false }, funded: { label: "FUNDED", bg: C.g500, col: C.ink, dot: false }, flagged: { label: "FLAGGED", bg: C.o500, col: C.wHi, dot: false } };
  const { label, bg, col, dot } = cfg[type];
  return (
    <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: 999, background: bg, color: col, textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 4 }}>
      {dot && <span className="tin-live-dot" />}{label}
    </span>
  );
};

const GoalBar = ({ current, goal }: { current: number; goal: number }) => {
  const pct = Math.min(100, (current / goal) * 100);
  return (
    <div>
      <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 5, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? C.c500 : `linear-gradient(90deg, ${C.g600}, ${C.g500})`, borderRadius: 4, transition: "width 0.8s cubic-bezier(0.2,0,0,1)", boxShadow: pct >= 100 ? "none" : `0 0 6px ${C.g500}66` }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.wLo }}>{current.toLocaleString()} / {goal.toLocaleString()}</span>
        {pct >= 100 && <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 8, fontWeight: 800, color: C.c500, letterSpacing: "0.1em" }}>FUNDED ✓</span>}
      </div>
    </div>
  );
};

const GiverStack = ({ count }: { count: number }) => {
  const shown = Math.min(4, count);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: shown }).map((_, i) => (
          <div key={i} style={{ width: 18, height: 18, borderRadius: "50%", background: [C.g500, C.o400, C.sky, C.c500][i % 4], border: "2px solid rgba(11,14,20,0.8)", marginLeft: i > 0 ? -5 : 0, zIndex: shown - i, fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {["🤠","🎩","😅","🎪"][i]}
          </div>
        ))}
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.wLo }}>{count} gave</span>
    </div>
  );
};

const PosterChip = ({ name, title, isLord = false, size = "S" }: { name: string; title: string; isLord?: boolean; size?: "S" | "M" }) => {
  const dim = size === "S" ? 32 : 40;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: dim, height: dim, borderRadius: 8, ...G.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: dim * 0.5, flexShrink: 0 }}>
        {isLord ? "🎩" : "🤠"}
      </div>
      <div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: size === "S" ? 12 : 14, fontWeight: 700, color: C.wHi, lineHeight: 1.2 }}>{name}</div>
        <TitleChip title={title} isLord={isLord} small />
      </div>
    </div>
  );
};

// ─── BEG CARD ─────────────────────────────────────────────────────────────────
const BegCard = ({ beg, onTap }: { beg: typeof BEGS[0]; onTap?: () => void }) => (
  <div onClick={onTap} className="tin-press" style={{ ...G.card, borderRadius: 16, padding: 12, cursor: "pointer", position: "relative", overflow: "hidden" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dust, background: "rgba(140,122,91,0.15)", padding: "2px 7px", borderRadius: 6 }}>{beg.cat}</span>
      <svg width={38} height={38}>
        <circle cx="19" cy="19" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
        <circle cx="19" cy="19" r="15" fill="none" stroke={beg.timeLeft < 6 ? C.o500 : C.g500} strokeWidth="2"
          strokeDasharray={`${(beg.timeLeft / 24) * 2 * Math.PI * 15} ${2 * Math.PI * 15}`}
          strokeLinecap="round" transform="rotate(-90 19 19)" style={{ filter: `drop-shadow(0 0 4px ${beg.timeLeft < 6 ? C.o500 : C.g500}88)` }}/>
        <text x="19" y="23" textAnchor="middle" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fill: C.wMid }}>{beg.timeLeft}h</text>
      </svg>
    </div>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
      <div style={{ width: 38, height: 46, ...G.elevated, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🤠</div>
      <div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.wHi, lineHeight: 1.35, marginBottom: 3 }}>{beg.beg}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.wMid }}>{beg.handle}</span>
          <TitleChip title={beg.title} small />
        </div>
      </div>
    </div>
    {beg.goal && <div style={{ marginBottom: 8 }}><GoalBar current={beg.coins} goal={beg.goal} /></div>}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <GiverStack count={beg.givers} />
      <CoinAmt value={beg.coins} size="S" />
    </div>
  </div>
);

// ─── CHALLENGE CARD ───────────────────────────────────────────────────────────
const ChallengeCard = ({ challenge, onTap }: { challenge: typeof CHALLENGES[0]; onTap?: () => void }) => (
  <div onClick={onTap} className="tin-press" style={{ ...G.card, borderRadius: 16, padding: 14, cursor: "pointer" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
      <Ico.Dynamite s={14} c={C.g500} />
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: C.wLo, textTransform: "uppercase" }}>BOUNTY · {challenge.deadline} remaining</span>
    </div>
    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 2, height: 3, marginBottom: 10, overflow: "hidden" }}>
      <div className="tin-fuse-burn" style={{ height: "100%", background: `linear-gradient(90deg, ${C.o500}, ${C.g500})`, borderRadius: 2, boxShadow: `0 0 6px ${C.g500}66` }} />
    </div>
    <div style={{ fontFamily: "'Ultra', serif", fontSize: 26, color: C.g500, letterSpacing: "0.02em", lineHeight: 1.1, marginBottom: 6, textShadow: `0 0 20px ${C.g500}55` }}>
      {challenge.bounty.toLocaleString()} coins
    </div>
    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 600, color: C.wHi, marginBottom: 10, lineHeight: 1.4 }}>{challenge.task}</div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <PosterChip name={challenge.lord} title="Baron" isLord size="S" />
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wMid }}>{challenge.participants} attempting</span>
    </div>
  </div>
);

// ─── STREAM CARD ──────────────────────────────────────────────────────────────
const StreamCard = ({ stream, onTap }: { stream: typeof STREAMS[0]; onTap?: () => void }) => (
  <div onClick={onTap} className="tin-press" style={{ width: 136, ...G.card, borderRadius: 16, overflow: "hidden", flexShrink: 0, cursor: "pointer" }}>
    <div style={{ height: 88, background: `linear-gradient(135deg, rgba(36,43,54,0.9) 0%, rgba(18,22,31,0.9) 100%)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 30 }}>🎪</span>
      <div style={{ position: "absolute", top: 6, left: 6 }}><StatusChip type="live" /></div>
      <div style={{ position: "absolute", bottom: 6, right: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: C.wHi, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", padding: "2px 5px", borderRadius: 4 }}>
        {stream.viewers.toLocaleString()} 👁
      </div>
    </div>
    <div style={{ padding: "8px 10px" }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.wHi }}>{stream.host}</div>
      {"battle" in stream && stream.battle && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.g500, marginTop: 2 }}>⚔ Battle active</div>}
    </div>
  </div>
);

// ─── TOP APP BAR ──────────────────────────────────────────────────────────────
const TopBar = ({ title, overline, balance, onBack, onBell, onWallet }: {
  title: string; overline?: string; balance?: number;
  onBack?: () => void; onBell?: () => void; onWallet?: () => void;
}) => (
  <div style={{ padding: "50px 16px 14px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, background: "linear-gradient(to bottom, rgba(11,14,20,0.92) 80%, transparent)", backdropFilter: "blur(20px) saturate(140%)", WebkitBackdropFilter: "blur(20px) saturate(140%)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {onBack && (
        <button onClick={onBack} className="tin-press-sm" style={{ width: 34, height: 34, borderRadius: "50%", ...G.card, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          <Ico.Back c={C.wMid} s={18} />
        </button>
      )}
      <div>
        {overline && <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.wLo, marginBottom: 2 }}>{overline}</div>}
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 22, fontWeight: 900, color: C.wHi, lineHeight: 1.15 }}>{title}</div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {balance !== undefined && (
        <button onClick={onWallet} className="tin-press-sm tin-balance-pill" style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 13px", borderRadius: 999, ...G.gold, cursor: "pointer", border: "none" }}>
          <span style={{ fontSize: 13 }}>🪙</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 500, color: C.g500 }}>{balance.toLocaleString()}</span>
        </button>
      )}
      {onBell && (
        <button onClick={onBell} className="tin-press-sm" style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", ...G.card, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
          <Ico.Bell c={C.wMid} s={18} />
          <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: C.o500, boxShadow: `0 0 6px ${C.o500}` }} />
        </button>
      )}
    </div>
  </div>
);

// ─── BOTTOM NAV BAR ───────────────────────────────────────────────────────────
const NavBar = ({ active, onTab, onCompose, isLord }: { active: Tab; onTab: (t: Tab) => void; onCompose: () => void; isLord: boolean }) => {
  const tabs: { id: Tab; icon: JSX.Element }[] = [
    { id: "mainStreet", icon: <Ico.Sheriff /> },
    { id: "feed", icon: <Ico.Lasso /> },
    { id: "lobbies", icon: <Ico.Saloon /> },
    { id: "profile", icon: <Ico.Poster /> },
  ];
  return (
    <div style={{ position: "absolute", bottom: 16, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between", ...G.nav, borderRadius: 999, padding: "10px 16px", zIndex: 30, boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)" }}>
      {tabs.slice(0, 2).map(t => (
        <button key={t.id} onClick={() => onTab(t.id)} className="tin-press-sm" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 48, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
          <div style={{ color: active === t.id ? C.g500 : C.wLo, transition: "color 0.16s", filter: active === t.id ? `drop-shadow(0 0 6px ${C.g500}88)` : "none" }}>{t.icon}</div>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.g500, boxShadow: `0 0 6px ${C.g500}` }} />}
        </button>
      ))}
      {/* Center Action Orb */}
      <button onClick={onCompose} className="tin-press" style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 28px ${C.g500}55, 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)`, flexShrink: 0, marginTop: -24, cursor: "pointer" }}>
        {isLord ? <Ico.Dynamite c={C.ink} /> : <Ico.Cup c={C.ink} />}
      </button>
      {tabs.slice(2).map(t => (
        <button key={t.id} onClick={() => onTab(t.id)} className="tin-press-sm" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, minWidth: 48, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
          <div style={{ color: active === t.id ? C.g500 : C.wLo, transition: "color 0.16s", filter: active === t.id ? `drop-shadow(0 0 6px ${C.g500}88)` : "none" }}>{t.icon}</div>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.g500, boxShadow: `0 0 6px ${C.g500}` }} />}
        </button>
      ))}
    </div>
  );
};

// ─── SCREEN: SPLASH ───────────────────────────────────────────────────────────
const SplashScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.m900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div className="tin-coin-drop" style={{ fontSize: 60, marginBottom: 28 }}>🪙</div>
      <div style={{ fontFamily: "'Ultra', serif", fontSize: 50, color: C.g500, letterSpacing: "0.05em", textShadow: `0 0 50px ${C.g500}66, 0 0 100px ${C.g500}22`, lineHeight: 1 }}>TIN CUP</div>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.3em", color: C.wLo, textTransform: "uppercase", marginTop: 10 }}>Perdition Gulch</div>
      <div style={{ position: "absolute", bottom: 36, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo }}>v1.0 · Season 1: Gold Rush</div>
    </div>
  );
};

// ─── SCREEN: WELCOME ──────────────────────────────────────────────────────────
const WelcomeScreen = ({ onWalk, onSignIn }: { onWalk: () => void; onSignIn: () => void }) => (
  <div style={{ position: "absolute", inset: 0, background: C.m900, overflow: "hidden" }}>
    <div className="tin-montage-bg tin-welcome-pan" style={{ position: "absolute", inset: 0 }} />
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(11,14,20,0.2) 0%, rgba(11,14,20,0.6) 55%, ${C.m900} 88%)` }} />
    <div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ fontFamily: "'Ultra', serif", fontSize: 42, color: C.g500, letterSpacing: "0.06em", textShadow: `0 0 40px ${C.g500}55` }}>TIN CUP</div>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: C.wLo }}>Perdition Gulch · Est. Now</div>
    </div>
    <div style={{ position: "absolute", top: "35%", left: 0, right: 0, textAlign: "center", padding: "0 32px" }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.wMid, lineHeight: 1.65, maxWidth: 280, margin: "0 auto" }}>
        Where strangers throw real gold at strangers — for glory, for laughs, for the story.
      </div>
    </div>
    <div style={{ position: "absolute", bottom: 40, left: 24, right: 24, display: "flex", flexDirection: "column", gap: 10 }}>
      <button onClick={onWalk} className="tin-press" style={{ width: "100%", height: 56, borderRadius: 14, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `0 0 32px ${C.g500}44, 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)` }}>
        Walk into town
      </button>
      <div style={{ textAlign: "center", fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wLo }}>Look around free. No account till you touch money.</div>
      <button onClick={onSignIn} className="tin-press" style={{ width: "100%", height: 48, background: "transparent", border: "none", fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 600, color: C.wMid, cursor: "pointer" }}>
        {"I've been here before"}
      </button>
    </div>
  </div>
);

// ─── SCREEN: CHOOSE YOUR FATE ─────────────────────────────────────────────────
const ChooseFateScreen = ({ onChoose }: { onChoose: (fate: "vagrant" | "lord") => void }) => {
  const [expanded, setExpanded] = useState<"vagrant" | "lord" | null>(null);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.m900, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "56px 24px 18px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.wLo, marginBottom: 5 }}>PERDITION GULCH</div>
        <div style={{ fontFamily: "'Ultra', serif", fontSize: 28, color: C.wHi, letterSpacing: "0.02em" }}>Choose Your Fate</div>
      </div>
      <div style={{ flex: 1, display: "flex", margin: "0 14px", gap: 8, overflow: "hidden", minHeight: 0 }}>
        {/* VAGRANT */}
        <div role="button" tabIndex={0} onClick={() => setExpanded(expanded === "vagrant" ? null : "vagrant")}
          style={{ flex: expanded === "vagrant" ? 7 : expanded === "lord" ? 3 : 5, background: "rgba(244,238,221,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 18, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", border: `2px solid ${expanded === "vagrant" ? C.g500 : "rgba(228,218,192,0.8)"}`, cursor: "pointer", transition: "flex 0.35s cubic-bezier(0.2,0,0,1), border-color 0.2s", textAlign: "center", overflow: "hidden", minWidth: 0, boxShadow: expanded === "vagrant" ? `0 0 24px ${C.g500}33` : "none" }}>
          <div style={{ width: "100%" }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dust, marginBottom: 6 }}>THE DRIFTER</div>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🤠</div>
            <div style={{ fontFamily: "'Ultra', serif", fontSize: 16, color: C.ink, letterSpacing: "0.03em", marginBottom: 6 }}>VAGRANT</div>
            {expanded === "vagrant" && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.dust, lineHeight: 1.55, marginBottom: 10 }}>Roll in with nothing but a tin cup and a story. Beg, perform, climb. Fortunes change in Perdition Gulch.</div>}
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 999, background: "rgba(140,122,91,0.18)", border: `1px solid rgba(140,122,91,0.35)` }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.dust, fontWeight: 700 }}>FREE</span>
            </div>
          </div>
          {expanded === "vagrant" && (
            <button onClick={(e) => { e.stopPropagation(); onChoose("vagrant"); }} className="tin-press" style={{ width: "100%", padding: "12px 0", borderRadius: 10, ...G.card, fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.wHi, cursor: "pointer", marginTop: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
              Take the cup
            </button>
          )}
        </div>
        {/* Rope divider */}
        <div style={{ width: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
          {Array.from({ length: 14 }).map((_, i) => <div key={i} style={{ width: 3, height: 12, background: C.dust, borderRadius: 2, opacity: 0.4 + (i % 2) * 0.2 }} />)}
        </div>
        {/* LORD */}
        <div role="button" tabIndex={0} onClick={() => setExpanded(expanded === "lord" ? null : "lord")}
          style={{ flex: expanded === "lord" ? 7 : expanded === "vagrant" ? 3 : 5, ...G.elevated, borderRadius: 18, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", border: `2px solid ${expanded === "lord" ? C.g500 : "rgba(255,255,255,0.09)"}`, cursor: "pointer", transition: "flex 0.35s cubic-bezier(0.2,0,0,1), border-color 0.2s", textAlign: "center", overflow: "hidden", minWidth: 0, boxShadow: expanded === "lord" ? `0 0 32px ${C.g500}44` : "none" }}>
          <div style={{ width: "100%" }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.wLo, marginBottom: 6 }}>THE LORD</div>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎩</div>
            <div style={{ fontFamily: "'Ultra', serif", fontSize: 16, color: C.g500, letterSpacing: "0.03em", textShadow: `0 0 18px ${C.g500}66`, marginBottom: 6 }}>LORD</div>
            {expanded === "lord" && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid, lineHeight: 1.55, marginBottom: 10 }}>Ride in with finery. Set bounties, run your Court, and rain gold on the beggars below. Power never looked so good.</div>}
            <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 999, ...G.gold }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.g500, fontWeight: 700 }}>$100 BUY-IN</span>
            </div>
          </div>
          {expanded === "lord" && (
            <button onClick={(e) => { e.stopPropagation(); onChoose("lord"); }} className="tin-press" style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, cursor: "pointer", marginTop: 14, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3)` }}>
              Claim your title
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: "16px 24px 32px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wLo, lineHeight: 1.6 }}>Drifters can rise. Lords never fall — and never go back.</div>
      </div>
    </div>
  );
};

// ─── SCREEN: CHARACTER CREATOR ────────────────────────────────────────────────
const CharacterCreatorScreen = ({ onDone }: { onDone: () => void }) => {
  type CatKey = "Face" | "Hair" | "Rags" | "Cup" | "Quirk";
  const [activeTab, setActiveTab] = useState<CatKey>("Rags");
  const [selected, setSelected] = useState<Record<CatKey, number>>({ Face: 0, Hair: 0, Rags: 0, Cup: 0, Quirk: 0 });
  const tabs: CatKey[] = ["Face", "Hair", "Rags", "Cup", "Quirk"];
  const items: Record<CatKey, Array<{ emoji: string; label: string; locked?: boolean }>> = {
    Face: [{ emoji: "😄", label: "Missing Tooth Grin" }, { emoji: "🥹", label: "Puppy Eyes" }, { emoji: "😅", label: "Nervous Sweat" }, { emoji: "😤", label: "Determined Scowl" }, { emoji: "🎭", label: "Theatrical Despair" }],
    Hair: [{ emoji: "💇", label: "Tangled Mop" }, { emoji: "🧶", label: "Knotted Mess" }, { emoji: "🪶", label: "Sad Bun" }, { emoji: "🧵", label: "Straggly Wisps" }, { emoji: "👑", label: "Velvet Crown", locked: true }],
    Rags: [{ emoji: "🧥", label: "Patched Duster" }, { emoji: "👔", label: "Moth-eaten Vest" }, { emoji: "🧤", label: "One-finger Gloves" }, { emoji: "🎪", label: "Canvas Sack Poncho" }, { emoji: "🥻", label: "Velvet Frock Coat", locked: true }, { emoji: "👘", label: "Brocade Vest", locked: true }],
    Cup: [{ emoji: "🫙", label: "Slightly Dented" }, { emoji: "🪣", label: "Moderately Dented" }, { emoji: "🎃", label: "Extremely Dented" }, { emoji: "💀", label: "Actually a Skull" }, { emoji: "✨", label: "Gold-Plated Cup", locked: true }],
    Quirk: [{ emoji: "🦟", label: "Fly Halo" }, { emoji: "🎵", label: "Sad Harmonica" }, { emoji: "💧", label: "Eternal Tear" }, { emoji: "🫧", label: "Hiccup Bubble" }, { emoji: "🌟", label: "Lucky Glint", locked: true }],
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: C.m900, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "52px 24px 12px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.wLo, marginBottom: 4 }}>CHARACTER CREATION</div>
        <div style={{ fontFamily: "'Ultra', serif", fontSize: 24, color: C.wHi }}>Your Outlaw</div>
      </div>
      <div style={{ flex: "0 0 160px", margin: "0 16px", borderRadius: 16, ...G.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div className="tin-idle-sway" style={{ fontSize: 64, zIndex: 1 }}>🤠</div>
        <div className="tin-fly-float" style={{ position: "absolute", top: "28%", right: "22%", fontSize: 11, opacity: 0.7 }}>🦟</div>
        <div style={{ position: "absolute", bottom: 12, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo, fontStyle: "italic" }}>Looking real down on your luck, partner.</div>
      </div>
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 6, overflowX: "auto" }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="tin-press-sm" style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${activeTab === tab ? C.g500 : "rgba(255,255,255,0.08)"}`, background: activeTab === tab ? "rgba(245,179,43,0.15)" : "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: activeTab === tab ? C.g500 : C.wMid, cursor: "pointer", flexShrink: 0, transition: "all 0.16s" }}>
            {tab}
          </button>
        ))}
      </div>
      <div style={{ padding: 14, overflowX: "auto", display: "flex", gap: 10, flex: 1, alignItems: "flex-start", minHeight: 0 }}>
        {items[activeTab].map((item, i) => (
          <button key={i} onClick={() => !item.locked && setSelected(s => ({ ...s, [activeTab]: i }))} className={item.locked ? "" : "tin-press"} style={{ width: 76, flexShrink: 0, ...G.card, border: `2px solid ${item.locked ? "rgba(255,255,255,0.05)" : selected[activeTab] === i ? C.g500 : "rgba(255,255,255,0.07)"}`, borderRadius: 14, padding: "10px 8px", cursor: item.locked ? "not-allowed" : "pointer", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, opacity: item.locked ? 0.45 : 1, position: "relative", boxShadow: selected[activeTab] === i && !item.locked ? `0 0 14px ${C.g500}44` : "none" }}>
            <span style={{ fontSize: 26 }}>{item.emoji}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: item.locked ? C.wLo : C.wMid, lineHeight: 1.3 }}>{item.label}</span>
            {item.locked && <div style={{ position: "absolute", top: 4, right: 4, fontSize: 10 }}>👑</div>}
            {selected[activeTab] === i && !item.locked && <div style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: C.g500, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico.Check s={8} c={C.ink} /></div>}
          </button>
        ))}
      </div>
      <div style={{ margin: "0 14px 8px", padding: "9px 13px", ...G.card, borderRadius: 10 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo }}>👑 Items marked with a crown are <span style={{ color: C.g500, fontWeight: 600 }}>Lords only</span>.</div>
      </div>
      <div style={{ padding: "8px 14px 28px" }}>
        <button onClick={onDone} className="tin-press" style={{ width: "100%", height: 54, borderRadius: 14, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `0 0 20px ${C.g500}33, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
          {"That'll do, partner."}
        </button>
      </div>
    </div>
  );
};

// ─── SCREEN: MAIN STREET ──────────────────────────────────────────────────────
const MainStreetScreen = ({ onBeg, onStream, onLeaderboard, onWallet, onBell, onChallenge }: {
  onBeg: (id: number) => void; onStream: () => void; onLeaderboard: () => void;
  onWallet: () => void; onBell: () => void; onChallenge: () => void;
}) => (
  <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 100 }}>
    <TopBar overline="PERDITION GULCH" title="Main Street" balance={1240} onWallet={onWallet} onBell={onBell} />
    <div style={{ padding: "0 16px 4px" }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 10, letterSpacing: "0.08em" }}>LIVE NOW</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        {STREAMS.map(s => <StreamCard key={s.id} stream={s} onTap={onStream} />)}
      </div>
    </div>
    <div style={{ padding: "16px 16px 4px" }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 10, letterSpacing: "0.08em" }}>TRENDING BEGS</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {BEGS.slice(0, 4).map(beg => <BegCard key={beg.id} beg={beg} onTap={() => onBeg(beg.id)} />)}
      </div>
    </div>
    <div style={{ padding: "16px 16px 4px" }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 10, letterSpacing: "0.08em" }}>ACTIVE BOUNTIES</div>
      <ChallengeCard challenge={CHALLENGES[0]} onTap={onChallenge} />
    </div>
    {/* Leaderboard teaser */}
    <div style={{ margin: "16px", ...G.card, borderRadius: 16, padding: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.wHi }}>Richest Barons</div>
        <button onClick={onLeaderboard} className="tin-press-sm" style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.g500, background: "none", border: "none", cursor: "pointer" }}>Full board →</button>
      </div>
      {LEADERBOARD.slice(0, 3).map((row) => (
        <div key={row.rank} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", ...([G.gold, { background: "rgba(255,255,255,0.06)" }, { background: "rgba(140,122,91,0.15)" }][row.rank - 1] ?? {}), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Ultra', serif", fontSize: 10, color: [C.g500, C.wMid, C.dust][row.rank - 1] }}>{row.rank}</span>
          </div>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, color: C.wHi, flex: 1 }}>{row.name}</span>
          <CoinAmt value={row.value} size="S" />
        </div>
      ))}
    </div>
    {/* Lucky Hour Banner */}
    <div onClick={onBell} className="tin-press" style={{ margin: "0 16px 20px", ...G.gold, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
      <span style={{ fontSize: 22 }}>⏰</span>
      <div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, color: C.g500 }}>Lucky Hour in 23 minutes</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wMid }}>2× visibility for all active begs · 9–10 PM</div>
      </div>
    </div>
  </div>
);

// ─── SCREEN: FEED OF MADNESS ──────────────────────────────────────────────────
const FeedScreen = ({ onBeg }: { onBeg: (id: number) => void }) => {
  const [clip, setClip] = useState(0);
  const [reaction, setReaction] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [tossed, setTossed] = useState(false);
  const clips = [
    { id: 1, handle: "RaggedMolly", title: "Notorious Outlaw", caption: "I trained 6 years to spin a lasso and now I beg for rent money. Watch this.", coins: 1240, bg: "linear-gradient(160deg, #180828, #380860)" },
    { id: 2, handle: "SorrySam", title: "Drifter", caption: "My landlord raised the rent. My horse raised objections. My dignity has left the building.", coins: 847, bg: "linear-gradient(160deg, #081828, #183870)" },
    { id: 3, handle: "DustyPete", title: "Folk Hero", caption: "Day 47 of begging for mustache wax. The mustache grows stronger. My will weakens.", coins: 2100, bg: "linear-gradient(160deg, #152808, #305014)" },
  ];
  const c = clips[clip];
  const handleToss = () => {
    setTossed(true);
    toast("🪙 +5 coins tossed!", { description: `${c.handle} thanks you, probably.`, duration: 2000 });
    setTimeout(() => setTossed(false), 600);
  };
  const handleFollow = () => {
    setFollowed(f => !f);
    toast(followed ? "Unfollowed." : `Following ${c.handle}`, { duration: 1500 });
  };
  const handleShare = () => toast("Link copied to saddlebag 🤠", { duration: 1500 });
  const handleFlag = () => toast("Flagged for the Sheriff's review ⭐", { duration: 2000 });
  const handleDoubleTap = () => {
    setReaction(true);
    handleToss();
    setTimeout(() => setReaction(false), 800);
  };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: c.bg, transition: "background 0.4s ease" }} onDoubleClick={handleDoubleTap}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className={reaction ? "tin-pop" : "tin-idle-sway"} style={{ fontSize: 88, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.5))" }}>🤠</div>
        </div>
        {/* Top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)", padding: "52px 16px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ fontFamily: "'Ultra', serif", fontSize: 20, color: C.g500, letterSpacing: "0.05em", textShadow: `0 0 20px ${C.g500}55` }}>TIN CUP</div>
          <div style={{ display: "flex", gap: 4, alignItems: "center", marginTop: 6 }}>
            {clips.map((_, i) => <button key={i} onClick={() => { setClip(i); setFollowed(false); setTossed(false); }} style={{ width: i === clip ? 16 : 4, height: 4, borderRadius: 2, background: i === clip ? C.g500 : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "width 0.2s ease", padding: 0 }} />)}
          </div>
        </div>
        {/* Bottom caption */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 64, background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)", padding: "0 16px 108px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <button onClick={() => onBeg(clips[clip].id)} className="tin-press-sm" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: C.wHi }}>{c.handle}</button>
            <TitleChip title={c.title} />
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.wHi, lineHeight: 1.55, marginBottom: 8 }}>{c.caption}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13 }}>💰</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.g500 }}>{c.coins.toLocaleString()} coins thrown</span>
          </div>
        </div>
        {/* Right rail */}
        <div style={{ position: "absolute", right: 0, bottom: 104, width: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, paddingBottom: 12 }}>
          <button onClick={() => onBeg(clips[clip].id)} className="tin-press-sm" style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(36,43,54,0.7)", backdropFilter: "blur(10px)", border: `2.5px solid ${C.wHi}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer" }}>🤠</button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={handleFollow} className="tin-press-sm" style={{ background: "none", border: "none", cursor: "pointer", filter: followed ? `drop-shadow(0 0 8px ${C.g500})` : "none", transition: "filter 0.2s" }}>
              <Ico.Lasso s={26} c={followed ? C.g500 : C.wHi} />
            </button>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: followed ? C.g500 : C.wHi }}>2.1k</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={handleToss} className="tin-press-sm" style={{ width: 44, height: 44, borderRadius: "50%", background: tossed ? C.g500 : "rgba(245,179,43,0.2)", backdropFilter: "blur(10px)", border: `1px solid ${C.g500}66`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}>
              <Ico.Coin s={20} c={tossed ? C.ink : C.g500} />
            </button>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, color: C.g500, fontWeight: 700 }}>TOSS +5</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <button onClick={handleShare} className="tin-press-sm" style={{ background: "none", border: "none", cursor: "pointer" }}><Ico.Share s={22} c={C.wHi} /></button>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.wHi }}>Share</span>
          </div>
          <button onClick={handleFlag} className="tin-press-sm" style={{ background: "none", border: "none", cursor: "pointer" }}><Ico.Flag s={20} c={C.wMid} /></button>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: LOBBY ────────────────────────────────────────────────────────────
const LobbyScreen = ({ onBeg, onBell }: { onBeg: (id: number) => void; onBell: () => void }) => {
  const [filter, setFilter] = useState("Rising");
  const filtered = filter === "Nearly funded"
    ? BEGS.filter(b => b.goal && b.coins / b.goal > 0.6)
    : filter === "Ridiculous"
    ? [...BEGS].sort((a, b) => b.givers - a.givers)
    : filter === "Newest"
    ? [...BEGS].reverse()
    : filter === "Big goals"
    ? BEGS.filter(b => b.goal && b.goal >= 400)
    : BEGS;
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 100 }}>
      <TopBar overline="PERDITION GULCH" title="Main Street Lobby" onBell={onBell} />
      <div style={{ margin: "0 16px 16px", ...G.card, borderRadius: 16, padding: 16, display: "flex", justifyContent: "space-between" }}>
        {[["THROWN TODAY", "24,891"], ["ACTIVE BEGS", "147"], ["BIGGEST DROP", "2,500"]].map(([label, value]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 500, color: C.g500, textShadow: `0 0 12px ${C.g500}44` }}>{value}</div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.wLo, marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 16px 14px", display: "flex", gap: 7, overflowX: "auto" }}>
        {["Newest", "Rising", "Ridiculous", "Nearly funded", "Big goals"].map(f => (
          <button key={f} onClick={() => setFilter(f)} className="tin-press-sm" style={{ padding: "7px 13px", borderRadius: 999, border: `1px solid ${filter === f ? C.g500 : "rgba(255,255,255,0.07)"}`, background: filter === f ? "rgba(245,179,43,0.15)" : "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 700, color: filter === f ? C.g500 : C.wMid, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", transition: "all 0.16s" }}>
            {f}
          </button>
        ))}
      </div>
      <div style={{ padding: "0 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {filtered.map(beg => <BegCard key={beg.id} beg={beg} onTap={() => onBeg(beg.id)} />)}
      </div>
    </div>
  );
};

// ─── SCREEN: LIVE STREAM ──────────────────────────────────────────────────────
const LiveStreamScreen = ({ onBack }: { onBack: () => void }) => {
  const [leftCoins, setLeftCoins] = useState(12400);
  const [rightCoins, setRightCoins] = useState(8900);
  const totalCoins = leftCoins + rightCoins;
  const leftPct = Math.round((leftCoins / totalCoins) * 100);
  const chat = [
    { user: "PonyExpress", text: "Go VAULTSWORTH!!!", gift: false },
    { user: "BaronVaultsworth", text: "250 coins on Molly — taste THAT!", gift: true, amt: 250, tier: 3 },
    { user: "TumbleweedTed", text: "This battle is absolutely insane", gift: false },
    { user: "TycoonBlackridge", text: "I'll match and raise — 500!", gift: true, amt: 500, tier: 4 },
    { user: "CactusDreams", text: "🤠🤠🤠 incredible", gift: false },
  ];
  const gifts = [
    { amt: 10, emoji: "🪙", label: "×10", side: "left" },
    { amt: 50, emoji: "👜", label: "×50", side: "left" },
    { amt: 100, emoji: "💥", label: "×100", side: "right" },
    { amt: 500, emoji: "🚂", label: "×500", side: "right" },
  ];
  const handleGift = (amt: number, side: string) => {
    if (side === "left") setLeftCoins(c => c + amt);
    else setRightCoins(c => c + amt);
    toast(`🪙 ${amt} coins thrown!`, { description: side === "left" ? "Vaultsworth gains strength." : "Crimsonhat rises!", duration: 1800 });
  };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #180a0e, #2d1a3d)" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="tin-idle-sway" style={{ fontSize: 80, opacity: 0.9 }}>🎩</div>
        </div>
      </div>
      {/* Top overlay */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.75), transparent)", padding: "50px 14px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={onBack} className="tin-press-sm" style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ico.Back c={C.wHi} s={18} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PosterChip name="BaronVaultsworth" title="Baron" isLord />
            <StatusChip type="live" />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.wMid }}>1,847 👁</span>
          </div>
          <div style={{ width: 34 }} />
        </div>
        {/* Battle Bar */}
        <div style={{ ...G.nav, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, color: C.g500 }}>VAULTSWORTH</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, color: C.wLo }}>⚔ BATTLE ⚔</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, color: C.sky }}>CRIMSONHAT</span>
          </div>
          <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.06)", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${leftPct}%`, background: `linear-gradient(90deg, ${C.g500}, ${C.g400})`, transition: "width 0.4s cubic-bezier(0.2,0,0,1)", boxShadow: `0 0 8px ${C.g500}66` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.g500 }}>{leftCoins.toLocaleString()}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.sky }}>{rightCoins.toLocaleString()}</span>
          </div>
        </div>
      </div>
      {/* Right gift rail */}
      <div style={{ position: "absolute", right: 12, bottom: 200, display: "flex", flexDirection: "column", gap: 10 }}>
        {gifts.map(g => (
          <button key={g.amt} onClick={() => handleGift(g.amt, g.side)} className="tin-press" style={{ width: 52, height: 52, borderRadius: 14, ...G.nav, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
            <span style={{ fontSize: g.amt >= 100 ? 18 : 14 }}>{g.emoji}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: C.g500 }}>{g.label}</span>
          </button>
        ))}
      </div>
      {/* Chat */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 70, height: "42%", background: "linear-gradient(to top, rgba(11,14,20,0.92), transparent)", padding: "0 12px 100px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 7 }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ ...( msg.gift ? { ...G.gold, borderRadius: 10, padding: "6px 10px" } : { padding: "1px 0" }) }}>
            {msg.gift && "amt" in msg && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}><span style={{ fontSize: 14 }}>{"tier" in msg && msg.tier === 4 ? "💥" : "👜"}</span><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: C.g500 }}>+{msg.amt} coins</span></div>}
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: msg.gift ? C.g400 : C.wHi }}>{msg.user}</span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: msg.gift ? C.wHi : C.wMid }}> {msg.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SCREEN: WALLET ───────────────────────────────────────────────────────────
const WalletScreen = ({ onBack, onDeposit, onCashOut }: { onBack: () => void; onDeposit: () => void; onCashOut: () => void }) => (
  <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
    <TopBar title="Wallet" overline="YOUR GOLD" onBack={onBack} />
    <div style={{ margin: "0 16px 20px" }}>
      <div className="tin-gold-pulse" style={{ ...G.gold, borderRadius: 22, padding: 24, position: "relative", overflow: "hidden", boxShadow: `0 0 40px ${C.g500}18, 0 8px 32px rgba(0,0,0,0.3)` }}>
        <div style={{ position: "absolute", right: -24, bottom: -24, fontSize: 130, opacity: 0.05, transform: "rotate(-15deg)", pointerEvents: "none" }}>🪙</div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.wLo, marginBottom: 12 }}>YOUR GOLD</div>
        <CoinAmt value={1240} size="XL" usd="1,240.00" />
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onDeposit} className="tin-press" style={{ flex: 1, height: 48, borderRadius: 12, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3)` }}>
            Add Gold
          </button>
          <button onClick={onCashOut} className="tin-press" style={{ flex: 1, height: 48, borderRadius: 12, ...G.cactus, fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.c500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, border: "1px solid rgba(63,155,91,0.28)" }}>
            <Ico.Cactus s={14} c={C.c500} /> Cash Out
          </button>
        </div>
      </div>
    </div>
    <div style={{ margin: "0 16px 12px", padding: "12px 14px", ...G.card, borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
      <Ico.Sheriff s={18} c={C.wLo} />
      <div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.wHi }}>No holds right now</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo }}>{"The Sheriff's watching but you're clear."}</div>
      </div>
    </div>
    <div style={{ margin: "0 16px 16px", padding: "12px 14px", ...G.card, borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 10 }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>🦅</span>
      <div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.wHi, marginBottom: 3 }}>The Monarch's Cut</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wMid, lineHeight: 1.55 }}>1% when gold comes in · 10% when Vagrants cash out. He never misses his coin.</div>
      </div>
    </div>
    <div style={{ padding: "0 16px" }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 12, letterSpacing: "0.08em" }}>RECENT ACTIVITY</div>
      {LEDGER.map(row => (
        <div key={row.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 18 }}>{row.icon}</span>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: row.fee ? C.wLo : C.wHi, lineHeight: 1.3 }}>{row.desc}</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.wLo }}>{row.time}</div>
            </div>
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 500, color: row.fee ? C.wLo : row.coins.startsWith("+") ? C.c500 : C.wHi }}>{row.coins}</span>
        </div>
      ))}
    </div>
    <div onClick={() => toast("Tax Center opens in your browser ↗", { duration: 2000 })} className="tin-press" style={{ margin: "16px 16px 0", padding: "12px 14px", ...G.card, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.wHi }}>Tax Center & 1099-K</div>
      <span style={{ color: C.g500 }}>→</span>
    </div>
  </div>
);

// ─── SCREEN: DEPOSIT HANDOFF ──────────────────────────────────────────────────
const DepositScreen = ({ onBack }: { onBack: () => void }) => (
  <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
    <TopBar title="Add Gold" onBack={onBack} />
    <div style={{ padding: "0 16px" }}>
      <div style={{ background: "rgba(244,238,221,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "2px solid rgba(228,218,192,0.8)", borderRadius: 20, padding: 28, marginBottom: 18, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🏦</div>
        <div style={{ fontFamily: "'Ultra', serif", fontSize: 22, color: C.ink, marginBottom: 10, letterSpacing: "0.02em", lineHeight: 1.2 }}>{"The Bank's in Another Building"}</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.dust, lineHeight: 1.65 }}>Gold gets minted at the Bank, not the Saloon. {"We'll"} take you to our secure site to load up. {"You'll"} come right back.</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", ...G.card, borderRadius: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 16 }}>🔒</span>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid }}>Handled by our licensed banking partner. No prices appear in this app. {"That's"} the law.</div>
      </div>
      <button onClick={() => toast("Opening secure bank in browser ↗", { duration: 2000 })} className="tin-press" style={{ width: "100%", height: 56, borderRadius: 14, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `0 0 28px ${C.g500}44, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
        Ride to the Bank ↗
      </button>
      <div style={{ textAlign: "center", marginTop: 12, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo }}>External site opens in browser. Returns automatically.</div>
    </div>
  </div>
);

// ─── SCREEN: CASH OUT ─────────────────────────────────────────────────────────
const CashOutScreen = ({ onBack }: { onBack: () => void }) => {
  const [amount, setAmount] = useState("100");
  const num = parseInt(amount) || 0;
  const fee = Math.floor(num * 0.1);
  const net = num - fee;
  const handleClaim = () => toast(`🎉 Claim submitted — ${net} coins incoming!`, { description: "Counted within 24 hours, partner.", duration: 3000 });
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
      <TopBar title="Cash Out" onBack={onBack} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ ...G.card, borderRadius: 20, padding: 24, marginBottom: 16, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.wLo, marginBottom: 12 }}>AMOUNT TO CLAIM</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 24 }}>🪙</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 42, fontWeight: 500, color: C.wHi, fontVariantNumeric: "tabular-nums" }}>{amount || "0"}</span>
          </div>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {["50", "100", "500", "MAX"].map(v => (
              <button key={v} onClick={() => setAmount(v === "MAX" ? "1240" : v)} className="tin-press-sm" style={{ padding: "6px 12px", borderRadius: 8, background: amount === (v === "MAX" ? "1240" : v) ? "rgba(245,179,43,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${amount === (v === "MAX" ? "1240" : v) ? C.g500 : "rgba(255,255,255,0.08)"}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: amount === (v === "MAX" ? "1240" : v) ? C.g500 : C.wMid, cursor: "pointer" }}>
                {v}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "rgba(244,238,221,0.95)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "2px solid rgba(228,218,192,0.8)", borderRadius: 16, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: C.dust, textAlign: "center", marginBottom: 14 }}>RECEIPT</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.ink }}>Amount requested</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: C.ink }}>🪙 {num.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px dashed rgba(228,218,192,0.8)`, paddingTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16 }}>🦅</span><span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.o500 }}>{"Monarch's Cut (10%)"}</span></div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: C.o500 }}>−{fee.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid rgba(23,19,12,0.15)`, paddingTop: 10 }}>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink }}>You receive</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, color: C.c500, fontWeight: 700 }}>🪙 {net.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button onClick={handleClaim} className="tin-press" style={{ width: "100%", height: 56, borderRadius: 14, ...G.cactus, border: "1px solid rgba(63,155,91,0.35)", fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: C.c500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Ico.Cactus s={18} c={C.c500} /> Claim Your Money
        </button>
        <div style={{ textAlign: "center", marginTop: 10, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo }}>Face ID required above 100 coins. Counted within 24h.</div>
      </div>
    </div>
  );
};

// ─── SCREEN: WANTED POSTER (PROFILE) ─────────────────────────────────────────
const ProfileScreen = ({ onAscension, onWallet }: { onAscension: () => void; onWallet: () => void }) => {
  const [followed, setFollowed] = useState(false);
  const handleFollow = () => { setFollowed(f => !f); toast(followed ? "Unfollowed DustyPete." : "Following DustyPete 🤠", { duration: 1500 }); };
  const handleMessage = () => toast("Messaging not open yet — town's still being built.", { duration: 2000 });
  const handleShare = () => toast("Wanted poster link copied 🪶", { duration: 1500 });
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 100 }}>
      <div style={{ padding: "52px 16px 16px" }}>
        {/* Parchment poster */}
        <div style={{ background: "rgba(244,238,221,0.96)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderRadius: 18, border: "2px solid rgba(228,218,192,0.8)", padding: 22, position: "relative", overflow: "hidden", marginBottom: 14, boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 22px, rgba(228,218,192,0.4) 22px, rgba(228,218,192,0.4) 23px)`, opacity: 0.4, pointerEvents: "none" }} />
          <div style={{ textAlign: "center", marginBottom: 14, position: "relative" }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(140,122,91,0.6)", marginBottom: 2 }}>WANTED</div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: C.dust, marginBottom: 14 }}>DRIFTER · PERDITION GULCH</div>
            <div style={{ width: 100, height: 122, margin: "0 auto 12px", background: "rgba(26,32,41,0.08)", borderRadius: 4, border: `3px solid rgba(23,19,12,0.2)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, position: "relative" }}>
              🤠
              {[["0","0"],["0","calc(100% - 10px)"],["calc(100% - 10px)","0"],["calc(100% - 10px)","calc(100% - 10px)"]].map(([t,l],i) => <div key={i} style={{ position: "absolute", top: t, left: l, width: 10, height: 10, background: C.ink, opacity: 0.15 }} />)}
            </div>
            <div style={{ fontFamily: "'Ultra', serif", fontSize: 26, color: C.ink, letterSpacing: "0.04em", lineHeight: 1.1, marginBottom: 3 }}>DUSTY PETE</div>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, color: C.dust }}>@DustyPete</div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 3, marginBottom: 16, position: "relative" }}>
            {[1,2,3,4,5].map(i => <Ico.Star key={i} s={16} c={i <= 4 ? C.g500 : "rgba(228,218,192,0.8)"} filled={i <= 4} />)}
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.dust, marginLeft: 5 }}>Trusted Vagrant</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "14px 0", borderTop: "1px solid rgba(228,218,192,0.8)", borderBottom: "1px solid rgba(228,218,192,0.8)", marginBottom: 16, position: "relative" }}>
            {[["GIVEN","0"],["RECEIVED","1,240"],["STREAK","7d"]].map(([label,value]) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 18, fontWeight: 500, color: C.ink }}>{value}</div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dust, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, position: "relative" }}>
            {["🏆","⚡","🌟","🎯","🔥"].map((badge,i) => (
              <div key={i} style={{ width: 42, height: 42, borderRadius: 10, background: i < 3 ? "rgba(26,32,41,0.12)" : "rgba(228,218,192,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, border: `2px solid ${i < 3 ? "rgba(245,179,43,0.6)" : "rgba(228,218,192,0.8)"}`, flexShrink: 0, opacity: i >= 3 ? 0.4 : 1 }}>{badge}</div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.dust }}>Gold Rush · Rank #412</div>
            <TitleChip title="Folk Hero" />
          </div>
        </div>
        {/* Action row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            { label: followed ? "Following ✓" : "Follow", action: handleFollow, accent: followed },
            { label: "Gift 🪙", action: onWallet, accent: true },
            { label: "Message", action: handleMessage, accent: false },
            { label: "Share", action: handleShare, accent: false },
          ].map(btn => (
            <button key={btn.label} onClick={btn.action} className="tin-press-sm" style={{ flex: 1, height: 40, borderRadius: 10, ...(btn.accent ? G.gold : G.card), fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 700, color: btn.accent ? C.g500 : C.wMid, cursor: "pointer", border: btn.accent ? `1px solid rgba(245,179,43,0.3)` : "1px solid rgba(255,255,255,0.07)" }}>
              {btn.label}
            </button>
          ))}
        </div>
        {/* Ascension CTA */}
        <div style={{ ...G.gold, borderRadius: 16, padding: 18, boxShadow: `0 0 24px ${C.g500}18` }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.g500, marginBottom: 4 }}>👑 Rise to Lordship</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid, lineHeight: 1.55, marginBottom: 14 }}>$100 buy-in. Permanent. Never beg again. Power never looked so good.</div>
          <button onClick={onAscension} className="tin-press" style={{ width: "100%", height: 44, borderRadius: 12, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3)` }}>
            Begin the Ascension
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: LEADERBOARD ──────────────────────────────────────────────────────
const LeaderboardScreen = ({ onBack }: { onBack: () => void }) => {
  const [tab, setTab] = useState("Richest Baron");
  const [period, setPeriod] = useState("Week");
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
      <TopBar title="Leaderboards" overline="THE GULCH" onBack={onBack} />
      <div style={{ margin: "0 16px 14px", padding: "9px 14px", ...G.gold, borderRadius: 10, textAlign: "center" }}>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.g500 }}>Season 1: Gold Rush · 23 days remaining</span>
      </div>
      <div style={{ padding: "0 16px 12px", display: "flex", gap: 7, overflowX: "auto" }}>
        {["Richest Baron", "Luckiest Drifter", "Fastest Climber", "Most Ridiculous"].map(t => (
          <button key={t} onClick={() => setTab(t)} className="tin-press-sm" style={{ padding: "7px 13px", borderRadius: 999, border: `1px solid ${tab === t ? C.g500 : "rgba(255,255,255,0.07)"}`, background: tab === t ? "rgba(245,179,43,0.15)" : "rgba(255,255,255,0.04)", backdropFilter: "blur(10px)", fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 700, color: tab === t ? C.g500 : C.wMid, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
            {t}
          </button>
        ))}
      </div>
      <div style={{ margin: "0 16px 16px", display: "flex", ...G.card, borderRadius: 12, padding: 4 }}>
        {["Today", "Week", "Season"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} className="tin-press-sm" style={{ flex: 1, padding: "8px 0", borderRadius: 9, background: period === p ? "rgba(255,255,255,0.08)" : "transparent", border: `1px solid ${period === p ? "rgba(255,255,255,0.1)" : "transparent"}`, fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, color: period === p ? C.wHi : C.wMid, cursor: "pointer", transition: "all 0.16s" }}>
            {p}
          </button>
        ))}
      </div>
      <div style={{ padding: "0 16px" }}>
        {LEADERBOARD.map(row => {
          const medalCol = [C.g500, C.wMid, C.dust][row.rank - 1] ?? C.wLo;
          return (
            <div key={row.rank} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: row.rank <= 3 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `2px solid ${row.rank <= 3 ? medalCol : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: row.rank <= 3 ? `0 0 10px ${medalCol}33` : "none" }}>
                <span style={{ fontFamily: "'Ultra', serif", fontSize: 13, color: row.rank <= 3 ? medalCol : C.wLo }}>{row.rank}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.wHi }}>{row.name}</div>
                <TitleChip title={row.title} isLord small />
              </div>
              <CoinAmt value={row.value} size="S" />
            </div>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 12px", marginTop: 8, ...G.gold, borderRadius: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: `2px solid ${C.g500}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Ultra', serif", fontSize: 10, color: C.g500 }}>412</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.g500 }}>You — DustyPete</div>
            <TitleChip title="Folk Hero" small />
          </div>
          <CoinAmt value="1,240" size="S" />
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.wLo, fontStyle: "italic" }}>"Fresh season. Nobody's rich yet. Terrifying."</div>
      </div>
    </div>
  );
};

// ─── SCREEN: BEG DETAIL ───────────────────────────────────────────────────────
const BegDetailScreen = ({ beg, onBack, onWallet }: { beg: typeof BEGS[0]; onBack: () => void; onWallet: () => void }) => {
  const [reacted, setReacted] = useState(false);
  const handleReact = () => { setReacted(r => !r); toast(reacted ? "Reaction removed." : "🤠 Reacted!", { duration: 1500 }); };
  const handleShare = () => toast("Beg link copied to clipboard ↗", { duration: 1500 });
  const handleGift = (amt: number) => {
    onWallet();
    toast(`🪙 Tossing ${amt} coins to ${beg.handle}...`, { duration: 2000 });
  };
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
      <TopBar title={beg.handle} overline="BEG DETAIL" onBack={onBack} />
      <div style={{ margin: "0 16px 16px", height: 196, ...G.card, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
        <div className="tin-idle-sway" style={{ fontSize: 72 }}>🤠</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.wHi }}>{beg.handle}</span>
          <TitleChip title={beg.title} />
        </div>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20, fontWeight: 900, color: C.wHi, lineHeight: 1.3, marginBottom: 14 }}>{beg.beg}</div>
        {beg.goal && <div style={{ marginBottom: 16 }}><GoalBar current={beg.coins} goal={beg.goal} /><div style={{ marginTop: 10 }}><GiverStack count={beg.givers} /></div></div>}
        {!beg.goal && <div style={{ marginBottom: 16 }}><GiverStack count={beg.givers} /></div>}
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[{ label: "Nickel Toss", emoji: "🪙", amt: 5 }, { label: "25 coins", emoji: "💰", amt: 25 }, { label: "100 coins", emoji: "💥", amt: 100 }].map(g => (
            <button key={g.label} onClick={() => handleGift(g.amt)} className="tin-press" style={{ flex: 1, height: 58, borderRadius: 14, ...(g.amt === 100 ? G.gold : G.card), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 3, border: g.amt === 100 ? `1px solid rgba(245,179,43,0.3)` : "1px solid rgba(255,255,255,0.07)", boxShadow: g.amt === 100 ? `0 0 14px ${C.g500}22` : "none" }}>
              <span style={{ fontSize: 18 }}>{g.emoji}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: g.amt === 100 ? C.g500 : C.wMid }}>{g.label}</span>
            </button>
          ))}
          <button onClick={onWallet} className="tin-press" style={{ flex: 1, height: 58, borderRadius: 14, ...G.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 3, border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: 18 }}>✏️</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: C.wMid }}>Custom</span>
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleReact} className="tin-press" style={{ flex: 1, height: 44, borderRadius: 12, ...(reacted ? G.gold : G.card), border: reacted ? `1px solid rgba(245,179,43,0.3)` : "1px solid rgba(255,255,255,0.07)", fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, color: reacted ? C.g500 : C.wMid, cursor: "pointer" }}>
            {reacted ? "🤠 Reacted" : "React 🤠"}
          </button>
          <button onClick={handleShare} className="tin-press" style={{ flex: 1, height: 44, borderRadius: 12, ...G.card, border: "1px solid rgba(255,255,255,0.07)", fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, color: C.wMid, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Ico.Share s={14} c={C.wMid} /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN: CHALLENGE DETAIL ─────────────────────────────────────────────────
const ChallengeDetailScreen = ({ challenge, onBack }: { challenge: typeof CHALLENGES[0]; onBack: () => void }) => {
  const [entered, setEntered] = useState(false);
  const handleEnter = () => {
    setEntered(true);
    toast("🤠 You're in the running!", { description: "Post your video to claim the bounty.", duration: 2500 });
  };
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
      <TopBar title="Bounty" overline="CHALLENGE" onBack={onBack} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ ...G.card, borderRadius: 20, padding: 22, marginBottom: 16, position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: C.wLo, marginBottom: 8 }}>BOUNTY · {challenge.deadline} remaining</div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 4, marginBottom: 14, overflow: "hidden" }}>
            <div className="tin-fuse-burn" style={{ height: "100%", background: `linear-gradient(90deg, ${C.o500}, ${C.g500})`, boxShadow: `0 0 8px ${C.g500}66` }} />
          </div>
          <div style={{ fontFamily: "'Ultra', serif", fontSize: 44, color: C.g500, textShadow: `0 0 30px ${C.g500}55`, marginBottom: 8 }}>{challenge.bounty.toLocaleString()}</div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, color: C.wLo, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>COINS TO THE WINNER</div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: C.wHi, lineHeight: 1.45, marginBottom: 16 }}>{challenge.task}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <PosterChip name={challenge.lord} title="Baron" isLord />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid }}>{challenge.participants} attempting</span>
          </div>
        </div>
        <div style={{ ...G.card, borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, color: C.wHi, marginBottom: 8 }}>Rules of the Gulch</div>
          {["Record yourself doing the task — start to finish, no cuts", "Post as a beg or reply video within the time limit", "Lord picks winner. No appeals. Their gold, their call.", "Sheriff reviews all submissions. Harassment = instant ban."].map((rule, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.g500, flexShrink: 0 }}>{i + 1}.</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid, lineHeight: 1.5 }}>{rule}</span>
            </div>
          ))}
        </div>
        <button onClick={entered ? undefined : handleEnter} className={entered ? "" : "tin-press"} style={{ width: "100%", height: 56, borderRadius: 14, background: entered ? "transparent" : `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: entered ? `1px solid ${C.g500}44` : "1px solid rgba(255,255,255,0.25)", borderTop: entered ? `1px solid ${C.g500}44` : "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: entered ? C.g500 : C.ink, cursor: entered ? "default" : "pointer", boxShadow: entered ? "none" : `0 0 24px ${C.g500}33, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
          {entered ? "✓ You're entered — go record it" : "Enter this Bounty"}
        </button>
      </div>
    </div>
  );
};

// ─── SCREEN: BEG COMPOSER ─────────────────────────────────────────────────────
const ComposerScreen = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [hasGoal, setHasGoal] = useState(false);
  const [goalAmt, setGoalAmt] = useState("500");
  const handlePost = () => {
    toast("🪙 Beg posted! The Sheriff's scanning it now.", { description: "Goes live after a quick safety check.", duration: 3000 });
    onBack();
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: C.m900, display: "flex", flexDirection: "column" }}>
      <TopBar title="New Beg" overline="COMPOSER" onBack={onBack} />
      <div style={{ padding: "0 16px 16px", display: "flex", gap: 10 }}>
        {["1. Write", "2. Show", "3. Preview"].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 2, background: step > i + 1 ? C.g500 : step === i + 1 ? C.g500 : "rgba(255,255,255,0.08)", marginBottom: 4, opacity: step === i + 1 ? 1 : step > i + 1 ? 0.6 : 0.3, boxShadow: step === i + 1 ? `0 0 8px ${C.g500}55` : "none" }} />
            <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 700, color: step === i + 1 ? C.g500 : C.wLo }}>{s}</span>
          </div>
        ))}
      </div>
      {step === 1 && (
        <div style={{ flex: 1, padding: "0 16px", overflowY: "auto" }}>
          <div style={{ background: "rgba(244,238,221,0.92)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 12, padding: "12px 14px", marginBottom: 16, border: "1px solid rgba(228,218,192,0.7)" }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 5 }}>Keep it legal & fun, partner. 🤠</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: C.dust, lineHeight: 1.6 }}>✔ "Best outlaw dance for $50" &nbsp; ✔ "Fund my mustache wax"<br/>✘ Scams &nbsp; ✘ Danger &nbsp; ✘ Genuine emergencies</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Pitch ({60 - title.length} left)</label>
            <textarea value={title} onChange={e => e.target.value.length <= 60 && setTitle(e.target.value)} placeholder="Fund my championship mustache wax..." style={{ width: "100%", padding: "12px 14px", ...G.card, borderRadius: 12, color: C.wHi, fontFamily: "'Inter', sans-serif", fontSize: 15, resize: "none", height: 76, outline: "none", boxSizing: "border-box", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, display: "block", marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Story ({280 - story.length} left)</label>
            <textarea value={story} onChange={e => e.target.value.length <= 280 && setStory(e.target.value)} placeholder="The full saga of why the town owes you this..." style={{ width: "100%", padding: "12px 14px", ...G.card, borderRadius: 12, color: C.wHi, fontFamily: "'Inter', sans-serif", fontSize: 14, resize: "none", height: 96, outline: "none", boxSizing: "border-box", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>
          <div style={{ padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: hasGoal ? 12 : 0 }}>
              <div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, fontWeight: 700, color: C.wHi }}>Set a Goal</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid }}>Give givers a finish line</div>
              </div>
              <button onClick={() => setHasGoal(!hasGoal)} className="tin-press-sm" style={{ width: 48, height: 28, borderRadius: 999, background: hasGoal ? C.g500 : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0, boxShadow: hasGoal ? `0 0 10px ${C.g500}44` : "none" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.wHi, position: "absolute", top: 3, left: hasGoal ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
              </button>
            </div>
            {hasGoal && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["100","250","500","1000","2500"].map(amt => (
                  <button key={amt} onClick={() => setGoalAmt(amt)} className="tin-press-sm" style={{ padding: "7px 14px", borderRadius: 999, border: `1px solid ${goalAmt === amt ? C.g500 : "rgba(255,255,255,0.08)"}`, background: goalAmt === amt ? "rgba(245,179,43,0.15)" : "rgba(255,255,255,0.04)", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: goalAmt === amt ? C.g500 : C.wMid, cursor: "pointer" }}>
                    {parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {step === 2 && (
        <div style={{ flex: 1, padding: "0 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <div style={{ fontSize: 64 }}>📹</div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20, fontWeight: 700, color: C.wHi, textAlign: "center" }}>Show them what you have</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.wMid, textAlign: "center" }}>60 seconds max. Make it count.</div>
          <button onClick={() => toast("Camera opens on your device 📷", { duration: 1500 })} className="tin-press" style={{ padding: "13px 28px", borderRadius: 12, ...G.card, border: "1px solid rgba(255,255,255,0.1)", fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: C.wHi, cursor: "pointer" }}>Record Video</button>
          <div onClick={() => toast("AI dramatization unlocks post-review 🎭", { duration: 2000 })} className="tin-press" style={{ padding: "10px 14px", ...G.card, borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", width: "100%", boxSizing: "border-box", cursor: "pointer" }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.wLo, marginBottom: 3 }}>Dramatize with AI</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wLo }}>The Sheriff checks it first. Unlocks after safety scan.</div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div style={{ flex: 1, padding: "0 16px", overflowY: "auto" }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>How it will look</div>
          <BegCard beg={{ ...BEGS[0], beg: title || "Fund my championship mustache wax regionals" }} />
        </div>
      )}
      <div style={{ padding: "12px 16px 28px", display: "flex", gap: 10 }}>
        {step > 1 && <button onClick={() => setStep(step - 1)} className="tin-press" style={{ flex: 1, height: 52, borderRadius: 12, ...G.card, border: "1px solid rgba(255,255,255,0.09)", fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: C.wHi, cursor: "pointer" }}>Back</button>}
        <button onClick={() => step < 3 ? setStep(step + 1) : handlePost()} className="tin-press" style={{ flex: 2, height: 52, borderRadius: 12, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3)` }}>
          {step === 3 ? "Post it" : "Continue →"}
        </button>
      </div>
    </div>
  );
};

// ─── SCREEN: NOTIFICATIONS ────────────────────────────────────────────────────
const NotificationsScreen = ({ onBack, onWallet }: { onBack: () => void; onWallet: () => void }) => (
  <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
    <TopBar title="Notifications" overline="TOWN CRIER" onBack={onBack} />
    {["Money", "Town", "The Law"].map(group => {
      const rows = NOTIFICATIONS.filter(n => n.group === group);
      if (!rows.length) return null;
      return (
        <div key={group} style={{ padding: "0 16px 8px" }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: group === "Money" ? C.g500 : group === "The Law" ? C.o400 : C.wLo, marginBottom: 10, marginTop: 16 }}>{group}</div>
          {rows.map(n => (
            <div key={n.id} onClick={n.coins ? onWallet : undefined} className={n.coins ? "tin-press" : ""} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: n.coins ? "pointer" : "default" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{n.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.wHi, lineHeight: 1.4, marginBottom: 3 }}>{n.title}</div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wMid, lineHeight: 1.4, marginBottom: 5 }}>{n.sub}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: C.wLo }}>{n.time}</span>
                  {n.coins && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: n.coins.startsWith("+") ? C.c500 : C.wLo }}>{n.coins}</span>}
                </div>
              </div>
              {n.coins && <span style={{ color: C.wLo, alignSelf: "center", fontSize: 12 }}>→</span>}
            </div>
          ))}
        </div>
      );
    })}
  </div>
);

// ─── SCREEN: SEARCH ───────────────────────────────────────────────────────────
const SearchScreen = ({ onBack, onBeg }: { onBack: () => void; onBeg: (id: number) => void }) => {
  const [query, setQuery] = useState("");
  const filtered = query.length > 1 ? BEGS.filter(b => b.beg.toLowerCase().includes(query.toLowerCase()) || b.handle.toLowerCase().includes(query.toLowerCase())) : BEGS;
  const trending = ["#mustachewax", "#outlawdance", "#barndoor", "#goldtrain", "#desperatedoug"];
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900, paddingBottom: 40 }}>
      <TopBar title="Search" overline="THE GULCH" onBack={onBack} />
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, ...G.card, borderRadius: 12, padding: "10px 14px", marginBottom: 20, border: "1px solid rgba(255,255,255,0.08)" }}>
          <Ico.Search s={18} c={C.wMid} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search begs, lords, lobbies..." style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "'Inter', sans-serif", fontSize: 15, color: C.wHi }} autoFocus />
          {query.length > 0 && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: C.wLo, cursor: "pointer", fontSize: 16 }}>×</button>}
        </div>
        {!query && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 12, letterSpacing: "0.08em" }}>TRENDING</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {trending.map(tag => (
                <button key={tag} onClick={() => setQuery(tag.replace("#",""))} className="tin-press-sm" style={{ padding: "7px 14px", borderRadius: 999, ...G.card, border: "1px solid rgba(255,255,255,0.08)", fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 700, color: C.g500, cursor: "pointer" }}>{tag}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 11, fontWeight: 800, color: C.wMid, marginBottom: 12, letterSpacing: "0.08em" }}>
          {query ? `${filtered.length} RESULT${filtered.length !== 1 ? "S" : ""}` : "RECENT BEGS"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map(beg => <BegCard key={beg.id} beg={beg} onTap={() => onBeg(beg.id)} />)}
        </div>
        {filtered.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.wLo, fontStyle: "italic" }}>Nothing in the gulch matches that. Try different words.</div>}
      </div>
    </div>
  );
};

// ─── SCREEN: ASCENSION ────────────────────────────────────────────────────────
const AscensionScreen = ({ onBack, onPONR }: { onBack: () => void; onPONR: () => void }) => {
  const [scrollPct, setScrollPct] = useState(0);
  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", background: C.m900 }}
      onScroll={e => { const el = e.currentTarget; setScrollPct(Math.min(1, el.scrollTop / (el.scrollHeight - el.clientHeight))); }}>
      <div style={{ height: 280, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${C.m800}, ${C.m900})`, opacity: 1 - scrollPct }}>
          <span style={{ fontSize: 84, filter: "grayscale(100%) brightness(0.6)" }}>🤠</span>
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, rgba(36,43,54,0.9), rgba(18,22,31,0.9))`, opacity: scrollPct }}>
          <span style={{ fontSize: 84, filter: `drop-shadow(0 0 20px ${C.g500}66)` }}>🎩</span>
        </div>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "52px 16px 0" }}>
          <button onClick={onBack} className="tin-press-sm" style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Ico.Back c={C.wHi} s={18} />
          </button>
        </div>
      </div>
      <div style={{ padding: "24px 16px" }}>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.g500, marginBottom: 8 }}>ASCENSION</div>
        <div style={{ fontFamily: "'Ultra', serif", fontSize: 32, color: C.wHi, lineHeight: 1.1, marginBottom: 20, letterSpacing: "0.02em" }}>
          Rise to <span style={{ color: C.g500, textShadow: `0 0 24px ${C.g500}77` }}>Lordship</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          {[["💰","Rain gold on any Vagrant in Perdition Gulch"],["⚔️","Post bounties and set absurd challenges"],["🏰","Run your own private Court with worshippers"],["👑","Unlock finery — no more rags, ever"],["🏆","Climb the Lord titles ladder to the Monarch's Court"],["🎭","Enter Lord-vs-Lord generosity battles in live streams"]].map(([icon, text]) => (
            <div key={text as string} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.wHi }}>{text as string}</span>
            </div>
          ))}
        </div>
        <div className="tin-gold-pulse" style={{ ...G.gold, borderRadius: 18, padding: 22, marginBottom: 20, textAlign: "center", boxShadow: `0 0 40px ${C.g500}18` }}>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: C.wLo, marginBottom: 10 }}>THE STAKE</div>
          <div style={{ fontFamily: "'Ultra', serif", fontSize: 44, color: C.g500, textShadow: `0 0 30px ${C.g500}77` }}>$100</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: C.wMid, marginTop: 4 }}>One-time deposit · 1% Monarch's cut on arrival</div>
        </div>
        <button onClick={onPONR} className="tin-press" style={{ width: "100%", height: 56, borderRadius: 14, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, border: "1px solid rgba(255,255,255,0.25)", borderTop: "1px solid rgba(255,255,255,0.4)", fontFamily: "'Archivo', sans-serif", fontSize: 17, fontWeight: 700, color: C.ink, cursor: "pointer", boxShadow: `0 0 32px ${C.g500}44, inset 0 1px 0 rgba(255,255,255,0.3)` }}>
          Begin the Ascension
        </button>
        <div style={{ textAlign: "center", marginTop: 10, fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wLo }}>One-time. Permanent. No going back.</div>
      </div>
    </div>
  );
};

// ─── SCREEN: POINT OF NO RETURN ───────────────────────────────────────────────
const PONRScreen = ({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) => {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progRef = useRef(0);
  const startHold = () => {
    timerRef.current = setInterval(() => {
      progRef.current += 2.5;
      setProgress(progRef.current);
      if (progRef.current >= 100) { clearInterval(timerRef.current!); onConfirm(); }
    }, 40);
  };
  const endHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    progRef.current = 0;
    setProgress(0);
  };
  return (
    <div style={{ position: "absolute", inset: 0, background: C.m900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "52px 24px 44px" }}>
      <div style={{ alignSelf: "flex-start" }}>
        <button onClick={onBack} className="tin-press-sm" style={{ width: 34, height: 34, borderRadius: "50%", ...G.card, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}><Ico.Back c={C.wLo} s={18} /></button>
      </div>
      <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 110, height: 148, borderRadius: "55px 55px 0 0", ...G.card, position: "relative", marginBottom: 36, overflow: "hidden", boxShadow: `0 0 40px ${C.g500}22, 0 8px 32px rgba(0,0,0,0.4)` }}>
          <div className="tin-door-glow" style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${C.g500}44, transparent 70%)` }} />
          <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: C.g500, boxShadow: `0 0 12px ${C.g500}` }} />
          <div style={{ position: "absolute", top: "25%", left: "15%", width: 2, height: "50%", background: `linear-gradient(to bottom, transparent, ${C.g500}66, transparent)`, transform: "rotate(-8deg)" }} />
        </div>
        <div style={{ fontFamily: "'Ultra', serif", fontSize: 34, color: C.g500, letterSpacing: "0.05em", textShadow: `0 0 36px ${C.g500}77`, marginBottom: 18, lineHeight: 1.1 }}>LORDS<br/>NEVER FALL.</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.wMid, lineHeight: 1.7, maxWidth: 270, marginBottom: 8 }}>Once you take the title, you can never beg again. No Vagrant days. No going back.</div>
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: C.wHi }}>Ever.</div>
      </div>
      <div style={{ width: "100%" }}>
        <div onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold} onTouchStart={startHold} onTouchEnd={endHold}
          style={{ width: "100%", height: 56, borderRadius: 14, ...G.card, position: "relative", overflow: "hidden", cursor: "pointer", userSelect: "none", marginBottom: 12, border: `1px solid ${C.g500}33` }}>
          <div style={{ position: "absolute", inset: 0, width: `${progress}%`, background: `linear-gradient(145deg, ${C.g400}, ${C.g500})`, borderRadius: "inherit", transition: progress === 0 ? "width 0.3s ease" : "none", boxShadow: progress > 0 ? `0 0 20px ${C.g500}44` : "none" }} />
          <div style={{ position: "relative", zIndex: 1, fontFamily: "'Archivo', sans-serif", fontSize: 15, fontWeight: 700, color: progress > 20 ? C.ink : C.wHi, textAlign: "center", lineHeight: "56px", transition: "color 0.2s" }}>
            {progress > 0 ? "Hold it..." : "Hold to swear the oath"}
          </div>
        </div>
        <button onClick={onBack} className="tin-press" style={{ width: "100%", background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.wLo, cursor: "pointer", padding: "8px 0" }}>{"I'm not ready."}</button>
      </div>
    </div>
  );
};

// ─── CORONATION ───────────────────────────────────────────────────────────────
const CoronationScreen = ({ onDone }: { onDone: () => void }) => {
  useEffect(() => { const t = setTimeout(onDone, 4200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.m900, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="tin-coin-rain" style={{ position: "absolute", left: `${(i / 18) * 100 + Math.random() * 5}%`, animationDelay: `${(i * 0.12) % 2}s`, animationDuration: `${2 + Math.random() * 1}s`, fontSize: 14 }}>🪙</div>
      ))}
      <div style={{ width: 150, height: 188, borderRadius: "75px 75px 0 0", ...G.gold, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: `0 0 70px ${C.g500}66, inset 0 0 40px ${C.g500}33`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${C.g500}33, transparent 70%)` }} />
        <div className="tin-coronation-crown" style={{ fontSize: 76, zIndex: 1 }}>🎩</div>
      </div>
      <div style={{ fontFamily: "'Ultra', serif", fontSize: 28, color: C.g500, letterSpacing: "0.06em", textShadow: `0 0 50px ${C.g500}88`, textAlign: "center", lineHeight: 1.2, marginBottom: 10 }}>HAIL,<br/>MY LORD.</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: C.wMid }}>Your finery awaits.</div>
      <button onClick={onDone} className="tin-press-sm" style={{ position: "absolute", top: 52, right: 16, background: "none", border: "none", fontFamily: "'Inter', sans-serif", fontSize: 12, color: C.wLo, cursor: "pointer" }}>Skip →</button>
    </div>
  );
};

// ─── MAIN APP STATE MACHINE ───────────────────────────────────────────────────
const MainApp = () => {
  const [tab, setTab] = useState<Tab>("mainStreet");
  const [sub, setSub] = useState<SubScreen>(null);
  const [selectedBeg, setSelectedBeg] = useState<typeof BEGS[0] | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<typeof CHALLENGES[0] | null>(null);
  const [isLord, setIsLord] = useState(false);
  const [crowned, setCrowned] = useState(false);

  const openBeg = (id: number) => {
    const beg = BEGS.find(b => b.id === id);
    if (beg) { setSelectedBeg(beg); setSub("begDetail"); }
  };
  const openChallenge = (idx = 0) => {
    setSelectedChallenge(CHALLENGES[idx]);
    setSub("challengeDetail");
  };

  if (crowned && !isLord) return <CoronationScreen onDone={() => { setIsLord(true); setCrowned(false); }} />;

  if (sub === "wallet") return <WalletScreen onBack={() => setSub(null)} onDeposit={() => setSub("deposit")} onCashOut={() => setSub("cashOut")} />;
  if (sub === "deposit") return <DepositScreen onBack={() => setSub("wallet")} />;
  if (sub === "cashOut") return <CashOutScreen onBack={() => setSub("wallet")} />;
  if (sub === "leaderboard") return <LeaderboardScreen onBack={() => setSub(null)} />;
  if (sub === "liveStream") return <LiveStreamScreen onBack={() => setSub(null)} />;
  if (sub === "notifications") return <NotificationsScreen onBack={() => setSub(null)} onWallet={() => setSub("wallet")} />;
  if (sub === "search") return <SearchScreen onBack={() => setSub(null)} onBeg={openBeg} />;
  if (sub === "ascension") return <AscensionScreen onBack={() => setSub(null)} onPONR={() => setSub("ponr")} />;
  if (sub === "ponr") return <PONRScreen onBack={() => setSub("ascension")} onConfirm={() => { setCrowned(true); setSub(null); }} />;
  if (sub === "begDetail" && selectedBeg) return <BegDetailScreen beg={selectedBeg} onBack={() => setSub(null)} onWallet={() => setSub("wallet")} />;
  if (sub === "challengeDetail" && selectedChallenge) return <ChallengeDetailScreen challenge={selectedChallenge} onBack={() => setSub(null)} />;
  if (sub === "composer") return <ComposerScreen onBack={() => setSub(null)} />;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {tab === "mainStreet" && <MainStreetScreen onBeg={openBeg} onStream={() => setSub("liveStream")} onLeaderboard={() => setSub("leaderboard")} onWallet={() => setSub("wallet")} onBell={() => setSub("notifications")} onChallenge={() => openChallenge(0)} />}
      {tab === "feed" && <FeedScreen onBeg={openBeg} />}
      {tab === "lobbies" && <LobbyScreen onBeg={openBeg} onBell={() => setSub("notifications")} />}
      {tab === "profile" && <ProfileScreen onAscension={() => setSub("ascension")} onWallet={() => setSub("wallet")} />}
      <NavBar active={tab} onTab={setTab} onCompose={() => setSub("composer")} isLord={isLord} />
    </div>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  return (
    <div style={{ minHeight: "100vh", background: "#04060C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
      <Toaster position="top-center" toastOptions={{ style: { background: "rgba(36,43,54,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", color: C.wHi, fontFamily: "'Inter', sans-serif", fontSize: 13 }, duration: 2500 }} />
      <div style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ height: 1, width: 60, background: "rgba(48,56,68,0.6)" }} />
        <div style={{ fontFamily: "'Ultra', serif", fontSize: 12, color: C.g500 + "88", letterSpacing: "0.25em" }}>TIN CUP</div>
        <div style={{ height: 1, width: 60, background: "rgba(48,56,68,0.6)" }} />
      </div>
      {/* Phone frame */}
      <div style={{ width: 393, height: 852, borderRadius: 52, background: C.m900, position: "relative", overflow: "hidden", flexShrink: 0, boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 0 0 11px #1C1C1E, 0 0 0 13px #2A2A2A, 0 0 0 14px #1C1C1E, 0 50px 120px rgba(0,0,0,0.95), 0 0 100px rgba(245,179,43,0.04)" }}>
        {/* Dynamic Island */}
        <div style={{ position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)", width: 126, height: 34, background: "#000", borderRadius: 20, zIndex: 100, boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }} />
        {screen === "splash" && <SplashScreen onDone={() => setScreen("welcome")} />}
        {screen === "welcome" && <WelcomeScreen onWalk={() => setScreen("chooseFate")} onSignIn={() => setScreen("chooseFate")} />}
        {screen === "chooseFate" && <ChooseFateScreen onChoose={() => setScreen("characterCreator")} />}
        {screen === "characterCreator" && <CharacterCreatorScreen onDone={() => setScreen("main")} />}
        {screen === "main" && <MainApp />}
        {/* Home indicator */}
        <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", width: 130, height: 5, background: "rgba(255,255,255,0.18)", borderRadius: 3, zIndex: 100, pointerEvents: "none" }} />
      </div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ height: 1, width: 40, background: "rgba(48,56,68,0.6)" }} />
        <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(48,56,68,0.8)" }}>The Gulch Design System · Season 1</div>
        <div style={{ height: 1, width: 40, background: "rgba(48,56,68,0.6)" }} />
      </div>
    </div>
  );
}
