/**
 * TIN CUP — "The Vessel" design tokens
 * Amber = given. Lime = received.
 * Ported from docs/redesign/tokens.css
 */

export type Caste = "vagrant" | "lord"
export type ThemeMode = "dark" | "light"

export const pure = {
  amber: "#FFB43D",
  lime: "#C4F000",
  bone: "#EDE6D6",
  fillInk: "#0a0a0a",
} as const

export const motion = {
  easeEnter: "cubic-bezier(.16,1,.3,1)",
  easeLiquid: "cubic-bezier(.22,1,.28,1)",
  easeExit: "cubic-bezier(.4,0,1,1)",
  pressMs: 80,
  screenMs: 620,
  fillMs: 2600,
  wipeInMs: 250,
  wipeOutMs: 640,
  toastMs: 2000,
  holdGoLiveMs: 1300,
  holdPonrMs: 2000,
  chatTickMs: 1400,
  giftBurstMs: 2600,
} as const

export const space = {
  screenPad: 22,
  sectionGap: 26,
  rowPad: 14,
  btnH: 56,
  navBlur: 24,
} as const

export type VesselColors = {
  bg: string
  ink: string
  dim: string
  faint: string
  line: string
  surf: string
  gls: string
  navbg: string
  navfade: string
  amb: string
  ambfill: string
  lim: string
  limfill: string
  rad: number
  radPill: number
  track: number
}

const vagrantDark: VesselColors = {
  bg: "#08090B",
  ink: "#F4F3F0",
  dim: "rgba(244,243,240,0.5)",
  faint: "rgba(244,243,240,0.32)",
  line: "rgba(255,255,255,0.10)",
  surf: "rgba(255,255,255,0.035)",
  gls: "rgba(255,255,255,0.22)",
  navbg: "rgba(20,21,24,0.72)",
  navfade: "rgba(8,9,11,0.92)",
  amb: pure.amber,
  ambfill: pure.amber,
  lim: pure.lime,
  limfill: pure.lime,
  rad: 20,
  radPill: 100,
  track: 0.3,
}

const vagrantLight: VesselColors = {
  bg: "#EDEBE5",
  ink: "#0B0C0E",
  dim: "rgba(11,12,14,0.55)",
  faint: "rgba(11,12,14,0.38)",
  line: "rgba(11,12,14,0.13)",
  surf: "rgba(11,12,14,0.035)",
  gls: "rgba(11,12,14,0.22)",
  navbg: "rgba(255,255,255,0.72)",
  navfade: "rgba(237,235,229,0.94)",
  amb: "#A86A00",
  ambfill: pure.amber,
  lim: "#6E8C00",
  limfill: pure.lime,
  rad: 20,
  radPill: 100,
  track: 0.3,
}

const lordDark: VesselColors = {
  bg: "#0C0906",
  ink: "#F7F1E4",
  dim: "rgba(247,241,228,0.52)",
  faint: "rgba(247,241,228,0.34)",
  line: "rgba(255,180,61,0.16)",
  surf: "rgba(255,180,61,0.05)",
  gls: "rgba(255,214,150,0.28)",
  navbg: "rgba(30,22,12,0.78)",
  navfade: "rgba(12,9,6,0.94)",
  amb: pure.amber,
  ambfill: pure.amber,
  lim: pure.bone,
  limfill: pure.bone,
  rad: 8,
  radPill: 4,
  track: 0.44,
}

const lordLight: VesselColors = {
  bg: "#F2ECDF",
  ink: "#17110A",
  dim: "rgba(23,17,10,0.58)",
  faint: "rgba(23,17,10,0.4)",
  line: "rgba(120,80,10,0.18)",
  surf: "rgba(168,106,0,0.06)",
  gls: "rgba(120,80,10,0.26)",
  navbg: "rgba(255,251,242,0.78)",
  navfade: "rgba(242,236,223,0.95)",
  amb: "#8A5300",
  ambfill: pure.amber,
  lim: "#4A3A22",
  limfill: "#6B573A",
  rad: 8,
  radPill: 4,
  track: 0.44,
}

export function vesselColors(caste: Caste, theme: ThemeMode): VesselColors {
  if (caste === "lord") return theme === "light" ? lordLight : lordDark
  return theme === "light" ? vagrantLight : vagrantDark
}

export const font = {
  ui: "Archivo_700Bold",
  uiSemi: "Archivo_600SemiBold",
  uiBlack: "Archivo_900Black",
  uiReg: "Archivo_400Regular",
  mono: "JetBrainsMono_400Regular",
  monoMed: "JetBrainsMono_500Medium",
  monoBold: "JetBrainsMono_700Bold",
} as const

/** Legacy bridge so old imports of color.bg.canvas still work during migration */
export const color = {
  bg: { canvas: vagrantDark.bg, surface: vagrantDark.surf, card: "#121316", sheet: "#1A1B1F" },
  text: { primary: vagrantDark.ink, secondary: vagrantDark.dim, tertiary: vagrantDark.faint, inverse: pure.fillInk },
  action: { primary: pure.amber, primaryPressed: "#D99620", danger: "#E5484D", success: pure.lime },
  border: { subtle: vagrantDark.line, strong: vagrantDark.gls },
  live: "#E5484D",
}
