import { useState, useEffect } from "react"
import { View, ScrollView, Pressable, FlatList } from "react-native"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Screen } from "@/components/ui/Screen"
import { Txt } from "@/components/ui/Txt"
import { Field } from "@/components/ui/Field"
import { Card } from "@/components/ui/Card"
import { LoadingState } from "@/components/ui/LoadingState"
import { supabase } from "@/lib/supabase"
import { logError, getUserErrorMessage } from "@/lib/errors"
import { color, space } from "@/theme/tokens"
import { formatCents } from "@/lib/format"
import { Beg } from "@/lib/types"

export default function SearchScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState<"all" | "title" | "author">("all")
  const [sortBy, setSortBy] = useState<"recent" | "trending" | "ending-soon">("recent")
  const [begs, setBegs] = useState<Beg[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setBegs([])
      return
    }

    setLoading(true)
    setError("")

    try {
      let query = supabase.from("begs").select("*").eq("status", "open")

      // Apply filter
      if (filterBy === "title") {
        query = query.ilike("title", `%${searchQuery}%`)
      } else if (filterBy === "author") {
        query = query.ilike("author_id", `%${searchQuery}%`)
      } else {
        // Search both title and story
        query = query.or(`title.ilike.%${searchQuery}%,story.ilike.%${searchQuery}%`)
      }

      // Apply sort
      if (sortBy === "trending") {
        query = query.order("raised_cents", { ascending: false })
      } else if (sortBy === "ending-soon") {
        query = query.order("created_at", { ascending: true })
      } else {
        query = query.order("created_at", { ascending: false })
      }

      const { data, error: err } = await query.limit(50)

      if (err) throw err

      setBegs(data || [])
    } catch (e: any) {
      logError("searchBegs", e)
      setError(getUserErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [filterBy, sortBy])

  return (
    <Screen scroll edges={["bottom"]} contentStyle={{ paddingHorizontal: space[6] }}>
      <LoadingState visible={Boolean(loading && searchQuery)} message="Searching..." />

      <View style={{ paddingVertical: space[8] }}>
        <Txt variant="displayL" center>
          SEARCH BEGS
        </Txt>
      </View>

      {/* Search Bar */}
      <Field
        label="SEARCH"
        placeholder="Find begs by title or author..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        style={{ marginBottom: space[6] }}
      />

      {/* Filters */}
      <Card style={{ marginBottom: space[4], padding: space[4] }}>
        <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[3] }}>
          FILTER BY
        </Txt>

        <View style={{ flexDirection: "row", gap: space[2], marginBottom: space[4] }}>
          {(["all", "title", "author"] as const).map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setFilterBy(filter)}
              style={{
                paddingHorizontal: space[3],
                paddingVertical: space[2],
                borderRadius: 6,
                backgroundColor:
                  filterBy === filter ? color.action.primary : color.surface.card,
              }}
            >
              <Txt
                variant="bodyS"
                color={filterBy === filter ? color.text.inverse : color.text.secondary}
              >
                {filter.toUpperCase()}
              </Txt>
            </Pressable>
          ))}
        </View>

        <Txt variant="bodyS" color={color.text.secondary} style={{ marginBottom: space[3] }}>
          SORT BY
        </Txt>

        <View style={{ flexDirection: "row", gap: space[2] }}>
          {(["recent", "trending", "ending-soon"] as const).map((sort) => (
            <Pressable
              key={sort}
              onPress={() => setSortBy(sort)}
              style={{
                paddingHorizontal: space[3],
                paddingVertical: space[2],
                borderRadius: 6,
                backgroundColor: sortBy === sort ? color.action.primary : color.surface.card,
              }}
            >
              <Txt
                variant="bodyS"
                color={sortBy === sort ? color.text.inverse : color.text.secondary}
              >
                {sort.replace("-", " ").toUpperCase()}
              </Txt>
            </Pressable>
          ))}
        </View>
      </Card>

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

      {/* Results */}
      {searchQuery && begs.length === 0 && !loading && (
        <Card style={{ padding: space[6], alignItems: "center" }}>
          <Txt variant="bodyM" color={color.text.secondary} center>
            No begs found
          </Txt>
        </Card>
      )}

      {begs.length > 0 && (
        <FlatList
          scrollEnabled={false}
          data={begs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/beg-details?id=${item.id}`)}
              style={{ marginBottom: space[4] }}
            >
              <Card style={{ padding: space[4] }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View style={{ flex: 1 }}>
                    <Txt variant="headlineM" numberOfLines={2}>
                      {item.title}
                    </Txt>
                    <Txt
                      variant="bodyS"
                      color={color.text.secondary}
                      numberOfLines={1}
                      style={{ marginTop: space[2] }}
                    >
                      {item.story?.substring(0, 60)}...
                    </Txt>
                  </View>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color={color.action.primary}
                    style={{ marginLeft: space[3] }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: space[3],
                    paddingTop: space[3],
                    borderTopColor: color.surface.card,
                    borderTopWidth: 1,
                  }}
                >
                  <Txt variant="bodyS" color={color.text.secondary}>
                    {item.backers} backers
                  </Txt>
                  <Txt variant="bodyS" color={color.action.primary}>
                    {formatCents(item.raised_cents || 0)} / {formatCents(item.goal_cents || 0)}
                  </Txt>
                </View>
              </Card>
            </Pressable>
          )}
        />
      )}
    </Screen>
  )
}
