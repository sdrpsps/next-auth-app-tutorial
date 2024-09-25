import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
})

interface HeaderProps {
  label: string
}

export function Header({ label }: HeaderProps) {
  return (
   <div  className="w-full flex flex-col gap-y-4 items-center justify-center">
    <h1 className={cn(poppins.className, "text-3xl font-semibold")}>🔐 Auth</h1>
    <p className="text-muted-foreground text-sm">{label}</p>
   </div>
  )
}