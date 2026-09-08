import { useEffect, useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
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
import { fmtUsd } from "@/lib/money"
import { motion, space } from "@/theme/vessel"

export default function BroadcastScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { say, user } = useApp()
  const [secs, setSecs] = useState(0)
  const [viewers, setViewers] = useState(12)
  const [raised, setRaised] = useState(0)
  const goal = 2000
  const [chat, setChat] = useState<{ who: string; t: string }[]>([])

  useEffect(() => {
    const tick = setInterval(() => {
      setSecs((s) => s + 1)
      setViewers((n) => n + 3 + Math.floor(Math.random() * 18))
      setRaised((r) => r + [0, 5, 10, 25, 0, 0][Math.floor(Math.random() * 6)])
      const who = ["@ace", "@nova", "@zed", "@luna"][Math.floor(Math.random() * 4)]
      const lines = ["You look great", "Sending", "First!", "Keep going", "Goal climb"]
      setChat((c) => [...c.slice(-4), { who, t: lines[Math.floor(Math.random() * lines.length)] }])
    }, motion.chatTickMs)
    return () => clearInterval(tick)
  }, [])

  const mm = String(Math.floor(secs / 60)).padStart(2, "0")
  const ss = String(secs % 60).padStart(2, "0")

  return (
    <VesselScreen nav={false} pad={false}>
      <View style={{ flex: 1 }}>
        <LiveRoom mode="publish" identity={user.handle || "host"} />

        <View style={[styles.top, { paddingHorizontal: space.screenPad }]}>
          <View style={[styles.onAir, { borderRadius: v.radPill, backgroundColor: v.limfill }]}>
            <Label style={{ color: "#0a0a0a" }}>ON AIR {mm}:{ss}</Label>
          </View>
          <Label>{viewers} watching</Label>
          <Pressable
            onPress={() => {
              say("Ended live")
              router.replace("/(app)")
            }}
            style={[styles.end, { borderRadius: v.radPill, borderColor: v.line }]}
          >
            <Label style={{ color: v.ink }}>END</Label>
          </Pressable>
        </View>

        <View style={[styles.meta, { paddingHorizontal: space.screenPad }]}>
          <MonoNum style={{ color: v.lim, fontSize: 16 }}>{fmtUsd(raised, { cents: false })}</MonoNum>
          <Label>GOAL {fmtUsd(goal, { cents: false })}</Label>
        </View>

        <View style={[styles.chat, { paddingHorizontal: space.screenPad }]}>
          {chat.map((m, i) => (
            <Row key={`${m.who}-${i}`} style={{ gap: 8, marginBottom: 6 }}>
              <Label style={{ color: v.amb }}>{m.who}</Label>
              <UiText weight="reg" style={{ fontSize: 13 }}>
                {m.t}
              </UiText>
            </Row>
          ))}
        </View>

        <Row style={[styles.tools, { paddingHorizontal: space.screenPad }]}>
          {(["MIC", "CAM", "FLIP", "FILTER"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => say(`${t} toggled`)}
              style={[styles.tool, { borderColor: v.line, borderRadius: v.radPill }]}
            >
              <Label>{t}</Label>
            </Pressable>
          ))}
        </Row>
      </View>
    </VesselScreen>
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
  chat: { position: "absolute", left: 0, right: 80, bottom: 90 },
  tools: { position: "absolute", bottom: 24, left: 0, right: 0, gap: 8, justifyContent: "space-between" },
  tool: { flex: 1, alignItems: "center", paddingVertical: 12, borderWidth: StyleSheet.hairlineWidth },
})
