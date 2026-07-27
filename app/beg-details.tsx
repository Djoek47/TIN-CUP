import { useMemo, useState } from "react"
import { View, ScrollView, Pressable, StyleSheet, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { TopAppBar, TitleChip, GoalBar, GiverStack, Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { BEGS } from "@/lib/make-data"
import { useAuth } from "@/providers/AuthProvider"
import { MONEY_FAIL_COPY } from "@/lib/thirdweb"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const GIFTS = [
  { label: "Nickel Toss", emoji: "🪙", amt: 5 },
  { label: "25 coins", emoji: "💰", amt: 25 },
  { label: "100 coins", emoji: "💥", amt: 100 },
]

/** S30 Beg Detail — Make BegDetailScreen */
export default function BegDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { giftUsdt } = useAuth()
  const [reacted, setReacted] = useState(false)

  const beg = useMemo(() => {
    const n = Number(id)
    return BEGS.find((b) => b.id === n) ?? BEGS[0]
  }, [id])

  const handleReact = () => {
    setReacted((r) => !r)
    Alert.alert(reacted ? "Reaction removed." : "🤠 Reacted!")
  }

  const handleShare = () => Alert.alert("Beg link copied to clipboard ↗")

  const handleGift = async (amt: number) => {
    try {
      await giftUsdt("0x0000000000000000000000000000000000000001", amt * 100)
      Alert.alert(`🪙 Tossing ${amt} coins to ${beg.handle}...`)
    } catch (e: any) {
      Alert.alert("Error", e?.message || MONEY_FAIL_COPY)
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title={beg.handle} overline="BEG DETAIL" onBack={() => router.back()} />

        <View style={[styles.hero, glass.card]}>
          <Txt style={{ fontSize: 72 }}>🤠</Txt>
          <View style={styles.handleRow}>
            <Txt
              style={{
                fontFamily: font.headlineBold,
                fontSize: 14,
                color: color.text.primary,
              }}
            >
              {beg.handle}
            </Txt>
            <TitleChip title={beg.title} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <Txt style={styles.pitch}>{beg.beg}</Txt>

          {beg.goal ? (
            <View style={{ marginBottom: 16 }}>
              <GoalBar current={beg.coins} goal={beg.goal} />
              <View style={{ marginTop: 10 }}>
                <GiverStack count={beg.givers} />
              </View>
            </View>
          ) : (
            <View style={{ marginBottom: 16 }}>
              <GiverStack count={beg.givers} />
            </View>
          )}

          <View style={styles.giftRow}>
            {GIFTS.map((g) => (
              <Pressable
                key={g.label}
                onPress={() => handleGift(g.amt)}
                style={[
                  styles.giftBtn,
                  g.amt === 100 ? glass.gold : glass.card,
                  g.amt === 100 && { borderColor: "rgba(245,179,43,0.3)" },
                ]}
              >
                <Txt style={{ fontSize: 18 }}>{g.emoji}</Txt>
                <Txt
                  style={{
                    fontFamily: font.mono,
                    fontSize: 9,
                    color: g.amt === 100 ? color.action.primary : color.text.secondary,
                  }}
                >
                  {g.label}
                </Txt>
              </Pressable>
            ))}
            <Pressable
              onPress={() => router.push("/(app)/wallet")}
              style={[styles.giftBtn, glass.card]}
            >
              <Txt style={{ fontSize: 18 }}>✏️</Txt>
              <Txt
                style={{
                  fontFamily: font.mono,
                  fontSize: 9,
                  color: color.text.secondary,
                }}
              >
                Custom
              </Txt>
            </Pressable>
          </View>

          <View style={styles.actionRow}>
            <Pressable
              onPress={handleReact}
              style={[
                styles.actionBtn,
                reacted ? glass.gold : glass.card,
                reacted && { borderColor: "rgba(245,179,43,0.3)" },
              ]}
            >
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 13,
                  color: reacted ? color.action.primary : color.text.secondary,
                }}
              >
                {reacted ? "🤠 Reacted" : "React 🤠"}
              </Txt>
            </Pressable>
            <Pressable onPress={handleShare} style={[styles.actionBtn, glass.card]}>
              <Ico.Share s={14} c={color.text.secondary} />
              <Txt
                style={{
                  fontFamily: font.headlineBold,
                  fontSize: 13,
                  color: color.text.secondary,
                }}
              >
                Share
              </Txt>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  hero: {
    marginHorizontal: 16,
    marginBottom: 16,
    height: 196,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  handleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  pitch: {
    fontFamily: font.headlineBlack,
    fontSize: 20,
    color: color.text.primary,
    lineHeight: 26,
    marginBottom: 14,
  },
  giftRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  giftBtn: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
})
