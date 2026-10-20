import { useState } from "react"
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  PrimaryButton,
  Label,
  UiText,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { launchVideoCamera, pickImage } from "@/lib/camera"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { space } from "@/theme/vessel"

/** Vessel beg composer — camera + Supabase post */
export default function ComposeScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { user, say } = useApp()
  const [title, setTitle] = useState("")
  const [story, setStory] = useState("")
  const [goalAmt, setGoalAmt] = useState("500")
  const [mediaUri, setMediaUri] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const attachPhoto = async () => {
    const asset = await pickImage()
    if (asset?.uri) setMediaUri(asset.uri)
  }

  const attachVideo = async () => {
    const asset = await launchVideoCamera()
    if (asset?.uri) setMediaUri(asset.uri)
  }

  const handlePost = async () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Give your beg a name.")
      return
    }
    if (!user.address) {
      Alert.alert("Sign in required", "Connect before posting.")
      return
    }
    setBusy(true)
    try {
      const goal = Math.max(0, Math.round(Number(goalAmt) || 0) * 100)
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("begs").insert({
          author_id: user.address.toLowerCase(),
          title: title.trim(),
          story: story.trim() || null,
          goal_cents: goal,
          raised_cents: 0,
          backers: 0,
          status: "open",
        })
        if (error) throw error
      }
      say("Beg posted")
      router.replace("/(app)")
    } catch (e: any) {
      Alert.alert("Post failed", e?.message || "Try again")
    } finally {
      setBusy(false)
    }
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="New Beg" onBack={() => router.back()} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Label>TITLE</Label>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="What do you need?"
            placeholderTextColor={v.faint}
            style={[styles.input, { color: v.ink, borderColor: v.line, borderRadius: v.rad }]}
          />
          <Label style={{ marginTop: 18 }}>STORY</Label>
          <TextInput
            value={story}
            onChangeText={setStory}
            placeholder="Keep it legal & fun."
            placeholderTextColor={v.faint}
            multiline
            style={[styles.input, styles.area, { color: v.ink, borderColor: v.line, borderRadius: v.rad }]}
          />
          <Label style={{ marginTop: 18 }}>GOAL (USD)</Label>
          <TextInput
            value={goalAmt}
            onChangeText={setGoalAmt}
            keyboardType="numeric"
            style={[styles.input, { color: v.ink, borderColor: v.line, borderRadius: v.rad }]}
          />

          <Hairline />
          <Label style={{ marginTop: 12 }}>MEDIA</Label>
          <Row style={{ gap: 10, marginTop: 10 }}>
            <PrimaryButton title="PHOTO" onPress={attachPhoto} />
          </Row>
          <View style={{ height: 10 }} />
          <PrimaryButton title="RECORD VIDEO" tone="lim" onPress={attachVideo} />
          {mediaUri ? (
            <Image source={{ uri: mediaUri }} style={styles.preview} />
          ) : (
            <Pressable
              onPress={attachPhoto}
              style={[styles.previewEmpty, { borderColor: v.line, borderRadius: v.rad }]}
            >
              <UiText weight="reg" style={{ color: v.dim, textAlign: "center" }}>
                Tap to add a photo or video
              </UiText>
            </Pressable>
          )}

          <View style={{ marginTop: 28 }}>
            <PrimaryButton title={busy ? "POSTING…" : "POST BEG"} onPress={handlePost} disabled={busy} />
          </View>
          <Label style={{ textAlign: "center", marginTop: 12, color: v.faint }}>
            {isSupabaseConfigured ? "SAVED TO SUPABASE" : "LOCAL ONLY · SUPABASE NOT CONFIGURED"}
          </Label>
        </ScrollView>
      </KeyboardAvoidingView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  area: { minHeight: 110, textAlignVertical: "top" },
  preview: { marginTop: 16, width: "100%", height: 200, borderRadius: 16 },
  previewEmpty: {
    marginTop: 16,
    height: 140,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.screenPad,
  },
})
