import { useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"

const HATS = ["stetson", "bandana", "tophat", "newsboy", "floppy"]
const FACES = ["😅", "😏", "😩", "🤨", "🧐", "😎", "🤠"]

export default function CreateCharacter() {
  const router = useRouter()
  const { updateProfile, connectWallet, wallet } = useAuth()
  const [title, setTitle] = useState("")
  const [hat, setHat] = useState(HATS[0])
  const [face, setFace] = useState(FACES[0])
  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (!wallet) await connectWallet()
      await updateProfile({
        title: title || "OUTLAW",
        hat,
        face,
        onboarded: true,
      })
      router.replace("/(app)")
    } catch (e) {
      console.log("[v0] Create character failed:", e)
      // Still enter town so the rider is never stuck
      router.replace("/(app)")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen padded scroll>
      <View style={{ paddingVertical: space[6] }}>
        <Txt variant="displayL" center>
          BECOME AN OUTLAW
        </Txt>
        <Txt variant="bodyM" color={color.text.secondary} center style={{ marginTop: space[2] }}>
          Customize your frontier legend.
        </Txt>
      </View>

      <View style={{ marginVertical: space[6], alignItems: "center" }}>
        <Txt variant="displayXL" style={{ fontSize: 64, marginBottom: space[3] }}>
          {face}
        </Txt>
      </View>

      <Field
        label="YOUR TITLE"
        placeholder="e.g., DRIFTER, RASCAL, THE RECKLESS"
        value={title}
        onChangeText={setTitle}
      />

      <View style={{ marginTop: space[6], marginBottom: space[4] }}>
        <Txt variant="bodyS" color={color.text.secondary}>
          FACE
        </Txt>
        <View style={styles.chips}>
          {FACES.map((f) => (
            <Pressable
              key={f}
              onPress={() => setFace(f)}
              style={[styles.chip, face === f && styles.chipOn]}
              accessibilityRole="button"
            >
              <Txt style={{ fontSize: 22 }}>{f}</Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: space[8] }}>
        <Txt variant="bodyS" color={color.text.secondary}>
          HAT
        </Txt>
        <View style={styles.chips}>
          {HATS.map((h) => (
            <Pressable
              key={h}
              onPress={() => setHat(h)}
              style={[styles.chip, hat === h && styles.chipOn]}
              accessibilityRole="button"
            >
              <Txt variant="buttonM" color={hat === h ? color.text.inverse : color.action.primary}>
                {h}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>

      <Button title="Ride into Main Street" onPress={handleFinish} loading={loading} size="lg" />
    </Screen>
  )
}

const styles = StyleSheet.create({
  chips: { flexDirection: "row", flexWrap: "wrap", gap: space[3], marginTop: space[3] },
  chip: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: space[3],
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(245,179,43,0.10)",
    borderWidth: 1,
    borderColor: "rgba(245,179,43,0.24)",
  },
  chipOn: {
    backgroundColor: color.action.primaryHover,
    borderColor: "rgba(255,255,255,0.25)",
  },
})
