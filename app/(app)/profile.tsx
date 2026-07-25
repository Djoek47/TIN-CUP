import { useState } from "react"
import { View } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { CameraButton } from "@/components/ui/CameraButton"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { uploadImageToSupabase } from "@/lib/camera"
import { color, space } from "@/theme/tokens"
import { formatCents } from "@/lib/format"

export default function ProfileScreen() {
  const router = useRouter()
  const { profile, signOut, refreshProfile } = useAuth()
  const [uploading, setUploading] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.replace("/(auth)/sign-in")
  }

  const handleImagePicked = async (imageUri: string) => {
    if (!profile?.id) return

    setUploading(true)
    try {
      console.log("[v0] Uploading profile image:", imageUri)
      
      const fileName = `${profile.id}-profile-${Date.now()}.jpg`
      const publicUrl = await uploadImageToSupabase(
        imageUri,
        "profiles",
        fileName,
        supabase
      )

      if (publicUrl) {
        // Update profile with image URL
        const { error } = await supabase
          .from("profiles")
          .update({ display_name: profile.display_name, profile_image_url: publicUrl })
          .eq("id", profile.id)

        if (error) throw error

        console.log("[v0] Profile image uploaded:", publicUrl)
        await refreshProfile()
      }
    } catch (e: any) {
      console.log("[v0] Profile upload error:", e)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Screen padded scroll>
      <Txt variant="displayL" style={{ marginBottom: space[6] }}>
        YOUR LEGEND
      </Txt>

      {/* Character Display */}
      <Card
        style={{
          backgroundColor: color.surface.raised,
          paddingVertical: space[8],
          paddingHorizontal: space[6],
          alignItems: "center",
          marginBottom: space[6],
        }}
      >
        <View style={{ position: "relative", marginBottom: space[4] }}>
          <Txt
            variant="displayXL"
            style={{
              fontSize: 80,
            }}
          >
            {profile?.face || "🤠"}
          </Txt>
          <View style={{ position: "absolute", bottom: 0, right: 0 }}>
            <CameraButton
              onImagePicked={handleImagePicked}
              size="small"
              disabled={uploading}
              icon={uploading ? "loading" : "camera"}
            />
          </View>
        </View>
        <Txt variant="displayL" center>
          {profile?.title || "OUTLAW"}
        </Txt>
        <Txt variant="headlineM" color={color.text.secondary} center style={{ marginTop: space[2] }}>
          @{profile?.handle}
        </Txt>
      </Card>

      {/* Stats */}
      <View style={{ flexDirection: "row", gap: space[4], marginBottom: space[6] }}>
        <Card
          style={{
            flex: 1,
            backgroundColor: color.surface.raised,
            paddingVertical: space[4],
            paddingHorizontal: space[3],
            alignItems: "center",
          }}
        >
          <Txt variant="numericL" color={color.action.primary}>
            {profile?.coins ?? 0}
          </Txt>
          <Txt variant="bodyS" color={color.text.secondary} style={{ marginTop: space[1] }}>
            Coins
          </Txt>
        </Card>
        <Card
          style={{
            flex: 1,
            backgroundColor: color.surface.raised,
            paddingVertical: space[4],
            paddingHorizontal: space[3],
            alignItems: "center",
          }}
        >
          <Txt variant="numericL" color={color.action.primary}>
            {formatCents(profile?.balance_cents ?? 0)}
          </Txt>
          <Txt variant="bodyS" color={color.text.secondary} style={{ marginTop: space[1] }}>
            Balance
          </Txt>
        </Card>
      </View>

      {/* Character Info */}
      <Card
        style={{
          backgroundColor: color.surface.card,
          paddingVertical: space[4],
          paddingHorizontal: space[4],
          marginBottom: space[6],
        }}
      >
        <View style={{ marginBottom: space[3] }}>
          <Txt variant="bodyS" color={color.text.secondary}>
            FATE
          </Txt>
          <Txt variant="headlineM" style={{ marginTop: space[1], textTransform: "uppercase" }}>
            {profile?.fate === "lord" ? "MONARCH" : "DRIFTER"}
          </Txt>
        </View>

        <View style={{ marginBottom: space[3] }}>
          <Txt variant="bodyS" color={color.text.secondary}>
            HAT
          </Txt>
          <Txt variant="headlineM" style={{ marginTop: space[1], textTransform: "capitalize" }}>
            {profile?.hat}
          </Txt>
        </View>

        <View>
          <Txt variant="bodyS" color={color.text.secondary}>
            JOINED
          </Txt>
          <Txt variant="headlineM" style={{ marginTop: space[1] }}>
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : "Not yet"}
          </Txt>
        </View>
      </Card>

      {/* Actions */}
      <Button
        onPress={handleSignOut}
        variant="secondary"
        size="large"
      >
        Ride Off
      </Button>
    </Screen>
  )
}
