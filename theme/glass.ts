import { ViewStyle } from "react-native"
import { color, radius } from "./tokens"

/** Gulch glass surfaces ported from Figma Make Tin-Cup-V2 */
export const glass = {
  card: {
    backgroundColor: "rgba(26, 32, 41, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.07)",
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: radius.m,
  } satisfies ViewStyle,
  elevated: {
    backgroundColor: "rgba(36, 43, 54, 0.84)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.09)",
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: radius.m,
  } satisfies ViewStyle,
  gold: {
    backgroundColor: "rgba(245, 179, 43, 0.13)",
    borderWidth: 1,
    borderColor: "rgba(245, 179, 43, 0.24)",
    borderTopColor: "rgba(245, 179, 43, 0.35)",
    borderRadius: 999,
  } satisfies ViewStyle,
  nav: {
    backgroundColor: "rgba(9, 12, 18, 0.92)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderTopColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 999,
  } satisfies ViewStyle,
  parchment: {
    backgroundColor: "rgba(244, 238, 221, 0.95)",
    borderWidth: 2,
    borderColor: color.dust,
    borderRadius: 18,
  } satisfies ViewStyle,
} as const
