import { useState, useEffect } from "react"
import { View, ScrollView, FlatList, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Card } from "@/components/ui/Card"
import { LoadingState } from "@/components/ui/LoadingState"
import { supabase } from "@/lib/supabase"
import { logError, getUserErrorMessage } from "@/lib/errors"
import { color, space } from "@/theme/tokens"
import { formatCents } from "@/lib/format"

interface LeaderboardEntry {
  id: string
  display_name?: string
  handle: string
  face: string
  stat: number
  title?: string
}

export default function LeaderboardScreen() {
  const router = useRouter()
  const [tab, setTab] = useState<"givers" | "beggars" | "lords">("givers")
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadLeaderboard()

    // Subscribe to real-time updates
    let subscription: any
    if (tab === "givers") {
      subscription = supabase
        .channel(`gifts_${tab}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "gifts" }, () => {
          loadLeaderboard()
        })
        .subscribe()
    } else if (tab === "beggars") {
      subscription = supabase
        .channel(`begs_${tab}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "begs" }, () => {
          loadLeaderboard()
        })
        .subscribe()
    } else if (tab === "lords") {
      subscription = supabase
        .channel(`profiles_${tab}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
          loadLeaderboard()
        })
        .subscribe()
    }

    return () => {
      if (subscription) subscription.unsubscribe()
    }
  }, [tab])

  const loadLeaderboard = async () => {
    setLoading(true)
    setError("")

    try {
      if (tab === "givers") {
        // Top gift senders (by total amount gifted)
        const { data: gifts, error: err } = await supabase
          .from("gifts")
          .select("sender_id, amount_cents")
          .order("created_at", { ascending: false })

        if (err) throw err

        // Aggregate by sender
        const senderTotals = new Map<string, number>()
        gifts?.forEach((gift) => {
          const current = senderTotals.get(gift.sender_id) || 0
          senderTotals.set(gift.sender_id, current + gift.amount_cents)
        })

        // Get top senders
        const topSenderIds = Array.from(senderTotals.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 20)
          .map(([id]) => id)

        if (topSenderIds.length === 0) {
          setData([])
          return
        }

        const { data: profiles, error: err2 } = await supabase
          .from("profiles")
          .select("id, display_name, handle, face")
          .in("id", topSenderIds)

        if (err2) throw err2

        const leaderboard = profiles?.map((p) => ({
          ...p,
          stat: senderTotals.get(p.id) || 0,
        })) as LeaderboardEntry[]

        setData(leaderboard || [])
      } else if (tab === "beggars") {
        // Top beg creators (by total raised)
        const { data: begs, error: err } = await supabase
          .from("begs")
          .select("author_id, raised_cents")
          .order("raised_cents", { ascending: false })
          .limit(20)

        if (err) throw err

        const authorIds = begs?.map((b) => b.author_id) || []
        if (authorIds.length === 0) {
          setData([])
          return
        }

        const { data: profiles, error: err2 } = await supabase
          .from("profiles")
          .select("id, display_name, handle, face")
          .in("id", authorIds)

        if (err2) throw err2

        const leaderboard = profiles?.map((p) => {
          const beg = begs?.find((b) => b.author_id === p.id)
          return {
            ...p,
            stat: beg?.raised_cents || 0,
          }
        }) as LeaderboardEntry[]

        setData(leaderboard || [])
      } else {
        // Most lords
        const { data: lords, error: err } = await supabase
          .from("profiles")
          .select("id, display_name, handle, face, is_lord")
          .eq("is_lord", true)
          .order("created_at", { ascending: false })
          .limit(20)

        if (err) throw err

        const leaderboard = lords?.map((p) => ({
          ...p,
          stat: 1, // Just a marker
        })) as LeaderboardEntry[]

        setData(leaderboard || [])
      }
    } catch (e: any) {
      logError(`loadLeaderboard-${tab}`, e)
      setError(getUserErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  const getTabLabel = () => {
    switch (tab) {
      case "givers":
        return "TOP GIVERS"
      case "beggars":
        return "TOP BEGGARS"
      case "lords":
        return "MONARCHS"
    }
  }

  const getStatLabel = () => {
    switch (tab) {
      case "givers":
        return "Total Gifted"
      case "beggars":
        return "Total Raised"
      case "lords":
        return "Member"
    }
  }

  const getStatValue = (entry: LeaderboardEntry, index: number) => {
    if (tab === "lords") {
      return "👑"
    }
    return formatCents(entry.stat)
  }

  return (
    <Screen scroll edges={["bottom"]} contentStyle={{ paddingHorizontal: space[6] }}>
      <LoadingState visible={loading} message={`Loading ${getTabLabel()}...`} />

      <View style={{ paddingVertical: space[8] }}>
        <Txt variant="displayL" center>
          LEADERBOARDS
        </Txt>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: "row", gap: space[2], marginBottom: space[6] }}>
        {(["givers", "beggars", "lords"] as const).map((t) => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={{
              flex: 1,
              paddingVertical: space[3],
              borderRadius: 8,
              backgroundColor: tab === t ? color.action.primary : color.surface.card,
              alignItems: "center",
            }}
          >
            <Txt
              variant="bodyS"
              color={tab === t ? color.text.inverse : color.text.secondary}
            >
              {t === "givers" ? "Givers" : t === "beggars" ? "Beggars" : "Lords"}
            </Txt>
          </Pressable>
        ))}
      </View>

      {error && (
        <Card
          style={{
            backgroundColor: color.action.danger,
            padding: space[3],
            marginBottom: space[4],
          }}
        >
          <Txt variant="bodyS" color={color.text.inverse}>
            {error}
          </Txt>
        </Card>
      )}

      {data.length === 0 && !loading && (
        <Card style={{ padding: space[6], alignItems: "center" }}>
          <Txt variant="bodyM" color={color.text.secondary} center>
            No entries yet
          </Txt>
        </Card>
      )}

      {/* Leaderboard List */}
      <FlatList
        scrollEnabled={false}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`/profile/${item.id}`)}
            style={{ marginBottom: space[3] }}
          >
            <Card
              style={{
                padding: space[3],
                flexDirection: "row",
                alignItems: "center",
                backgroundColor:
                  index === 0
                    ? "rgba(245, 179, 43, 0.1)" // Gold
                    : index === 1
                      ? "rgba(200, 200, 200, 0.1)" // Silver
                      : index === 2
                        ? "rgba(205, 127, 50, 0.1)" // Bronze
                        : color.surface.raised,
              }}
            >
              {/* Rank Badge */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor:
                    index === 0
                      ? "#F5B32B"
                      : index === 1
                        ? "#C8C8C8"
                        : index === 2
                          ? "#CD7F32"
                          : color.surface.card,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: space[4],
                }}
              >
                <Txt
                  variant="headlineS"
                  color={index < 3 ? color.text.inverse : color.text.primary}
                >
                  {index + 1}
                </Txt>
              </View>

              {/* User Info */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: space[1] }}>
                  <Txt variant="headlineM">{item.face}</Txt>
                  <Txt variant="bodyM" style={{ marginLeft: space[2] }}>
                    {item.display_name || item.handle}
                  </Txt>
                </View>
                <Txt variant="bodyS" color={color.text.secondary}>
                  @{item.handle}
                </Txt>
              </View>

              {/* Stat */}
              <View style={{ alignItems: "flex-end" }}>
                <Txt variant="headlineS" color={color.action.primary}>
                  {getStatValue(item, index)}
                </Txt>
                <Txt variant="bodyS" color={color.text.secondary}>
                  {getStatLabel()}
                </Txt>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  )
}
