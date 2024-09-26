"use server"

import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { NewPasswordSchema } from "@/schemas"
import { hash } from "bcryptjs"
import { z } from "zod"

export async function newPassword(token: string, values: z.infer<typeof NewPasswordSchema>) {
  if (!token) {
    return {
      error: "No token provided",
    }
  }

  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.errors).map((error) => error.message).join(", "),
    }
  }

  const { password } = validatedFields.data

  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return {
      error: "Invalid token",
    }
  }

  const hasExpired = existingToken.expires < new Date()

  if (hasExpired) {
    return {
      error: "Token has expired",
    }
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) {
    return {
      error: "Email does not exist",
    }
  }

  const hashedPassword = await hash(password, 10)

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  })

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  })

  return {
    success: "Password updated",
  }
}