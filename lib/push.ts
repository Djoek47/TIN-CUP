/**
 * Expo push token registration — stores token on profiles.push_token.
 */
import { Platform } from "react-native"
import * as Device from "expo-device"
import * as Notifications from "expo-notifications"
import Constants from "expo-constants"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function registerPushToken(userId: string | null): Promise<string | null> {
  if (!userId || !isSupabaseConfigured) return null
  if (!Device.isDevice) return null
  if (Platform.OS === "web") return null

  const { status: existing } = await Notifications.getPermissionsAsync()
  let finalStatus = existing
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }
  if (finalStatus !== "granted") return null

  const projectId =
    Constants.easConfig?.projectId ||
    (Constants.expoConfig?.extra as any)?.eas?.projectId ||
    undefined

  const token = (
    await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined)
  ).data

  await supabase
    .from("profiles")
    .update({ push_token: token, updated_at: new Date().toISOString() })
    .eq("id", userId.toLowerCase())

  return token
}

export async function sendExpoPush(params: {
  to: string
  title: string
  body: string
  data?: Record<string, unknown>
}) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: params.to,
      title: params.title,
      body: params.body,
      data: params.data ?? {},
      sound: "default",
    }),
  })
}
