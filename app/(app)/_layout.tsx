import { Tabs } from "expo-router"
import { vesselColors } from "@/theme/vessel"

/** Vessel tabs — BottomNav lives in VesselScreen; hide default tab bar. */
export default function AppTabsLayout() {
  const bg = vesselColors("vagrant", "dark").bg
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

      {/* Legacy routes kept reachable but out of nav */}
      <Tabs.Screen name="feed" options={{ href: null }} />
      <Tabs.Screen name="lobbies" options={{ href: null }} />
      <Tabs.Screen name="live-stream" options={{ href: null }} />
    </Tabs>
  )
}
