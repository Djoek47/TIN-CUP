import { useState } from "react"
import { View, ScrollView, Pressable, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"

const FACES = ["🤠", "😐", "😊", "😎", "😈", "🧐", "😴", "🤐"]
const HATS = ["stetson", "cowboy", "tophat", "beanie", "crown", "visor", "fedora", "helmet"]
const TITLES = ["OUTLAW", "SHERIFF", "GAMBLER", "DRIFTER", "DESPERADO", "VARMINT", "BANDIT", "RENEGADE"]
const ACCENTS = ["gold", "silver", "bronze", "ruby", "emerald", "sapphire", "diamond", "copper"]

export default function CustomizeCharacter() {
  const router = useRouter()
  const { profile, updateProfile } = useAuth()

  const [face, setFace] = useState(profile?.face || "🤠")
  const [hat, setHat] = useState(profile?.hat || "stetson")
  const [title, setTitle] = useState(profile?.title || "OUTLAW")
  const [accent, setAccent] = useState(profile?.accent || "gold")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateProfile({ face, hat, title, accent })
      Alert.alert("Success", "Your character has been updated!")
      router.back()
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to save character")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen scroll edges={["bottom"]} contentStyle={{ paddingHorizontal: space[6] }}>
      <View style={{ paddingVertical: space[6] }}>
        <Txt variant="displayL" center>CUSTOMIZE YOUR LOOK</Txt>
        <Txt variant="bodyM" color={color.text.secondary} center style={{ marginTop: space[2] }}>
          Make your outlaw unique
        </Txt>
      </View>

      <Card
        style={{
          backgroundColor: color.surface.raised,
          paddingVertical: space[8],
          paddingHorizontal: space[6],
          alignItems: "center",
          marginBottom: space[6],
        }}
      >
        <Txt variant="displayXL" style={{ fontSize: 100 }}>
          {face}
        </Txt>
        <Txt variant="displayL" center style={{ marginTop: space[4] }}>
          {title}
        </Txt>
        <Txt variant="bodyS" color={color.text.secondary} center style={{ marginTop: space[2] }}>
          {hat.toUpperCase()} • {accent.toUpperCase()}
        </Txt>
      </Card>

      <View style={{ marginBottom: space[6] }}>
        <Txt variant="bodyS" color={color.text.tertiary} style={{ marginBottom: space[3] }}>
          FACE
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {FACES.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFace(f)}
              style={{
                width: "23%",
                aspectRatio: 1,
                backgroundColor: face === f ? color.action.primary : color.surface.card,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: face === f ? 2 : 0,
                borderColor: color.action.primary,
              }}
            >
              <Txt variant="displayL">{f}</Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: space[6] }}>
        <Txt variant="bodyS" color={color.text.tertiary} style={{ marginBottom: space[3] }}>
          HAT
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {HATS.map((h) => (
            <Pressable
              key={h}
              onPress={() => setHat(h)}
              style={{
                flex: 1,
                minWidth: "48%",
                paddingVertical: space[2],
                paddingHorizontal: space[3],
                backgroundColor: hat === h ? color.action.primary : color.surface.card,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Txt variant="bodyS" color={hat === h ? color.text.inverse : color.text.primary}>
                {h.toUpperCase()}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: space[6] }}>
        <Txt variant="bodyS" color={color.text.tertiary} style={{ marginBottom: space[3] }}>
          TITLE
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {TITLES.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTitle(t)}
              style={{
                flex: 1,
                minWidth: "48%",
                paddingVertical: space[2],
                paddingHorizontal: space[3],
                backgroundColor: title === t ? color.action.primary : color.surface.card,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Txt variant="bodyS" color={title === t ? color.text.inverse : color.text.primary}>
                {t}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: space[8] }}>
        <Txt variant="bodyS" color={color.text.tertiary} style={{ marginBottom: space[3] }}>
          ACCENT
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[2] }}>
          {ACCENTS.map((a) => (
            <Pressable
              key={a}
              onPress={() => setAccent(a)}
              style={{
                flex: 1,
                minWidth: "48%",
                paddingVertical: space[2],
                paddingHorizontal: space[3],
                backgroundColor: accent === a ? color.action.primary : color.surface.card,
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Txt variant="bodyS" color={accent === a ? color.text.inverse : color.text.primary}>
                {a.toUpperCase()}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <Button
        title="Save Character"
        onPress={handleSave}
        loading={loading}
        size="lg"
        style={{ marginBottom: space[4] }}
      />
    </Screen>
  )
}
