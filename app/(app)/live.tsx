import { useEffect, useState } from "react"
import { View, Pressable, StyleSheet, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  Label,
  UiText,
  MonoNum,
  Row,
  LiveRoom,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtUsd } from "@/lib/money"
import { motion, pure, space } from "@/theme/vessel"

const GIFTS = [10, 50, 100, 250, 500]
const SEED_CHAT = [
  { who: "@zed", t: "Let's go Luna" },
  { who: "@stella", t: "Goal almost there" },
  { who: "@kai", t: "Pouring now" },
]

export default function LiveScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { gift, say } = useApp()
  const [secs, setSecs] = useState(14 * 60 + 32)
  const [raised, setRaised] = useState(1235)
  const goal = 2000
  const [chat, setChat] = useState(SEED_CHAT)
  const [burst, setBurst] = useState<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const lines = ["Fire 🔥", "You got this", "Sending love", "Almost at goal", "Iconic"]
    const t = setInterval(() => {
      const who = ["@ace", "@nova", "@phantom", "@kingx"][Math.floor(Math.random() * 4)]
      setChat((c) => [...c.slice(-4), { who, t: lines[Math.floor(Math.random() * lines.length)] }])
    }, motion.chatTickMs)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(secs / 60)).padStart(2, "0")
  const ss = String(secs % 60).padStart(2, "0")
  const pct = Math.min(100, Math.round((raised / goal) * 100))

  const onGift = async (amount: number) => {
    try {
      await gift("@luna", amount)
      setRaised((r) => r + amount)
      setBurst(amount)
      say(`$${amount} poured`)
      setTimeout(() => setBurst(null), motion.giftBurstMs)
    } catch {
      /* toast via gift */
    }
  }

  return (
    <VesselScreen pad={false}>
      <View style={{ flex: 1 }}>
        <View style={[styles.frame, { backgroundColor: v.surf }]}>
          <LiveRoom mode="subscribe" identity="viewer" />
        </View>

        <View style={[styles.top, { paddingHorizontal: space.screenPad }]}>
          <Pressable onPress={() => router.back()}>
            <UiText style={{ fontSize: 22 }}>‹</UiText>
          </Pressable>
          <Row style={{ gap: 8, alignItems: "center" }}>
            <View style={[styles.live, { borderRadius: v.radPill }]}>
              <View style={[styles.dot, { backgroundColor: v.limfill }]} />
              <Label style={{ color: "#fff" }}>LIVE {mm}:{ss}</Label>
            </View>
            <Label>2.4K</Label>
          </Row>
          <Pressable onPress={() => router.push("/(app)/send")}>
            <Label style={{ color: v.amb }}>GIVE</Label>
          </Pressable>
        </View>

        <View style={[styles.goal, { paddingHorizontal: space.screenPad }]}>
          <Row style={{ justifyContent: "space-between" }}>
            <MonoNum style={{ color: v.lim, fontSize: 18 }}>{fmtUsd(raised, { cents: false })} RAISED</MonoNum>
            <Label>GOAL {fmtUsd(goal, { cents: false })}</Label>
          </Row>
          <View style={[styles.track, { backgroundColor: v.line }]}>
            <View style={{ width: `${pct}%`, height: "100%", backgroundColor: v.limfill }} />
          </View>
        </View>

        <View style={styles.chatWrap}>
          {chat.map((m, i) => (
            <View key={`${m.who}-${i}`} style={styles.chatLine}>
              <Label style={{ color: v.amb }}>{m.who}</Label>
              <UiText weight="reg" style={{ fontSize: 13, marginLeft: 8 }}>
                {m.t}
              </UiText>
            </View>
          ))}
        </View>

        {burst != null ? (
          <View style={styles.burst} pointerEvents="none">
            <MonoNum style={{ color: pure.amber, fontSize: 42 }}>${burst}</MonoNum>
            <Label style={{ color: pure.amber }}>POURED</Label>
          </View>
        ) : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.gifts, { paddingHorizontal: space.screenPad }]}
          style={styles.giftRail}
        >
          {GIFTS.map((g) => (
            <Pressable
              key={g}
              onPress={() => onGift(g)}
              style={[
                styles.pill,
                {
                  borderRadius: v.radPill,
                  borderColor: g === 250 ? v.amb : v.line,
                  backgroundColor: g === 250 ? v.ambfill : "transparent",
                },
              ]}
            >
              <MonoNum style={{ color: g === 250 ? pure.fillInk : v.ink, fontSize: 13 }}>${g}</MonoNum>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  frame: { flex: 1, alignItems: "center", justifyContent: "center" },
  top: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  live: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "rgba(4,4,6,0.55)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.14)",
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  goal: { position: "absolute", top: 56, left: 0, right: 0 },
  track: { height: 2, marginTop: 8, borderRadius: 2, overflow: "hidden" },
  chatWrap: { position: "absolute", left: 22, right: 100, bottom: 100, gap: 8 },
  chatLine: { flexDirection: "row", alignItems: "center" },
  giftRail: { position: "absolute", bottom: 16, left: 0, right: 0 },
  gifts: { gap: 8, alignItems: "center" },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 64,
    alignItems: "center",
  },
  burst: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
})
