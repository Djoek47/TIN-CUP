import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera"
import { Label, UiText } from "@/components/vessel/MonoNum"
import { useVessel } from "@/providers/VesselTheme"

/**
 * Apple camera surface via expo-camera (AVFoundation on iOS).
 * Publish = host preview. Subscribe = viewer; remote A/V needs a stream session —
 * we show host identity / waiting state, never a fake “demo frame”.
 */
export function LiveRoom({
  mode,
  identity = "guest",
  facing: facingProp = "front",
  muted = false,
  onFacingChange,
}: {
  mode: "publish" | "subscribe"
  room?: string
  identity?: string
  facing?: "front" | "back"
  muted?: boolean
  onFacingChange?: (facing: "front" | "back") => void
}) {
  const { v } = useVessel()
  const [camPerm, requestCam] = useCameraPermissions()
  const [micPerm, requestMic] = useMicrophonePermissions()
  const [facing, setFacing] = useState<"front" | "back">(facingProp)
  const native = Platform.OS === "ios" || Platform.OS === "android"

  useEffect(() => {
    setFacing(facingProp)
  }, [facingProp])

  useEffect(() => {
    if (mode !== "publish") return
    ;(async () => {
      if (!camPerm?.granted) await requestCam()
      if (!micPerm?.granted) await requestMic()
    })()
  }, [mode, camPerm?.granted, micPerm?.granted, requestCam, requestMic])

  const flip = () => {
    const next = facing === "front" ? "back" : "front"
    setFacing(next)
    onFacingChange?.(next)
  }

  if (mode === "subscribe") {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: "#050505" }]}>
        <Label style={{ color: v.lim }}>WAITING FOR HOST</Label>
        <UiText weight="semi" style={{ color: v.ink, marginTop: 10, fontSize: 16 }}>
          @{identity}
        </UiText>
        <Label style={{ color: v.dim, marginTop: 14, textAlign: "center", paddingHorizontal: 24 }}>
          Viewer joins the host’s Apple camera session when they go live. No placeholder stream.
        </Label>
      </View>
    )
  }

  if (!native) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: "#050505" }]}>
        <Label style={{ color: v.amb }}>CAMERA REQUIRES iOS / ANDROID BUILD</Label>
        <Label style={{ color: v.dim, marginTop: 10, textAlign: "center", paddingHorizontal: 28 }}>
          TestFlight / device binary uses Apple camera. Web preview cannot open AVFoundation.
        </Label>
      </View>
    )
  }

  if (!camPerm?.granted) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: "#050505" }]}>
        <Label style={{ color: v.amb }}>CAMERA PERMISSION NEEDED</Label>
        <Pressable
          onPress={() => requestCam()}
          style={[styles.btn, { borderColor: v.lim, borderRadius: v.radPill }]}
        >
          <Label style={{ color: v.lim }}>ALLOW CAMERA</Label>
        </Pressable>
        {!micPerm?.granted ? (
          <Pressable
            onPress={() => requestMic()}
            style={[styles.btn, { borderColor: v.line, borderRadius: v.radPill, marginTop: 10 }]}
          >
            <Label style={{ color: v.dim }}>ALLOW MICROPHONE</Label>
          </Pressable>
        ) : null}
      </View>
    )
  }

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: "#000" }]}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        mute={muted}
        mode="video"
        mirror={facing === "front"}
      />
      <View style={styles.badge}>
        <Label style={{ color: v.lim, fontSize: 8 }}>
          {muted ? "MIC OFF · " : ""}
          {facing === "front" ? "FRONT CAM" : "BACK CAM"} · @{identity}
        </Label>
      </View>
      <Pressable
        onPress={flip}
        style={[styles.flip, { borderColor: v.line, borderRadius: v.radPill }]}
      >
        <Label style={{ color: v.ink }}>FLIP</Label>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center", padding: 20 },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  flip: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  btn: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
})
