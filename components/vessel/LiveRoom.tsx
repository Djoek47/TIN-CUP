import { useEffect, useState, type ComponentType } from "react"
import { Platform, StyleSheet, View } from "react-native"
import { ImageSlot, Label } from "@/components/vessel"
import { fetchLiveToken, livekitConfigured } from "@/lib/livekit"
import { requestCameraPermission } from "@/lib/camera"
import { useVessel } from "@/providers/VesselTheme"

let CameraView: ComponentType<{ style?: object; facing?: "front" | "back" }> | null = null
try {
  CameraView = require("expo-camera").CameraView
} catch {
  CameraView = null
}

/**
 * Live room surface.
 * - LiveKit token badge when URLs configured (full RN SDK needs native build).
 * - Broadcast: expo-camera preview after permission.
 * - Viewer: placeholder frame.
 */
export function LiveRoom({
  mode,
  room = "obol-demo",
  identity = "guest",
}: {
  mode: "publish" | "subscribe"
  room?: string
  identity?: string
}) {
  const { v } = useVessel()
  const [status, setStatus] = useState<"fallback" | "camera" | "livekit-ready" | "connecting">("fallback")
  const [camGranted, setCamGranted] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (mode === "publish") {
        const ok = await requestCameraPermission()
        if (!cancelled) {
          setCamGranted(ok)
          if (ok) setStatus("camera")
        }
      }
      if (!livekitConfigured()) return
      setStatus("connecting")
      const token = await fetchLiveToken(room, identity)
      if (cancelled) return
      setStatus(token ? "livekit-ready" : camGranted ? "camera" : "fallback")
    })()
    return () => {
      cancelled = true
    }
  }, [room, identity, mode, camGranted])

  const camOk =
    Boolean(CameraView) && Platform.OS !== "web" && mode === "publish" && camGranted

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000" }]}>
      {camOk && CameraView ? (
        <CameraView style={StyleSheet.absoluteFill} facing="front" />
      ) : (
        <ImageSlot
          label={
            mode === "publish"
              ? camGranted
                ? "CAMERA READY · NATIVE PREVIEW"
                : "ALLOW CAMERA TO GO LIVE"
              : "LIVE STREAM FRAME"
          }
          height={640}
          radius={0}
        />
      )}
      <View style={styles.badge}>
        <Label style={{ color: v.lim, fontSize: 8 }}>
          {status === "livekit-ready"
            ? "LIVEKIT TOKEN OK"
            : status === "connecting"
              ? "CONNECTING…"
              : status === "camera"
                ? "CAMERA LIVE"
                : "DEMO FRAME"}
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
