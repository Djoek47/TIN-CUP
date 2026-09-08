import { View, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { Label, UiText } from "./MonoNum"
import { BottomNav } from "./BottomNav"
import { space } from "@/theme/vessel"

export function ToastHost() {
  const { toast } = useApp()
  const { v } = useVessel()
  const insets = useSafeAreaInsets()
  if (!toast) return null
  return (
    <View style={[styles.toast, { top: insets.top + 12, backgroundColor: v.navbg, borderColor: v.line }]}>
      <Label style={{ color: v.ink }}>{toast.text}</Label>
    </View>
  )
}

export function VesselScreen({
  children,
  nav = true,
  pad = true,
}: {
  children: React.ReactNode
  nav?: boolean
  pad?: boolean
}) {
  const { v } = useVessel()
  const insets = useSafeAreaInsets()
  return (
    <View style={{ flex: 1, backgroundColor: v.bg, paddingTop: insets.top }}>
      <ToastHost />
      <View style={{ flex: 1, paddingHorizontal: pad ? space.screenPad : 0, paddingBottom: nav ? 90 : insets.bottom + 12 }}>
        {children}
      </View>
      {nav ? <BottomNav /> : null}
    </View>
  )
}

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  const { v } = useVessel()
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={12} style={{ width: 40 }}>
          <UiText style={{ fontSize: 22, color: v.ink }}>‹</UiText>
        </Pressable>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <Label style={{ color: v.ink, letterSpacing: 3 }}>{title}</Label>
      <View style={{ width: 40, alignItems: "flex-end" }}>{right}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: StyleSheet.hairlineWidth,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
})
