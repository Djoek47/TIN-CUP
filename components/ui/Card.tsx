import { ReactNode } from "react"
import { View, StyleSheet, ViewStyle, Pressable } from "react-native"
import { color, radius, space, elevation } from "@/theme/tokens"

interface CardProps {
  children: ReactNode
  style?: ViewStyle
  onPress?: () => void
  padded?: boolean
  glow?: boolean
}

export function Card({ children, style, onPress, padded = true, glow }: CardProps) {
  const content = (
    <View
      style={[
        styles.card,
        padded && styles.padded,
        glow ? elevation.gold : elevation.card,
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
  card: {
    backgroundColor: color.bg.card,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: color.border.subtle,
  },
  padded: { padding: space[4] },
  glowBorder: { borderColor: "rgba(245,179,43,0.4)" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.995 }] },
})
