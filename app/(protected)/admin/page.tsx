"use client"

import { admin } from "@/actions/admin"
import { RoleGate } from "@/components/auth/role-gate"
import { FormSuccess } from "@/components/form-success"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

export default function AdminPage() {
  const onAdminApiClick = () => {
    fetch("/api/admin").then((res) => {
      if (res.ok) {
        toast.success("Allowed Admin API Route!")
      } else {
        toast.error("Forbidden Admin API Route!")
      }
    })
  }

  const onAdminActionClick = () => {
    admin().then((res) => {
      if (res.success) {
        toast.success("Allowed Admin Action!")
      } else {
        toast.error("Forbidden Admin Action!")
      }
    })
  }

  return (
    <Card className="w-[600px]">
      <CardHeader className="text-2xl font-semibold text-center">
        🔑 Admin
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are authorized to access this page" />
        </RoleGate>
        <div className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only API Routes
          </p>
          <Button onClick={onAdminApiClick}>Click to test</Button>
        </div>
        <div className="flex flex-row justify-between items-center rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">
            Admin-only API Action
          </p>
          <Button onClick={onAdminActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}