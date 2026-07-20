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
          borderTopWidth: 1,
          height: 84,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontFamily: font.headlineSemi, fontSize: 11 },
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
        name="wallet"
        options={{
          title: "Tin Cup",
          tabBarIcon: ({ color: c, size }) => <MaterialCommunityIcons name="cup" size={size} color={c} />,
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
