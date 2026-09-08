import { useEffect } from "react"
import { Redirect } from "expo-router"

/** Make auth entry is Welcome — keep route for deep links. */
export default function SignIn() {
  return <Redirect href="/(auth)/welcome" />
}
