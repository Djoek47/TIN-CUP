import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TabBar } from "@/components/tab-bar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  return (
    <>
      <main className="min-h-dvh pb-24">{children}</main>
      <TabBar />
    </>
  )
}
