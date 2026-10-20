import { Redirect, useLocalSearchParams } from "expo-router"

/** Deep link obol://beg/:id → beg details. */
export default function BegDeepLink() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  return <Redirect href={{ pathname: "/beg-details", params: { id: id || "" } }} />
}
