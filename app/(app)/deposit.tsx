import { View, ScrollView, StyleSheet, Linking, Alert } from "react-native"
import { useRouter } from "expo-router"
import { TopAppBar, GoldButton } from "@/components/gds"
import { Txt } from "@/components/ui/Txt"
import { glass } from "@/theme/glass"
import { color, font } from "@/theme/tokens"

/** S20 Deposit handoff — Make DepositScreen */
export default function DepositScreen() {
  const router = useRouter()

  const rideToBank = async () => {
    const url = "https://tincup.example/bank"
    try {
      const can = await Linking.canOpenURL(url)
      if (can) {
        await Linking.openURL(url)
      } else {
        Alert.alert("Opening secure bank in browser ↗")
      }
    } catch {
      Alert.alert("Opening secure bank in browser ↗")
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <TopAppBar title="Add Gold" onBack={() => router.back()} />
        <View style={{ paddingHorizontal: 16 }}>
          <View style={[styles.parchment, glass.parchment]}>
            <Txt style={{ fontSize: 52, marginBottom: 14, textAlign: "center" }}>🏦</Txt>
            <Txt style={styles.headline}>{"The Bank's in Another Building"}</Txt>
            <Txt style={styles.body}>
              {
                "Gold gets minted at the Bank, not the Saloon. We'll take you to our secure site to load up. You'll come right back."
              }
            </Txt>
          </View>

          <View style={[styles.lockRow, glass.card]}>
            <Txt style={{ fontSize: 16 }}>🔒</Txt>
            <Txt style={styles.lockTxt}>
              {
                "Handled by our licensed banking partner. No prices appear in this app. That's the law."
              }
            </Txt>
          </View>

          <GoldButton title="Ride to the Bank ↗" onPress={rideToBank} />
          <Txt style={styles.foot}>External site opens in browser. Returns automatically.</Txt>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg.canvas },
  parchment: {
    borderRadius: 20,
    padding: 28,
    marginBottom: 18,
    alignItems: "center",
  },
  headline: {
    fontFamily: font.display,
    fontSize: 22,
    color: color.text.inverse,
    marginBottom: 10,
    letterSpacing: 0.4,
    lineHeight: 28,
    textAlign: "center",
  },
  body: {
    fontFamily: font.body,
    fontSize: 14,
    color: color.dust,
    lineHeight: 23,
    textAlign: "center",
  },
  lockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  lockTxt: {
    flex: 1,
    fontFamily: font.body,
    fontSize: 12,
    color: color.text.secondary,
  },
  foot: {
    textAlign: "center",
    marginTop: 12,
    fontFamily: font.body,
    fontSize: 11,
    color: color.text.tertiary,
  },
})
