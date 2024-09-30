"use client"

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { LoginForm } from "./login-form";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect"
  asChild?: boolean
}

export const LoginButton = ({ children, mode = "redirect", asChild }: LoginButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/auth/login");
  }

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <DialogTitle />
          <DialogDescription />
          <LoginForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span className="cursor-pointer" onClick={onClick}>{children}</span>
  )
}