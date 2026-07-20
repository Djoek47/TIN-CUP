import { useEffect, useState } from "react"
import { Platform, Alert, Pressable, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as AppleAuthentication from "expo-apple-authentication"
import { supabase } from "../lib/supabase"
import { colors, fonts, radius, spacing } from "../theme"

export function AppleButton() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    if (Platform.OS === "ios") {
      AppleAuthentication.isAvailableAsync().then(setAvailable).catch(() => setAvailable(false))
    }
  }, [])

  const handlePress = async () => {
    if (!available) {
      Alert.alert(
        "Sign in with Apple",
        "Apple Sign In runs on a real iPhone with a development build. For now, continue with email to test Fanissima.",
      )
      return
    }
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: credential.identityToken,
        })
        if (error) Alert.alert("Sign in failed", error.message)
      }
    } catch (e: any) {
      if (e?.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("Sign in failed", e?.message ?? "Please try again.")
      }
    }
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.btn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
    >
      <Ionicons name="logo-apple" size={19} color={colors.black} style={{ marginTop: -2 }} />
      <Text style={styles.label}>Continue with Apple</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: colors.black,
  },
})
