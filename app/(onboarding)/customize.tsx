import { useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { VesselScreen, Label } from "@/components/vessel"
import { color } from "@/theme/vessel"

/** Legacy customize → Vessel edit-profile */
export default function CustomizeCharacter() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/(app)/edit-profile")
  }, [router])

  return (
    <VesselScreen nav={false}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <ActivityIndicator color={color.action.primary} />
        <Label>Opening edit profile…</Label>
      </View>
    </VesselScreen>
  )
}
