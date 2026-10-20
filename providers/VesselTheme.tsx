import { createContext, useContext, useMemo, ReactNode } from "react"
import { Caste, ThemeMode, VesselColors, vesselColors } from "@/theme/vessel"

type VesselCtx = {
  caste: Caste
  theme: ThemeMode
  v: VesselColors
  isLord: boolean
}

const Ctx = createContext<VesselCtx>({
  caste: "vagrant",
  theme: "dark",
  v: vesselColors("vagrant", "dark"),
  isLord: false,
})

export function VesselThemeProvider({
  caste,
  theme,
  children,
}: {
  caste: Caste
  theme: ThemeMode
  children: ReactNode
}) {
  const value = useMemo(
    () => ({
      caste,
      theme,
      v: vesselColors(caste, theme),
      isLord: caste === "lord",
    }),
    [caste, theme],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useVessel() {
  return useContext(Ctx)
}
