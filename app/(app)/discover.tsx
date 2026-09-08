import { useState } from "react"
import { View, ScrollView, Pressable, TextInput, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, BegCard, Ico } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { BEGS } from "@/lib/make-data"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

const TRENDING = ["#mustachewax", "#outlawdance", "#barndoor", "#goldtrain", "#desperatedoug"]

/** S23 Search / Discover — Make SearchScreen */
export default function DiscoverScreen() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const filtered =
    query.length > 1
      ? BEGS.filter(
          (b) =>
            b.beg.toLowerCase().includes(query.toLowerCase()) ||
            b.handle.toLowerCase().includes(query.toLowerCase())
        )
      : BEGS

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title="Search" overline="THE GULCH" onBack={() => router.back()} />
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={[styles.searchBox, glass.card]}>
            <Ico.Search s={18} c={color.text.secondary} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search begs, lords, lobbies..."
              placeholderTextColor={color.text.tertiary}
              style={styles.input}
              autoFocus
            />
            {query.length > 0 ? (
              <Pressable onPress={() => setQuery("")}>
                <Txt style={{ color: color.text.tertiary, fontSize: 16 }}>×</Txt>
              </Pressable>
            ) : null}
          </View>

          {!query ? (
            <View style={{ marginBottom: 20 }}>
              <Txt style={styles.sectionLabel}>TRENDING</Txt>
              <View style={styles.tags}>
                {TRENDING.map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => setQuery(tag.replace("#", ""))}
                    style={[styles.tag, glass.card]}
                  >
                    <Txt
                      style={{
                        fontFamily: font.headlineBold,
                        fontSize: 12,
                        color: color.action.primary,
                      }}
                    >
                      {tag}
                    </Txt>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <Txt style={styles.sectionLabel}>
            {query
              ? `${filtered.length} RESULT${filtered.length !== 1 ? "S" : ""}`
              : "RECENT BEGS"}
          </Txt>

          <View style={styles.grid}>
            {filtered.map((beg) => (
              <View key={beg.id} style={styles.gridItem}>
                <BegCard beg={beg} onPress={() => router.push(`/beg-details?id=${beg.id}`)} />
              </View>
            ))}
          </View>

          {filtered.length === 0 ? (
            <Txt style={styles.empty}>
              Nothing in the gulch matches that. Try different words.
            </Txt>
          ) : null}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
    borderColor: "rgba(255,255,255,0.08)",
  },
  input: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 15,
    color: color.text.primary,
    padding: 0,
  },
  sectionLabel: {
    fontFamily: font.headlineBlack,
    fontSize: 11,
    color: color.text.secondary,
    marginBottom: 12,
    letterSpacing: 1.2,
  },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  gridItem: { width: "48%", flexGrow: 1 },
  empty: {
    textAlign: "center",
    paddingVertical: 32,
    fontFamily: font.body,
    fontSize: 14,
    color: color.text.tertiary,
    fontStyle: "italic",
  },
})
