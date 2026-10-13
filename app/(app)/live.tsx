import { useCallback, useEffect, useState } from "react"
import { View, Pressable, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import {
  VesselScreen,
  Label,
  UiText,
  MonoNum,
  Row,
  LiveRoom,
  PrimaryButton,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { bumpLiveRaised, listLiveSessions, type LiveSession } from "@/lib/live-sessions"
import { fmtUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

const GIFTS = [10, 50, 100, 250, 500]

export default function LiveScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { gift, say, user } = useApp()
  const params = useLocalSearchParams<{ host?: string; title?: string }>()
  const [sessions, setSessions] = useState<LiveSession[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [raised, setRaised] = useState(0)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    const list = await listLiveSessions()
    setSessions(list)
    const match = list.find((s) => s.handle === params.host) || list[0]
    if (match) setRaised(match.raised_cents / 100)
  }, [params.host])

  useEffect(() => {
    load()
  }, [load])

  const active = sessions.find((s) => s.handle === params.host) || sessions[0]
  const host = active?.handle || params.host || ""
  const title = active?.title || params.title || "Live"
  const goal = (active?.goal_cents || 0) / 100
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0
  const peerHandle = host ? `@${host}` : ""

  const onGift = async (amount: number) => {
    if (busy || !host || !peerHandle) return
    setBusy(true)
    try {
      await gift(peerHandle, amount)
      setRaised((r) => r + amount)
      if (active?.host_id) await bumpLiveRaised(active.host_id, amount * 100)
      say(`$${amount} poured`)
    } catch {
      /* toast */
    } finally {
      setBusy(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  if (!sessions.length && !params.host) {
    return (
      <VesselScreen>
        <Row style={{ paddingHorizontal: space.screenPad, paddingTop: 8, alignItems: "center" }}>
          <Pressable onPress={() => router.back()}>
            <UiText style={{ fontSize: 22 }}>‹</UiText>
          </Pressable>
          <Label style={{ flex: 1, textAlign: "center" }}>LIVE</Label>
          <View style={{ width: 22 }} />
        </Row>
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: space.screenPad }}>
          <Label style={{ color: v.dim, textAlign: "center" }}>NO ONE IS LIVE</Label>
          <UiText weight="reg" style={{ color: v.dim, textAlign: "center", marginTop: 12, lineHeight: 20 }}>
            When a vagrant starts Apple camera broadcast, they appear here.
          </UiText>
          {!isLord ? (
            <View style={{ marginTop: 24 }}>
              <PrimaryButton title="GO LIVE" tone="lim" onPress={() => router.push("/(app)/golive")} />
            </View>
          ) : (
            <View style={{ marginTop: 24 }}>
              <PrimaryButton title="POUR GOLD ANYWAY" onPress={() => router.push("/(app)/send")} />
            </View>
          )}
        </View>
      </VesselScreen>
    )
  }

  return (
    <VesselScreen pad={false}>
      <View style={{ flex: 1 }}>
        <View style={[styles.frame, { backgroundColor: v.surf }]}>
          <LiveRoom mode="subscribe" identity={host || "host"} />
        </View>

        <View style={[styles.top, { paddingHorizontal: space.screenPad }]}>
          <Pressable onPress={() => router.back()}>
            <UiText style={{ fontSize: 22 }}>‹</UiText>
          </Pressable>
          <Row style={{ gap: 8, alignItems: "center" }}>
            <View style={[styles.live, { borderRadius: v.radPill }]}>
              <View style={[styles.dot, { backgroundColor: v.limfill }]} />
              <Label style={{ color: "#fff" }}>LIVE</Label>
            </View>
            <Label>@{host}</Label>
          </Row>
          <Pressable onPress={() => router.push("/(app)/send")}>
            <Label style={{ color: v.amb }}>GIVE</Label>
          </Pressable>
        </View>

        <View style={[styles.goal, { paddingHorizontal: space.screenPad }]}>
          <UiText weight="semi" style={{ fontSize: 14, marginBottom: 6 }}>
            {title}
          </UiText>
          <Row style={{ justifyContent: "space-between" }}>
            <MonoNum style={{ color: v.lim, fontSize: 18 }}>
              {fmtUsd(raised, { cents: false })} RAISED
            </MonoNum>
            <Label>GOAL {fmtUsd(goal || 0, { cents: false })}</Label>
          </Row>
          <View style={[styles.track, { backgroundColor: v.line }]}>
            <View style={{ width: `${pct}%`, height: "100%", backgroundColor: v.limfill }} />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.gifts}
          contentContainerStyle={{ gap: 8, paddingHorizontal: space.screenPad }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={v.amb} />}
        >
          {GIFTS.map((g) => (
            <Pressable
              key={g}
              disabled={busy || !host || host === user.handle}
              onPress={() => onGift(g)}
              style={[styles.gift, { borderColor: v.amb, borderRadius: v.radPill }]}
            >
              <MonoNum style={{ color: v.amb, fontSize: 14 }}>${g}</MonoNum>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  frame: { ...StyleSheet.absoluteFill },
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
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  goal: { position: "absolute", left: 0, right: 0, bottom: 100 },
  track: { height: 3, marginTop: 8, borderRadius: 2, overflow: "hidden" },
  gifts: { position: "absolute", left: 0, right: 0, bottom: 28, maxHeight: 52 },
  gift: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
})
