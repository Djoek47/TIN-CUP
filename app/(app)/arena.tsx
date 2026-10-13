import { useCallback, useState } from "react"
import { View, Pressable, StyleSheet, ScrollView, Alert, RefreshControl } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  Label,
  UiText,
  MonoNum,
  Row,
  Hairline,
} from "@/components/vessel"
import { useVessel } from "@/providers/VesselTheme"
import { useApp } from "@/providers/AppState"
import { CHALLENGES } from "@/lib/challenges"
import { listLiveSessions, type LiveSession } from "@/lib/live-sessions"
import { fmtUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

const TABS = ["Challenges", "Roulette", "Events"] as const

export default function ArenaScreen() {
  const router = useRouter()
  const { v, isLord } = useVessel()
  const { enterChallenge, fundBounty, say } = useApp()
  const [tab, setTab] = useState(0)
  const [busy, setBusy] = useState(false)
  const [live, setLive] = useState<LiveSession[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const A = CHALLENGES[tab] ?? CHALLENGES[0]
  const cta = isLord ? "FUND THIS BOUNTY" : "ENTER CHALLENGE"

  const loadLive = useCallback(async () => {
    setLive(await listLiveSessions())
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadLive()
    }, [loadLive]),
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await loadLive()
    setRefreshing(false)
  }

  const onCta = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (isLord) {
        await fundBounty(A.title, A.fundUsd)
        Alert.alert("Bounty funded", `${A.title} · $${A.fundUsd} held in mock escrow.`)
        router.push("/(app)/wallet")
      } else {
        await enterChallenge(A.title, A.entryUsd)
        Alert.alert("You're in", `Stake $${A.entryUsd} held. Record & post to claim.`)
        router.push({ pathname: "/challenge-details", params: { id: A.id } })
      }
    } catch (e: any) {
      say(e?.message || "Action failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen>
      <ScreenHeader title="Arena" onBack={() => router.back()} />
      <Row style={{ gap: 6, marginTop: 8 }}>
        {TABS.map((name, i) => (
          <Pressable
            key={name}
            onPress={() => setTab(i)}
            style={[
              styles.tab,
              {
                borderRadius: v.radPill,
                backgroundColor: i === tab ? v.ambfill : "transparent",
                borderColor: i === tab ? "transparent" : v.line,
              },
            ]}
          >
            <Label style={{ color: i === tab ? "#0a0a0a" : v.dim }}>{name}</Label>
          </Pressable>
        ))}
      </Row>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={v.amb} />}
      >
        <Pressable
          onPress={() =>
            router.push({ pathname: "/challenge-details", params: { id: A.id } })
          }
        >
          <Label style={{ marginTop: space.sectionGap }}>{A.kicker}</Label>
          <UiText weight="black" style={{ fontSize: 28, marginTop: 10 }}>
            {A.title}
          </UiText>
          <UiText weight="reg" style={{ color: v.dim, fontSize: 14, marginTop: 8, lineHeight: 20 }}>
            {A.summary}
          </UiText>
        </Pressable>

        <Row style={{ marginTop: 22, justifyContent: "space-between" }}>
          <View>
            <Label>REWARD</Label>
            <MonoNum style={{ color: v.amb, fontSize: 22, marginTop: 4 }}>{A.rewardLabel}</MonoNum>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Label>ENDS IN</Label>
            <MonoNum style={{ fontSize: 22, marginTop: 4 }}>{A.endsIn}</MonoNum>
          </View>
        </Row>

        <View style={{ marginTop: 24 }}>
          <PrimaryButton title={cta} onPress={onCta} disabled={busy} />
        </View>
        <Label style={{ marginTop: 10, textAlign: "center", color: v.faint }}>
          {isLord
            ? `Funds $${A.fundUsd} from available → bounty escrow`
            : `Entry stake $${A.entryUsd} held · then record via compose / go live`}
        </Label>

        <Label style={{ marginTop: space.sectionGap }}>Live Now</Label>
        {live.length ? (
          live.map((s) => (
            <Pressable
              key={s.id}
              onPress={() =>
                router.push({
                  pathname: "/(app)/live",
                  params: { host: s.handle, title: s.title },
                } as any)
              }
            >
              <Hairline />
              <Row style={styles.row}>
                <View style={{ flex: 1 }}>
                  <UiText weight="semi" style={{ fontSize: 14 }}>
                    @{s.handle}
                  </UiText>
                  <Label style={{ marginTop: 4 }}>{s.title}</Label>
                </View>
                <MonoNum style={{ color: v.lim, fontSize: 16 }}>
                  {fmtUsd(s.goal_cents / 100, { cents: false })}
                </MonoNum>
              </Row>
            </Pressable>
          ))
        ) : (
          <UiText weight="reg" style={{ color: v.dim, marginTop: 12, lineHeight: 18 }}>
            Nobody is on Apple camera. Go live from Home to appear here.
          </UiText>
        )}
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: { paddingVertical: space.rowPad, alignItems: "center" },
})
