import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { useRouter, type Href } from "expo-router"
import { useApp } from "@/providers/AppState"
import { getSession } from "@/lib/auth"
import { color } from "@/theme/vessel"

/** OAuth deep-link landing — hydrate session then continue onboarding/app. */
export default function AuthCallback() {
  const router = useRouter()
  const { hydrateFromAuth, say } = useApp()

  useEffect(() => {
    ;(async () => {
      try {
        const session = await getSession()
        if (!session) {
          say("Sign-in incomplete")
          router.replace("/(auth)/sign-in" as Href)
          return
        }
        await hydrateFromAuth()
        router.replace("/(onboarding)/choose-fate" as Href)
      } catch {
        router.replace("/(auth)/sign-in" as Href)
      }
    })()
  }, [hydrateFromAuth, router, say])

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: color.bg.canvas }}>
      <ActivityIndicator color="#FFB43D" />
    </View>
  )
}
