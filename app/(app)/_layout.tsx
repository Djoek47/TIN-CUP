import { Tabs } from "expo-router"
import { color } from "@/theme/tokens"
import { GulchTabBar } from "@/components/ui/GulchTabBar"

export default function AppTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => (
        <GulchTabBar state={props.state} navigation={props.navigation} />
      )}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: color.bg.canvas },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Main St" }} />
      <Tabs.Screen name="search" options={{ title: "Feed" }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Lobby" }} />
      <Tabs.Screen name="profile" options={{ title: "Poster" }} />
      {/* Accessed via center orb / top bar — hidden from pill (Figma Make nav) */}
      <Tabs.Screen name="compose" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  )
}
