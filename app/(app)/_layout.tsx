import { Tabs } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { color, font } from "@/theme/tokens"

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.action.primary,
        tabBarInactiveTintColor: color.text.tertiary,
        tabBarStyle: {
          backgroundColor: "rgba(18, 22, 31, 0.94)",
          borderTopColor: color.border.subtle,
          borderTopWidth: 1,
          height: 88,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontFamily: font.headlineSemi,
          fontSize: 10,
          letterSpacing: 0.4,
          textTransform: "uppercase",
        },
        sceneStyle: { backgroundColor: color.bg.canvas },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Main St",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="home-variant" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Find",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="magnify" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Top Dogs",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="crown" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Tin Cup",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="cup" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="compose"
        options={{
          title: "POST",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="plus" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Saloon",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="bell-ring-outline" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="account-circle-outline" size={size} color={c} />,
        }}
      />
    </Tabs>
  )
}
