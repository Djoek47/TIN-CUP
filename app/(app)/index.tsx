import { useEffect, useState } from "react"
import { View, ScrollView, Pressable, FlatList } from "react-native"
import { useRouter } from "expo-router"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { color, space } from "@/theme/tokens"
import { Beg, Profile } from "@/lib/types"
import { formatCents } from "@/lib/format"

export default function MainStreetScreen() {
  const router = useRouter()
  const { profile } = useAuth()
  const [begs, setBegs] = useState<(Beg & { author: Profile })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBegs = async () => {
      const { data, error } = await supabase
        .from("begs")
        .select("*, author:author_id(display_name, title, face, hat)")
        .order("created_at", { ascending: false })
        .limit(20)

      if (!error && data) {
        setBegs(data as any)
      }
      setLoading(false)
    }

    loadBegs()
  }, [])

  const progressPercent = (beg: Beg) => {
    if (beg.goal_cents === 0) return 100
    return Math.min(100, Math.round((beg.raised_cents / beg.goal_cents) * 100))
  }

  return (
    <Screen scroll padded edges={["top"]}>
      {/* Header with Balance */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: space[6] }}>
        <Txt variant="displayL">MAIN STREET</Txt>
        <Pressable
          style={{
            backgroundColor: color.action.primary,
            paddingHorizontal: space[4],
            paddingVertical: space[2],
            borderRadius: 20,
          }}
          onPress={() => router.push("/(app)/wallet")}
        >
          <Txt variant="buttonM" color={color.text.inverse}>
            💰 {formatCents(profile?.balance_cents ?? 0)}
          </Txt>
        </Pressable>
      </View>

      {/* LIVE NOW Section */}
      <View style={{ marginBottom: space[6] }}>
        <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[3] }}>
          LIVE NOW 🔥
        </Txt>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEventThrottle={16}>
          {begs
            .filter((b) => b.status === "open")
            .slice(0, 5)
            .map((beg) => (
              <Pressable key={beg.id} onPress={() => router.push(`/gift/${beg.id}`)}>
                <Card
                  style={{
                    marginRight: space[3],
                    width: 160,
                    paddingVertical: space[4],
                    paddingHorizontal: space[3],
                    backgroundColor: color.surface.card,
                  }}
                >
                  <Txt variant="bodyS" center numberOfLines={2} style={{ marginBottom: space[2] }}>
                    {beg.title}
                  </Txt>
                  <View
                    style={{
                      backgroundColor: color.border.subtle,
                      height: 4,
                      borderRadius: 2,
                      overflow: "hidden",
                      marginBottom: space[2],
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: color.action.primary,
                        height: "100%",
                        width: `${progressPercent(beg)}%`,
                      }}
                    />
                  </View>
                  <Txt variant="bodyS" color={color.text.secondary} center>
                    {progressPercent(beg)}% funded
                  </Txt>
                </Card>
              </Pressable>
            ))}
        </ScrollView>
      </View>

      {/* TRENDING BEGS */}
      <View>
        <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[3] }}>
          TRENDING BEGS
        </Txt>
        {begs.map((beg) => (
          <Pressable key={beg.id} onPress={() => router.push(`/gift/${beg.id}`)}>
            <Card
              style={{
                marginBottom: space[3],
                paddingVertical: space[4],
                paddingHorizontal: space[4],
                backgroundColor: color.surface.card,
              }}
            >
              <View style={{ flexDirection: "row", gap: space[3] }}>
                <Txt variant="displayXL" style={{ fontSize: 36 }}>
                  {beg.author?.face || "🤠"}
                </Txt>
                <View style={{ flex: 1 }}>
                  <Txt variant="headlineM" numberOfLines={1}>
                    {beg.title}
                  </Txt>
                  <Txt variant="bodyS" color={color.text.secondary} numberOfLines={2} style={{ marginTop: space[1] }}>
                    {beg.author?.display_name}
                  </Txt>
                  <View
                    style={{
                      backgroundColor: color.border.subtle,
                      height: 4,
                      borderRadius: 2,
                      overflow: "hidden",
                      marginTop: space[2],
                      marginBottom: space[1],
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: color.action.primary,
                        height: "100%",
                        width: `${progressPercent(beg)}%`,
                      }}
                    />
                  </View>
                  <Txt variant="bodyS" color={color.text.secondary}>
                    {formatCents(beg.raised_cents)} raised • {beg.backers} backers
                  </Txt>
                </View>
              </View>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}
