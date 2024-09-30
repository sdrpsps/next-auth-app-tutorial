import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import { LoginButton } from "@/components/auth/login-button";
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-500 to-blue-800">
      <div className="space-y-6 text-center">
        <h1 className={cn(poppins.className, "text-6xl font-semibold text-white drop-shadow-md")}>🔐 Auth</h1>
        <p className="text-xl text-white drop-shadow-md">A simple authentication service</p>
        <div className="flex gap-4">
          <LoginButton mode="redirect" asChild>
            <Button size="lg" variant="secondary">Sign in (Redirect)</Button>
          </LoginButton>
          <LoginButton mode="modal" asChild>
            <Button size="lg" variant="secondary">Sign in (Dialog)</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
