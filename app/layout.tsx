import type { Metadata, Viewport } from "next"
import { Inter, Archivo } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HERO — Women's Sports Hub",
  description:
    "The premium home for women's sports. Live scores, athlete profiles, stats, highlights, rumors, transfers, and fan community across the WNBA, NWSL, WTA, and more.",
  manifest: "/manifest.webmanifest",
  applicationName: "HERO",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HERO",
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: "#09090c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${archivo.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-md bg-background">
          {children}
        </div>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "rgba(20,20,25,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#f4f4f6",
              backdropFilter: "blur(20px)",
            },
          }}
        />
      </body>
    </html>
  )
}
