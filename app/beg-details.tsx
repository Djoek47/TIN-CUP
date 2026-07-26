import { useState, useEffect } from "react"
import { View, ScrollView, Pressable, Animated, Easing, Alert, FlatList } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { BlurView } from "expo-blur"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ShareButton } from "@/components/ui/ShareButton"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"
import { shareBeg, copyBegLink } from "@/lib/share"
import { color, space } from "@/theme/tokens"
import { Beg, Profile } from "@/lib/types"
import { formatCents } from "@/lib/format"

export default function BegDetailsModal() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { profile } = useAuth()

  const [beg, setBeg] = useState<Beg | null>(null)
  const [author, setAuthor] = useState<Profile | null>(null)
  const [backers, setBackers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBegDetails()
  }, [id])

  const loadBegDetails = async () => {
    if (!id) return
    setLoading(true)

    try {
      // Load beg
      const { data: begData, error: begErr } = await supabase
        .from("begs")
        .select("*")
        .eq("id", id)
        .single()

      if (begErr) throw begErr
      setBeg(begData)

      // Load author
      if (begData?.author_id) {
        const { data: authorData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", begData.author_id)
          .single()

        setAuthor(authorData)
      }

      // Load backers (gifts)
      const { data: giftsData } = await supabase
        .from("gifts")
        .select("*, sender:profiles(id, display_name, handle, face)")
        .eq("beg_id", id)
        .order("created_at", { ascending: false })

      if (giftsData) setBackers(giftsData)
    } catch (e) {
      console.log("[v0] Load details error:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!beg?.id || !beg?.title) return
    await shareBeg(beg.title, beg.id)
  }

  const handleCopyLink = async () => {
    if (!beg?.id) return
    await copyBegLink(beg.id)
  }

  const handleGift = () => {
    if (!beg?.id) return
    router.push(`/gift/${beg.id}`)
  }

  const progressPercent = beg ? (beg.raised_cents / beg.goal_cents) * 100 : 0

  return (
    <Screen scroll edges={["bottom"]} contentStyle={{ paddingHorizontal: space[6] }}>
      {/* Header */}
      <View style={{ paddingVertical: space[6], flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Txt variant="displayL">{beg?.title}</Txt>
        <Pressable onPress={() => router.back()}>
          <Txt variant="headlineL" color={color.text.secondary}>✕</Txt>
        </Pressable>
      </View>

      {/* Progress */}
      {beg && (
        <Card style={{ marginBottom: space[6], padding: space[4] }}>
          <View style={{ marginBottom: space[3] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: space[2] }}>
              <Txt variant="bodyM">{formatCents(beg.raised_cents)} raised</Txt>
              <Txt variant="bodyM" color={color.text.secondary}>{formatCents(beg.goal_cents)} goal</Txt>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: color.surface.raised,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(progressPercent, 100)}%`,
                  backgroundColor: color.action.primary,
                }}
              />
            </View>
            <Txt variant="caption" color={color.text.tertiary} style={{ marginTop: space[2] }}>
              {Math.round(progressPercent)}% complete • {beg.backers} backer{beg.backers !== 1 ? "s" : ""}
            </Txt>
          </View>

          {/* Author */}
          {author && (
            <View style={{ borderTopColor: color.border.subtle, borderTopWidth: 1, paddingTop: space[4], marginTop: space[4] }}>
              <Txt variant="bodyS" color={color.text.tertiary}>Started by</Txt>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: space[2] }}>
                <Txt variant="displayL">{author.face}</Txt>
                <View style={{ marginLeft: space[3] }}>
                  <Txt variant="bodyM">{author.display_name}</Txt>
                  <Txt variant="bodyS" color={color.text.secondary}>@{author.handle}</Txt>
                </View>
              </View>
            </View>
          )}
        </Card>
      )}

      {/* Story */}
      {beg?.story && (
        <Card style={{ marginBottom: space[6], padding: space[4] }}>
          <Txt variant="bodyS" color={color.text.tertiary} style={{ marginBottom: space[2] }}>THEIR STORY</Txt>
          <Txt variant="bodyM" style={{ lineHeight: 24 }}>{beg.story}</Txt>
        </Card>
      )}

      {/* Action Buttons */}
      <View style={{ gap: space[2], marginBottom: space[6] }}>
        <Button title="Send Gift" onPress={handleGift} size="lg" />
        <View style={{ flexDirection: "row", gap: space[2] }}>
          <ShareButton onPress={handleShare} size="small" label="Share" />
          <Button title="Copy Link" onPress={handleCopyLink} variant="ghost" size="md" />
        </View>
      </View>

      {/* Backers */}
      {backers.length > 0 && (
        <Card style={{ marginBottom: space[6], padding: space[4] }}>
          <Txt variant="bodyS" color={color.text.tertiary} style={{ marginBottom: space[4] }}>
            {backers.length} BACKER{backers.length !== 1 ? "S" : ""}
          </Txt>
          <FlatList
            data={backers}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: space[2], borderBottomColor: color.border.subtle, borderBottomWidth: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Txt variant="headlineM" style={{ marginRight: space[2] }}>{item.sender?.face || "🤠"}</Txt>
                  <View>
                    <Txt variant="bodyS">{item.sender?.display_name || "Anonymous"}</Txt>
                    <Txt variant="caption" color={color.text.tertiary}>{new Date(item.created_at).toLocaleDateString()}</Txt>
                  </View>
                </View>
                <Txt variant="bodyM" color={color.action.primary}>{formatCents(item.amount_cents)}</Txt>
              </View>
            )}
          />
        </Card>
      )}
    </Screen>
  )
}
