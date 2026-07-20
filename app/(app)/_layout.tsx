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
          backgroundColor: color.bg.surface,
          borderTopColor: color.border.subtle,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: font.headlineSemi, fontSize: 11 },
        sceneStyle: { backgroundColor: color.bg.canvas },
      }}
    >
      <Tabs.Screen
        name="main-street"
        options={{
          title: "Main St",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="home-variant" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="madness"
        options={{
          title: "Madness",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="cards-playing-outline" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="lobbies"
        options={{
          title: "Lobbies",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="door-sliding" size={size} color={c} />,
        }}
      />
      <Tabs.Screen
        name="poster"
        options={{
          title: "Poster",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="account-box-outline" size={size} color={c} />,
        }}
      />
    </Tabs>
  )
}
