import { useState } from "react"
import { View, ScrollView, Switch, Pressable, Alert } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Field } from "@/components/ui/Field"
import { LoadingState } from "@/components/ui/LoadingState"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { validateHandle } from "@/lib/validation"
import { logError, getUserErrorMessage } from "@/lib/errors"
import { color, space } from "@/theme/tokens"

export default function SettingsScreen() {
  const router = useRouter()
  const { profile, signOut, refreshProfile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [privateProfile, setPrivateProfile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [handleError, setHandleError] = useState("")

  const handleSaveProfile = async () => {
    if (!profile?.id) return

    setSaving(true)
    setError("")

    try {
      const { error: err } = await supabase
        .from("profiles")
        .update({
          display_name: displayName || profile.handle,
        })
        .eq("id", profile.id)

      if (err) throw err

      await refreshProfile()
      Alert.alert("Success", "Profile updated")
    } catch (e: any) {
      logError("saveProfile", e)
      setError(getUserErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const handleChangeNotifications = (value: boolean) => {
    setNotificationsEnabled(value)
    // TODO: Save to user preferences
  }

  const handleChangePrivacy = (value: boolean) => {
    setPrivateProfile(value)
    // TODO: Save to user preferences
  }

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to disconnect your wallet?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async () => {
          setLoading(true)
          try {
            await signOut()
            router.replace("/(auth)/welcome")
          } catch (e: any) {
            logError("signOut", e)
            Alert.alert("Error", "Failed to sign out")
          } finally {
            setLoading(false)
          }
        },
        style: "destructive",
      },
    ])
  }

  return (
    <Screen scroll edges={["bottom"]} contentStyle={{ paddingHorizontal: space[6] }}>
      <LoadingState visible={loading} message="Signing out..." />

      <View style={{ paddingVertical: space[8] }}>
        <Txt variant="displayL" center>
          SETTINGS
        </Txt>
      </View>

      {/* Profile Section */}
      <Card style={{ marginBottom: space[6], padding: space[4] }}>
        <Txt variant="headlineM" style={{ marginBottom: space[4] }}>
          PROFILE
        </Txt>

        <Field
          label="DISPLAY NAME"
          placeholder="Enter your name"
          value={displayName}
          onChangeText={setDisplayName}
          style={{ marginBottom: space[4] }}
        />

        <Card
          style={{
            backgroundColor: color.surface.card,
            padding: space[3],
            marginBottom: space[4],
          }}
        >
          <Txt variant="bodyS" color={color.text.secondary}>
            Handle: @{profile?.handle}
          </Txt>
          <Txt variant="bodyS" color={color.text.secondary} style={{ marginTop: space[1] }}>
            Wallet: {profile?.id?.slice(0, 10)}...{profile?.id?.slice(-8)}
          </Txt>
        </Card>

        {error && (
          <Card
            style={{
              backgroundColor: color.action.danger,
              padding: space[3],
              marginBottom: space[4],
            }}
          >
            <Txt variant="bodyS" color={color.text.inverse}>
              {error}
            </Txt>
          </Card>
        )}

        <Button
          title="Save Changes"
          onPress={handleSaveProfile}
          loading={saving}
          size="small"
        />
      </Card>

      {/* Notifications Section */}
      <Card style={{ marginBottom: space[6], padding: space[4] }}>
        <Txt variant="headlineM" style={{ marginBottom: space[4] }}>
          NOTIFICATIONS
        </Txt>

        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: space[3],
          }}
        >
          <Txt variant="bodyM">Receive notifications</Txt>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleChangeNotifications}
            trackColor={{ false: color.surface.card, true: color.action.primary }}
          />
        </Pressable>

        <Txt variant="bodyS" color={color.text.secondary}>
          Get alerts for gifts, payments, and updates
        </Txt>
      </Card>

      {/* Privacy Section */}
      <Card style={{ marginBottom: space[6], padding: space[4] }}>
        <Txt variant="headlineM" style={{ marginBottom: space[4] }}>
          PRIVACY
        </Txt>

        <Pressable
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: space[3],
          }}
        >
          <Txt variant="bodyM">Private profile</Txt>
          <Switch
            value={privateProfile}
            onValueChange={handleChangePrivacy}
            trackColor={{ false: color.surface.card, true: color.action.primary }}
          />
        </Pressable>

        <Txt variant="bodyS" color={color.text.secondary}>
          Hide your profile from public leaderboards
        </Txt>
      </Card>

      {/* Danger Zone */}
      <Card
        style={{
          marginBottom: space[8],
          padding: space[4],
          borderColor: color.action.danger,
          borderWidth: 1,
        }}
      >
        <Txt variant="headlineM" style={{ marginBottom: space[4], color: color.action.danger }}>
          DANGER ZONE
        </Txt>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="danger"
          size="small"
        />

        <Txt variant="bodyS" color={color.text.secondary} style={{ marginTop: space[3] }}>
          Disconnect your wallet and return to login
        </Txt>
      </Card>
    </Screen>
  )
}
