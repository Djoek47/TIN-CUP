import { View, StyleSheet } from "react-native"
import { LiveRoom } from "@/components/vessel/LiveRoom"
import { Label } from "@/components/vessel"

/** Thin live surface used by live + broadcast screens */
export function LiveVideoSurface({
  mode,
  identity,
}: {
  mode: "publish" | "subscribe"
  identity?: string
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LiveRoom mode={mode} identity={identity ?? (mode === "publish" ? "host" : "viewer")} />
    </View>
  )
}
