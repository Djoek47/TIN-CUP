import { useCallback, useState } from "react"
import { ScrollView, View, Pressable, StyleSheet, RefreshControl } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import {
  VesselScreen,
  ImageSlot,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
  PrimaryButton,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fetchHomeBundle, type FeedBeg } from "@/lib/feed"
import type { LiveSession } from "@/lib/live-sessions"
import { fmtUsd, fmtCompactUsd } from "@/lib/money"
import { font, space, pure } from "@/theme/vessel"

export default function HomeScreen() {
  const router = useRouter()
  const { v, isLord, caste } = useVessel()
  const { ledger, moneyBadge, user } = useApp()
  const [live, setLive] = useState<LiveSession[]>([])
  const [begs, setBegs] = useState<FeedBeg[]>([])
  const [story, setStory] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const bundle = await fetchHomeBundle()
    setLive(bundle.live)
    setBegs(bundle.begs)
    setStory(0)
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const H = begs[story]
  const pct = H
    ? Math.min(100, Math.round((H.raised_cents / Math.max(1, H.goal_cents)) * 100))
    : 0
  const activity = ledger.slice(0, 6)

  return (
    <VesselScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={v.amb} />}
      >
        <Row style={styles.top}>
          <Row style={{ gap: 9, flex: 1 }}>
            <UiText
              weight="black"
              style={{ fontSize: 16, letterSpacing: isLord ? 6 : 3.5, fontFamily: font.display }}
            >
              0bol
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
            <Pressable onPress={() => router.push("/(app)/compose" as any)}>
              <Label style={{ color: v.dim, fontSize: 16 }}>+</Label>
            </Pressable>
            <Pressable onPress={() => router.push("/(app)/arena" as any)}>
              <Label style={{ color: v.dim, fontSize: 16 }}>⌘</Label>
            </Pressable>
            <Pressable onPress={() => router.push("/(app)/notifications" as any)}>
              <Label style={{ color: v.dim, fontSize: 16 }}>◉</Label>
            </Pressable>
          </Row>
        </Row>

        {live.length ? (
          <>
            <Label style={{ marginTop: 18 }}>LIVE NOW</Label>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingTop: 12 }}
            >
              {live.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() =>
                    router.push({
                      pathname: "/(app)/live",
                      params: { host: s.handle, title: s.title },
                    } as any)
                  }
                  style={{ width: 120 }}
                >
                  <View style={{ position: "relative" }}>
                    <ImageSlot label={`@${s.handle}`} height={148} radius={14} />
                    <View
                      style={[styles.dot, { position: "absolute", top: 8, left: 8, backgroundColor: v.limfill }]}
                    />
                  </View>
                  <Label style={{ marginTop: 7 }}>@{s.handle}</Label>
                </Pressable>
              ))}
            </ScrollView>
          </>
        ) : (
          <View style={{ marginTop: 22 }}>
            <Label>LIVE NOW</Label>
            <UiText weight="reg" style={{ color: v.dim, marginTop: 8, fontSize: 13, lineHeight: 18 }}>
              Nobody is on camera. {isLord ? "Pour gold when a vagrant goes live." : "Hold the orb to go live with Apple camera."}
            </UiText>
            {!isLord ? (
              <View style={{ marginTop: 14 }}>
                <PrimaryButton title="GO LIVE" tone="lim" onPress={() => router.push("/(app)/golive")} />
              </View>
            ) : null}
          </View>
        )}

        <Label style={{ marginTop: space.sectionGap }}>OPEN BEGS</Label>
        {begs.length ? (
          <>
            <Row style={{ gap: 18, marginTop: 12, marginBottom: 14, flexWrap: "wrap" }}>
              {begs.slice(0, 6).map((s, i) => (
                <Pressable key={s.id} onPress={() => setStory(i)}>
                  <Label
                    style={{
                      color: i === story ? v.ink : v.faint,
                      borderBottomWidth: i === story ? 1 : 0,
                      borderBottomColor: v.ink,
                      paddingBottom: 8,
                    }}
                  >
                    {s.handle || s.title.slice(0, 12)}
                  </Label>
                </Pressable>
              ))}
            </Row>
            {H ? (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/beg-details",
                    params: {
                      name: H.handle || "user",
                      title: H.title,
                      story: H.story,
                      raised: String(H.raised_cents / 100),
                      goal: String(H.goal_cents / 100),
                    },
                  } as any)
                }
              >
                <View style={[styles.hero, { borderRadius: v.rad }]}>
                  <ImageSlot label={`${H.handle || "beg"} · portrait`} height={320} radius={v.rad} />
                  <View style={styles.heroScrim} pointerEvents="none" />
                  <View style={styles.heroBottom}>
                    <UiText weight="bold" style={{ color: "#fff", fontSize: 22, lineHeight: 26 }}>
                      {H.title}
                    </UiText>
                    <UiText
                      weight="reg"
                      style={{ color: "rgba(255,255,255,0.62)", fontSize: 14, marginTop: 4 }}
                    >
                      {H.story || `@${H.handle || "user"}`}
                    </UiText>
                    <Row style={{ justifyContent: "space-between", alignItems: "flex-end", marginTop: 16 }}>
                      <View>
                        <Label style={{ color: "rgba(255,255,255,0.45)", fontSize: 8.5 }}>RAISED</Label>
                        <MonoNum style={{ color: v.limfill, fontSize: 26, marginTop: 2 }}>
                          {fmtUsd(H.raised_cents / 100, { cents: false })}
                        </MonoNum>
                      </View>
                      <Label style={{ color: "rgba(255,255,255,0.45)", paddingBottom: 5 }}>
                        GOAL {fmtUsd(H.goal_cents / 100, { cents: false })}
                      </Label>
                    </Row>
                    <View style={styles.track}>
                      <View
                        style={[styles.fill, { width: `${pct}%`, backgroundColor: v.limfill, shadowColor: v.limfill }]}
                      />
                    </View>
                  </View>
                </View>
              </Pressable>
            ) : null}
          </>
        ) : (
          <View style={{ marginTop: 12 }}>
            <UiText weight="reg" style={{ color: v.dim, fontSize: 13, lineHeight: 18 }}>
              No open begs yet. {user.address ? "Post one from +" : "Connect to post."}
            </UiText>
            <View style={{ marginTop: 14 }}>
              <PrimaryButton title="COMPOSE BEG" onPress={() => router.push("/(app)/compose" as any)} />
            </View>
          </View>
        )}

        <View style={{ marginTop: space.sectionGap }}>
          <Row style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <Label>Your activity</Label>
            <Pressable onPress={() => router.push("/(app)/activity" as any)}>
              <Label style={{ color: v.amb }}>SEE ALL</Label>
            </Pressable>
          </Row>
          {activity.length ? (
            activity.map((e) => (
              <Pressable key={e.id} onPress={() => router.push("/(app)/wallet")}>
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
              </Pressable>
            ))
          ) : (
            <Label style={{ marginTop: 12, color: v.dim }}>No ledger yet</Label>
          )}
        </View>

        <View
          style={[styles.moneyStrip, { borderColor: v.line, backgroundColor: v.surf, borderRadius: v.radPill }]}
        >
          <Label style={{ color: pure.amber, letterSpacing: 1.5 }}>{moneyBadge}</Label>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  top: { alignItems: "center", justifyContent: "space-between", paddingTop: 8 },
  badge: { paddingHorizontal: 9, paddingVertical: 3, borderWidth: StyleSheet.hairlineWidth },
  hero: { overflow: "hidden", position: "relative", marginTop: 4 },
  heroScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "transparent",
    borderBottomWidth: 180,
    borderBottomColor: "rgba(4,4,6,0.92)",
  },
  heroBottom: { position: "absolute", left: 14, right: 14, bottom: 16 },
  track: { height: 3, backgroundColor: "rgba(255,255,255,0.15)", marginTop: 10, borderRadius: 2, overflow: "hidden" },
  fill: { height: "100%", shadowOpacity: 0.6, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
  actRow: { paddingVertical: space.rowPad, alignItems: "center", gap: 10 },
  moneyStrip: {
    marginTop: 22,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
})
