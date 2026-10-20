import { ReactNode } from "react"
import { View, StyleSheet, ViewStyle, Pressable } from "react-native"
import { space, elevation } from "@/theme/tokens"
import { glass } from "@/theme/glass"

interface CardProps {
  children: ReactNode
  style?: ViewStyle
  onPress?: () => void
  padded?: boolean
  glow?: boolean
}

/** Glass card surface from Figma Make Tin-Cup-V2 */
export function Card({ children, style, onPress, padded = true, glow }: CardProps) {
  const content = (
    <View
      style={[
        glass.card,
        padded && styles.padded,
        glow ? elevation.gold : undefined,
        glow && styles.glowBorder,
        style,
      ]}
    >
      {children}
    </View>
  )
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => (pressed ? styles.pressed : undefined)}>
        {content}
      </Pressable>
    )
  }
  return content
}

const styles = StyleSheet.create({
  padded: { padding: space[4] },
  glowBorder: { borderColor: "rgba(245,179,43,0.4)", borderTopColor: "rgba(245,179,43,0.55)" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.995 }] },
})
