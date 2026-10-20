import { TextStyle } from "react-native"
import { font, color } from "./tokens"

/**
 * Type scale from the GDS Figma spec (8pt-aligned line heights).
 * Display/ceremonial = Ultra. Headlines = Archivo. Body = Inter. Money = IBM Plex Mono.
 */
export const type: Record<string, TextStyle> = {
  displayXL: { fontFamily: font.display, fontSize: 52, lineHeight: 56, letterSpacing: 1, textTransform: "uppercase", color: color.text.primary },
  displayL: { fontFamily: font.display, fontSize: 38, lineHeight: 42, letterSpacing: 0.8, textTransform: "uppercase", color: color.text.primary },
  displayM: { fontFamily: font.display, fontSize: 28, lineHeight: 32, letterSpacing: 0.6, textTransform: "uppercase", color: color.text.primary },
  headlineXL: { fontFamily: font.headlineBlack, fontSize: 28, lineHeight: 32, color: color.text.primary },
  headlineL: { fontFamily: font.headlineBold, fontSize: 22, lineHeight: 28, color: color.text.primary },
  headlineM: { fontFamily: font.headlineBold, fontSize: 18, lineHeight: 24, color: color.text.primary },
  headlineS: { fontFamily: font.headlineSemi, fontSize: 15, lineHeight: 20, color: color.text.primary },
  bodyL: { fontFamily: font.body, fontSize: 17, lineHeight: 24, color: color.text.primary },
  bodyM: { fontFamily: font.body, fontSize: 15, lineHeight: 20, color: color.text.primary },
  bodyS: { fontFamily: font.body, fontSize: 13, lineHeight: 18, color: color.text.secondary },
  caption: { fontFamily: font.bodyMed, fontSize: 12, lineHeight: 16, letterSpacing: 0.2, color: color.text.secondary },
  numericL: { fontFamily: font.mono, fontSize: 24, lineHeight: 32, color: color.text.primary },
  numericM: { fontFamily: font.mono, fontSize: 17, lineHeight: 24, color: color.text.primary },
  numericS: { fontFamily: font.mono, fontSize: 13, lineHeight: 16, color: color.text.primary },
  buttonL: { fontFamily: font.headlineBold, fontSize: 17, lineHeight: 24 },
  buttonM: { fontFamily: font.headlineBold, fontSize: 15, lineHeight: 20 },
  overline: { fontFamily: font.headlineSemi, fontSize: 11, lineHeight: 16, letterSpacing: 1.6, textTransform: "uppercase", color: color.text.secondary },
}
