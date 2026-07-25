import { Pressable, View, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Txt } from "./Txt"
import { color, space } from "@/theme/tokens"

interface ShareButtonProps {
  onPress: () => void
  size?: "small" | "medium" | "large"
  variant?: "primary" | "ghost"
  icon?: boolean
  label?: string
}

export function ShareButton({
  onPress,
  size = "medium",
  variant = "primary",
  icon = true,
  label = "Share",
}: ShareButtonProps) {
  const sizeStyle =
    size === "small" ? styles.small : size === "large" ? styles.large : styles.medium

  const variantStyle =
    variant === "ghost"
      ? {
          backgroundColor: "transparent",
          borderColor: color.action.primary,
          borderWidth: 1,
        }
      : {
          backgroundColor: color.action.primary,
        }

  const iconSize = size === "small" ? 16 : size === "large" ? 24 : 20

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        variantStyle,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <MaterialCommunityIcons
            name="share-variant"
            size={iconSize}
            color={variant === "ghost" ? color.action.primary : color.text.inverse}
            style={label ? { marginRight: space[2] } : undefined}
          />
        )}
        {label && (
          <Txt
            variant={size === "small" ? "bodyS" : "bodyM"}
            color={variant === "ghost" ? color.action.primary : color.text.inverse}
          >
            {label}
          </Txt>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    paddingHorizontal: space[2],
    paddingVertical: space[1],
  },
  medium: {
    paddingHorizontal: space[4],
    paddingVertical: space[2],
  },
  large: {
    paddingHorizontal: space[6],
    paddingVertical: space[3],
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },
})
