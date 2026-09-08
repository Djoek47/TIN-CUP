import { useEffect, useState, type ComponentType } from "react"
import { Platform, StyleSheet, View } from "react-native"
import { ImageSlot, Label } from "@/components/vessel"
import { fetchLiveToken, livekitConfigured } from "@/lib/livekit"
import { useVessel } from "@/providers/VesselTheme"

let CameraView: ComponentType<{ style?: object; facing?: "front" | "back" }> | null = null
try {
  CameraView = require("expo-camera").CameraView
} catch {
  CameraView = null
}

/**
 * Live room surface.
 * - LiveKit: when EXPO_PUBLIC_LIVEKIT_URL + token URL are set (EAS/TestFlight).
 * - Fallback: expo-camera preview (broadcast) or ImageSlot placeholder (viewer).
 */
export function LiveRoom({
  mode,
  room = "tincup-demo",
  identity = "guest",
}: {
  mode: "publish" | "subscribe"
  room?: string
  identity?: string
}) {
  const { v } = useVessel()
  const [status, setStatus] = useState<"fallback" | "livekit-ready" | "connecting">("fallback")

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!livekitConfigured()) return
      setStatus("connecting")
      const token = await fetchLiveToken(room, identity)
      if (cancelled) return
      // Full LiveKit RN room attach requires native EAS build + @livekit/react-native.
      // Tonight we mark ready when token exists; UI still uses camera/placeholder frame.
      setStatus(token ? "livekit-ready" : "fallback")
    })()
    return () => {
      cancelled = true
    }
  }, [room, identity])

  const camOk = Boolean(CameraView) && Platform.OS !== "web" && mode === "publish"

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000" }]}>
      {camOk && CameraView ? (
        <CameraView style={StyleSheet.absoluteFill} facing="front" />
      ) : (
        <ImageSlot
          label={mode === "publish" ? "CAMERA PREVIEW · OR BROWSE FILES" : "LIVE STREAM FRAME · OR BROWSE FILES"}
          height={640}
          radius={0}
        />
      )}
      <View style={styles.badge}>
        <Label style={{ color: v.lim, fontSize: 8 }}>
          {status === "livekit-ready"
            ? "LIVEKIT TOKEN OK"
            : status === "connecting"
              ? "CONNECTING LIVEKIT…"
              : "CAMERA FALLBACK"}
        </Label>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
})
