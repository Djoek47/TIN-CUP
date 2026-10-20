import { createContext, useContext, ReactNode } from "react"
import { isThirdwebConfigured } from "@/lib/thirdweb"

const WalletReadyContext = createContext({ configured: false })

/**
 * Wallet readiness context.
 * Do not mount ThirdwebProvider / import thirdweb/wallets at root —
 * Expo Go Metro cannot resolve the native in-app wallet graph.
 * AuthProvider + lib/thirdweb.ts use a demo seat in Expo Go; custom
 * builds can inject a real signer on WalletAccount.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <WalletReadyContext.Provider value={{ configured: isThirdwebConfigured }}>
      {children}
    </WalletReadyContext.Provider>
  )
}

export function useWalletReady() {
  return useContext(WalletReadyContext)
}
