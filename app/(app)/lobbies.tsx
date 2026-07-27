import { useMemo, useState } from "react"
import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, BegCard } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { BEGS } from "@/lib/make-data"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const FILTERS = ["Newest", "Rising", "Ridiculous", "Nearly funded", "Big goals"] as const

/** S17 General Lobby — Make */
export default function LobbyScreen() {
  const router = useRouter()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Rising")

  const filtered = useMemo(() => {
    if (filter === "Nearly funded") return BEGS.filter((b) => b.goal && b.coins / b.goal > 0.6)
    if (filter === "Ridiculous") return [...BEGS].sort((a, b) => b.givers - a.givers)
    if (filter === "Newest") return [...BEGS].reverse()
    if (filter === "Big goals") return BEGS.filter((b) => b.goal && b.goal >= 400)
    return BEGS
  }, [filter])

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <TopAppBar
          overline="PERDITION GULCH"
          title="Main Street Lobby"
          onBell={() => router.push("/(app)/notifications")}
        />

        <View style={[styles.stats, glass.card]}>
          {[
            ["THROWN TODAY", "24,891"],
            ["ACTIVE BEGS", "147"],
            ["BIGGEST DROP", "2,500"],
          ].map(([label, value]) => (
            <View key={label} style={{ alignItems: "center" }}>
              <Txt style={{ fontFamily: font.mono, fontSize: 18, color: color.action.primary }}>{value}</Txt>
              <Txt
                style={{
                  fontFamily: font.headlineBlack,
                  fontSize: 8,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: color.text.tertiary,
                  marginTop: 3,
                }}
              >
                {label}
              </Txt>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              style={[
                styles.chip,
                filter === f && { borderColor: color.action.primary, backgroundColor: "rgba(245,179,43,0.15)" },
              ]}
            >
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 11,
                  color: filter === f ? color.action.primary : color.text.secondary,
                }}
              >
                {f}
              </Txt>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {filtered.map((beg) => (
            <View key={beg.id} style={styles.gridItem}>
              <BegCard beg={beg} onPress={() => router.push(`/beg-details?id=${beg.id}`)} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  stats: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filters: { paddingHorizontal: 16, paddingBottom: 14, gap: 7 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  grid: { paddingHorizontal: 16, flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%", flexGrow: 1 },
})
