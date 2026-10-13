import { useCallback, useState } from "react"
import { View, ScrollView, Pressable, StyleSheet, RefreshControl } from "react-native"
import { useFocusEffect, useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  Label,
  UiText,
  Hairline,
  Row,
  MonoNum,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fetchNotifications } from "@/lib/sync"
import { space } from "@/theme/vessel"

type RowT = {
  id: string
  kind: string
  title: string
  body: string
  created_at: string
}

export default function NotificationsScreen() {
  const router = useRouter()
  const { v } = useVessel()
  const { user, ledger } = useApp()
  const [rows, setRows] = useState<RowT[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    if (!user.address) {
      // Fall back to local ledger-derived feed
      setRows(
        ledger.slice(0, 20).map((e) => ({
          id: e.id,
          kind: e.kind,
          title: e.dir === "in" ? "Gold in" : "Gold out",
          body: `${e.who} · ${e.escrow_status}`,
          created_at: new Date(e.ts).toISOString(),
        })),
      )
      return
    }
    const data = await fetchNotifications(user.address)
    if (data.length) {
      setRows(
        data.map((n: any) => ({
          id: String(n.id),
          kind: n.kind,
          title: n.title || n.kind,
          body: n.body || "",
          created_at: n.created_at,
        })),
      )
    } else {
      setRows(
        ledger.slice(0, 20).map((e) => ({
          id: e.id,
          kind: e.kind,
          title: e.dir === "in" ? "Gold in" : "Gold out",
          body: `${e.who} · ${e.escrow_status}`,
          created_at: new Date(e.ts).toISOString(),
        })),
      )
    }
  }, [ledger, user.address])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load]),
  )

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  return (
    <VesselScreen nav={false}>
      <ScreenHeader title="Notifications" onBack={() => router.back()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={v.amb} />}
      >
        {!rows.length ? (
          <Label style={{ marginTop: 40, textAlign: "center", color: v.dim }}>
            No notifications yet
          </Label>
        ) : (
          rows.map((n) => (
            <View key={n.id}>
              <Hairline />
              <Pressable
                onPress={() => {
                  if (
                    n.kind === "deposit" ||
                    n.kind === "cashout" ||
                    n.kind === "gift" ||
                    n.kind === "bounty"
                  ) {
                    router.push("/(app)/wallet")
                  } else if (n.kind === "challenge") {
                    router.push("/(app)/arena")
                  } else if (n.kind === "system") {
                    router.push("/(app)/settings")
                  }
                }}
                style={styles.row}
              >
                <View style={{ flex: 1 }}>
                  <UiText weight="semi" style={{ fontSize: 14 }}>
                    {n.title}
                  </UiText>
                  <Label style={{ marginTop: 4 }}>{n.body}</Label>
                  <Label style={{ marginTop: 6, color: v.faint }}>
                    {new Date(n.created_at).toLocaleString()}
                  </Label>
                </View>
                <MonoNum style={{ fontSize: 11, color: v.amb }}>{n.kind.toUpperCase()}</MonoNum>
              </Pressable>
            </View>
          ))
        )}
        <Row style={{ height: space.sectionGap }} />
      </ScrollView>
    </VesselScreen>
  )
}

const styles = StyleSheet.create({
  row: { paddingVertical: space.rowPad, flexDirection: "row", alignItems: "center", gap: 12 },
})
