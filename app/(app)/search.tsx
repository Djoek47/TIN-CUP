import { Redirect } from "expo-router"

/** Legacy search route → Discover (Make SearchScreen) */
export default function SearchRedirect() {
  return <Redirect href="/(app)/discover" />
}
