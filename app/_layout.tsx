import { useEffect } from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useFonts } from "expo-font"
import { Ultra_400Regular } from "@expo-google-fonts/ultra"
import { Archivo_600SemiBold, Archivo_700Bold, Archivo_900Black } from "@expo-google-fonts/archivo"
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter"
import { IBMPlexMono_400Regular, IBMPlexMono_500Medium } from "@expo-google-fonts/ibm-plex-mono"
import { AuthProvider } from "@/providers/AuthProvider"
import { color } from "@/theme/tokens"

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Ultra_400Regular,
    Archivo_600SemiBold,
    Archivo_700Bold,
    Archivo_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  })

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {})
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: color.bg.canvas }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: color.bg.canvas },
              animation: "slide_from_right",
              linking: {
                prefixes: ["tincup://", "https://tincup.app", "https://www.tincup.app"],
                config: {
                  screens: {
                    "(app)": "app",
                    "beg-details": "beg/:id",
                    "gift/[id]": "gift/:id",
                    "profile": "profile/:id",
                  },
                },
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(app)" />
            <Stack.Screen name="gift/[id]" options={{ presentation: "transparentModal", animation: "fade" }} />
            <Stack.Screen name="beg-details" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
