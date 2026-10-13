import { useEffect, useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  VesselScreen,
  Label,
  UiText,
  MonoNum,
  LiveRoom,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { endLiveSession } from "@/lib/live-sessions"
import { fmtUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

export default function BroadcastScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { say, user } = useApp()
  const params = useLocalSearchParams<{ title?: string; goal?: string }>()
  const [secs, setSecs] = useState(0)
  const [muted, setMuted] = useState(false)
  const [facing, setFacing] = useState<"front" | "back">("front")
  const goal = Number(params.goal || 2000) || 2000
  const title = params.title || "Live"

  useEffect(() => {
    const tick = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(tick)
  }, [])

  const mm = String(Math.floor(secs / 60)).padStart(2, "0")
  const ss = String(secs % 60).padStart(2, "0")

  const end = async () => {
    if (user.address) await endLiveSession(user.address)
    say("Ended live")
    router.replace("/(app)")
  }

  return (
    <VesselScreen nav={false} pad={false}>
      <View style={{ flex: 1 }}>
        <LiveRoom
          mode="publish"
          identity={user.handle || "host"}
          facing={facing}
          muted={muted}
          onFacingChange={setFacing}
        />

        <View style={[styles.top, { paddingHorizontal: space.screenPad }]}>
          <View style={[styles.onAir, { borderRadius: v.radPill, backgroundColor: v.limfill }]}>
            <Label style={{ color: "#0a0a0a" }}>
              ON AIR {mm}:{ss}
            </Label>
          </View>
          <Label numberOfLines={1} style={{ flex: 1, marginHorizontal: 10 }}>
            {title}
          </Label>
          <Pressable
            onPress={end}
            style={[styles.end, { borderRadius: v.radPill, borderColor: v.line }]}
          >
            <Label style={{ color: v.ink }}>END</Label>
          </Pressable>
        </View>

        <View style={[styles.meta, { paddingHorizontal: space.screenPad }]}>
          <MonoNum style={{ color: v.lim, fontSize: 16 }}>GOAL {fmtUsd(goal, { cents: false })}</MonoNum>
          <Label>Apple camera · @{user.handle}</Label>
        </View>

        <Row style={[styles.tools, { paddingHorizontal: space.screenPad }]}>
          <Tool
            label={muted ? "MIC OFF" : "MIC ON"}
            on={ !muted}
            onPress={() => {
              setMuted((m) => !m)
              say(muted ? "Mic on" : "Mic off")
            }}
          />
          <Tool
            label="FLIP"
            on={facing === "back"}
            onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
          />
          <Tool label="END" on={false} onPress={end} />
        </Row>
      </View>
    </VesselScreen>
  )
}

function Tool({
  label,
  on,
  onPress,
}: {
  label: string
  on: boolean
  onPress: () => void
}) {
  const { v } = useVessel()
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tool,
        {
          borderColor: on ? v.lim : v.line,
          borderRadius: v.radPill,
          backgroundColor: on ? "rgba(196,240,0,0.12)" : "transparent",
        },
      ]}
    >
      <Label style={{ color: on ? v.lim : v.dim }}>{label}</Label>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  top: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  onAir: { paddingHorizontal: 12, paddingVertical: 6 },
  end: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: StyleSheet.hairlineWidth },
  meta: { position: "absolute", top: 56, left: 0, right: 0, gap: 4 },
  tools: { position: "absolute", bottom: 24, left: 0, right: 0, gap: 8, justifyContent: "space-between" },
  tool: { flex: 1, alignItems: "center", paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth },
})
