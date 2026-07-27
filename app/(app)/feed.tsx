import { useState } from "react"
import { View, Pressable, StyleSheet, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Txt } from "@/components/ui/Txt"
import { TitleChip, Ico } from "@/components/gds"
import { FEED_CLIPS } from "@/lib/make-data"
import { useAuth } from "@/providers/AuthProvider"
import { MONEY_FAIL_COPY } from "@/lib/thirdweb"
import { color, font } from "@/theme/tokens"

/** S14 Feed of Madness — Make vertical clip pager */
export default function FeedOfMadness() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { giftUsdt, profile } = useAuth()
  const [clip, setClip] = useState(0)
  const [followed, setFollowed] = useState(false)
  const [tossed, setTossed] = useState(false)
  const c = FEED_CLIPS[clip]

  const handleToss = async () => {
    setTossed(true)
    try {
      await giftUsdt("0x0000000000000000000000000000000000000001", 500)
      Alert.alert("🪙 +5 coins tossed!", `${c.handle} thanks you, probably.`)
    } catch (e: any) {
      Alert.alert("Error", e?.message || MONEY_FAIL_COPY)
    } finally {
      setTimeout(() => setTossed(false), 600)
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={[...c.bg]} style={StyleSheet.absoluteFill} />
      <View style={styles.center}>
        <Txt style={{ fontSize: 88 }}>🤠</Txt>
      </View>

      <LinearGradient
        colors={["rgba(0,0,0,0.65)", "transparent"]}
        style={[styles.topGrad, { paddingTop: insets.top + 12 }]}
      >
        <Txt
          style={{
            fontFamily: font.display,
            fontSize: 20,
            color: color.action.primary,
            letterSpacing: 1,
          }}
        >
          TIN CUP
        </Txt>
        <View style={styles.dots}>
          {FEED_CLIPS.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                setClip(i)
                setFollowed(false)
                setTossed(false)
              }}
              style={[styles.dot, i === clip && styles.dotOn]}
            />
          ))}
        </View>
      </LinearGradient>

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} style={styles.bottomGrad}>
        <View style={{ paddingBottom: 108, paddingRight: 64, paddingLeft: 16 }}>
          <View style={styles.handleRow}>
            <Pressable onPress={() => router.push(`/beg-details?id=${c.id}`)}>
              <Txt style={{ fontFamily: font.headlineBold, fontSize: 15, color: color.text.primary }}>
                {c.handle}
              </Txt>
            </Pressable>
            <TitleChip title={c.title} />
          </View>
          <Txt
            style={{
              fontFamily: font.body,
              fontSize: 13,
              color: color.text.primary,
              lineHeight: 20,
              marginBottom: 8,
            }}
          >
            {c.caption}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Txt style={{ fontSize: 13 }}>💰</Txt>
            <Txt style={{ fontFamily: font.mono, fontSize: 13, color: color.action.primary }}>
              {c.coins.toLocaleString()} coins thrown
            </Txt>
          </View>
        </View>
      </LinearGradient>

      <View style={[styles.rail, { bottom: 104 + insets.bottom }]}>
        <Pressable onPress={() => router.push(`/beg-details?id=${c.id}`)} style={styles.avatarBtn}>
          <Txt style={{ fontSize: 22 }}>🤠</Txt>
        </Pressable>
        <View style={styles.railItem}>
          <Pressable onPress={() => setFollowed((f) => !f)}>
            <Ico.Lasso s={26} c={followed ? color.action.primary : color.text.primary} />
          </Pressable>
          <Txt style={{ fontFamily: font.body, fontSize: 10, color: followed ? color.action.primary : color.text.primary }}>
            2.1k
          </Txt>
        </View>
        <View style={styles.railItem}>
          <Pressable
            onPress={handleToss}
            style={[styles.toss, { backgroundColor: tossed ? color.action.primary : "rgba(245,179,43,0.2)" }]}
          >
            <Ico.Coin s={20} c={tossed ? color.text.inverse : color.action.primary} />
          </Pressable>
          <Txt style={{ fontFamily: font.body, fontSize: 9, color: color.action.primary, fontWeight: "700" }}>
            TOSS +5
          </Txt>
        </View>
        <View style={styles.railItem}>
          <Pressable onPress={() => Alert.alert("Link copied to saddlebag 🤠")}>
            <Ico.Share s={22} c={color.text.primary} />
          </Pressable>
          <Txt style={{ fontFamily: font.body, fontSize: 10, color: color.text.primary }}>Share</Txt>
        </View>
        <Pressable onPress={() => Alert.alert("Flagged for the Sheriff's review ⭐")}>
          <Ico.Flag s={20} c={color.text.secondary} />
        </Pressable>
        <Txt style={{ fontFamily: font.mono, fontSize: 9, color: color.text.tertiary, marginTop: 4 }}>
          {profile?.coins ?? 0}
        </Txt>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas, overflow: "hidden" },
  center: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  topGrad: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  dots: { flexDirection: "row", gap: 4, alignItems: "center", marginTop: 6 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.4)" },
  dotOn: { width: 16, backgroundColor: color.action.primary },
  bottomGrad: { position: "absolute", bottom: 0, left: 0, right: 0 },
  handleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 },
  rail: {
    position: "absolute",
    right: 0,
    width: 64,
    alignItems: "center",
    gap: 22,
    paddingBottom: 12,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(36,43,54,0.7)",
    borderWidth: 2.5,
    borderColor: color.text.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  railItem: { alignItems: "center", gap: 2 },
  toss: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(245,179,43,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
})
