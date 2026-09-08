import { ScrollView, View, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import {
  VesselScreen,
  ScreenHeader,
  ImageSlot,
  Label,
  UiText,
  MonoNum,
  Hairline,
  Row,
} from "@/components/vessel"
import { useApp } from "@/providers/AppState"
import { useVessel } from "@/providers/VesselTheme"
import { fmtCompactUsd } from "@/lib/money"
import { space } from "@/theme/vessel"

export default function ProfileScreen() {
  const router = useRouter()
  const { v, isLord, caste } = useVessel()
  const { user, balance } = useApp()
  const xp = 2650
  const xpMax = 10000
  const xpPct = Math.round((xp / xpMax) * 100)

  return (
    <VesselScreen>
      <ScreenHeader
        title="Profile"
        right={
          <Pressable onPress={() => router.push("/(app)/settings")}>
            <Label>⚙</Label>
          </Pressable>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row style={{ gap: 14, alignItems: "center", marginTop: 8 }}>
          <View style={{ width: 72 }}>
            <ImageSlot label={user.displayName.slice(0, 1).toUpperCase()} height={72} radius={36} />
          </View>
          <View style={{ flex: 1 }}>
            <UiText weight="black" style={{ fontSize: 22 }}>
              @{user.handle}
            </UiText>
            <Row style={{ gap: 8, marginTop: 6, alignItems: "center" }}>
              <Label style={{ color: v.amb }}>BARON</Label>
              <View
                style={[
                  styles.badge,
                  {
                    borderColor: isLord ? v.amb : v.lim,
                    borderRadius: v.radPill,
                    backgroundColor: isLord ? "rgba(255,180,61,0.12)" : "rgba(196,240,0,0.1)",
                  },
                ]}
              >
                <Label style={{ color: isLord ? v.amb : v.lim, fontSize: 8 }}>{caste.toUpperCase()}</Label>
              </View>
            </Row>
          </View>
        </Row>

        <UiText weight="reg" style={{ color: v.dim, marginTop: 14, fontSize: 14, lineHeight: 20 }}>
          {user.bio}
        </UiText>
        {user.address ? (
          <Label style={{ marginTop: 10 }}>{user.address.slice(0, 6)}···{user.address.slice(-4)}</Label>
        ) : null}

        <Row style={{ marginTop: 22 }}>
          <Stat n="12.4K" l="FOLLOWERS" />
          <Stat n="342" l="FOLLOWING" />
          <Stat n="$84.7K" l="GIVEN" />
        </Row>

        <Hairline style={{ marginTop: 22 }} />

        {isLord ? (
          <View style={{ marginTop: 18 }}>
            <Label>COURT OF {user.displayName.toUpperCase()}</Label>
            <UiText weight="black" style={{ fontSize: 24, marginTop: 10 }}>
              28 / 40 PATRONS
            </UiText>
            <Label style={{ marginTop: 8, color: v.amb }}>RANK NEVER FALLS · XP RETIRED AT ASCENSION</Label>
            <Pressable onPress={() => router.push("/(app)/leaderboard")} style={{ marginTop: 18 }}>
              <Label style={{ color: v.amb }}>VIEW TOP GIVERS →</Label>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => router.push("/(app)/level" as any)} style={{ marginTop: 18 }}>
            <Row style={{ justifyContent: "space-between", alignItems: "baseline" }}>
              <Label>LEVEL 7 · BARON</Label>
              <Label>NEXT: TYCOON</Label>
            </Row>
            <View style={[styles.bar, { backgroundColor: v.line, marginTop: 12 }]}>
              <View style={{ width: `${xpPct}%`, height: "100%", backgroundColor: v.ambfill }} />
            </View>
            <MonoNum style={{ marginTop: 8, fontSize: 13 }}>
              {xp.toLocaleString()} / {xpMax.toLocaleString()} XP
            </MonoNum>
            <Label style={{ marginTop: 6, color: v.dim }}>
              COIN DUST {balance.coinDust.toLocaleString()} · TAP FOR LADDER
            </Label>
          </Pressable>
        )}

        <Label style={{ marginTop: space.sectionGap }}>TOP SUPPORTER</Label>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 14 }}>
            @maverick
          </UiText>
          <MonoNum style={{ color: v.amb }}>{fmtCompactUsd(1250)}</MonoNum>
        </Row>

        <Label style={{ marginTop: space.sectionGap }}>RANKS / BARKS</Label>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 13.5 }}>
            Global givers
          </UiText>
          <Pressable onPress={() => router.push("/(app)/leaderboard")}>
            <Label style={{ color: v.amb }}>#31</Label>
          </Pressable>
        </Row>
        <Hairline />
        <Row style={styles.row}>
          <UiText weight="semi" style={{ flex: 1, fontSize: 13.5 }}>
            City — Toronto
          </UiText>
          <Label>#4</Label>
        </Row>
      </ScrollView>
    </VesselScreen>
  )
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <View style={{ flex: 1 }}>
      <MonoNum style={{ fontSize: 18 }}>{n}</MonoNum>
      <Label style={{ marginTop: 4 }}>{l}</Label>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderWidth: StyleSheet.hairlineWidth },
  bar: { height: 3, borderRadius: 2, overflow: "hidden" },
  row: { paddingVertical: space.rowPad, alignItems: "center" },
})
