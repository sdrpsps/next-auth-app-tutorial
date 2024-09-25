"use client"

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export const LoginButton = ({ children, mode = "redirect" }: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  }

  if (mode === "modal") {
    return (
      <span>TODO: Implement modal</span>
    )
  } else if (mode === "redirect") {
    console.log("REDIRECTING");
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>{children}</span>
  )
}