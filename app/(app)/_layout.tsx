import { useEffect } from "react"
import { Tabs, useRouter } from "expo-router"
import { vesselColors } from "@/theme/vessel"
import { useApp } from "@/providers/AppState"
import { demoAuthAllowed } from "@/lib/auth"

/** Vessel tabs — require session (auth or demo) for money/live surfaces. */
export default function AppTabsLayout() {
  const bg = vesselColors("vagrant", "dark").bg
  const { ready, user, authUserId } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    const signedIn = Boolean(user.address || authUserId)
    if (!signedIn) {
      router.replace("/(auth)/welcome")
    }
  }, [ready, user.address, authUserId, router])

  // Keep demo QA paths working without blocking paint
  void demoAuthAllowed

  return (
    <Tabs
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="live" options={{ title: "Live" }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet" }} />
      <Tabs.Screen name="profile" options={{ title: "You" }} />

      <Tabs.Screen name="send" options={{ href: null }} />
      <Tabs.Screen name="arena" options={{ href: null }} />
      <Tabs.Screen name="golive" options={{ href: null }} />
      <Tabs.Screen name="broadcast" options={{ href: null }} />
      <Tabs.Screen name="cash-out" options={{ href: null }} />
      <Tabs.Screen name="activity" options={{ href: null }} />
      <Tabs.Screen name="received" options={{ href: null }} />
      <Tabs.Screen name="level" options={{ href: null }} />
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="deposit" options={{ href: null }} />
      <Tabs.Screen name="compose" options={{ href: null }} />
      <Tabs.Screen name="discover" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="ascension" options={{ href: null }} />
      <Tabs.Screen name="ponr" options={{ href: null }} />
      <Tabs.Screen name="coronation" options={{ href: null }} />

      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="lobbies" options={{ href: null }} />
      <Tabs.Screen name="live-stream" options={{ href: null }} />
    </Tabs>
  )
}
