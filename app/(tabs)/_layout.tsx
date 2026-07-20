import { Tabs } from "expo-router"
import { View, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Text } from "../../components/ui"
import { colors, fonts } from "../../theme"

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  index: { on: "home", off: "home-outline" },
  explore: { on: "compass", off: "compass-outline" },
  live: { on: "radio", off: "radio-outline" },
  me: { on: "person", off: "person-outline" },
}

const LABELS: Record<string, string> = {
  index: "Home",
  explore: "Explore",
  live: "Live",
  me: "Me",
}

function TabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || 10 }]}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index
        const icon = ICONS[route.name]
        if (!icon) return null
        return (
          <Pressable
            key={route.key}
            style={styles.tab}
            onPress={() => {
              const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true })
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name)
            }}
          >
            <Ionicons
              name={focused ? icon.on : icon.off}
              size={23}
              color={focused ? colors.pink : colors.textFaint}
            />
            <Text
              style={{
                fontFamily: focused ? fonts.sansBold : fonts.sansMedium,
                fontSize: 10.5,
                color: focused ? colors.pink : colors.textFaint,
              }}
            >
              {LABELS[route.name]}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="live" />
      <Tabs.Screen name="me" />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
})
