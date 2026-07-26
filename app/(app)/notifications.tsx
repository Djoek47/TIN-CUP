import { useEffect, useState } from "react"
import { View, Pressable, FlatList } from "react-native"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space } from "@/theme/tokens"
import { Notification } from "@/lib/types"
import { formatRelativeTime } from "@/lib/format"

export default function NotificationsScreen() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadNotifications = async () => {
      if (!profile?.id) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
      setLoading(false)
    }

    loadNotifications()

    // Subscribe to new notifications
    const subscription = supabase
      .channel(`notifications:${profile?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${profile?.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [profile?.id])

  const handleMarkRead = async (notifId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notifId)

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const handleMarkAllRead = async () => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", profile?.id)

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
    }
  }

  const getIcon = (kind: string) => {
    const icons: Record<string, string> = {
      gift: "🎁",
      deposit: "💰",
      cashout: "💸",
      system: "📢",
      streak: "🔥",
    }
    return icons[kind] || "📢"
  }

  return (
    <Screen padded edges={["top"]}>
      <View style={{ marginBottom: space[6] }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Txt variant="displayL">SALOON</Txt>
          {unreadCount > 0 && (
            <View
              style={{
                backgroundColor: color.action.primary,
                paddingHorizontal: space[2],
                paddingVertical: space[1],
                borderRadius: 20,
              }}
            >
              <Txt variant="buttonM" color={color.text.inverse}>
                {unreadCount} new
              </Txt>
            </View>
          )}
        </View>
        <Txt variant="bodyM" color={color.text.secondary} style={{ marginTop: space[2] }}>
          Gossip from the gulch
        </Txt>
      </View>

      {unreadCount > 0 && (
        <Button
          title="Mark all as read"
          variant="secondary"
          size="md"
          onPress={handleMarkAllRead}
          style={{ marginBottom: space[4] }}
        />
      )}

      {loading ? (
        <Txt variant="bodyM" color={color.text.secondary}>
          Loading notifications...
        </Txt>
      ) : notifications.length === 0 ? (
        <Card
          style={{
            backgroundColor: color.surface.raised,
            paddingVertical: space[8],
            paddingHorizontal: space[4],
            alignItems: "center",
          }}
        >
          <Txt variant="displayXL" style={{ fontSize: 48, marginBottom: space[4] }}>
            🦗
          </Txt>
          <Txt variant="headlineM" center>
            Quiet in the Saloon
          </Txt>
          <Txt variant="bodyS" color={color.text.secondary} center style={{ marginTop: space[2] }}>
            No news yet. Keep an eye out for gossip.
          </Txt>
        </Card>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Pressable onPress={() => !item.read && handleMarkRead(item.id)}>
              <Card
                style={{
                  marginBottom: space[3],
                  paddingVertical: space[4],
                  paddingHorizontal: space[4],
                  backgroundColor: item.read ? color.surface.idle : color.surface.raised,
                  opacity: item.read ? 0.6 : 1,
                }}
              >
                <View style={{ flexDirection: "row", gap: space[3] }}>
                  <Txt
                    variant="displayXL"
                    style={{
                      fontSize: 32,
                    }}
                  >
                    {getIcon(item.kind)}
                  </Txt>
                  <View style={{ flex: 1 }}>
                    <Txt variant="headlineM" numberOfLines={1}>
                      {item.title}
                    </Txt>
                    {item.body && (
                      <Txt
                        variant="bodyS"
                        color={color.text.secondary}
                        numberOfLines={2}
                        style={{ marginTop: space[1] }}
                      >
                        {item.body}
                      </Txt>
                    )}
                    <Txt
                      variant="bodyS"
                      color={color.text.tertiary}
                      style={{ marginTop: space[2] }}
                    >
                      {formatRelativeTime(item.created_at)}
                    </Txt>
                  </View>
                  {!item.read && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: color.action.primary,
                        marginTop: space[1],
                      }}
                    />
                  )}
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  )
}
