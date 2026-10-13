import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { VesselScreen, Label } from "@/components/vessel"
import { color } from "@/theme/vessel"

/** Legacy gift deep-link → Vessel send (mock AppState gold). */
export default function GiftScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  useEffect(() => {
    router.replace({
      pathname: "/(app)/send",
      params: id ? { begId: String(id) } : {},
    } as any)
  }, [id, router])

  return (
    <VesselScreen nav={false}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <ActivityIndicator color={color.action.primary} />
        <Label>Opening pour…</Label>
      </View>
    </VesselScreen>
  )
}
