import { View } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { color, space } from "@/theme/tokens"
import { formatCents } from "@/lib/format"

export default function ProfileScreen() {
  const router = useRouter()
  const { profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.replace("/(auth)/sign-in")
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
        <Txt
          variant="displayXL"
          style={{
            fontSize: 80,
            marginBottom: space[4],
          }}
        >
          {profile?.face || "🤠"}
        </Txt>
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
