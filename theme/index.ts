import { Platform } from "react-native"

export const colors = {
  // backgrounds
  bg: "#0b0710",
  bgElevated: "#15101c",
  surface: "#181320",
  surface2: "#1f1830",
  border: "#2a2136",
  // brand
  pink: "#ff2d6e",
  pinkSoft: "#ff6fa0",
  pinkDeep: "#c9165a",
  gold: "#e6c27a",
  green: "#3ddc97",
  blue: "#4d9fff",
  amber: "#f5a623",
  // text
  text: "#f6f1f8",
  textDim: "#b3a8c0",
  textFaint: "#7d7290",
  // status
  live: "#ff2d6e",
  white: "#ffffff",
  black: "#000000",
}

export const gradients = {
  brand: ["#ff2d6e", "#ff6fa0"] as const,
  brandDeep: ["#c9165a", "#ff2d6e"] as const,
  avatar: ["#ff2d6e", "#a04bff", "#4d9fff"] as const,
  ai: ["#ff2d6e", "#e6c27a"] as const,
  hero: ["transparent", "rgba(11,7,16,0.2)", "rgba(11,7,16,0.96)"] as const,
}

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
}

export const fonts = {
  // Playfair Display = elegant fashion serif for headings (matches Fanissima wordmark)
  serif: "PlayfairDisplay_600SemiBold",
  serifBold: "PlayfairDisplay_700Bold",
  // Inter for clean UI body
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  // system monospace for stats/numbers
  mono: Platform.select({ ios: "Menlo", android: "monospace", default: "ui-monospace" }) as string,
}

export const sportEmoji: Record<string, string> = {
  Football: "⚽",
  Tennis: "🎾",
  Basketball: "🏀",
  Athletics: "🏃",
  Gymnastics: "🤸",
  Volleyball: "🏐",
}

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: {
    shadowColor: colors.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
}
