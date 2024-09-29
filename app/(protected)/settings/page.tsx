"use client"

import { logout } from "@/actions/logout"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {

  function onClick() {
    logout()
  }

  return (

    <Button onClick={onClick}>Logout</Button>

  )
}

