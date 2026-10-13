import { useCallback, useState } from "react"
import { ScrollView, View, Pressable, StyleSheet, RefreshControl } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fetchTopGivers } from "@/lib/feed"
import { fmtCompactUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

export default function LeaderboardScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { user, ledger } = useApp()
  const [rows, setRows] = useState<{ handle: string; cents: number }[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const remote = await fetchTopGivers()
    if (remote.length) {
      setRows(remote)
      return
    }
    // Local ledger fallback — real gifts/bounties from this device only
    const tallies: Record<string, number> = {}
    for (const e of ledger) {
      if (e.kind !== "gift" && e.kind !== "bounty") continue
      if (e.dir !== "out") continue
      const key = user.handle || "you"
      tallies[key] = (tallies[key] || 0) + Math.round(e.amount * 100)
    }
    setRows(
      Object.entries(tallies)
        .map(([handle, cents]) => ({ handle, cents }))
        .sort((a, b) => b.cents - a.cents),
    )
  }, [ledger, user.handle])

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

  const youCents = rows.find((r) => r.handle === user.handle)?.cents ?? 0
  const youRank = rows.findIndex((r) => r.handle === user.handle) + 1
  const podium = rows.slice(0, 3)
  const rest = rows.slice(3, 12)

  return (
    <VesselScreen>
      <ScreenHeader title="Top Givers" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={v.amb} />}
      >
        <Label style={{ marginTop: 8, color: v.dim }}>
          Ranked from real gift / bounty ledger rows
        </Label>

        {!rows.length ? (
          <UiText weight="reg" style={{ color: v.dim, marginTop: 28, lineHeight: 20 }}>
            No gifts yet. Pour gold to appear here.
          </UiText>
        ) : (
          <>
            <Row style={styles.podium}>
              {[podium[1], podium[0], podium[2]].map((p, i) =>
                p ? (
                  <PodiumPlace
                    key={p.handle}
                    place={i === 1 ? 1 : i === 0 ? 2 : 3}
                    name={`@${p.handle}`}
                    amt={fmtCompactUsd(p.cents / 100)}
                    h={i === 1 ? 150 : i === 0 ? 96 : 70}
                    highlight={i === 1}
                  />
                ) : (
                  <View key={`empty-${i}`} style={{ flex: 1 }} />
                ),
              )}
            </Row>

            {rest.map((row, i) => (
              <Pressable key={row.handle} onPress={() => router.push("/(app)/send")}>
                <Hairline />
                <Row style={styles.row}>
                  <MonoNum style={{ width: 28, color: v.dim }}>
                    {String(i + 4).padStart(2, "0")}
                  </MonoNum>
                  <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
                    @{row.handle}
                  </UiText>
                  <MonoNum style={{ color: v.amb }}>{fmtCompactUsd(row.cents / 100)}</MonoNum>
                </Row>
              </Pressable>
            ))}
          </>
        )}

        <View style={[styles.you, { borderColor: v.amb, backgroundColor: v.surf, borderRadius: v.rad }]}>
          <Row style={{ alignItems: "center" }}>
            <Label style={{ color: v.amb }}>YOUR RANK</Label>
            <View style={{ flex: 1 }} />
            <MonoNum style={{ color: v.amb, marginRight: 12 }}>
              {youRank > 0 ? `#${youRank}` : "—"}
            </MonoNum>
            <MonoNum>{fmtCompactUsd(youCents / 100)}</MonoNum>
          </Row>
        </View>
      </ScrollView>
    </VesselScreen>
  )
}

function PodiumPlace({
  place,
  name,
  amt,
  h,
  highlight,
}: {
  place: number
  name: string
  amt: string
  h: number
  highlight?: boolean
}) {
  const { v } = useVessel()
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 8 }}>
      <Label style={{ color: highlight ? v.amb : v.dim }}>{name}</Label>
      <MonoNum style={{ color: highlight ? v.amb : v.dim, fontSize: highlight ? 13 : 11 }}>{amt}</MonoNum>
      <View
        style={{
          width: "100%",
          height: h,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderWidth: StyleSheet.hairlineWidth,
          borderBottomWidth: 0,
          borderColor: highlight ? "rgba(255,180,61,0.5)" : v.gls,
          backgroundColor: highlight ? "rgba(255,180,61,0.28)" : "rgba(255,180,61,0.1)",
          alignItems: "center",
          paddingTop: 12,
        }}
      >
        <MonoNum style={{ fontSize: highlight ? 23 : 19 }}>{place}</MonoNum>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  podium: { alignItems: "flex-end", gap: 12, marginTop: 28, height: 220 },
  row: { paddingVertical: space.rowPad, alignItems: "center" },
  you: {
    marginTop: 18,
    marginBottom: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
})
