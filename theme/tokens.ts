/**
 * THE GULCH DESIGN SYSTEM (GDS)
 * Dark-first. Gold means money. Green means paid. Red means law.
 * Primitive + semantic tokens ported from the Stage 2 Figma spec.
 */

export const primitive = {
  midnight: {
    900: "#0B0E14", // app background
    800: "#12161F", // raised surface
    700: "#1A2029", // card
    600: "#242B36", // elevated card / sheet
    500: "#303844", // borders, dividers
  },
  gold: {
    600: "#C98F14",
    500: "#F5B32B",
    400: "#FFC94D",
    100: "#FFF3D6",
  },
  oxblood: {
    500: "#8E2D30",
    400: "#B33A3E",
    100: "#F6E3E3",
  },
  cactus: {
    500: "#3F9B5B",
    100: "#E1F2E7",
  },
  parchment: {
    100: "#F4EEDD",
    300: "#E4DAC0",
  },
  ink: {
    900: "#17130C",
  },
  white: {
    hi: "#F7F5F0", // primary text 96%
    mid: "#B9B4A8", // secondary text
    lo: "#7A766C", // tertiary / disabled
  },
  dust: {
    500: "#8C7A5B", // coin-dust currency accent
  },
  parchment: {
    100: "#F4EEDD",
    300: "#E4DAC0",
  },
  sky: {
    500: "#4E7DA6", // links / informational
  },
  live: "#E5484D",
} as const

/** Semantic color tokens (Dark mode — the canonical mode) */
export const color = {
  bg: {
    canvas: primitive.midnight[900],
    surface: primitive.midnight[800],
    card: primitive.midnight[700],
    sheet: primitive.midnight[600],
  },
  /** Screen aliases used across app routes (maps to bg primitives) */
  surface: {
    idle: primitive.midnight[800],
    raised: primitive.midnight[800],
    card: primitive.midnight[700],
    sheet: primitive.midnight[600],
    drifter: "#1A2430",
    lord: "#2A2418",
  },
  border: {
    subtle: primitive.midnight[500],
    strong: "#3C4550",
  },
  text: {
    primary: primitive.white.hi,
    secondary: primitive.white.mid,
    tertiary: primitive.white.lo,
    inverse: primitive.ink[900],
  },
  action: {
    primary: primitive.gold[500],
    primaryPressed: primitive.gold[600],
    primaryHover: primitive.gold[400],
    danger: primitive.oxblood[500],
    success: primitive.cactus[500],
  },
  money: {
    positive: primitive.cactus[500], // received / cash-out ONLY
    amount: primitive.gold[500],
    fee: primitive.white.mid,
  },
  status: {
    live: primitive.live,
    warning: primitive.gold[600],
  },
  dust: primitive.dust[500],
  parchment: primitive.parchment[100],
  parchmentEdge: primitive.parchment[300],
  link: primitive.sky[500],
  overlay: {
    scrim: "rgba(11,14,20,0.72)",
  },
} as const

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
  9: 64,
} as const

export const radius = {
  xs: 6, // chips, tags, poster cards
  s: 10, // buttons, inputs
  m: 14, // cards
  l: 20, // sheets, modals
  full: 999, // pills, avatars
} as const

/** Font family keys — mapped to loaded fonts in theme/typography.ts */
export const font = {
  display: "Ultra_400Regular", // wanted-poster slab, ceremonial only
  headlineBlack: "Archivo_900Black",
  headlineBold: "Archivo_700Bold",
  headlineSemi: "Archivo_600SemiBold",
  body: "Inter_400Regular",
  bodyMed: "Inter_500Medium",
  bodySemi: "Inter_600SemiBold",
  mono: "IBMPlexMono_500Medium",
  monoReg: "IBMPlexMono_400Regular",
} as const

export const elevation = {
  gold: {
    shadowColor: primitive.gold[500],
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  card: {
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  sheet: {
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 24,
  },
} as const

export const motion = {
  instant: 80,
  fast: 160,
  base: 240,
  slow: 400,
  ceremony: 1100,
} as const
