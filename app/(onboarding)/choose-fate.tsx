import { useState } from "react"
import { View, Pressable, StyleSheet, ActivityIndicator, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Txt } from "@/components/ui/Txt"
import { useAuth } from "@/providers/AuthProvider"
import { MONEY_FAIL_COPY } from "@/lib/thirdweb"
import { glass } from "@/theme/glass"
import { color, font, space } from "@/theme/tokens"

/** S08 Choose Your Fate — Make diptych */
export default function ChooseFate() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { connectWallet, wallet, profile, updateProfile, ascendLord } = useAuth()
  const [expanded, setExpanded] = useState<"vagrant" | "lord" | null>(null)
  const [loading, setLoading] = useState(false)

  const choose = async (fate: "vagrant" | "lord") => {
    if (loading) return
    setLoading(true)
    try {
      if (!wallet || !profile?.id) await connectWallet()
      if (fate === "lord") {
        try {
          await ascendLord()
        } catch (e: any) {
          Alert.alert("Error", e?.message || MONEY_FAIL_COPY)
          setLoading(false)
          return
        }
      } else {
        await updateProfile({ fate: "drifter", is_lord: false })
      }
      router.push("/(onboarding)/create")
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to choose fate")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.header}>
        <Txt
          style={{
            fontFamily: font.headlineBlack,
            fontSize: 10,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: color.text.tertiary,
            marginBottom: 5,
          }}
        >
          PERDITION GULCH
        </Txt>
        <Txt style={{ fontFamily: font.display, fontSize: 28, color: color.text.primary, letterSpacing: 0.5 }}>
          Choose Your Fate
        </Txt>
      </View>

      <View style={styles.row}>
        <Pressable
          onPress={() => setExpanded(expanded === "vagrant" ? null : "vagrant")}
          style={[
            styles.panel,
            styles.parchment,
            { flex: expanded === "vagrant" ? 7 : expanded === "lord" ? 3 : 5 },
            expanded === "vagrant" && { borderColor: color.action.primary },
          ]}
          disabled={loading}
        >
          <Txt style={styles.overDust}>THE DRIFTER</Txt>
          <Txt style={{ fontSize: 48, marginVertical: 8 }}>🤠</Txt>
          <Txt style={{ fontFamily: font.display, fontSize: 16, color: color.text.inverse, letterSpacing: 0.5 }}>
            VAGRANT
          </Txt>
          {expanded === "vagrant" ? (
            <Txt
              style={{
                fontFamily: font.body,
                fontSize: 12,
                color: color.dust,
                lineHeight: 18,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Roll in with nothing but a tin cup and a story. Beg, perform, climb. Fortunes change in Perdition Gulch.
            </Txt>
          ) : null}
          <View style={[styles.chip, { backgroundColor: "rgba(140,122,91,0.18)", marginTop: 10 }]}>
            <Txt style={{ fontFamily: font.mono, fontSize: 11, color: color.dust, fontWeight: "700" }}>FREE</Txt>
          </View>
          {expanded === "vagrant" ? (
            <Pressable
              disabled={loading}
              onPress={() => choose("vagrant")}
              style={[styles.ctaDark, glass.card]}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color={color.text.primary} />
              ) : (
                <Txt style={{ fontFamily: font.headlineBold, fontSize: 14, color: color.text.primary }}>
                  Take the cup
                </Txt>
              )}
            </Pressable>
          ) : null}
        </Pressable>

        <View style={styles.rope}>
          {Array.from({ length: 14 }).map((_, i) => (
            <View key={i} style={[styles.ropeKnot, { opacity: 0.4 + (i % 2) * 0.2 }]} />
          ))}
        </View>

        <Pressable
          onPress={() => setExpanded(expanded === "lord" ? null : "lord")}
          style={[
            styles.panel,
            glass.elevated,
            { flex: expanded === "lord" ? 7 : expanded === "vagrant" ? 3 : 5 },
            expanded === "lord" && { borderColor: color.action.primary, borderWidth: 2 },
          ]}
          disabled={loading}
        >
          <Txt style={styles.overLo}>THE LORD</Txt>
          <Txt style={{ fontSize: 48, marginVertical: 8 }}>🎩</Txt>
          <Txt
            style={{
              fontFamily: font.display,
              fontSize: 16,
              color: color.action.primary,
              letterSpacing: 0.5,
              textShadowColor: "rgba(245,179,43,0.4)",
              textShadowRadius: 18,
              textShadowOffset: { width: 0, height: 0 },
            }}
          >
            LORD
          </Txt>
          {expanded === "lord" ? (
            <Txt
              style={{
                fontFamily: font.body,
                fontSize: 12,
                color: color.text.secondary,
                lineHeight: 18,
                marginTop: 10,
                textAlign: "center",
              }}
            >
              Ride in with finery. Set bounties, run your Court, and rain gold on the beggars below. Power never looked
              so good.
            </Txt>
          ) : null}
          <View style={[styles.chip, glass.gold, { marginTop: 10 }]}>
            <Txt style={{ fontFamily: font.mono, fontSize: 11, color: color.action.primary, fontWeight: "700" }}>
              $100 BUY-IN
            </Txt>
          </View>
          {expanded === "lord" ? (
            <Pressable
              disabled={loading}
              onPress={() => choose("lord")}
              style={styles.ctaGold}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color={color.text.inverse} />
              ) : (
                <Txt style={{ fontFamily: font.headlineBold, fontSize: 14, color: color.text.inverse }}>
                  Claim your title
                </Txt>
              )}
            </Pressable>
          ) : null}
        </Pressable>
      </View>

      <Txt
        style={{
          fontFamily: font.body,
          fontSize: 12,
          color: color.text.tertiary,
          lineHeight: 19,
          textAlign: "center",
          paddingHorizontal: space[5],
          paddingVertical: space[4],
        }}
      >
        Drifters can rise. Lords never fall — and never go back.
      </Txt>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  header: { paddingHorizontal: 24, paddingBottom: 18, alignItems: "center" },
  row: { flex: 1, flexDirection: "row", marginHorizontal: 14, gap: 8, minHeight: 0 },
  panel: {
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    overflow: "hidden",
    minWidth: 0,
  },
  parchment: {
    backgroundColor: "rgba(244,238,221,0.95)",
    borderColor: "rgba(228,218,192,0.8)",
  },
  overDust: {
    fontFamily: font.headlineBlack,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: color.dust,
    marginBottom: 6,
  },
  overLo: {
    fontFamily: font.headlineBlack,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: color.text.tertiary,
    marginBottom: 6,
  },
  chip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  ctaDark: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
  },
  ctaGold: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 14,
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  rope: { width: 10, alignItems: "center", justifyContent: "center", gap: 3 },
  ropeKnot: { width: 3, height: 12, borderRadius: 2, backgroundColor: color.dust },
})
