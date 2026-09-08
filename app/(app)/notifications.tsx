import { View, ScrollView, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { NOTIFICATIONS } from "@/lib/make-data"
import { color, font, primitive } from "@/theme/tokens"

/** S22 Notifications — Make NotificationsScreen */
export default function NotificationsScreen() {
  const router = useRouter()

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar
          title="Notifications"
          overline="TOWN CRIER"
          onBack={() => router.back()}
        />
        {(["Money", "Town", "The Law"] as const).map((group) => {
          const rows = NOTIFICATIONS.filter((n) => n.group === group)
          if (!rows.length) return null
          const groupColor =
            group === "Money"
              ? color.action.primary
              : group === "The Law"
                ? primitive.oxblood[400]
                : color.text.tertiary
          return (
            <View key={group} style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
              <Txt style={[styles.groupLabel, { color: groupColor }]}>{group}</Txt>
              {rows.map((n) => (
                <Pressable
                  key={n.id}
                  onPress={n.coins ? () => router.push("/(app)/wallet") : undefined}
                  style={styles.row}
                >
                  <Txt style={{ fontSize: 22 }}>{n.icon}</Txt>
                  <View style={{ flex: 1 }}>
                    <Txt style={styles.title}>{n.title}</Txt>
                    <Txt style={styles.sub}>{n.sub}</Txt>
                    <View style={styles.meta}>
                      <Txt style={styles.time}>{n.time}</Txt>
                      {n.coins ? (
                        <Txt
                          style={{
                            fontFamily: font.mono,
                            fontSize: 12,
                            color: n.coins.startsWith("+")
                              ? color.money.positive
                              : color.text.tertiary,
                          }}
                        >
                          {n.coins}
                        </Txt>
                      ) : null}
                    </View>
                  </View>
                  {n.coins ? (
                    <Txt style={{ color: color.text.tertiary, alignSelf: "center", fontSize: 12 }}>
                      →
                    </Txt>
                  ) : null}
                </Pressable>
              ))}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  groupLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  title: {
    fontFamily: font.body,
    fontSize: 13,
    color: color.text.primary,
    lineHeight: 18,
    marginBottom: 3,
  },
  sub: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.text.secondary,
    lineHeight: 17,
    marginBottom: 5,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 8 },
  time: { fontFamily: font.body, fontSize: 10, color: color.text.tertiary },
})
