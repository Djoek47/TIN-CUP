import { useState } from "react"
import { View, Pressable, ScrollView, StyleSheet, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Txt } from "@/components/ui/Txt"
import { GoldButton } from "@/components/gds/GoldButton"
import { Ico } from "@/components/gds/icons"
import { CHAR_ITEMS, type CharCat } from "@/lib/make-data"
import { useAuth } from "@/providers/AuthProvider"
import { glass } from "@/theme/glass"
import { color, font, space } from "@/theme/tokens"

const TABS: CharCat[] = ["Face", "Hair", "Rags", "Cup", "Quirk"]

/** S09 Character Creator — Make */
export default function CreateCharacter() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { updateProfile, connectWallet, wallet } = useAuth()
  const [activeTab, setActiveTab] = useState<CharCat>("Rags")
  const [selected, setSelected] = useState<Record<CharCat, number>>({
    Face: 0,
    Hair: 0,
    Rags: 0,
    Cup: 0,
    Quirk: 0,
  })
  const [loading, setLoading] = useState(false)

  const finish = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (!wallet) await connectWallet()
      const face = CHAR_ITEMS.Face[selected.Face]?.emoji ?? "🤠"
      await updateProfile({
        face,
        hat: CHAR_ITEMS.Hair[selected.Hair]?.label ?? "stetson",
        title: "OUTLAW",
        onboarded: true,
      })
      router.replace("/(app)")
    } catch (e) {
      console.log("[v0] create failed:", e)
      router.replace("/(app)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 8 }]}>
      <View style={styles.header}>
        <Txt
          style={{
            fontFamily: font.headlineBlack,
            fontSize: 10,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: color.text.tertiary,
            marginBottom: 4,
          }}
        >
          CHARACTER CREATION
        </Txt>
        <Txt style={{ fontFamily: font.display, fontSize: 24, color: color.text.primary }}>Your Outlaw</Txt>
      </View>

      <View style={[styles.stage, glass.card]}>
        <Txt style={{ fontSize: 64 }}>🤠</Txt>
        <Txt style={{ position: "absolute", top: "28%", right: "22%", fontSize: 11, opacity: 0.7 }}>🦟</Txt>
        <Txt
          style={{
            position: "absolute",
            bottom: 12,
            fontFamily: font.body,
            fontSize: 11,
            color: color.text.tertiary,
            fontStyle: "italic",
          }}
        >
          Looking real down on your luck, partner.
        </Txt>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              activeTab === tab && { borderColor: color.action.primary, backgroundColor: "rgba(245,179,43,0.15)" },
            ]}
          >
            <Txt
              style={{
                fontFamily: font.headlineBold,
                fontSize: 12,
                color: activeTab === tab ? color.action.primary : color.text.secondary,
              }}
            >
              {tab}
            </Txt>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.items}>
        {CHAR_ITEMS[activeTab].map((item, i) => {
          const locked = "locked" in item && item.locked
          const on = selected[activeTab] === i && !locked
          return (
            <Pressable
              key={`${activeTab}-${i}`}
              onPress={() => {
                if (locked) {
                  Alert.alert("Lords only", "Rise to Lordship to wear this.")
                  return
                }
                setSelected((s) => ({ ...s, [activeTab]: i }))
              }}
              style={[
                styles.item,
                glass.card,
                {
                  borderColor: locked
                    ? "rgba(255,255,255,0.05)"
                    : on
                      ? color.action.primary
                      : "rgba(255,255,255,0.07)",
                  opacity: locked ? 0.45 : 1,
                },
              ]}
            >
              <Txt style={{ fontSize: 26 }}>{item.emoji}</Txt>
              <Txt
                style={{
                  fontFamily: font.body,
                  fontSize: 9,
                  color: locked ? color.text.tertiary : color.text.secondary,
                  lineHeight: 12,
                  textAlign: "center",
                }}
              >
                {item.label}
              </Txt>
              {locked ? (
                <Txt style={styles.lock}>👑</Txt>
              ) : on ? (
                <View style={styles.check}>
                  <Ico.Check s={8} c={color.text.inverse} />
                </View>
              ) : null}
            </Pressable>
          )
        })}
      </ScrollView>

      <View style={[styles.note, glass.card]}>
        <Txt style={{ fontFamily: font.body, fontSize: 11, color: color.text.tertiary }}>
          👑 Items marked with a crown are{" "}
          <Txt style={{ color: color.action.primary, fontWeight: "600" }}>Lords only</Txt>.
        </Txt>
      </View>

      <View style={{ paddingHorizontal: 14, paddingTop: 8 }}>
        <GoldButton title="That'll do, partner." onPress={finish} loading={loading} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  header: { paddingHorizontal: 24, paddingBottom: 12, alignItems: "center" },
  stage: {
    height: 160,
    marginHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tabs: { paddingHorizontal: 16, paddingTop: 12, gap: 6 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  items: { padding: 14, gap: 10, alignItems: "flex-start" },
  item: {
    width: 76,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 5,
    borderWidth: 2,
  },
  lock: { position: "absolute", top: 4, right: 4, fontSize: 10 },
  check: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: color.action.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  note: { marginHorizontal: 14, marginBottom: 8, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10 },
})
