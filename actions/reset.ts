"use server"

import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/email"
import { generatePasswordResetToken } from "@/lib/tokens"
import { ResetSchema } from "@/schemas"
import { z } from "zod"

export async function reset(values: z.infer<typeof ResetSchema>) {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: Object.values(validatedFields.error.flatten().fieldErrors).join(", "),
    }
  }

  const { email } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return {
      error: "Email does not exist",
    }
  }

  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

  return {
    success: "Reset email sent",
  }
}
