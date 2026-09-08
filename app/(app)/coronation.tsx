import { useEffect, useMemo } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { Txt } from "@/components/ui/Txt"
import { useAuth } from "@/providers/AuthProvider"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

/** S29 Coronation — Make CoronationScreen (4.2s → is_lord) */
export default function CoronationScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { updateProfile } = useAuth()

  const coins = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: (i / 18) * 100 + ((i * 17) % 5),
        delay: (i * 0.12) % 2,
      })),
    []
  )

  const finish = async () => {
    try {
      await updateProfile({ is_lord: true, fate: "lord" })
    } catch {
      // local path still advances
    }
    router.replace("/(app)")
  }

  useEffect(() => {
    const t = setTimeout(() => {
      finish()
    }, 4200)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <View style={styles.root}>
      {coins.map((c) => (
        <Txt
          key={c.id}
          style={[
            styles.coin,
            {
              left: `${c.left}%`,
              top: 40 + (c.id % 7) * 28,
            },
          ]}
        >
          🪙
        </Txt>
      ))}

      <View style={[styles.arch, glass.gold]}>
        <Txt style={{ fontSize: 76, zIndex: 1 }}>🎩</Txt>
      </View>
      <Txt style={styles.hail}>
        HAIL,{"\n"}MY LORD.
      </Txt>
      <Txt style={styles.sub}>Your finery awaits.</Txt>

      <Pressable
        onPress={finish}
        style={[styles.skip, { top: insets.top + 16 }]}
      >
        <Txt style={styles.skipTxt}>Skip →</Txt>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: color.bg.canvas,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  coin: {
    position: "absolute",
    fontSize: 14,
    opacity: 0.85,
  },
  arch: {
    width: 150,
    height: 188,
    borderTopLeftRadius: 75,
    borderTopRightRadius: 75,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
    overflow: "hidden",
  },
  hail: {
    fontFamily: font.display,
    fontSize: 28,
    color: color.action.primary,
    letterSpacing: 1.5,
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 10,
  },
  sub: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.text.secondary,
  },
  skip: { position: "absolute", right: 16 },
  skipTxt: {
    fontFamily: font.body,
    fontSize: 12,
    color: color.text.tertiary,
  },
})
