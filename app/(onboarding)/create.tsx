import { useState } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import * as Haptics from "expo-haptics"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { useAuth } from "@/providers/AuthProvider"
import { color, primitive, space, radius, font } from "@/theme/tokens"

const FACES = ["😅", "😏", "😩", "🤨", "😎", "🥸", "🤠", "😤", "🧐", "😬"]
const HATS = [
  { key: "stetson", label: "Stetson", icon: "hat-fauna" },
  { key: "bandana", label: "Bandana", icon: "bandage" },
  { key: "tophat", label: "Top Hat", icon: "hat-fedora" },
  { key: "newsboy", label: "Newsboy", icon: "cap" },
]
const ACCENTS = [
  { key: "gold", color: primitive.gold[500] },
  { key: "cactus", color: primitive.cactus[500] },
  { key: "oxblood", color: primitive.oxblood[400] },
  { key: "sky", color: primitive.sky[500] },
]

export default function CreateCharacter() {
  const router = useRouter()
  const { fate } = useLocalSearchParams<{ fate: "drifter" | "lord" }>()
  const { updateProfile, profile } = useAuth()
  const isLord = fate === "lord"

  const [name, setName] = useState(profile?.display_name ?? "")
  const [face, setFace] = useState(isLord ? "🧐" : "🤠")
  const [hat, setHat] = useState(isLord ? "tophat" : "stetson")
  const [accent, setAccent] = useState(isLord ? "gold" : "cactus")
  const [busy, setBusy] = useState(false)

  async function takeTheCup() {
    if (!name.trim()) return
    setBusy(true)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    const startingCoins = isLord ? 12000 : 100
    const startingBalance = isLord ? 1000000 : 0 // Lords buy in with $100 of "gold" test funds
    await updateProfile({
      display_name: name.trim(),
      fate: fate ?? "drifter",
      title: isLord ? "THE LORD" : "DRIFTER",
      face,
      hat,
      accent,
      coins: startingCoins,
      balance_cents: startingBalance,
      onboarded: true,
    } as any)
    router.replace("/(app)")
  }

  return (
    <Screen scroll contentStyle={styles.content}>
      <Txt variant="overline" color={color.text.tertiary}>
        {isLord ? "FORGE YER LORDSHIP" : "FORGE YER OUTLAW"}
      </Txt>
      <Txt variant="displayL" style={styles.title}>
        {"MAKE YER MARK"}
      </Txt>

      {/* Avatar preview */}
      <View style={styles.previewWrap}>
        <View
          style={[
            styles.avatar,
            { borderColor: ACCENTS.find((a) => a.key === accent)?.color ?? primitive.gold[500] },
          ]}
        >
          <Txt style={styles.avatarFace}>{face}</Txt>
        </View>
        <Txt variant="headlineL" style={{ marginTop: space[3] }}>
          {name.trim() || "Nameless Drifter"}
        </Txt>
        <View style={styles.titlePill}>
          <MaterialCommunityIcons
            name={isLord ? "crown" : "pistol"}
            size={13}
            color={primitive.gold[500]}
          />
          <Txt style={styles.titlePillTxt}>{isLord ? "THE LORD" : "DRIFTER"}</Txt>
        </View>
      </View>

      <Field
        label="Outlaw name"
        placeholder="e.g. Cactus Jack"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        maxLength={24}
      />

      <Txt variant="overline" color={color.text.tertiary} style={styles.sectionLabel}>
        {"THE MUG"}
      </Txt>
      <View style={styles.faceGrid}>
        {FACES.map((f) => (
          <Pressable
            key={f}
            onPress={() => {
              Haptics.selectionAsync()
              setFace(f)
            }}
            style={[styles.faceCell, face === f && styles.faceCellActive]}
          >
            <Txt style={styles.faceEmoji}>{f}</Txt>
          </Pressable>
        ))}
      </View>

      <Txt variant="overline" color={color.text.tertiary} style={styles.sectionLabel}>
        {"THE HAT"}
      </Txt>
      <View style={styles.hatRow}>
        {HATS.map((h) => (
          <Pressable
            key={h.key}
            onPress={() => {
              Haptics.selectionAsync()
              setHat(h.key)
            }}
            style={[styles.hatCell, hat === h.key && styles.hatCellActive]}
          >
            <MaterialCommunityIcons
              name={h.icon as any}
              size={22}
              color={hat === h.key ? primitive.gold[500] : color.text.secondary}
            />
            <Txt variant="caption" color={hat === h.key ? color.text.primary : color.text.tertiary}>
              {h.label}
            </Txt>
          </Pressable>
        ))}
      </View>

      <Txt variant="overline" color={color.text.tertiary} style={styles.sectionLabel}>
        {"YER COLORS"}
      </Txt>
      <View style={styles.accentRow}>
        {ACCENTS.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => {
              Haptics.selectionAsync()
              setAccent(a.key)
            }}
            style={[
              styles.accentDot,
              { backgroundColor: a.color },
              accent === a.key && styles.accentDotActive,
            ]}
          >
            {accent === a.key && (
              <MaterialCommunityIcons name="check-bold" size={16} color={primitive.ink[900]} />
            )}
          </Pressable>
        ))}
      </View>

      <View style={{ height: space[5] }} />
      <Button
        title="Take the cup"
        variant="primary"
        size="lg"
        loading={busy}
        disabled={!name.trim()}
        onPress={takeTheCup}
        icon={<MaterialCommunityIcons name="cup" size={20} color={color.text.inverse} />}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: space[5], paddingTop: space[4], paddingBottom: space[9] },
  title: { marginTop: space[2] },
  previewWrap: { alignItems: "center", marginVertical: space[5] },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: radius.full,
    borderWidth: 3,
    backgroundColor: color.bg.card,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFace: { fontSize: 52, lineHeight: 60 },
  titlePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[1],
    marginTop: space[2],
    paddingHorizontal: space[3],
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: "rgba(245,179,43,0.12)",
  },
  titlePillTxt: {
    fontFamily: font.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: primitive.gold[500],
  },
  sectionLabel: { marginTop: space[5], marginBottom: space[3] },
  faceGrid: { flexDirection: "row", flexWrap: "wrap", gap: space[2] },
  faceCell: {
    width: 52,
    height: 52,
    borderRadius: radius.m,
    backgroundColor: color.bg.card,
    borderWidth: 1,
    borderColor: color.border.subtle,
    alignItems: "center",
    justifyContent: "center",
  },
  faceCellActive: { borderColor: primitive.gold[500], backgroundColor: "rgba(245,179,43,0.10)" },
  faceEmoji: { fontSize: 26, lineHeight: 32 },
  hatRow: { flexDirection: "row", gap: space[2] },
  hatCell: {
    flex: 1,
    paddingVertical: space[3],
    borderRadius: radius.m,
    backgroundColor: color.bg.card,
    borderWidth: 1,
    borderColor: color.border.subtle,
    alignItems: "center",
    gap: space[1],
  },
  hatCellActive: { borderColor: primitive.gold[500], backgroundColor: "rgba(245,179,43,0.10)" },
  accentRow: { flexDirection: "row", gap: space[3] },
  accentDot: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  accentDotActive: { borderWidth: 3, borderColor: color.text.primary },
})
