import { View, Pressable, StyleSheet, Platform } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { color, space } from "@/theme/tokens"
import { glass } from "@/theme/glass"
import { useAuth } from "@/providers/AuthProvider"

type TabRoute = { key: string; name: string }
type TabNavState = { index: number; routes: TabRoute[] }
type GulchTabBarProps = {
  state: TabNavState
  navigation: { navigate: (name: string) => void }
}

const TAB_META: Record<
  string,
  { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }
> = {
  index: { label: "Main St", icon: "star-circle" },
  search: { label: "Feed", icon: "movie-open" },
  leaderboard: { label: "Lobby", icon: "door-open" },
  profile: { label: "Poster", icon: "card-account-details-outline" },
}

const VISIBLE = ["index", "search", "leaderboard", "profile"] as const

/** Floating glass pill nav from Figma Make Tin-Cup-V2 */
export function GulchTabBar({ state, navigation }: GulchTabBarProps) {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const { profile } = useAuth()
  const isLord = Boolean(profile?.is_lord)

  const routes = state.routes.filter((r) =>
    (VISIBLE as readonly string[]).includes(r.name),
  )

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={[styles.pill, glass.nav]}>
        {routes.slice(0, 2).map((route) => {
          const focused = state.index === state.routes.findIndex((r) => r.key === route.key)
          const meta = TAB_META[route.name] ?? { label: route.name, icon: "circle" as const }
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <MaterialCommunityIcons
                name={meta.icon}
                size={22}
                color={focused ? color.action.primary : color.text.tertiary}
              />
              {focused ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
            </Pressable>
          )
        })}

        <Pressable
          onPress={() => router.push("/(app)/compose")}
          style={styles.orb}
          accessibilityLabel="Post"
        >
          <MaterialCommunityIcons
            name={isLord ? "flash" : "cup"}
            size={26}
            color={color.text.inverse}
          />
        </Pressable>

        {routes.slice(2).map((route) => {
          const focused = state.index === state.routes.findIndex((r) => r.key === route.key)
          const meta = TAB_META[route.name] ?? { label: route.name, icon: "circle" as const }
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
            >
              <MaterialCommunityIcons
                name={meta.icon}
                size={22}
                color={focused ? color.action.primary : color.text.tertiary}
              />
              {focused ? <View style={styles.dot} /> : <View style={styles.dotSpacer} />}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 0,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space[4],
    paddingVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 16 },
      default: {},
    }),
  },
  tab: {
    minWidth: 48,
    alignItems: "center",
    gap: 3,
    paddingVertical: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: color.action.primary,
  },
  dotSpacer: { width: 4, height: 4 },
  orb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.action.primaryHover,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderTopColor: "rgba(255,255,255,0.4)",
    ...Platform.select({
      ios: {
        shadowColor: color.action.primary,
        shadowOpacity: 0.45,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 10 },
      default: {},
    }),
  },
})
