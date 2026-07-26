import { useEffect, useState } from "react"
import { View, ScrollView, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space, font } from "@/theme/tokens"
import { glass } from "@/theme/glass"
import { Beg, Profile } from "@/lib/types"
import { formatCents } from "@/lib/format"

/** Main Street — Figma Make Tin-Cup-V2 layout */
export default function MainStreetScreen() {
  const router = useRouter()
  const { profile } = useAuth()
  const [begs, setBegs] = useState<(Beg & { author: Profile })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBegs = async () => {
      const { data, error } = await supabase
        .from("begs")
        .select("*, author:author_id(display_name, title, face, hat)")
        .order("created_at", { ascending: false })
        .limit(20)

      if (!error && data) {
        setBegs(data as any)
      }
      setLoading(false)
    }

    loadBegs()
  }, [])

  const progressPercent = (beg: Beg) => {
    if (beg.goal_cents === 0) return 100
    return Math.min(100, Math.round((beg.raised_cents / beg.goal_cents) * 100))
  }

  const openBegs = begs.filter((b) => b.status === "open")

  return (
    <Screen scroll padded edges={["top"]} contentStyle={{ paddingBottom: 120 }}>
      {/* TopBar — PERDITION GULCH / Main Street + gold balance + bell */}
      <View style={styles.topBar}>
        <View>
          <Txt variant="overline" color={color.text.tertiary}>
            PERDITION GULCH
          </Txt>
          <Txt variant="headlineL" style={{ fontFamily: font.headlineBlack, marginTop: 2 }}>
            Main Street
          </Txt>
        </View>
        <View style={styles.topActions}>
          <Pressable
            style={[styles.balancePill, glass.gold]}
            onPress={() => router.push("/(app)/wallet")}
          >
            <Txt variant="numericS" color={color.action.primary}>
              🪙 {formatCents(profile?.balance_cents ?? 0).replace("$", "")}
            </Txt>
          </Pressable>
          <Pressable
            style={[styles.bell, glass.card]}
            onPress={() => router.push("/(app)/notifications")}
          >
            <MaterialCommunityIcons name="bell-outline" size={18} color={color.text.secondary} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>
      </View>

      {/* LIVE NOW */}
      <Txt variant="overline" color={color.text.secondary} style={styles.section}>
        LIVE NOW
      </Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: space[5] }}>
        {(openBegs.length ? openBegs : begs).slice(0, 5).map((beg) => (
          <Pressable key={beg.id} onPress={() => router.push(`/gift/${beg.id}`)}>
            <Card style={styles.streamCard} padded={false}>
              <View style={styles.streamThumb}>
                <Txt style={{ fontSize: 30 }}>🎪</Txt>
                <View style={styles.liveChip}>
                  <View style={styles.liveDot} />
                  <Txt variant="overline" color={color.text.primary} style={{ fontSize: 9 }}>
                    LIVE
                  </Txt>
                </View>
              </View>
              <View style={{ padding: space[2] }}>
                <Txt variant="headlineS" numberOfLines={1}>
                  {(beg as any).author?.display_name ?? beg.title}
                </Txt>
              </View>
            </Card>
          </Pressable>
        ))}
        {!loading && begs.length === 0 && (
          <Card style={{ width: 200, marginRight: space[3] }}>
            <Txt variant="bodyS" color={color.text.secondary}>
              No live begs yet. Post one from the gold cup.
            </Txt>
          </Card>
        )}
      </ScrollView>

      {/* TRENDING BEGS */}
      <Txt variant="overline" color={color.text.secondary} style={styles.section}>
        TRENDING BEGS
      </Txt>
      <View style={styles.grid}>
        {begs.slice(0, 4).map((beg) => (
          <Pressable
            key={beg.id}
            style={styles.gridItem}
            onPress={() => router.push(`/beg-details?id=${beg.id}`)}
          >
            <Card style={{ flex: 1 }} padded>
              <Txt variant="overline" color={color.dust} style={{ marginBottom: space[2] }}>
                BEG
              </Txt>
              <View style={{ flexDirection: "row", gap: space[2], marginBottom: space[2] }}>
                <View style={[styles.avatar, glass.elevated]}>
                  <Txt style={{ fontSize: 20 }}>{(beg as any).author?.face ?? "🤠"}</Txt>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt variant="headlineS" numberOfLines={2}>
                    {beg.title}
                  </Txt>
                  <Txt variant="caption" color={color.text.secondary} numberOfLines={1}>
                    {(beg as any).author?.display_name ?? "Outlaw"}
                  </Txt>
                </View>
              </View>
              <View style={styles.goalTrack}>
                <View style={[styles.goalFill, { width: `${progressPercent(beg)}%` }]} />
              </View>
              <Txt variant="numericS" color={color.action.primary} style={{ marginTop: space[2] }}>
                🪙 {formatCents(beg.raised_cents).replace("$", "")}
              </Txt>
            </Card>
          </Pressable>
        ))}
      </View>

      {/* Leaderboard teaser */}
      <Card style={{ marginTop: space[5] }} onPress={() => router.push("/(app)/leaderboard")}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Txt variant="headlineM">Richest Barons</Txt>
          <Txt variant="buttonM" color={color.action.primary}>
            Full board →
          </Txt>
        </View>
      </Card>
    </Screen>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: space[5],
  },
  topActions: { flexDirection: "row", alignItems: "center", gap: space[2] },
  balancePill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
  },
  bell: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: color.status.live,
  },
  section: { marginBottom: space[3], letterSpacing: 1.2 },
  streamCard: { width: 136, marginRight: space[3], overflow: "hidden" },
  streamThumb: {
    height: 88,
    backgroundColor: color.bg.sheet,
    alignItems: "center",
    justifyContent: "center",
  },
  liveChip: {
    position: "absolute",
    top: 6,
    left: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: color.action.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space[3] },
  gridItem: { width: "48%", flexGrow: 1 },
  avatar: {
    width: 38,
    height: 46,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  goalTrack: {
    height: 5,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  goalFill: {
    height: "100%",
    backgroundColor: color.action.primary,
    borderRadius: 4,
  },
})
