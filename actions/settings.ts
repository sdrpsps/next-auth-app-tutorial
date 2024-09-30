"use server"

import { unstable_update } from "@/auth"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendVerificationEmail } from "@/lib/email"
import { generateVerificationToken } from "@/lib/tokens"
import { SettingsSchema } from "@/schemas"
import { compare, hash } from "bcryptjs"
import { z } from "zod"

export async function settings(values: z.infer<typeof SettingsSchema>) {
  const user = await currentUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: "User not found" }
  }

  if (user.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email)

    if (existingUser) {
      return { error: "Email already in use" }
    }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: "Verification email sent" }
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await compare(values.password, dbUser.password)

    if (!passwordMatch) {
      return { error: "Invalid password" }
    }

    const hashedPassword = await hash(values.newPassword, 10)

    values.password = hashedPassword
    values.newPassword = undefined
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      ...values
    }
  })

  unstable_update({
    user: {
      name: updatedUser.name,
      email: updatedUser.email,
      isTwoFactorEnabled: !!updatedUser.isTwoFactorEnabled,
      role: updatedUser.role
    }
  })

  return { success: "Settings updated" }
}