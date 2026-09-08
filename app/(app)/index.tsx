import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, BegCard, ChallengeCard, StreamCard, CoinAmount } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { BEGS, CHALLENGES, STREAMS, LEADERBOARD } from "@/lib/make-data"
import { useAuth } from "@/providers/AuthProvider"
import { glass } from "@/theme/glass"
import { color, font, space } from "@/theme/tokens"

/** S13 Main Street — Make modules */
export default function MainStreet() {
  const router = useRouter()
  const { profile } = useAuth()
  const balance = profile?.coins ?? 1240

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <TopAppBar
          overline="PERDITION GULCH"
          title="Main Street"
          balance={balance}
          onWallet={() => router.push("/(app)/wallet")}
          onBell={() => router.push("/(app)/notifications")}
        />

        <View style={styles.section}>
          <Txt style={styles.sectionLabel}>LIVE NOW</Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {STREAMS.map((s) => (
              <StreamCard key={s.id} stream={s} onPress={() => router.push("/(app)/live-stream")} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Txt style={styles.sectionLabel}>TRENDING BEGS</Txt>
          <View style={styles.grid}>
            {BEGS.slice(0, 4).map((beg) => (
              <View key={beg.id} style={styles.gridItem}>
                <BegCard beg={beg} onPress={() => router.push(`/beg-details?id=${beg.id}`)} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Txt style={styles.sectionLabel}>ACTIVE BOUNTIES</Txt>
          <ChallengeCard
            challenge={CHALLENGES[0]}
            onPress={() => router.push(`/challenge-details?id=${CHALLENGES[0].id}`)}
          />
        </View>

        <View style={[styles.teaser, glass.card]}>
          <View style={styles.teaserHead}>
            <Txt style={{ fontFamily: font.headlineBold, fontSize: 14, color: color.text.primary }}>
              Richest Barons
            </Txt>
            <Pressable onPress={() => router.push("/(app)/leaderboard")}>
              <Txt style={{ fontFamily: font.headlineBold, fontSize: 12, color: color.action.primary }}>
                Full board →
              </Txt>
            </Pressable>
          </View>
          {LEADERBOARD.slice(0, 3).map((row) => (
            <View key={row.rank} style={styles.lbRow}>
              <View style={[styles.medal, row.rank === 1 ? glass.gold : { backgroundColor: "rgba(255,255,255,0.06)" }]}>
                <Txt
                  style={{
                    fontFamily: font.display,
                    fontSize: 10,
                    color: [color.action.primary, color.text.secondary, color.dust][row.rank - 1],
                  }}
                >
                  {row.rank}
                </Txt>
              </View>
              <Txt style={{ fontFamily: font.headlineBold, fontSize: 13, color: color.text.primary, flex: 1 }}>
                {row.name}
              </Txt>
              <CoinAmount value={row.value} size="S" />
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push("/(app)/notifications")}
          style={[styles.lucky, glass.gold]}
        >
          <Txt style={{ fontSize: 22 }}>⏰</Txt>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontFamily: font.headlineBold, fontSize: 13, color: color.action.primary }}>
              Lucky Hour in 23 minutes
            </Txt>
            <Txt style={{ fontFamily: font.body, fontSize: 11, color: color.text.secondary }}>
              2× visibility for all active begs · 9–10 PM
            </Txt>
          </View>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  section: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  sectionLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 11,
    color: color.text.secondary,
    marginBottom: 10,
    letterSpacing: 1,
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%", flexGrow: 1 },
  teaser: { margin: 16, borderRadius: 16, padding: 16 },
  teaserHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lbRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  medal: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  lucky: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
})
