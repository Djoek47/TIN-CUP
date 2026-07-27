import { useState } from "react"
import { View, ScrollView, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, CoinAmount, TitleChip } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { LEADERBOARD } from "@/lib/make-data"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const TABS = ["Richest Baron", "Luckiest Drifter", "Fastest Climber", "Most Ridiculous"] as const
const PERIODS = ["Today", "Week", "Season"] as const

/** S24 Leaderboards — Make LeaderboardScreen */
export default function LeaderboardScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<(typeof TABS)[number]>("Richest Baron")
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Week")

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title="Leaderboards" overline="THE GULCH" onBack={() => router.back()} />

        <View style={[styles.season, glass.gold]}>
          <Txt style={styles.seasonTxt}>Season 1: Gold Rush · 23 days remaining</Txt>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tab,
                tab === t && {
                  borderColor: color.action.primary,
                  backgroundColor: "rgba(245,179,43,0.15)",
                },
              ]}
            >
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 11,
                  color: tab === t ? color.action.primary : color.text.secondary,
                }}
              >
                {t}
              </Txt>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[styles.periods, glass.card]}>
          {PERIODS.map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              style={[
                styles.period,
                period === p && {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.1)",
                },
              ]}
            >
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 13,
                  color: period === p ? color.text.primary : color.text.secondary,
                }}
              >
                {p}
              </Txt>
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {LEADERBOARD.map((row) => {
            const medalCol =
              [color.action.primary, color.text.secondary, color.dust][row.rank - 1] ??
              color.text.tertiary
            return (
              <View key={row.rank} style={styles.row}>
                <View
                  style={[
                    styles.medal,
                    {
                      backgroundColor:
                        row.rank <= 3 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                      borderColor: row.rank <= 3 ? medalCol : "rgba(255,255,255,0.08)",
                    },
                  ]}
                >
                  <Txt
                    style={{
                      fontFamily: font.display,
                      fontSize: 13,
                      color: row.rank <= 3 ? medalCol : color.text.tertiary,
                    }}
                  >
                    {row.rank}
                  </Txt>
                </View>
                <View style={{ flex: 1 }}>
                  <Txt
                    style={{
                      fontFamily: font.headlineBold,
                      fontSize: 14,
                      color: color.text.primary,
                    }}
                  >
                    {row.name}
                  </Txt>
                  <TitleChip title={row.title} isLord small />
                </View>
                <CoinAmount value={row.value} size="S" />
              </View>
            )
          })}

          <View style={[styles.youRow, glass.gold]}>
            <View style={styles.youMedal}>
              <Txt style={{ fontFamily: font.display, fontSize: 10, color: color.action.primary }}>
                412
              </Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 14,
                  color: color.action.primary,
                }}
              >
                You — DustyPete
              </Txt>
              <TitleChip title="Folk Hero" small />
            </View>
            <CoinAmount value="1,240" size="S" />
          </View>

          <Txt style={styles.quote}>
            {'"Fresh season. Nobody\'s rich yet. Terrifying."'}
          </Txt>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  season: {
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  seasonTxt: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.action.primary,
  },
  tabs: { paddingHorizontal: 16, paddingBottom: 12, gap: 7 },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  periods: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
  },
  period: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  medal: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  youRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
  },
  youMedal: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 2,
    borderColor: color.action.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  quote: {
    textAlign: "center",
    marginTop: 20,
    fontFamily: font.body,
    fontSize: 11,
    color: color.text.tertiary,
    fontStyle: "italic",
  },
})
