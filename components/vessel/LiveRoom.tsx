import { useEffect, useMemo, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera"
import { Room, RoomEvent } from "livekit-client"
import { Label, UiText } from "@/components/vessel/MonoNum"
import { useVessel } from "@/providers/VesselTheme"
import { fetchLiveKitToken, livekitConfigured } from "@/lib/livekit"

let livekitNativeReady = false
try {
  // Native WebRTC globals for @livekit/react-native / livekit-client on device
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const lkNative = require("@livekit/react-native") as { registerGlobals?: () => void }
  if (Platform.OS !== "web" && typeof lkNative.registerGlobals === "function") {
    lkNative.registerGlobals()
    livekitNativeReady = true
  }
} catch {
  livekitNativeReady = false
}

/** Phone camera + LiveKit distribute (publish) / subscribe when configured. */
export function LiveRoom({
  mode,
  room: roomName,
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
  const [lkStatus, setLkStatus] = useState<string>("")
  const [remoteAttached, setRemoteAttached] = useState(false)
  const native = Platform.OS === "ios" || Platform.OS === "android"
  const wantLiveKit = livekitConfigured() && !!roomName

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

  useEffect(() => {
    if (!wantLiveKit || !roomName) return
    let cancelled = false
    let room: Room | null = null

    ;(async () => {
      try {
        setLkStatus("Connecting…")
        const tok = await fetchLiveKitToken({
          room: roomName,
          role: mode === "publish" ? "host" : "viewer",
          identity,
        })
        if (!tok || cancelled) {
          setLkStatus(livekitConfigured() ? "Token unavailable" : "LiveKit off")
          return
        }
        room = new Room({ adaptiveStream: true, dynacast: true })
        room.on(RoomEvent.TrackSubscribed, () => setRemoteAttached(true))
        room.on(RoomEvent.Disconnected, () => {
          setRemoteAttached(false)
          setLkStatus("Disconnected")
        })
        await room.connect(tok.url, tok.token)
        if (cancelled) {
          await room.disconnect()
          return
        }
        setLkStatus("LiveKit connected")
        if (mode === "publish" && (Platform.OS === "web" || livekitNativeReady)) {
          await room.localParticipant.setCameraEnabled(true)
          await room.localParticipant.setMicrophoneEnabled(!muted)
        }
      } catch (e: any) {
        console.warn("[LiveRoom] livekit", e)
        setLkStatus(e?.message || "LiveKit connect failed")
      }
    })()

    return () => {
      cancelled = true
      room?.disconnect()
    }
  }, [wantLiveKit, roomName, mode, identity, muted])

  const flip = () => {
    const next = facing === "front" ? "back" : "front"
    setFacing(next)
    onFacingChange?.(next)
  }

  const lkBadge = useMemo(() => {
    if (!wantLiveKit) return null
    return (
      <View style={styles.lkBadge}>
        <Label style={{ color: remoteAttached || lkStatus.includes("connected") ? v.lim : v.amb, fontSize: 8 }}>
          {lkStatus || "LIVEKIT"}
        </Label>
      </View>
    )
  }, [wantLiveKit, lkStatus, remoteAttached, v.amb, v.lim])

  if (mode === "subscribe") {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: "#050505" }]}>
        {lkBadge}
        <Label style={{ color: v.lim }}>
          {remoteAttached ? "STREAM LIVE" : wantLiveKit ? "CONNECTING TO HOST" : "WAITING FOR HOST"}
        </Label>
        <UiText weight="semi" style={{ color: v.ink, marginTop: 10, fontSize: 16 }}>
          @{identity}
        </UiText>
        <Label style={{ color: v.dim, marginTop: 14, textAlign: "center", paddingHorizontal: 24 }}>
          {wantLiveKit
            ? remoteAttached
              ? "Receiving LiveKit media."
              : lkStatus || "Joining room…"
            : "The stream starts when they go live. Set EXPO_PUBLIC_LIVEKIT_URL for remote video."}
        </Label>
      </View>
    )
  }

  if (!native) {
    return (
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: "#050505" }]}>
        {lkBadge}
        <Label style={{ color: v.amb }}>CAMERA ON PHONE</Label>
        <Label style={{ color: v.dim, marginTop: 10, textAlign: "center", paddingHorizontal: 28 }}>
          Go live from the 0bol app on your iPhone or iPad.
          {wantLiveKit ? ` ${lkStatus}` : ""}
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
      {lkBadge}
      <View style={styles.badge}>
        <Label style={{ color: v.lim, fontSize: 8 }}>
          {muted ? "MIC OFF · " : ""}
          {facing === "front" ? "FRONT CAM" : "BACK CAM"} · @{identity}
          {wantLiveKit ? " · LK" : ""}
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
  lkBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 2,
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
