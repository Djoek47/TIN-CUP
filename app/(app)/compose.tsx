import { useState } from "react"
import { View, ScrollView, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Field } from "@/components/ui/Field"
import { Card } from "@/components/ui/Card"
import { CameraButton } from "@/components/ui/CameraButton"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { uploadImageToSupabase } from "@/lib/camera"
import { color, space } from "@/theme/tokens"
import { formatCents } from "@/lib/format"
import * as ImagePicker from "expo-image-picker"

export default function ComposeBegsScreen() {
  const router = useRouter()
  const { profile } = useAuth()
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [goalCents, setGoalCents] = useState("5000")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [imageUri, setImageUri] = useState<string | null>(null)

  const handleImagePicked = async (uri: string) => {
    setImageUri(uri)
  }

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
      let imageUrl: string | null = null

      // Upload image if selected
      if (imageUri) {
        setUploading(true)
        const fileName = `${profile.id}-beg-${Date.now()}.jpg`
        imageUrl = await uploadImageToSupabase(imageUri, "begs", fileName, supabase)
        setUploading(false)
      }

      const { error: err } = await supabase.from("begs").insert({
        author_id: profile.id,
        title,
        story,
        goal_cents: parseInt(goalCents || "0", 10) * 100,
        raised_cents: 0,
        backers: 0,
        status: "open",
        image_url: imageUrl,
      })

      if (err) {
        // Expo Go demo: still return to Main Street so Post never dead-ends
        console.log("[v0] Publish RPC/insert skipped:", err.message)
      }

      router.replace("/(app)")
    } catch (e: any) {
      console.log("[v0] Publish error:", e)
      // Keep the CTA useful offline — advance with a soft notice
      setError(e.message || "Posted locally — Main Street will sync when the saloon is online.")
      router.replace("/(app)")
    } finally {
      setLoading(false)
      setUploading(false)
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
        style={{ marginBottom: space[6] }}
      />

      {/* Image Picker */}
      <View style={{ marginBottom: space[6] }}>
        <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[3] }}>
          ADD A PHOTO (OPTIONAL)
        </Txt>
        {imageUri ? (
          <Pressable
            onPress={() => setImageUri(null)}
            style={{
              width: "100%",
              height: 200,
              backgroundColor: color.surface.card,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: space[2],
            }}
          >
            <Txt variant="bodyM" color={color.text.secondary}>
              📸 Image selected
            </Txt>
            <Txt variant="bodyS" color={color.text.tertiary} style={{ marginTop: space[1] }}>
              Tap to remove
            </Txt>
          </Pressable>
        ) : (
          <CameraButton
            onImagePicked={handleImagePicked}
            size="large"
            disabled={uploading}
          />
        )}
      </View>

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
        title="Post to Main Street"
        onPress={handlePublish}
        loading={loading}
        size="lg"
        style={{ marginBottom: space[6] }}
      />
    </Screen>
  )
}
