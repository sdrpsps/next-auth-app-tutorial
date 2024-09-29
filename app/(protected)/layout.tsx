import { auth } from "@/auth"
import { SettingsNavbar } from "@/components/settings/navbar"
import { SessionProvider } from "next-auth/react"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="h-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-blue-800">
        <SettingsNavbar />
        {children}
      </div>
    </SessionProvider>
  )
}

