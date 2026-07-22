import { useState } from "react"
import { View } from "react-native"
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
  const { profile, updateProfile } = useAuth()
  const [title, setTitle] = useState("")
  const [hat, setHat] = useState(HATS[0])
  const [face, setFace] = useState(FACES[0])
  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    setLoading(true)
    try {
      await updateProfile({
        title: title || "OUTLAW",
        hat,
        face,
        onboarded: true,
      })
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
        <Txt
          variant="displayXL"
          style={{
            fontSize: 64,
            marginBottom: space[3],
          }}
        >
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
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3], marginTop: space[3] }}>
          {FACES.map((f) => (
            <Button
              key={f}
              variant={face === f ? "primary" : "secondary"}
              size="small"
              onPress={() => setFace(f)}
              style={{ flex: 0 }}
            >
              {f}
            </Button>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: space[8] }}>
        <Txt variant="bodyS" color={color.text.secondary}>
          HAT
        </Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space[3], marginTop: space[3] }}>
          {HATS.map((h) => (
            <Button
              key={h}
              variant={hat === h ? "primary" : "secondary"}
              size="small"
              onPress={() => setHat(h)}
              style={{ flex: 0 }}
            >
              {h}
            </Button>
          ))}
        </View>
      </View>

      <Button onPress={handleFinish} loading={loading} size="large">
        Ride into Main Street
      </Button>
    </Screen>
  )
}
