import { useMemo, useState } from "react"
import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ImageSlot,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtUsd, fmtCompactUsd } from "@/lib/money"
import { space, pure } from "@/theme/vessel"

const STORIES = [
  { n: "Luna", l: "TORONTO, CA", i: "L", t: "Rent is due.", s: "Help a girl breathe this month.", r: 1235, g: 2000 },
  { n: "Stella", l: "LAGOS, NG", i: "S", t: "Last exam fee.", s: "One paper between me and the degree.", r: 640, g: 900 },
  { n: "Kai", l: "BERLIN, DE", i: "K", t: "Studio rent.", s: "Ten tracks done. Room runs out Friday.", r: 2180, g: 3000 },
]

const MOMENTS = ["@stella", "@kai", "@luna", "@zed"]

export default function HomeScreen() {
  const router = useRouter()
  const { v, isLord, caste } = useVessel()
  const { ledger, moneyBadge } = useApp()
  const [story, setStory] = useState(0)
  const H = STORIES[story]
  const pct = Math.min(100, Math.round((H.r / H.g) * 100))

  const activity = useMemo(() => ledger.slice(0, 6), [ledger])

  return (
    <VesselScreen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Row style={styles.top}>
          <Row style={{ gap: 9, flex: 1 }}>
            <UiText weight="black" style={{ fontSize: 15, letterSpacing: isLord ? 7 : 4.5 }}>
              TIN CUP
            </UiText>
            <View
              style={[
                styles.badge,
                {
                  borderColor: isLord ? v.amb : v.lim,
                  backgroundColor: isLord ? "rgba(255,180,61,0.12)" : "rgba(196,240,0,0.1)",
                  borderRadius: v.radPill,
                },
              ]}
            >
              <Label style={{ color: isLord ? v.amb : v.lim, fontSize: 8 }}>
                {caste.toUpperCase()}
              </Label>
            </View>
          </Row>
          <Row style={{ gap: 16 }}>
            <Pressable onPress={() => router.push("/(app)/arena" as any)}>
              <Label style={{ color: v.dim, fontSize: 16 }}>⌘</Label>
            </Pressable>
            <Pressable onPress={() => router.push("/(app)/activity" as any)}>
              <Label style={{ color: v.dim, fontSize: 16 }}>◉</Label>
            </Pressable>
          </Row>
        </Row>

        <Row style={{ gap: 18, marginTop: 16, marginBottom: 14 }}>
          {STORIES.map((s, i) => (
            <Pressable key={s.n} onPress={() => setStory(i)}>
              <Label style={{ color: i === story ? v.ink : v.faint, borderBottomWidth: i === story ? 1 : 0, borderBottomColor: v.ink, paddingBottom: 8 }}>
                {s.n}
              </Label>
            </Pressable>
          ))}
        </Row>

        <Pressable onPress={() => router.push("/(app)/live")}>
          <View style={[styles.hero, { borderRadius: v.rad }]}>
            <ImageSlot label={`${H.n} · live portrait`} height={360} radius={v.rad} />
            <View style={styles.heroScrim} pointerEvents="none" />
            <View style={styles.heroTop}>
              <View style={[styles.livePill, { borderRadius: v.radPill }]}>
                <View style={[styles.dot, { backgroundColor: v.limfill }]} />
                <Label style={{ color: "#fff", fontSize: 9 }}>LIVE</Label>
              </View>
              <View style={[styles.livePill, { borderRadius: v.radPill, opacity: 0.9 }]}>
                <Label style={{ color: "rgba(255,255,255,0.8)", fontSize: 9 }}>2.4K WATCHING</Label>
              </View>
            </View>
            <View style={styles.heroBottom}>
              <Row style={{ gap: 8, marginBottom: 10 }}>
                <View style={styles.avatar}>
                  <Label style={{ color: v.faint }}>{H.i}</Label>
                </View>
                <UiText weight="semi" style={{ color: "#fff", fontSize: 13 }}>
                  {H.n}
                </UiText>
                <Label style={{ color: "rgba(255,255,255,0.5)" }}>{H.l}</Label>
              </Row>
              <UiText weight="bold" style={{ color: "#fff", fontSize: 24, lineHeight: 28 }}>
                {H.t}
              </UiText>
              <UiText weight="reg" style={{ color: "rgba(255,255,255,0.62)", fontSize: 15, marginTop: 4 }}>
                {H.s}
              </UiText>
              <Row style={{ justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
                <View>
                  <Label style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5 }}>RECEIVED</Label>
                  <MonoNum style={{ color: v.limfill, fontSize: 29, marginTop: 2 }}>
                    {fmtUsd(H.r, { cents: false })}
                  </MonoNum>
                </View>
                <Label style={{ color: "rgba(255,255,255,0.45)", paddingBottom: 5 }}>
                  GOAL {fmtUsd(H.g, { cents: false })}
                </Label>
              </Row>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${pct}%`, backgroundColor: v.limfill, shadowColor: v.limfill }]} />
              </View>
            </View>
          </View>
        </Pressable>

        <Row style={{ marginTop: space.sectionGap, justifyContent: "space-between" }}>
          <Label>Live Moments</Label>
          <Pressable onPress={() => router.push("/(app)/activity" as any)}>
            <Label style={{ color: v.amb }}>SEE ALL</Label>
          </Pressable>
        </Row>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingTop: 14 }}>
          {MOMENTS.map((h) => (
            <Pressable key={h} onPress={() => router.push("/(app)/live")} style={{ width: 112 }}>
              <View style={{ position: "relative" }}>
                <ImageSlot label="Clip" height={148} radius={14} />
                <View style={[styles.dot, { position: "absolute", top: 8, left: 8, backgroundColor: v.limfill }]} />
              </View>
              <Label style={{ marginTop: 7 }}>{h}</Label>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ marginTop: space.sectionGap }}>
          <Label style={{ marginBottom: 4 }}>Activity</Label>
          {activity.map((e) => (
            <View key={e.id}>
              <Hairline />
              <Row style={styles.actRow}>
                <Label style={{ color: e.dir === "in" ? v.lim : v.amb, width: 16 }}>
                  {e.dir === "in" ? "↓" : "↑"}
                </Label>
                <View style={{ flex: 1 }}>
                  <UiText weight="semi" style={{ fontSize: 13.5 }}>
                    {e.who}
                  </UiText>
                  <Label style={{ marginTop: 2 }}>{e.kind}</Label>
                </View>
                <MonoNum style={{ color: e.dir === "in" ? v.lim : v.amb, fontSize: 14 }}>
                  {e.dir === "in" ? "+" : "−"}
                  {fmtCompactUsd(e.amount)}
                </MonoNum>
              </Row>
            </View>
          ))}
        </View>

        <View style={[styles.moneyStrip, { borderColor: v.line, backgroundColor: v.surf, borderRadius: v.radPill }]}>
          <Label style={{ color: pure.amber, letterSpacing: 1.5 }}>{moneyBadge}</Label>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  top: { alignItems: "center", justifyContent: "space-between", paddingTop: 8 },
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderWidth: StyleSheet.hairlineWidth },
  hero: { overflow: "hidden", position: "relative" },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    borderBottomWidth: 180,
    borderBottomColor: "rgba(4,4,6,0.92)",
  },
  heroTop: { position: "absolute", top: 14, left: 14, flexDirection: "row", gap: 7 },
  livePill: {
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
  heroBottom: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 16 },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  track: { height: 2, backgroundColor: "rgba(255,255,255,0.16)", marginTop: 9, borderRadius: 2 },
  fill: { height: "100%", borderRadius: 2, shadowOpacity: 0.9, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } },
  actRow: { paddingVertical: space.rowPad, alignItems: "center", gap: 10 },
  moneyStrip: {
    marginTop: 22,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
})
