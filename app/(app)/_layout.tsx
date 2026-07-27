import { Tabs } from "expo-router"
import { color } from "@/theme/tokens"
import { GulchTabBar } from "@/components/ui/GulchTabBar"

/** Make tabs: Main St · Feed · Lobbies · Poster */
export default function AppTabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <GulchTabBar state={props.state} navigation={props.navigation} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: color.bg.canvas },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Main St" }} />
      <Tabs.Screen name="feed" options={{ title: "Feed" }} />
      <Tabs.Screen name="lobbies" options={{ title: "Lobbies" }} />
      <Tabs.Screen name="profile" options={{ title: "Poster" }} />
      <Tabs.Screen name="compose" options={{ href: null }} />
      <Tabs.Screen name="wallet" options={{ href: null }} />
      <Tabs.Screen name="deposit" options={{ href: null }} />
      <Tabs.Screen name="cash-out" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="discover" options={{ href: null }} />
      <Tabs.Screen name="leaderboard" options={{ href: null }} />
      <Tabs.Screen name="live-stream" options={{ href: null }} />
      <Tabs.Screen name="ascension" options={{ href: null }} />
      <Tabs.Screen name="ponr" options={{ href: null }} />
      <Tabs.Screen name="coronation" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  )
}
