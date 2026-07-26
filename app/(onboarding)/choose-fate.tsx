import { useState } from "react"
import { View, Pressable, Alert, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space, font } from "@/theme/tokens"
import { glass } from "@/theme/glass"

/** Choose Your Fate — Vagrant / Lord accordion from Figma Make */
export default function ChooseFate() {
  const router = useRouter()
  const { profile, wallet, updateProfile } = useAuth()
  const [expanded, setExpanded] = useState<"vagrant" | "lord" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const choose = async (fate: "vagrant" | "lord") => {
    if (!wallet || !profile?.id) {
      setError("Wallet not connected")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (fate === "lord") {
        const { error: rpcError } = await supabase.rpc("become_lord", {
          p_amount_cents: 10000,
        })
        if (rpcError) throw rpcError
        Alert.alert("Welcome, Lord", "You have ascended. Lords never fall — and never go back.")
      }

      // DB still uses fate: drifter | lord
      await updateProfile({
        fate: fate === "vagrant" ? "drifter" : "lord",
        is_lord: fate === "lord",
      })
      router.push("/(onboarding)/create")
    } catch (e: any) {
      setError(e.message || "Transaction failed")
      Alert.alert("Error", e.message || "Failed to complete transaction")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen edges={["top", "bottom"]} contentStyle={{ paddingHorizontal: space[4], flex: 1 }}>
      <View style={{ paddingTop: space[7], paddingBottom: space[4], alignItems: "center" }}>
        <Txt variant="overline" color={color.text.tertiary}>
          PERDITION GULCH
        </Txt>
        <Txt variant="displayM" center style={{ marginTop: space[1] }}>
          Choose Your Fate
        </Txt>
        {error ? (
          <Txt variant="bodyS" color={color.action.danger} center style={{ marginTop: space[3] }}>
            {error}
          </Txt>
        ) : null}
      </View>

      <View style={styles.row}>
        {/* VAGRANT — parchment */}
        <Pressable
          onPress={() => setExpanded(expanded === "vagrant" ? null : "vagrant")}
          style={[
            styles.panel,
            glass.parchment,
            { flex: expanded === "vagrant" ? 7 : expanded === "lord" ? 3 : 5 },
            expanded === "vagrant" && { borderColor: color.action.primary },
          ]}
        >
          <Txt variant="overline" color={color.dust}>
            THE DRIFTER
          </Txt>
          <Txt style={{ fontSize: 48, marginVertical: space[2] }}>🤠</Txt>
          <Txt
            variant="displayM"
            color={color.text.inverse}
            style={{ fontFamily: font.display, fontSize: 16 }}
          >
            VAGRANT
          </Txt>
          {expanded === "vagrant" && (
            <Txt variant="bodyS" color={color.dust} center style={{ marginTop: space[2] }}>
              Roll in with nothing but a tin cup and a story. Beg, perform, climb.
            </Txt>
          )}
          <View style={[styles.chip, { backgroundColor: "rgba(140,122,91,0.18)", marginTop: space[3] }]}>
            <Txt variant="numericS" color={color.dust}>
              FREE
            </Txt>
          </View>
          {expanded === "vagrant" && (
            <Pressable
              disabled={loading}
              onPress={() => choose("vagrant")}
              style={[styles.ctaDark, glass.card, { marginTop: space[4] }]}
            >
              <Txt variant="buttonM" color={color.text.primary}>
                Take the cup
              </Txt>
            </Pressable>
          )}
        </Pressable>

        <View style={styles.rope}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={[styles.ropeKnot, { opacity: 0.35 + (i % 2) * 0.2 }]} />
          ))}
        </View>

        {/* LORD */}
        <Pressable
          onPress={() => setExpanded(expanded === "lord" ? null : "lord")}
          style={[
            styles.panel,
            glass.elevated,
            { flex: expanded === "lord" ? 7 : expanded === "vagrant" ? 3 : 5 },
            expanded === "lord" && { borderColor: color.action.primary, borderWidth: 2 },
          ]}
        >
          <Txt variant="overline" color={color.text.tertiary}>
            THE LORD
          </Txt>
          <Txt style={{ fontSize: 48, marginVertical: space[2] }}>🎩</Txt>
          <Txt variant="displayM" color={color.action.primary} style={{ fontSize: 16 }}>
            LORD
          </Txt>
          {expanded === "lord" && (
            <Txt variant="bodyS" color={color.text.secondary} center style={{ marginTop: space[2] }}>
              Ride in with finery. Set bounties, run your Court, and rain gold.
            </Txt>
          )}
          <View style={[styles.chip, glass.gold, { marginTop: space[3] }]}>
            <Txt variant="numericS" color={color.action.primary}>
              $100 BUY-IN
            </Txt>
          </View>
          {expanded === "lord" && (
            <Pressable
              disabled={loading}
              onPress={() => choose("lord")}
              style={[styles.ctaGold, { marginTop: space[4] }]}
            >
              <Txt variant="buttonM" color={color.text.inverse}>
                Claim your title
              </Txt>
            </Pressable>
          )}
        </Pressable>
      </View>

      <Txt variant="caption" color={color.text.tertiary} center style={{ paddingVertical: space[5] }}>
        Drifters can rise. Lords never fall — and never go back.
      </Txt>
    </Screen>
  )
}

const styles = StyleSheet.create({
  row: { flex: 1, flexDirection: "row", gap: 8, minHeight: 0 },
  panel: {
    padding: space[4],
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  ctaDark: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaGold: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  rope: { width: 10, alignItems: "center", justifyContent: "center", gap: 3 },
  ropeKnot: {
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: color.dust,
  },
})
