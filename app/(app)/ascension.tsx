import { useState } from "react"
import { View, ScrollView, Pressable, StyleSheet, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { GoldButton, Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const BENEFITS: [string, string][] = [
  ["💰", "Rain gold on any Vagrant in Perdition Gulch"],
  ["⚔️", "Post bounties and set absurd challenges"],
  ["🏰", "Run your own private Court with worshippers"],
  ["👑", "Unlock finery — no more rags, ever"],
  ["🏆", "Climb the Lord titles ladder to the Monarch's Court"],
  ["🎭", "Enter Lord-vs-Lord generosity battles in live streams"],
]

/** S27 Ascension — Make AscensionScreen */
export default function AscensionScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [scrollPct, setScrollPct] = useState(0)

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
    const max = contentSize.height - layoutMeasurement.height
    setScrollPct(max > 0 ? Math.min(1, contentOffset.y / max) : 0)
  }

  return (
    <View style={styles.root}>
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <LinearGradient
            colors={[color.bg.surface, color.bg.canvas]}
            style={[StyleSheet.absoluteFill, { opacity: 1 - scrollPct, alignItems: "center", justifyContent: "center" }]}
          >
            <Txt style={{ fontSize: 84, opacity: 0.6 }}>🤠</Txt>
          </LinearGradient>
          <LinearGradient
            colors={["rgba(36,43,54,0.9)", "rgba(18,22,31,0.9)"]}
            style={[StyleSheet.absoluteFill, { opacity: scrollPct, alignItems: "center", justifyContent: "center" }]}
          >
            <Txt style={{ fontSize: 84 }}>🎩</Txt>
          </LinearGradient>
          <View style={[styles.backWrap, { paddingTop: insets.top + 12 }]}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ico.Back c={color.text.primary} s={18} />
            </Pressable>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Txt style={styles.overline}>ASCENSION</Txt>
          <Txt style={styles.headline}>
            Rise to <Txt style={styles.lordship}>Lordship</Txt>
          </Txt>

          <View style={{ marginBottom: 24 }}>
            {BENEFITS.map(([icon, text]) => (
              <View key={text} style={styles.benefit}>
                <Txt style={{ fontSize: 20, width: 28 }}>{icon}</Txt>
                <Txt style={{ fontFamily: font.body, fontSize: 14, color: color.text.primary, flex: 1 }}>
                  {text}
                </Txt>
              </View>
            ))}
          </View>

          <View style={[styles.stake, glass.gold]}>
            <Txt style={styles.stakeLabel}>THE STAKE</Txt>
            <Txt style={styles.stakeAmt}>$100</Txt>
            <Txt style={styles.stakeSub}>{"One-time deposit · 1% Monarch's cut on arrival"}</Txt>
          </View>

          <GoldButton
            title="Begin the Ascension"
            onPress={() => router.push("/(app)/ponr")}
          />
          <Txt style={styles.foot}>One-time. Permanent. No going back.</Txt>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  hero: { height: 280, overflow: "hidden" },
  backWrap: { position: "absolute", top: 0, left: 0, right: 0, paddingHorizontal: 16 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  overline: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: color.action.primary,
    marginBottom: 8,
  },
  headline: {
    fontFamily: font.display,
    fontSize: 32,
    color: color.text.primary,
    lineHeight: 36,
    marginBottom: 20,
    letterSpacing: 0.4,
  },
  lordship: {
    fontFamily: font.display,
    fontSize: 32,
    color: color.action.primary,
  },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  stake: {
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    alignItems: "center",
  },
  stakeLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: color.text.tertiary,
    marginBottom: 10,
  },
  stakeAmt: {
    fontFamily: font.display,
    fontSize: 44,
    color: color.action.primary,
  },
  stakeSub: {
    fontFamily: font.body,
    fontSize: 13,
    color: color.text.secondary,
    marginTop: 4,
  },
  foot: {
    textAlign: "center",
    marginTop: 10,
    fontFamily: font.body,
    fontSize: 12,
    color: color.text.tertiary,
  },
})
