import { View, ActivityIndicator, StyleSheet, Animated } from "react-native"
import { Txt } from "./Txt"
import { color, space } from "@/theme/tokens"

interface LoadingStateProps {
  visible: boolean
  message?: string
  size?: "small" | "large"
  overlay?: boolean
}

export function LoadingState({
  visible,
  message = "Loading...",
  size = "large",
  overlay = true,
}: LoadingStateProps) {
  if (!visible) return null

  return (
    <View
      style={[
        styles.container,
        overlay && styles.overlay,
      ]}
    >
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color.action.primary} />
        {message && (
          <Txt
            variant="bodyM"
            color={color.text.secondary}
            center
            style={{ marginTop: space[3] }}
          >
            {message}
          </Txt>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    backgroundColor: color.surface.card,
    padding: space[6],
    borderRadius: 12,
  },
})
