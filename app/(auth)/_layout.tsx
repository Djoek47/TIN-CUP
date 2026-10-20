import { Stack } from "expo-router"
import { vesselColors } from "@/theme/vessel"

const bg = vesselColors("vagrant", "dark").bg

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bg },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="verify" />
    </Stack>
  )
}
