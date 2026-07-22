import { useState } from "react"
import { View, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space } from "@/theme/tokens"
import { formatCents } from "@/lib/format"

export default function ComposeBegsScreen() {
  const router = useRouter()
  const { profile } = useAuth()
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [goalCents, setGoalCents] = useState("5000")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePublish = async () => {
    if (!title.trim()) {
      setError("Give your beg a title, outlaw.")
      return
    }
    if (!profile?.id) {
      setError("Not signed in.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error: err } = await supabase.from("begs").insert({
        author_id: profile.id,
        title,
        story,
        goal_cents: parseInt(goalCents) * 100,
        raised_cents: 0,
        backers: 0,
        status: "open",
      })

      if (err) throw err

      router.replace("/(app)")
    } catch (e: any) {
      setError(e.message || "Failed to post beg")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen scroll padded edges={["top"]}>
      <View style={{ paddingVertical: space[4], marginBottom: space[6] }}>
        <Txt variant="displayL">POST A BEG</Txt>
        <Txt variant="bodyM" color={color.text.secondary} style={{ marginTop: space[2] }}>
          Tell the gulch what you need. Every coin counts.
        </Txt>
      </View>

      {error && (
        <Card
          style={{
            backgroundColor: color.action.danger,
            paddingVertical: space[3],
            paddingHorizontal: space[4],
            marginBottom: space[4],
          }}
        >
          <Txt variant="bodyS" color={color.text.inverse}>
            {error}
          </Txt>
        </Card>
      )}

      <Field
        label="TITLE"
        placeholder="Fund my championship mustache wax regionals"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: space[6] }}
      />

      <Field
        label="YOUR STORY"
        placeholder="Been growin this beauty for three winters..."
        value={story}
        onChangeText={setStory}
        multiline
        numberOfLines={6}
        style={{ marginBottom: space[6] }}
      />

      <Field
        label="GOAL (DOLLARS)"
        placeholder="50"
        value={goalCents}
        onChangeText={setGoalCents}
        keyboardType="decimal-pad"
        style={{ marginBottom: space[4] }}
      />

      <Card
        style={{
          backgroundColor: color.surface.raised,
          paddingVertical: space[4],
          paddingHorizontal: space[4],
          marginBottom: space[8],
        }}
      >
        <Txt variant="bodyS" style={{ marginBottom: space[2] }}>
          YOUR GOAL
        </Txt>
        <Txt variant="displayM" color={color.action.primary}>
          {formatCents(parseInt(goalCents || "0") * 100)}
        </Txt>
        <Txt variant="bodyS" color={color.text.secondary} style={{ marginTop: space[2] }}>
          5% Monarch&apos;s Cut. Every gift is tracked.
        </Txt>
      </Card>

      <Button
        onPress={handlePublish}
        loading={loading}
        size="large"
        style={{ marginBottom: space[6] }}
      >
        Post to Main Street
      </Button>
    </Screen>
  )
}
